import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
  Modal,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { PREDEFINED_INTERESTS } from "../../constants/interests";
import styles from "../../assets/styles/userProfileStyles";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.56.1:3000";

const UserProfile = () => {
  const { userData, userToken, signOut } = useContext(AuthContext);
  const navigation = useNavigation();
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
  const [newInterest, setNewInterest] = useState("");
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const loadProfileData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          birthDate: data.birthDate || "",
          bio: data.bio || "",
          interests: data.interests || [],
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadProfileData();
    }, [])
  );

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

  const addInterest = async (interest) => {
    if (isEditing && !formData.interests?.includes(interest)) {
      try {
        const profileResponse = await fetch(`${API_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const currentProfile = await profileResponse.json();

        const updatedInterests = [
          ...(currentProfile.interests || []),
          interest,
        ];

        const response = await fetch(`${API_URL}/api/profile/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            ...formData,
            interests: updatedInterests,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Erreur lors de la mise à jour");
        }

        setFormData((prev) => ({
          ...prev,
          interests: updatedInterests,
        }));

        loadProfileData();
      } catch (error) {
        Alert.alert("Erreur", error.message);
      }
    }
  };

  const removeInterest = async (index) => {
    if (isEditing) {
      try {
        const profileResponse = await fetch(`${API_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const currentProfile = await profileResponse.json();

        const newInterests = [...currentProfile.interests];
        newInterests.splice(index, 1);

        const response = await fetch(`${API_URL}/api/profile/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            ...formData,
            interests: newInterests,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Erreur lors de la mise à jour");
        }

        setFormData((prev) => ({
          ...prev,
          interests: newInterests,
        }));

        loadProfileData();
      } catch (error) {
        Alert.alert("Erreur", error.message);
      }
    }
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

          <View style={styles.interestsSection}>
            <Text style={styles.sectionTitle}>Centres d'intérêt</Text>

            {isEditing && (
              <TouchableOpacity
                style={styles.addInterestMainButton}
                onPress={() => setShowInterestsModal(true)}
              >
                <MaterialIcons
                  name="add-circle-outline"
                  size={24}
                  color="#FFFFFF"
                />
                <Text style={styles.addInterestButtonText}>
                  Ajouter des centres d'intérêt
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.interestsList}>
              {formData.interests?.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                  {isEditing && (
                    <TouchableOpacity
                      onPress={() => removeInterest(index)}
                      style={styles.removeInterestButton}
                    >
                      <MaterialIcons name="close" size={18} color="#FF4B6E" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>

            <Modal
              visible={showInterestsModal}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setShowInterestsModal(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>
                    {selectedCategory
                      ? selectedCategory
                      : "Choisir une catégorie"}
                  </Text>

                  {!selectedCategory ? (
                    <ScrollView>
                      {Object.keys(PREDEFINED_INTERESTS).map((category) => (
                        <TouchableOpacity
                          key={category}
                          style={styles.categoryButton}
                          onPress={() => setSelectedCategory(category)}
                        >
                          <Text style={styles.categoryButtonText}>
                            {category}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  ) : (
                    <>
                      <ScrollView style={styles.interestsScrollView}>
                        {PREDEFINED_INTERESTS[selectedCategory].map(
                          (interest) => (
                            <TouchableOpacity
                              key={interest}
                              style={[
                                styles.interestOption,
                                formData.interests?.includes(interest) &&
                                  styles.selectedInterest,
                              ]}
                              onPress={() => addInterest(interest)}
                            >
                              <Text
                                style={[
                                  styles.interestOptionText,
                                  formData.interests?.includes(interest) &&
                                    styles.selectedInterestText,
                                ]}
                              >
                                {interest}
                              </Text>
                            </TouchableOpacity>
                          )
                        )}
                      </ScrollView>

                      <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => setSelectedCategory(null)}
                      >
                        <Text style={styles.buttonText}>
                          Retour aux catégories
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}

                  <TouchableOpacity
                    style={styles.closeModalButton}
                    onPress={() => {
                      setShowInterestsModal(false);
                      setSelectedCategory(null);
                    }}
                  >
                    <Text style={styles.buttonText}>Fermer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>

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

export default UserProfile;
