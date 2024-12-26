import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "../../assets/styles/matchesStyles";
import theme from "../../assets/styles/theme";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const Matches = ({ navigation }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending"); // "pending" ou "accepted"
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const initializeUserId = async () => {
      const token = await AsyncStorage.getItem("userToken");
      const id = JSON.parse(atob(token.split(".")[1])).userId;
      console.log("userId initialisé:", id);
      setUserId(id);
    };

    initializeUserId();
    fetchMatches();

    const unsubscribe = navigation.addListener("focus", () => {
      fetchMatches();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchMatches = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${API_URL}/api/matching/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des matchs");
      }

      const data = await response.json();
      console.log("Données reçues brutes:", data.matches);

      // Formater correctement les matches
      const formattedMatches = data.matches.map((match) => {
        // Trouver l'autre utilisateur
        const otherUser =
          match.users?.find((user) => user._id !== userId) || match.otherUser;

        return {
          ...match,
          _id: match._id || match.id,
          users: Array.isArray(match.users) ? match.users : [],
          initiator: match.initiator || {},
          otherUser: otherUser || {},
        };
      });

      console.log("Matches formatés:", formattedMatches);
      setMatches(formattedMatches);
    } catch (error) {
      console.error("Erreur complète:", error);
      Alert.alert(
        "Erreur",
        "Impossible de récupérer les matchs. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptMatch = async (matchId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      console.log("Tentative d'acceptation du match - ID:", matchId);

      const id = matchId.toString();
      console.log("URL de la requête:", `${API_URL}/api/matching/accept/${id}`);

      const response = await fetch(`${API_URL}/api/matching/accept/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Log de la réponse brute pour debug
      const responseText = await response.text();
      console.log("Réponse brute:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Erreur de parsing:", parseError);
        console.error("Contenu reçu:", responseText);
        throw new Error("Réponse invalide du serveur");
      }

      console.log("Status de la réponse:", response.status);
      console.log("Données reçues:", data);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Vous n'êtes pas autorisé à accepter ce match");
        } else if (response.status === 404) {
          throw new Error("Match non trouvé");
        }
        throw new Error(
          data.message || "Erreur lors de l'acceptation du match"
        );
      }

      Alert.alert("Succès", "Match accepté avec succès");
      await fetchMatches();
    } catch (error) {
      console.error("Erreur détaillée lors de l'acceptation:", error);
      console.error("Stack trace:", error.stack);
      Alert.alert(
        "Erreur",
        error.message || "Impossible d'accepter le match, veuillez réessayer"
      );
    }
  };

  const handleDeclineMatch = async (matchId) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      console.log("ID du match à refuser:", matchId);
      console.log("Type de l'ID:", typeof matchId);

      const id = matchId.toString();

      const response = await fetch(`${API_URL}/api/matching/decline/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Status de la réponse:", response.status);
      const data = await response.json();
      console.log("Réponse du serveur:", data);

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors du refus du match");
      }

      Alert.alert("Succès", "Match refusé avec succès");
      await fetchMatches();
    } catch (error) {
      console.error("Erreur détaillée lors du refus:", error);
      Alert.alert(
        "Erreur",
        error.message || "Une erreur est survenue lors du refus du match"
      );
    }
  };

  const renderMatch = ({ item }) => {
    console.log("Match à rendre:", item);

    if (!item || !item._id) return null;

    const isPending = item.status === "pending";
    const canAcceptMatch =
      isPending &&
      item.initiator?._id !== userId &&
      item.users.some((user) => user._id === userId);

    const otherUser =
      item.users?.find((user) => user._id !== userId) || item.otherUser;

    // Contenu commun du match
    const MatchContent = () => (
      <>
        <View style={styles.avatarContainer}>
          {otherUser?.profilePicture ? (
            <Image
              source={{ uri: otherUser.profilePicture }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.defaultAvatar]}>
              <MaterialIcons
                name="person"
                size={30}
                color={theme.colors.textTertiary}
              />
            </View>
          )}
        </View>
        <View style={styles.matchInfo}>
          <Text style={styles.name}>
            {otherUser?.firstName} {otherUser?.lastName}
          </Text>
          <Text style={styles.status} numberOfLines={1}>
            {isPending
              ? "Demande reçue"
              : item.lastMessage
              ? item.lastMessage.content
              : "Commencez la conversation !"}
          </Text>
        </View>
        {item.hasUnread && !isPending && <View style={styles.unreadDot} />}
      </>
    );

    // Rendu différent selon le statut du match
    if (item.status === "accepted") {
      return (
        <TouchableOpacity
          style={[styles.matchItem, styles.acceptedMatch]}
          onPress={() => navigation.navigate("Chat", { matchId: item._id })}
        >
          <MatchContent />
          <View style={styles.chatIcon}>
            <MaterialIcons name="chat" size={24} color="#666" />
          </View>
        </TouchableOpacity>
      );
    } else {
      // Match en attente : afficher les boutons d'action
      return (
        <View style={styles.matchItem}>
          <MatchContent />
          {canAcceptMatch && (
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => handleAcceptMatch(item._id)}
              >
                <Text style={styles.buttonText}>Accepter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.declineButton}
                onPress={() => handleDeclineMatch(item._id)}
              >
                <Text style={styles.buttonText}>Refuser</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    }
  };

  const filteredMatches = matches.filter((match) => {
    console.log("Filtrage du match:", match);

    if (activeTab === "pending") {
      if (match.status === "pending") {
        // Vérifier si l'utilisateur est le destinataire
        const isRecipient =
          match.initiator?._id !== userId &&
          match.users.some((user) => user._id === userId);

        console.log("Est destinataire:", isRecipient);
        return isRecipient;
      }
      return false;
    }
    return match.status === "accepted";
  });

  console.log("Matches filtrés:", filteredMatches); // Debug

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.secondary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Matchs</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "pending" && styles.activeTab]}
          onPress={() => setActiveTab("pending")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "pending" && styles.activeTabText,
            ]}
          >
            Demandes reçues
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "accepted" && styles.activeTab]}
          onPress={() => setActiveTab("accepted")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "accepted" && styles.activeTabText,
            ]}
          >
            Matchs acceptés
          </Text>
        </TouchableOpacity>
      </View>

      {console.log("Nombre de matches filtrés:", filteredMatches.length)}
      {filteredMatches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {activeTab === "pending"
              ? "Aucune demande de match en attente"
              : "Aucun match accepté"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredMatches}
          renderItem={renderMatch}
          keyExtractor={(item) => item._id || item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

export default Matches;
