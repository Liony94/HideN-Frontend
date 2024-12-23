import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const DEFAULT_AVATAR = "https://via.placeholder.com/50";

const Conversations = ({ navigation, route }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const initializeUserId = async () => {
      const token = await AsyncStorage.getItem("userToken");
      const id = JSON.parse(atob(token.split(".")[1])).userId;
      setUserId(id);
    };

    initializeUserId();
    fetchConversations();

    const unsubscribeFocus = navigation.addListener("focus", () => {
      fetchConversations();
    });

    const unsubscribeNewMessage = navigation.addListener(
      "newMessage",
      ({ data }) => {
        if (data?.matchId && userId) {
          setConversations((prevConversations) =>
            prevConversations.map((conv) =>
              conv.matchId === data.matchId && data.senderId !== userId
                ? { ...conv, hasUnread: true }
                : conv
            )
          );
          navigation.getParent()?.setParams({ hasUnread: true });
        }
      }
    );

    const unsubscribeParams = navigation.addListener("focus", () => {
      const params = route.params;
      if (params?.messageRead && params?.matchId) {
        setConversations((prevConversations) =>
          prevConversations.map((conv) =>
            conv.matchId === params.matchId
              ? { ...conv, hasUnread: false }
              : conv
          )
        );
        const hasUnreadMessages = conversations.some(
          (conv) => conv.matchId !== params.matchId && conv.hasUnread
        );
        navigation.getParent()?.setParams({ hasUnread: hasUnreadMessages });
      }
    });

    return () => {
      unsubscribeFocus();
      unsubscribeParams();
      unsubscribeNewMessage();
    };
  }, [navigation, route.params, userId]);

  const handleConversationPress = async (matchId) => {
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.matchId === matchId ? { ...conv, hasUnread: false } : conv
      )
    );

    navigation.navigate("Chat", { matchId });
  };

  const fetchConversations = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.error("Pas de token trouvé");
        return;
      }
      const userId = JSON.parse(atob(token.split(".")[1])).userId;

      console.log("URL de l'API:", `${API_URL}/api/messages/all`);
      console.log("Token utilisé:", token);

      const response = await fetch(`${API_URL}/api/messages/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Status de la réponse:", response.status);
      const data = await response.text();
      console.log("Réponse brute du serveur:", data);

      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status} - ${data}`);
      }

      let conversations;
      try {
        conversations = JSON.parse(data);
      } catch (parseError) {
        console.error("Erreur lors du parsing JSON:", parseError);
        throw new Error("Réponse invalide du serveur");
      }

      // Formater les conversations pour l'affichage
      const formattedConversations = conversations.map((conv) => {
        console.log("Traitement de la conversation:", conv);
        return {
          matchId: conv.matchId,
          matchInfo: {
            _id: conv.matchInfo._id,
            firstName: conv.matchInfo.firstName,
            lastName: conv.matchInfo.lastName,
            profilePicture: conv.matchInfo.profilePicture,
          },
          lastMessage: conv.lastMessage,
          hasUnread: conv.unreadCount > 0,
          userId: userId,
        };
      });

      console.log("Conversations formatées:", formattedConversations);
      setConversations(formattedConversations);

      // Mettre à jour le badge des messages non lus
      const hasUnreadMessages = formattedConversations.some(
        (conv) => conv.hasUnread
      );
      navigation.getParent()?.setParams({ hasUnread: hasUnreadMessages });
    } catch (error) {
      console.error("Erreur lors de la récupération des conversations:");
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
      if (error.response) {
        console.error("Détails de la réponse:", await error.response.text());
      }
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const messageDate = new Date(date);
    const today = new Date();

    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return messageDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
    });
  };

  const getUniqueKey = (item) => {
    return item.matchId;
  };

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => navigation.navigate("Chat", { matchId: item.matchId })}
    >
      {item.matchInfo.profilePicture ? (
        <Image
          source={{ uri: item.matchInfo.profilePicture }}
          style={styles.avatar}
        />
      ) : (
        <View style={[styles.avatar, styles.defaultAvatar]}>
          <MaterialIcons name="person" size={30} color="#666" />
        </View>
      )}
      <View style={styles.conversationInfo}>
        <Text style={styles.name}>
          {item.matchInfo.firstName} {item.matchInfo.lastName}
        </Text>
        <View style={styles.messageContainer}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage
              ? item.lastMessage.content
              : "Commencez la conversation !"}
          </Text>
          {item.hasUnread && <View style={styles.unreadDot} />}
        </View>
      </View>
      <Text style={styles.date}>
        {item.lastMessage
          ? new Date(item.lastMessage.createdAt).toLocaleDateString()
          : "Nouveau match"}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4B6E" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>
      {userId && (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={getUniqueKey}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
  },
  listContainer: {
    paddingVertical: 10,
  },
  conversationItem: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  conversationInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  messageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: "#999",
    marginRight: 10,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF4B6E",
    marginLeft: 8,
  },
  defaultAvatar: {
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Conversations;
