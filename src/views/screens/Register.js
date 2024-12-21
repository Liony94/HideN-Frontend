import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../context/AuthContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.56.1:3000";

const Register = () => {
  const navigation = useNavigation();
  const { signIn } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    birthDate: "",
  });

  const handleRegister = async () => {
    // Validation basique
    if (
      !formData.email ||
      !formData.password ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.birthDate
    ) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Erreur", "Email invalide");
      return;
    }

    // Validation date de naissance
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formData.birthDate)) {
      Alert.alert("Erreur", "Format de date invalide (YYYY-MM-DD)");
      return;
    }

    try {
      console.log("Tentative de connexion à:", `${API_URL}/api/auth/register`); // Debug log

      const url = `${API_URL}/api/auth/register`;
      console.log("URL de l'API:", url);
      console.log("Données envoyées:", formData);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Statut de la réponse:", response.status);
      const responseData = await response.json();
      console.log("Données reçues:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Une erreur est survenue");
      }

      await signIn(responseData.token, responseData.user);

      Alert.alert("Succès", "Inscription réussie");
    } catch (error) {
      console.error("Type d'erreur:", error.name);
      console.error("Message d'erreur:", error.message);
      Alert.alert(
        "Erreur de connexion",
        "Détails de l'erreur : " + error.message
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>AnonyMatch</Text>
          <Text style={styles.subtitle}>Inscription</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Prénom"
            placeholderTextColor="#888888"
            value={formData.firstName}
            onChangeText={(text) =>
              setFormData({ ...formData, firstName: text })
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Nom"
            placeholderTextColor="#888888"
            value={formData.lastName}
            onChangeText={(text) =>
              setFormData({ ...formData, lastName: text })
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888888"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#888888"
            value={formData.password}
            onChangeText={(text) =>
              setFormData({ ...formData, password: text })
            }
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Date de naissance (YYYY-MM-DD)"
            placeholderTextColor="#888888"
            value={formData.birthDate}
            onChangeText={(text) =>
              setFormData({ ...formData, birthDate: text })
            }
          />

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>S'inscrire</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginButtonText}>
              Déjà un compte ? Se connecter
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 30,
  },
  form: {
    padding: 20,
  },
  input: {
    backgroundColor: "#2A2A2A",
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    color: "#FFFFFF",
    fontSize: 16,
  },
  registerButton: {
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
  loginButton: {
    alignItems: "center",
    padding: 10,
  },
  loginButtonText: {
    color: "#FF4B6E",
    fontSize: 16,
  },
});

export default Register;
