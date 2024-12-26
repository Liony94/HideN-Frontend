import { StyleSheet } from "react-native";
import theme from "./theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.layout.containerPadding,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  listContainer: {
    paddingVertical: theme.spacing.medium,
    backgroundColor: theme.colors.background,
  },
  conversationItem: {
    flexDirection: "row",
    padding: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundSecondary,
    marginHorizontal: theme.spacing.medium,
    marginBottom: theme.spacing.small,
    borderRadius: theme.borderRadius.medium,
    ...theme.shadows.small,
  },
  avatar: {
    width: theme.images.avatar.medium,
    height: theme.images.avatar.medium,
    borderRadius: theme.images.avatar.medium / 2,
    marginRight: theme.spacing.medium,
  },
  defaultAvatar: {
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  conversationInfo: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: theme.typography.sizes.medium,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  date: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textTertiary,
    alignSelf: "flex-start",
    marginTop: theme.spacing.xs,
  },
  messageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    flex: 1,
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.medium,
  },
  unreadDot: {
    width: theme.spacing.medium,
    height: theme.spacing.medium,
    borderRadius: theme.spacing.medium / 2,
    backgroundColor: theme.colors.success,
    marginLeft: theme.spacing.small,
  },
});
