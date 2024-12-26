import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { PREDEFINED_INTERESTS } from "../constants/interests";
import { API_URL } from "../config/api.config";
import { useNavigation } from "@react-navigation/native";
import styles from "../assets/styles/dailyMatchModalStyles";
import theme from "../assets/styles/theme";

const DEFAULT_PROFILE_IMAGE = "https://via.placeholder.com/150";

const DailyMatchModal = ({ visible, onClose, onMatchFound }) => {
  const navigation = useNavigation();
  const [step, setStep] = useState(1); // 1: Catégories, 2: Intérêts, 3: Recherche/Résultat
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(24 * 60 * 60); // 24 heures en secondes

  useEffect(() => {
    if (visible) {
      setStep(1);
      setSelectedCategory(null);
      setSelectedInterest(null);
      setError(null);
    }
  }, [visible]);

  useEffect(() => {
    let timer;
    if (selectedMatch) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [selectedMatch]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setStep(2);
  };

  const handleInterestSelect = async (interest) => {
    setSelectedInterest(interest);
    setLoading(true);
    try {
      console.log("Tentative de match avec l'intérêt:", interest);
      const token = await AsyncStorage.getItem("userToken");
      console.log("Token récupéré:", token);

      const response = await fetch(`${API_URL}/api/matching/daily-match`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedCriteria: interest }),
      });

      console.log("URL appelée:", `${API_URL}/api/matching/daily-match`);
      console.log("Réponse complète:", response);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Erreur texte:", errorText);
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("Données reçues:", data);

      if (data.match) {
        setSelectedMatch(data.match);
        setStep(3);
      } else {
        setError("Aucun match trouvé pour ce critère");
      }
    } catch (error) {
      console.error("Erreur lors du matching:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <View>
      <Text style={styles.title}>Choisissez une catégorie</Text>
      <Text style={styles.subtitle}>
        Sélectionnez la catégorie qui vous intéresse aujourd'hui
      </Text>
      <ScrollView style={styles.scrollView}>
        {Object.keys(PREDEFINED_INTERESTS).map((category) => (
          <TouchableOpacity
            key={category}
            style={styles.categoryButton}
            onPress={() => handleCategorySelect(category)}
          >
            <Text style={styles.categoryText}>{category}</Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={theme.colors.secondary}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.title}>Choisissez un intérêt</Text>
      <Text style={styles.subtitle}>Dans la catégorie {selectedCategory}</Text>
      <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
        <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
        <Text style={styles.backButtonText}>Retour aux catégories</Text>
      </TouchableOpacity>
      <ScrollView style={styles.scrollView}>
        {PREDEFINED_INTERESTS[selectedCategory].map((interest) => (
          <TouchableOpacity
            key={interest}
            style={[
              styles.interestButton,
              selectedInterest === interest && styles.selectedInterestButton,
            ]}
            onPress={() => handleInterestSelect(interest)}
            activeOpacity={0.7}
          >
            <Text style={styles.interestText}>{interest}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.loadingContainer}>
      {loading ? (
        <>
          <ActivityIndicator size="large" color={theme.colors.secondary} />
          <Text style={styles.loadingText}>Recherche de votre match...</Text>
        </>
      ) : error ? (
        <>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setStep(1)}
          >
            <Text style={styles.buttonText}>Réessayer</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.matchInfoContainer}>
          <Text style={styles.matchTitle}>Match du Jour !</Text>
          <View style={styles.matchCard}>
            <Image
              source={
                selectedMatch?.profileImage
                  ? { uri: selectedMatch.profileImage }
                  : { uri: DEFAULT_PROFILE_IMAGE }
              }
              style={styles.matchImage}
            />
            <Text style={styles.matchName}>
              {selectedMatch?.firstName}, {selectedMatch?.age} ans
            </Text>
            {selectedMatch?.bio && (
              <Text style={styles.matchBio}>{selectedMatch.bio}</Text>
            )}
            <Text style={styles.matchInterest}>
              Vous partagez un intérêt : {selectedInterest}
            </Text>

            <TouchableOpacity
              style={styles.viewProfileButton}
              onPress={() => {
                onMatchFound(selectedMatch);
                onClose();
                navigation.navigate("UserProfileView", {
                  userId: selectedMatch._id,
                });
              }}
            >
              <Text style={styles.viewProfileText}>Voir le profil</Text>
            </TouchableOpacity>

            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>
                Prochain match disponible dans
              </Text>
              <Text style={styles.timerValue}>{formatTime(timeRemaining)}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialIcons
              name="close"
              size={24}
              style={styles.closeButtonIcon}
            />
          </TouchableOpacity>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </View>
      </View>
    </Modal>
  );
};

export default DailyMatchModal;
