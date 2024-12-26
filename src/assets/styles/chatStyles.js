import { StyleSheet } from "react-native";
import theme from "./theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    color: theme.colors.primary,
    fontSize: theme.typography.sizes.medium,
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.large,
    fontWeight: theme.typography.weights.bold,
  },
  headerSpace: {
    width: 50,
  },
  chatContainer: {
    flex: 1,
  },
  messageContainer: {
    margin: theme.spacing.medium,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.large,
    maxWidth: "75%",
    minWidth: "20%",
  },
  sentMessage: {
    backgroundColor: theme.colors.primary,
    alignSelf: "flex-end",
    borderBottomRightRadius: theme.spacing.xs,
    marginLeft: "25%",
    borderTopLeftRadius: theme.borderRadius.large,
    borderTopRightRadius: theme.borderRadius.large,
    borderBottomLeftRadius: theme.borderRadius.large,
  },
  receivedMessage: {
    backgroundColor: theme.colors.backgroundSecondary,
    alignSelf: "flex-start",
    borderBottomLeftRadius: theme.spacing.xs,
    marginRight: "25%",
    borderTopLeftRadius: theme.borderRadius.large,
    borderTopRightRadius: theme.borderRadius.large,
    borderBottomRightRadius: theme.borderRadius.large,
  },
  messageText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.medium,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: theme.typography.sizes.xs,
    marginTop: theme.spacing.xs,
    alignSelf: "flex-end",
  },
  sentMessageTime: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  receivedMessageTime: {
    color: theme.colors.textTertiary,
  },
  inputContainer: {
    flexDirection: "row",
    padding: theme.spacing.medium,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.large,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.medium,
    marginRight: theme.spacing.medium,
    color: theme.colors.text,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.large,
    paddingHorizontal: theme.spacing.large,
    justifyContent: "center",
  },
  sendButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.medium,
  },
}); 