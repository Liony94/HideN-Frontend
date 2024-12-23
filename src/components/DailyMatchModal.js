import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { PREDEFINED_INTERESTS } from "../constants/interests";
import { API_URL } from "../config/api.config";

const DEFAULT_PROFILE_IMAGE = "https://via.placeholder.com/150";

const DailyMatchModal = ({ visible, onClose, onMatchFound }) => {
  const [step, setStep] = useState(1); // 1: Catégories, 2: Intérêts, 3: Recherche/Résultat
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    if (visible) {
      setStep(1);
      setSelectedCategory(null);
      setSelectedInterest(null);
      setError(null);
    }
  }, [visible]);

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
            <MaterialIcons name="chevron-right" size={24} color="#FF4B6E" />
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
          <ActivityIndicator size="large" color="#FF4B6E" />
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
          <Text style={styles.matchTitle}>Match trouvé !</Text>
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
              Centre d'intérêt commun : {selectedInterest}
            </Text>

            <View style={styles.matchButtons}>
              <TouchableOpacity
                style={[styles.matchButton, styles.acceptButton]}
                onPress={() => {
                  onMatchFound(selectedMatch);
                  onClose();
                }}
              >
                <Text style={styles.buttonText}>Voir le profil</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.matchButton, styles.declineButton]}
                onPress={() => setStep(1)}
              >
                <Text style={styles.buttonText}>Chercher un autre match</Text>
              </TouchableOpacity>
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
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.buttonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
    marginBottom: 20,
  },
  scrollView: {
    maxHeight: 400,
  },
  categoryButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  categoryText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "500",
  },
  interestButton: {
    backgroundColor: "#2A2A2A",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedInterestButton: {
    backgroundColor: "#FF4B6E",
    transform: [{ scale: 1.02 }],
  },
  interestText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 15,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 10,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 10,
  },
  errorText: {
    color: "#FF4B6E",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: "#FF4B6E",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#FF4B6E",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  matchInfoContainer: {
    alignItems: "center",
    padding: 20,
  },
  matchTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  matchCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    alignItems: "center",
  },
  matchImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  matchName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  matchBio: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
    marginBottom: 15,
  },
  matchInterest: {
    fontSize: 16,
    color: "#FF4B6E",
    marginBottom: 20,
  },
  matchButtons: {
    width: "100%",
    gap: 10,
  },
  matchButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#FF4B6E",
  },
  declineButton: {
    backgroundColor: "#2A2A2A",
    borderWidth: 1,
    borderColor: "#FF4B6E",
  },
});

export default DailyMatchModal;
