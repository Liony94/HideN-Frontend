import { StyleSheet } from "react-native";
import theme from "./theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  errorText: {
    color: theme.colors.primary,
    fontSize: 16,
    textAlign: "center",
  },
  header: {
    padding: 20,
  },
  backButton: {
    padding: 10,
  },
  profileContainer: {
    alignItems: "center",
    padding: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  infoSection: {
    width: "100%",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 10,
  },
  interestsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  interestTag: {
    backgroundColor: "rgba(255, 75, 110, 0.1)",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  interestText: {
    color: theme.colors.text,
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: 140,
    justifyContent: "center",
  },
  blockButton: {
    backgroundColor: theme.colors.primary,
  },
  unblockButton: {
    backgroundColor: "#4CAF50",
  },
  reportButton: {
    backgroundColor: "#FF9800",
  },
  actionButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#2A2A2A",
    borderRadius: 15,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: "#CCCCCC",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  modalButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
});
