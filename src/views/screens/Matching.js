import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.6;

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const DefaultAvatar = ({ name, size }) => {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  return (
    <LinearGradient
      colors={["#FF4B6E", "#FF758C"]}
      style={[
        styles.defaultAvatar,
        {
          width: size,
          height: size,
        },
      ]}
    >
      <Text style={[styles.initialsText, { fontSize: size * 0.4 }]}>
        {initials}
      </Text>
    </LinearGradient>
  );
};

const Matching = () => {
  const navigation = useNavigation();
  const [isSearching, setIsSearching] = useState(false);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [error, setError] = useState(null);
  const [cardScale] = useState(new Animated.Value(0.9));
  const [cardOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (currentMatch) {
      Animated.parallel([
        Animated.spring(cardScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [currentMatch]);

  const findNewMatch = async () => {
    try {
      cardScale.setValue(0.9);
      cardOpacity.setValue(0);

      const token = await AsyncStorage.getItem("userToken");
      if (!token) throw new Error("Vous devez être connecté");

      const response = await fetch(`${API_URL}/api/matching/find`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la recherche");
      }

      const data = await response.json();
      if (!data.match) {
        throw new Error("Aucun match trouvé");
      }

      setCurrentMatch(data.match);
    } catch (err) {
      setError(err.message);
      setIsSearching(false);
    }
  };

  const handleSendMatchRequest = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) throw new Error("Vous devez être connecté");

      const response = await fetch(
        `${API_URL}/api/matching/request/${currentMatch._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi de la demande");
      }

      // Animation de succès
      Animated.sequence([
        Animated.spring(cardScale, {
          toValue: 1.1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentMatch(null);
        setIsSearching(false);
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#FF4B6E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Découvrir</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setError(null);
                startSearching();
              }}
            >
              <Text style={styles.retryButtonText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        )}

        {isSearching && !currentMatch && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF4B6E" />
            <Text style={styles.loadingText}>
              Recherche de votre match parfait...
            </Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsSearching(false)}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        )}

        {currentMatch && (
          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ scale: cardScale }],
                opacity: cardOpacity,
              },
            ]}
          >
            {currentMatch.profilePicture ? (
              <Image
                source={{ uri: currentMatch.profilePicture }}
                style={styles.profileImage}
              />
            ) : (
              <DefaultAvatar
                name={currentMatch.firstName}
                size={CARD_HEIGHT * 0.7}
              />
            )}
            <View style={styles.cardContent}>
              <Text style={styles.matchName}>
                {currentMatch.firstName}, {currentMatch.age} ans
              </Text>
              {currentMatch.distance && (
                <View style={styles.infoRow}>
                  <MaterialIcons name="place" size={20} color="#FF4B6E" />
                  <Text style={styles.infoText}>
                    À {currentMatch.distance} km
                  </Text>
                </View>
              )}
              {currentMatch.interests && currentMatch.interests.length > 0 && (
                <View style={styles.interestsContainer}>
                  {currentMatch.interests.map((interest, index) => (
                    <View key={index} style={styles.interestTag}>
                      <Text style={styles.interestText}>{interest}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.skipButton]}
                onPress={() => {
                  setCurrentMatch(null);
                  findNewMatch();
                }}
              >
                <MaterialIcons name="close" size={30} color="#FF4B6E" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.likeButton]}
                onPress={handleSendMatchRequest}
              >
                <MaterialIcons name="favorite" size={30} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {!isSearching && !currentMatch && !error && (
          <View style={styles.startContainer}>
            <MaterialIcons name="favorite" size={60} color="#FF4B6E" />
            <Text style={styles.startTitle}>Prêt à matcher ?</Text>
            <Text style={styles.startDescription}>
              Trouvez des personnes qui partagent vos centres d'intérêt
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => {
                setIsSearching(true);
                findNewMatch();
              }}
            >
              <Text style={styles.startButtonText}>Commencer la recherche</Text>
            </TouchableOpacity>
          </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: width - 40,
    height: CARD_HEIGHT,
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  profileImage: {
    width: "100%",
    height: "70%",
    resizeMode: "cover",
  },
  cardContent: {
    padding: 20,
  },
  matchName: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    color: "#CCCCCC",
    fontSize: 16,
    marginLeft: 6,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  interestTag: {
    backgroundColor: "rgba(255, 75, 110, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    color: "#FF4B6E",
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  skipButton: {
    backgroundColor: "#FFFFFF",
  },
  likeButton: {
    backgroundColor: "#FF4B6E",
  },
  startContainer: {
    alignItems: "center",
    padding: 20,
  },
  startTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  startDescription: {
    color: "#CCCCCC",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: "#FF4B6E",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 18,
    marginTop: 20,
    marginBottom: 30,
  },
  cancelButton: {
    padding: 10,
  },
  cancelButtonText: {
    color: "#FF4B6E",
    fontSize: 16,
  },
  errorContainer: {
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#FF4B6E",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#FF4B6E",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  defaultAvatar: {
    width: "100%",
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default Matching;
