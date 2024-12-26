import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";
import styles from "../../assets/styles/chatStyles";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const Chat = ({ route, navigation }) => {
  const { matchId, otherUser } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [matchInfo, setMatchInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const [isMatchAccepted, setIsMatchAccepted] = useState(false);

  useEffect(() => {
    if (otherUser) {
      setMatchInfo({
        firstName: otherUser.firstName,
        lastName: otherUser.lastName,
        profilePicture: otherUser.profilePicture,
      });
      setLoading(false);
    } else {
      fetchMatchInfo();
    }

    fetchMessages();
    setupSocket();
    markMessagesAsRead();

    return () => {
      if (socketRef.current) {
        socketRef.current.emit("leave_chat", matchId);
        socketRef.current.disconnect();
      }
      const parent = navigation.getParent();
      if (parent) {
        parent.navigate("ConversationsTab", {
          screen: "Conversations",
          params: { refresh: true },
        });
      }
    };
  }, [matchId]);

  const setupSocket = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userId = JSON.parse(atob(token.split(".")[1])).userId;

      socketRef.current = io(API_URL, {
        auth: {
          token: token,
        },
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current.on("connect", () => {
        console.log("Socket connected successfully");
        socketRef.current.emit("join_chat", matchId);
        console.log("Joined chat room:", matchId);
      });

      socketRef.current.on("new_message", (message) => {
        console.log("Message reçu via socket:", message);
        setMessages((prevMessages) => {
          const messageExists = prevMessages.some(
            (msg) => msg._id === message._id
          );
          if (messageExists) {
            return prevMessages;
          }

          return [
            {
              ...message,
              isSender: message.senderId === userId,
              createdAt: new Date(message.createdAt).toISOString(),
            },
            ...prevMessages,
          ];
        });
      });

      socketRef.current.on("user_joined", (data) => {
        console.log("Utilisateur rejoint le chat:", data);
      });

      socketRef.current.on("user_left", (data) => {
        console.log("Utilisateur a quitté le chat:", data);
      });

      socketRef.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      socketRef.current.onAny((event, ...args) => {
        console.log("Socket event received:", event, args);
      });

      socketRef.current.on("disconnect", (reason) => {
        console.log("Socket déconnecté, raison:", reason);
        if (reason === "io server disconnect") {
          // Le serveur a forcé la déconnexion
          setupSocket(); // Tentative de reconnexion
        }
      });
    } catch (error) {
      console.error("Socket initialization error:", error);
      Alert.alert("Erreur", "Impossible d'initialiser la connexion au chat");
    }
  };

  const acceptMatch = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      console.log("Tentative d'acceptation du match:", matchId);

      const response = await fetch(
        `${API_URL}/api/matching/accept/${matchId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const responseText = await response.text();
      console.log("Réponse brute:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Erreur de parsing:", parseError);
        console.error("Contenu reçu:", responseText);
        throw new Error("Réponse invalide du serveur");
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors de l'acceptation du match"
        );
      }

      console.log("Match accepté avec succès:", data);
      setIsMatchAccepted(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fetchMatchInfo();
    } catch (error) {
      console.error("Erreur détaillée acceptMatch:", error);
      Alert.alert(
        "Erreur",
        "Impossible d'accepter le match. Veuillez réessayer."
      );
    }
  };

  const fetchMatchInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      console.log("Récupération des infos pour le match:", matchId);

      const response = await fetch(`${API_URL}/api/messages/match/${matchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors de la récupération des informations"
        );
      }

      setMatchInfo({
        firstName: data.otherUser.firstName,
        lastName: data.otherUser.lastName,
        profilePicture: data.otherUser.profilePicture,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des infos:", error);
      Alert.alert(
        "Erreur",
        "Impossible de récupérer les informations de la conversation"
      );
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      console.log("Récupération des messages pour le match:", matchId);

      const response = await fetch(`${API_URL}/api/messages/${matchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Messages reçus:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors de la récupération des messages"
        );
      }

      const userId = JSON.parse(atob(token.split(".")[1])).userId;
      const formattedMessages = data.map((message) => ({
        ...message,
        isSender: message.senderId === userId,
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error(
        "Erreur détaillée lors de la récupération des messages:",
        error
      );
      Alert.alert(
        "Erreur",
        "Impossible de charger les messages. Veuillez réessayer."
      );
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = await AsyncStorage.getItem("userToken");
      const messageToSend = newMessage.trim();
      setNewMessage("");

      console.log("Envoi du message pour le match:", matchId);
      const response = await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          matchId,
          content: messageToSend,
        }),
      });

      const data = await response.json();
      console.log("Réponse du serveur:", data);

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'envoi du message");
      }

      // Le message sera ajouté via le socket
    } catch (error) {
      console.error("Erreur détaillée lors de l'envoi:", error);
      Alert.alert(
        "Erreur",
        error.message || "Impossible d'envoyer le message. Veuillez réessayer."
      );
      setNewMessage(messageToSend); // Restaurer le message en cas d'erreur
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.isSender ? styles.sentMessage : styles.receivedMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.content}</Text>
      <Text
        style={[
          styles.messageTime,
          item.isSender ? styles.sentMessageTime : styles.receivedMessageTime,
        ]}
      >
        {new Date(item.createdAt).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );

  const markMessagesAsRead = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_URL}/api/messages/${matchId}/read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors du marquage des messages comme lus");
      }

      console.log("Messages marqués comme lus");

      const parent = navigation.getParent();
      if (parent) {
        parent.setParams({ hasUnread: false });

        parent.navigate("ConversationsTab", {
          screen: "Conversations",
          params: {
            messageRead: true,
            matchId: matchId,
          },
        });
      }
    } catch (error) {
      console.error("Erreur lors du marquage des messages comme lus:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{matchInfo?.firstName || "Chat"}</Text>
        <View style={styles.headerSpace} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.chatContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 90}
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item._id}
          inverted
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Écrivez votre message..."
            placeholderTextColor="#666"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Envoyer</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;
