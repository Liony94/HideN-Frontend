import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import DailyMatchModal from "../../components/DailyMatchModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
          <MaterialIcons name="favorite" size={60} color="#FF4B6E" />
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
          <MaterialIcons name="search" size={24} color="#FFFFFF" />
          <Text style={styles.mainButtonText}>Commencer à matcher</Text>
        </TouchableOpacity>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("UserProfile")}
          >
            <MaterialIcons name="person" size={24} color="#FF4B6E" />
            <Text style={styles.actionButtonText}>Mon Profil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("Matches")}
          >
            <MaterialIcons name="favorite-border" size={24} color="#FF4B6E" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  header: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#888888",
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 15,
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF4B6E",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#CCCCCC",
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 10,
  },
  mainButton: {
    backgroundColor: "#FF4B6E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 30,
    marginBottom: 20,
  },
  mainButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 75, 110, 0.1)",
    padding: 15,
    borderRadius: 15,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 8,
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    color: "#999999",
    fontSize: 14,
  },
});

export default Home;
