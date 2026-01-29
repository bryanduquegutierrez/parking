import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    await SecureStore.setItemAsync(
      "user",
      JSON.stringify({ username, password })
    );
    router.replace("/auth");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <TextInput
        placeholder="Usuario"
        placeholderTextColor="#9ca3af"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#9ca3af"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </Pressable>

      <Pressable onPress={() => router.replace("/auth")}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#f9fafb",
  },
  button: {
    height: 56,
    backgroundColor: "#2563eb",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  link: {
    marginTop: 24,
    textAlign: "center",
    color: "#2563eb",
    fontSize: 14,
  },
});
