import React, { useState, useEffect } from "react";
import {
  View,
  Text,
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
import DailyMatchModal from "../../components/DailyMatchModal";
import styles from "../../assets/styles/matchingStyles";

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
  const [showDailyMatch, setShowDailyMatch] = useState(false);

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

  const handleMatchFound = (match) => {
    // Logique de gestion du match trouvé
    console.log("Match trouvé:", match);
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

      <DailyMatchModal
        visible={showDailyMatch}
        onClose={() => setShowDailyMatch(false)}
        onMatchFound={handleMatchFound}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

export default Matching;
