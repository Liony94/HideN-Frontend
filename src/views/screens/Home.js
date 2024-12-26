import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import DailyMatchModal from "../../components/DailyMatchModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../assets/styles/homeStyles";
import theme from "../../assets/styles/theme";

const { width } = Dimensions.get("window");

const Home = () => {
  const navigation = useNavigation();
  const [showDailyModal, setShowDailyModal] = useState(false);

  useEffect(() => {
    checkDailyMatch();

    const unsubscribe = navigation.addListener("focus", () => {
      checkDailyMatch();
    });

    return unsubscribe;
  }, [navigation]);

  const checkDailyMatch = async () => {
    try {
      setShowDailyModal(true);
    } catch (error) {
      console.error(
        "Erreur lors de la vérification du match quotidien:",
        error
      );
    }
  };

  const handleMatchFound = (match) => {
    navigation.navigate("Matching", { dailyMatch: match });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AnonyMatch</Text>
        <Text style={styles.subtitle}>Rencontrez l'inattendu</Text>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.card}>
          <MaterialIcons
            name="favorite"
            size={60}
            color={theme.colors.secondary}
          />
          <Text style={styles.cardTitle}>Trouvez votre match</Text>
          <Text style={styles.cardDescription}>
            Découvrez des personnes qui partagent vos centres d'intérêt
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1K+</Text>
            <Text style={styles.statLabel}>Utilisateurs</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>Matchs</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statLabel}>Satisfaits</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => navigation.navigate("Matching")}
        >
          <MaterialIcons name="search" size={24} color={theme.colors.text} />
          <Text style={styles.mainButtonText}>Commencer à matcher</Text>
        </TouchableOpacity>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("UserProfile")}
          >
            <MaterialIcons
              name="person"
              size={24}
              color={theme.colors.secondary}
            />
            <Text style={styles.actionButtonText}>Mon Profil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Matches")}
          >
            <MaterialIcons
              name="favorite-border"
              size={24}
              color={theme.colors.secondary}
            />
            <Text style={styles.actionButtonText}>Mes Matchs</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Rencontrez l'inattendu en toute sécurité
        </Text>
      </View>

      <DailyMatchModal
        visible={showDailyModal}
        onClose={() => setShowDailyModal(false)}
        onMatchFound={handleMatchFound}
      />
    </SafeAreaView>
  );
};

export default Home;
