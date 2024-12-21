import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const Chat = ({ route, navigation }) => {
  const { matchId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [matchInfo, setMatchInfo] = useState(null);

  useEffect(() => {
    fetchMatchInfo();
    fetchMessages();
  }, []);

  const fetchMatchInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_URL}/api/matches/${matchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setMatchInfo(data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des infos du match:",
        error
      );
    }
  };

  const fetchMessages = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_URL}/api/messages/${matchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          matchId,
          content: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage("");
        fetchMessages(); // Recharger les messages
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
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
      <Text style={styles.messageTime}>
        {new Date(item.createdAt).toLocaleTimeString()}
      </Text>
    </View>
  );

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    color: "#FF4B6E",
    fontSize: 16,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSpace: {
    width: 50,
  },
  chatContainer: {
    flex: 1,
  },
  messageContainer: {
    margin: 10,
    padding: 10,
    borderRadius: 15,
    maxWidth: "80%",
  },
  sentMessage: {
    backgroundColor: "#FF4B6E",
    alignSelf: "flex-end",
  },
  receivedMessage: {
    backgroundColor: "#333",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  messageTime: {
    color: "#CCCCCC",
    fontSize: 12,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  input: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    color: "#FFFFFF",
  },
  sendButton: {
    backgroundColor: "#FF4B6E",
    borderRadius: 20,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default Chat;
