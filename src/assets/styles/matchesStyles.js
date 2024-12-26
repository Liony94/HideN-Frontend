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
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.medium,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.secondary,
  },
  tabText: {
    color: theme.colors.textTertiary,
    fontSize: theme.typography.sizes.medium,
  },
  activeTabText: {
    color: theme.colors.secondary,
    fontWeight: theme.typography.weights.semiBold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  listContainer: {
    backgroundColor: theme.colors.background,
  },
  matchItem: {
    flexDirection: "row",
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: theme.spacing.medium,
  },
  avatar: {
    width: theme.images.avatar.medium,
    height: theme.images.avatar.medium,
    borderRadius: theme.images.avatar.medium / 2,
  },
  defaultAvatar: {
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  matchInfo: {
    flex: 1,
  },
  name: {
    fontSize: theme.typography.sizes.medium,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  status: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.medium,
  },
  acceptButton: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    borderRadius: theme.borderRadius.circle,
  },
  declineButton: {
    backgroundColor: theme.colors.danger,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    borderRadius: theme.borderRadius.circle,
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.small,
    fontWeight: theme.typography.weights.semiBold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.large,
  },
  emptyText: {
    color: theme.colors.textTertiary,
    fontSize: theme.typography.sizes.medium,
    textAlign: "center",
  },
  acceptedMatch: {
    backgroundColor: theme.colors.backgroundSecondary,
  },
  chatIcon: {
    padding: theme.spacing.medium,
    marginLeft: theme.spacing.medium,
  },
  unreadDot: {
    position: "absolute",
    right: -6,
    top: -3,
    width: theme.spacing.medium,
    height: theme.spacing.medium,
    borderRadius: theme.spacing.medium / 2,
    backgroundColor: theme.colors.success,
  },
});
