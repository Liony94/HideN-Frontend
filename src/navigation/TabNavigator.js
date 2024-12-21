import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Home from "../views/screens/Home";
import Matches from "../views/screens/Matches";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const [hasMatchRequests, setHasMatchRequests] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  useEffect(() => {
    checkPendingMatches();
    checkUnreadMessages();

    // Vérifier périodiquement les nouveaux messages et matchs
    const interval = setInterval(() => {
      checkPendingMatches();
      checkUnreadMessages();
    }, 30000); // Vérifier toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  const checkPendingMatches = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_URL}/api/matching/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la vérification des matchs");
      }

      const data = await response.json();
      const userId = JSON.parse(atob(token.split(".")[1])).userId;

      const hasPendingRequests = data.matches.some(
        (match) => match.status === "pending" && match.initiator._id !== userId
      );

      setHasMatchRequests(hasPendingRequests);
    } catch (error) {
      console.error("Erreur lors de la vérification des matchs:", error);
    }
  };

  const checkUnreadMessages = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_URL}/api/messages/unread/count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la vérification des messages");
      }

      const data = await response.json();
      setHasUnreadMessages(data.hasUnread);
    } catch (error) {
      console.error("Erreur lors de la vérification des messages:", error);
    }
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#1A1A1A" },
        tabBarActiveTintColor: "#FF4B6E",
        tabBarInactiveTintColor: "#888888",
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={Home}
        options={{
          tabBarLabel: "Accueil",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Matches"
        component={Matches}
        options={{
          tabBarLabel: "Matchs",
          tabBarIcon: ({ color, size }) => (
            <View>
              <MaterialIcons name="favorite" size={size} color={color} />
              {(hasMatchRequests || hasUnreadMessages) && (
                <View
                  style={{
                    position: "absolute",
                    right: -6,
                    top: -3,
                    backgroundColor: "#4CAF50",
                    borderRadius: 6,
                    width: 12,
                    height: 12,
                  }}
                />
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
