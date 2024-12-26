import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { API_URL } from "../../config/api.config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../assets/styles/userProfileViewStyles";

const DEFAULT_PROFILE_IMAGE = "https://via.placeholder.com/150";

const UserProfileView = ({ route, navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = route.params;
  const [isBlocked, setIsBlocked] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      console.log("Fetching profile for userId:", userId);

      console.log("API URL:", `${API_URL}/api/users/${userId}`);
      console.log("Token:", token);

      const response = await fetch(`${API_URL}/api/users/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);
      const responseText = await response.text();
      console.log("Response text:", responseText);

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(
            errorData.message || "Erreur lors de la récupération du profil"
          );
        } catch (e) {
          throw new Error("Erreur lors de la récupération du profil");
        }
      }

      const data = JSON.parse(responseText);
      console.log("Profile data received:", data);
      setUserData(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4B6E" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileContainer}>
        <Image
          source={
            userData?.profileImage
              ? { uri: userData.profileImage }
              : { uri: DEFAULT_PROFILE_IMAGE }
          }
          style={styles.profileImage}
        />
        <Text style={styles.name}>
          {userData?.firstName}, {userData?.age} ans
        </Text>

        {userData?.bio && <Text style={styles.bio}>{userData.bio}</Text>}

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Centres d'intérêt</Text>
          <View style={styles.interestsList}>
            {userData?.interests?.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              isBlocked ? styles.unblockButton : styles.blockButton,
            ]}
            onPress={() => {
              setShowPremiumModal(true);
            }}
          >
            <MaterialIcons
              name={isBlocked ? "lock-open" : "block"}
              size={24}
              color="#FFFFFF"
            />
            <Text style={styles.actionButtonText}>
              {isBlocked ? "Débloquer" : "Bloquer"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.reportButton]}
            onPress={() => {
              setShowPremiumModal(true);
            }}
          >
            <MaterialIcons name="flag" size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Signaler</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showPremiumModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPremiumModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Fonctionnalité Premium</Text>
            <Text style={styles.modalText}>
              Cette fonctionnalité est réservée aux membres premium.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowPremiumModal(false)}
            >
              <Text style={styles.modalButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default UserProfileView;
