import { StyleSheet } from "react-native";
import theme from "./theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: 30,
  },
  form: {
    padding: 20,
  },
  input: {
    backgroundColor: "#2A2A2A",
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    color: theme.colors.text,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "600",
  },
  loginButton: {
    alignItems: "center",
    padding: 10,
  },
  loginButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
  },
});
