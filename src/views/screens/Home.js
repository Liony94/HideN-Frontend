import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const navigation = useNavigation();

  const handleStartMatching = () => {
    navigation.navigate("Matching");
  };

  const handleGoToProfile = () => {
    navigation.navigate("UserProfile");
  };

  const handleGoToConversations = () => {
    navigation.navigate("Conversations");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AnonyMatch</Text>
        <Text style={styles.subtitle}>Rencontrez l'inattendu</Text>
      </View>

      <View style={styles.mainContent}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/6386/6386976.png",
          }}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.description}>
          Découvrez des conversations authentiques dans l'anonymat total
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartMatching}
        >
          <Text style={styles.buttonText}>Commencer une conversation</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={handleGoToProfile}
        >
          <Text style={styles.profileButtonText}>Mon profil</Text>
        </TouchableOpacity>
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
    fontSize: 16,
    color: "#888888",
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  description: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  buttonContainer: {
    padding: 20,
  },
  startButton: {
    backgroundColor: "#FF4B6E",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  conversationsButton: {
    backgroundColor: "#2A2A2A",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
  },
  conversationsButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  profileButton: {
    backgroundColor: "transparent",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF4B6E",
  },
  profileButtonText: {
    color: "#FF4B6E",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Home;
