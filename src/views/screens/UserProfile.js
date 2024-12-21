import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.56.1:3000";

const UserProfile = () => {
  const { userData, userToken, signOut } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    email: userData?.email || "",
    birthDate: userData?.birthDate || "",
    bio: userData?.bio || "",
    interests: userData?.interests || [],
    // Ajoutez d'autres champs selon votre modèle utilisateur
  });

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${API_URL}/api/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la mise à jour");
      }

      Alert.alert("Succès", "Profil mis à jour avec succès");
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  };

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Oui",
        onPress: signOut,
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Mon Profil</Text>
        </View>

        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri: userData?.profileImage || "https://via.placeholder.com/150",
            }}
            style={styles.profileImage}
          />
          {isEditing && (
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Changer la photo</Text>
            </TouchableOpacity>
          )}
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
            editable={isEditing}
          />

          <TextInput
            style={styles.input}
            placeholder="Nom"
            placeholderTextColor="#888888"
            value={formData.lastName}
            onChangeText={(text) =>
              setFormData({ ...formData, lastName: text })
            }
            editable={isEditing}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888888"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            editable={isEditing}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Date de naissance"
            placeholderTextColor="#888888"
            value={formData.birthDate}
            onChangeText={(text) =>
              setFormData({ ...formData, birthDate: text })
            }
            editable={isEditing}
          />

          <TextInput
            style={[styles.input, styles.bioInput]}
            placeholder="Bio"
            placeholderTextColor="#888888"
            value={formData.bio}
            onChangeText={(text) => setFormData({ ...formData, bio: text })}
            editable={isEditing}
            multiline
            numberOfLines={4}
          />

          {isEditing ? (
            <View style={styles.editButtons}>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleUpdate}
              >
                <Text style={styles.buttonText}>Enregistrer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.buttonText}>Modifier le profil</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Se déconnecter</Text>
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
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  changePhotoButton: {
    padding: 8,
  },
  changePhotoText: {
    color: "#FF4B6E",
    fontSize: 16,
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
  bioInput: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: "#FF4B6E",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: "#FF4B6E",
    flex: 1,
    marginLeft: 5,
  },
  logoutButton: {
    backgroundColor: "#CF2A2A",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  editButtons: {
    flexDirection: "row",
    marginBottom: 15,
  },
});

export default UserProfile;
