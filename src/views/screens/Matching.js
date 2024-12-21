import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
console.log("API URL:", API_URL);

const Matching = () => {
  const navigation = useNavigation();
  const [isSearching, setIsSearching] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [error, setError] = useState(null);

  const findNewMatch = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        throw new Error("Vous devez être connecté");
      }

      const response = await fetch(`${API_URL}/api/matching/find`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.text();

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${responseData}`);
      }

      const data = JSON.parse(responseData);

      if (!data.match) {
        throw new Error("Aucun match trouvé");
      }

      setCurrentMatch(data.match);
    } catch (err) {
      console.error("Erreur recherche:", err);
      setError(err.message || "Une erreur est survenue lors de la recherche");
      setIsSearching(false);
    }
  };

  const startSearching = async () => {
    setIsSearching(true);
    setError(null);
    await findNewMatch();
  };

  const handleSendMatchRequest = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        throw new Error("Vous devez être connecté");
      }

      const response = await fetch(
        `${API_URL}/api/matching/request/${currentMatch._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const responseData = await response.text();
        throw new Error(`Erreur ${response.status}: ${responseData}`);
      }

      Alert.alert("Succès", "Votre demande de match a été envoyée !", [
        {
          text: "OK",
          onPress: () => {
            setCurrentMatch(null);
            setIsSearching(false);
          },
        },
      ]);
    } catch (err) {
      console.error("Erreur lors de l'envoi de la demande:", err);
      Alert.alert(
        "Erreur",
        err.message || "Une erreur est survenue lors de l'envoi de la demande"
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {error && <Text style={styles.errorText}>{error}</Text>}

        {isSearching && !currentMatch ? (
          <>
            <ActivityIndicator size="large" color="#FF4B6E" />
            <Text style={styles.searchingText}>
              Recherche d'une personne disponible...
            </Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsSearching(false)}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </>
        ) : currentMatch ? (
          <View style={styles.matchContainer}>
            {currentMatch.profilePicture && (
              <Image
                source={{ uri: currentMatch.profilePicture }}
                style={styles.profileImage}
              />
            )}
            <Text style={styles.matchName}>
              {currentMatch.firstName}, {currentMatch.age} ans
            </Text>
            {currentMatch.distance && (
              <Text style={styles.matchDistance}>
                À {currentMatch.distance} km
              </Text>
            )}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.sendRequestButton}
                onPress={handleSendMatchRequest}
              >
                <Text style={styles.buttonText}>Envoyer une demande</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.skipButton}
                onPress={() => {
                  setCurrentMatch(null);
                  startSearching();
                }}
              >
                <Text style={styles.buttonText}>Passer</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.startButton} onPress={startSearching}>
            <Text style={styles.startButtonText}>Commencer la recherche</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  header: {
    padding: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: "#FF4B6E",
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  searchingText: {
    color: "#FFFFFF",
    fontSize: 18,
    marginTop: 20,
    textAlign: "center",
  },
  startButton: {
    backgroundColor: "#FF4B6E",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: "80%",
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
  },
  cancelButton: {
    marginTop: 20,
    padding: 10,
  },
  cancelButtonText: {
    color: "#FF4B6E",
    fontSize: 16,
  },
  errorText: {
    color: "#FF4B6E",
    marginBottom: 20,
    textAlign: "center",
  },
  matchContainer: {
    alignItems: "center",
    width: "100%",
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  matchName: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  matchDistance: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
  },
  sendRequestButton: {
    backgroundColor: "#FF4B6E",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: "45%",
  },
  skipButton: {
    backgroundColor: "#666",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: "45%",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
  },
});

export default Matching;
