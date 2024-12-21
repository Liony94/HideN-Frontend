import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View } from "react-native";
import { AuthContext } from "../context/AuthContext";

import Home from "../views/screens/Home";
import UserProfile from "../views/screens/UserProfile";
import Matching from "../views/screens/Matching";
import Login from "../views/screens/Login";
import Register from "../views/screens/Register";
import Chat from "../views/screens/Chat";

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
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {userToken ? (
          // Écrans authentifiés
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="Matching" component={Matching} />
            <Stack.Screen name="Chat" component={Chat} />
          </>
        ) : (
          // Écrans non authentifiés
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
