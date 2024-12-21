import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    fetchConversations();

    const unsubscribeFocus = navigation.addListener("focus", () => {
      fetchConversations();
    });

    const unsubscribeNewMessage = navigation.addListener(
      "newMessage",
      ({ data }) => {
        if (data?.matchId) {
          setConversations((prevConversations) =>
            prevConversations.map((conv) =>
              conv.matchId === data.matchId
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
  }, [navigation, route.params]);

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
      const response = await fetch(`${API_URL}/api/messages/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des conversations");
      }

      const data = await response.json();
      const formattedData = data.map((conv) => ({
        ...conv,
        hasUnread: conv.unreadCount > 0,
      }));

      setConversations(formattedData);

      const hasUnreadMessages = formattedData.some((conv) => conv.hasUnread);
      navigation.getParent()?.setParams({ hasUnread: hasUnreadMessages });
    } catch (error) {
      console.error("Erreur lors de la récupération des conversations:", error);
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

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => handleConversationPress(item.matchId)}
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
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.name}>
            {item.matchInfo.firstName} {item.matchInfo.lastName}
          </Text>
          <Text style={styles.date}>
            {formatDate(item.lastMessage.createdAt)}
          </Text>
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage.content}
          </Text>
          {item.hasUnread && !item.lastMessage.isSender && (
            <View style={styles.unreadDot} />
          )}
        </View>
      </View>
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
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.matchId}
        contentContainerStyle={styles.listContainer}
      />
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
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
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
