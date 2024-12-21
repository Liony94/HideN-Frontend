import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier s'il y a une session existante au démarrage
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("userToken");
      const storedUser = await AsyncStorage.getItem("userData");

      if (storedToken && storedUser) {
        setUserToken(storedToken);
        setUserData(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log("Erreur lors du chargement de la session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (token, user) => {
    try {
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userData", JSON.stringify(user));
      setUserToken(token);
      setUserData(user);
    } catch (error) {
      console.log("Erreur lors de la sauvegarde de la session:", error);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");
      setUserToken(null);
      setUserData(null);
    } catch (error) {
      console.log("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        userData,
        signIn,
        signOut,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
