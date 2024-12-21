import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from "../views/screens/Home";
import UserProfile from "../views/screens/UserProfile";
import Matching from "../views/screens/Matching";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="Matching" component={Matching} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
