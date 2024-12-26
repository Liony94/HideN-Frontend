import { StyleSheet, Dimensions } from "react-native";
import theme from "./theme";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: "center",
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.large,
  },
  title: {
    fontSize: theme.typography.sizes.title,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.small,
  },
  subtitle: {
    fontSize: theme.typography.sizes.large,
    color: theme.colors.textSecondary,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: theme.layout.containerPadding,
    paddingTop: theme.layout.containerPadding,
  },
  card: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.xl,
    alignItems: "center",
    marginBottom: theme.spacing.large,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardTitle: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
  },
  cardDescription: {
    fontSize: theme.typography.sizes.medium,
    color: theme.colors.textMuted,
    textAlign: "center",
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.large,
    marginBottom: theme.spacing.large,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.secondary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.sizes.small,
    color: theme.colors.textMuted,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.medium,
  },
  mainButton: {
    backgroundColor: theme.colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.circle,
    marginBottom: theme.spacing.large,
    ...theme.shadows.medium,
  },
  mainButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.sizes.large,
    fontWeight: theme.typography.weights.semiBold,
    marginLeft: theme.spacing.medium,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.medium,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primaryLight,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
  },
  actionButtonText: {
    color: theme.colors.text,
    fontSize: theme.typography.sizes.medium,
    marginLeft: theme.spacing.small,
  },
  footer: {
    padding: theme.spacing.large,
    alignItems: "center",
  },
  footerText: {
    color: theme.colors.textTertiary,
    fontSize: theme.typography.sizes.small,
  },
});
