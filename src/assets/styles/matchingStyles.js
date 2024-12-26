import { StyleSheet, Dimensions, StatusBar } from "react-native";
import theme from "./theme";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.6;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: width - 40,
    height: CARD_HEIGHT,
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  profileImage: {
    width: "100%",
    height: "70%",
    resizeMode: "cover",
  },
  cardContent: {
    padding: 20,
  },
  matchName: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    color: "#CCCCCC",
    fontSize: 16,
    marginLeft: 6,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  interestTag: {
    backgroundColor: "rgba(255, 75, 110, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    color: theme.colors.primary,
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  skipButton: {
    backgroundColor: theme.colors.text,
  },
  likeButton: {
    backgroundColor: theme.colors.primary,
  },
  startContainer: {
    alignItems: "center",
    padding: 20,
  },
  startTitle: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  startDescription: {
    color: "#CCCCCC",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  startButtonText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
  },
  loadingText: {
    color: theme.colors.text,
    fontSize: 18,
    marginTop: 20,
    marginBottom: 30,
  },
  cancelButton: {
    padding: 10,
  },
  cancelButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
  },
  errorContainer: {
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: theme.colors.primary,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  retryButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  defaultAvatar: {
    width: "100%",
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    color: theme.colors.text,
    fontWeight: "bold",
  },
});
