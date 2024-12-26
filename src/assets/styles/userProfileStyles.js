import { StyleSheet } from "react-native";
import theme from "./theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.layout.containerPadding,
  },
  header: {
    alignItems: "center",
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.large,
  },
  title: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: theme.images.avatar.large,
    height: theme.images.avatar.large,
    borderRadius: theme.images.avatar.large / 2,
    marginBottom: theme.spacing.medium,
  },
  changePhotoButton: {
    padding: 8,
  },
  changePhotoText: {
    color: theme.colors.primary,
    fontSize: 16,
  },
  form: {
    padding: 20,
  },
  input: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.circle,
    padding: theme.inputs.padding,
    marginBottom: theme.spacing.medium,
    color: theme.colors.text,
    fontSize: theme.typography.sizes.medium,
  },
  bioInput: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    ...theme.shadows.medium,
    height: theme.buttons.height.medium,
    borderRadius: theme.borderRadius.circle,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.medium,
  },
  editButton: {
    backgroundColor: theme.colors.primary,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: theme.colors.primary,
    flex: 1,
    marginLeft: 5,
  },
  logoutButton: {
    backgroundColor: "#CF2A2A",
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  editButtons: {
    flexDirection: "row",
    marginBottom: 15,
  },
  interestsSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 10,
  },
  interestsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  interestTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 75, 110, 0.1)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  interestText: {
    color: theme.colors.text,
    marginRight: 5,
  },
  removeInterestButton: {
    padding: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: "#2A2A2A",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  categoryButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    textAlign: "center",
  },
  interestsScrollView: {
    maxHeight: 400,
  },
  interestOption: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#2A2A2A",
  },
  selectedInterest: {
    backgroundColor: theme.colors.primary,
  },
  interestOptionText: {
    color: theme.colors.text,
    fontSize: 16,
    textAlign: "center",
  },
  selectedInterestText: {
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#2A2A2A",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  closeModalButton: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  addInterestMainButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 25,
    marginBottom: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addInterestButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
