import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../../assets/styles/conversationsStyles";
import theme from "../../assets/styles/theme";

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
          <MaterialIcons name="person" size={30} color={theme.colors.textTertiary} />
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
        <ActivityIndicator size="large" color={theme.colors.secondary} />
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

export default Conversations;
