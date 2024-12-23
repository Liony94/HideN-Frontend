import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View } from "react-native";
import { AuthContext } from "../context/AuthContext";

import TabNavigator from "./TabNavigator";
import UserProfile from "../views/screens/UserProfile";
import Matching from "../views/screens/Matching";
import Login from "../views/screens/Login";
import Register from "../views/screens/Register";
import Chat from "../views/screens/Chat";
import NotificationHandler from "../components/NotificationHandler";
import UserProfileView from "../views/screens/UserProfileView";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { userToken, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FF4B6E" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken && <NotificationHandler />}
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {userToken ? (
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="Matching" component={Matching} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen
              name="UserProfileView"
              component={UserProfileView}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Register" component={Register} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
