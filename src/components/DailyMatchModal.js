import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const DailyMatchModal = ({ visible, onClose, onMatchFound }) => {
  const [loading, setLoading] = useState(true);
  const [criteria, setCriteria] = useState([]);
  const [selectedCriteria, setSelectedCriteria] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible) {
      fetchCriteria();
    }
  }, [visible]);

  const fetchCriteria = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_URL}/api/matching/daily-criteria`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      if (data.canGetMatch) {
        setCriteria(data.availableCriteria);
      } else {
        setError(
          `Prochain match disponible dans: ${new Date(
            data.nextAvailable
          ).toLocaleString()}`
        );
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCriteriaSelect = async (criteria) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_URL}/api/matching/daily-match`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedCriteria: criteria }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      onMatchFound(data.match);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Match Quotidien Spécial</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#FF4B6E" />
          ) : error ? (
            <View>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.buttonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.subtitle}>
                Choisissez un critère pour trouver votre match du jour
              </Text>
              <FlatList
                data={criteria}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.criteriaButton}
                    onPress={() => handleCriteriaSelect(item)}
                  >
                    <Text style={styles.criteriaText}>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
              />
            </>
          )}
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
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
    marginBottom: 20,
  },
  criteriaButton: {
    backgroundColor: "#2A2A2A",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  criteriaText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#FF4B6E",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  errorText: {
    color: "#FF4B6E",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default DailyMatchModal;
