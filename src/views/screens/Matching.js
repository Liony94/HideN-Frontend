import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const Matching = () => {
  const navigation = useNavigation();
  const [isSearching, setIsSearching] = useState(false);

  const startSearching = () => {
    setIsSearching(true);
    // la logique de matching avec le backend
  };

  const cancelSearching = () => {
    setIsSearching(false);
    // Annuler la recherche
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
        {isSearching ? (
          <>
            <ActivityIndicator size="large" color="#FF4B6E" />
            <Text style={styles.searchingText}>
              Recherche d'une personne disponible...
            </Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={cancelSearching}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </>
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
});

export default Matching;
