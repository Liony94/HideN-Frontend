import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Home from "../views/screens/Home";
import Conversations from "../views/screens/Conversations";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
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
        name="ConversationsTab"
        component={Conversations}
        options={({ route }) => ({
          tabBarLabel: "Messages",
          tabBarIcon: ({ color, size }) => (
            <View>
              <MaterialIcons name="chat" size={size} color={color} />
              {route.params?.hasUnread && (
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
        })}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
