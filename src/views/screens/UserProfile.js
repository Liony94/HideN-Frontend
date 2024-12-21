import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import UserController from "../../controllers/UserController";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await UserController.fetchUserData(1); // exemple avec ID 1
      setUserData(data);
    } catch (error) {
      console.error("Erreur vue:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {loading ? (
        <Text>Chargement...</Text>
      ) : (
        <Text>Profil de {userData?.name}</Text>
      )}
    </View>
  );
};

export default UserProfile;
