import React, { useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NotificationHandler = () => {
  const navigation = useNavigation();
  const socketRef = useRef(null);

  useEffect(() => {
    const initNotifications = async () => {
      await registerForPushNotifications();
      await connectNotificationSocket();
    };

    initNotifications();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const registerForPushNotifications = async () => {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Permission refusée pour les notifications!");
        return;
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF4B6E",
        });
      }
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement des notifications:",
        error
      );
    }
  };

  const connectNotificationSocket = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userId = JSON.parse(atob(token.split(".")[1])).userId;
      console.log("UserId pour les notifications:", userId);

      socketRef.current = io(process.env.EXPO_PUBLIC_API_URL, {
        auth: { token: `Bearer ${token}` },
        transports: ["websocket"],
      });

      // Gérer les notifications uniquement via le socket
      socketRef.current.on("new_notification", async (notification) => {
        console.log("Nouvelle notification reçue:", notification);
        console.log("SenderId:", notification.data?.senderId);
        console.log("UserId local:", userId);

        // Vérifier explicitement que l'expéditeur est différent
        if (
          notification.type === "new_message" &&
          notification.data?.senderId &&
          notification.data.senderId.toString() !== userId.toString()
        ) {
          console.log("Notification valide, affichage...");
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Nouveau message",
              body: notification.message,
              data: {
                matchId: notification.data.matchId,
                senderId: notification.data.senderId,
              },
            },
            trigger: null,
          });
        } else {
          console.log(
            "Notification ignorée - message envoyé par l'utilisateur actuel"
          );
        }
      });

      // Gérer le clic sur les notifications
      const subscription =
        Notifications.addNotificationResponseReceivedListener((response) => {
          const data = response.notification.request.content.data;
          if (data.matchId && data.senderId !== userId) {
            navigation.navigate("Chat", { matchId: data.matchId });
          }
        });

      return () => {
        subscription.remove();
      };
    } catch (error) {
      console.error(
        "Erreur lors de la connexion au socket de notifications:",
        error
      );
    }
  };

  return null;
};

export default NotificationHandler;
