import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AuthScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const storedUser = await SecureStore.getItemAsync("user");

    if (!storedUser) {
      alert("Usuario no registrado");
      return;
    }

    const { username: savedUser, password: savedPass } =
      JSON.parse(storedUser);

    if (username === savedUser && password === savedPass) {
      router.replace("/parking");
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/auth.png")}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Overlay para oscurecer un poco el fondo */}
      <View style={styles.overlay}>
        <Text style={styles.title}>Iniciar sesión</Text>

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

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </Pressable>

        <Pressable onPress={() => router.replace("/register")}>
          <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",   // contenido hacia abajo
    paddingHorizontal: 32,
    paddingBottom: 60,           // ajusta para bajar más
    backgroundColor: "rgba(0,0,0,0.55)", // fondo más oscuro
  },

  title: {
    fontSize: 42,
    fontWeight: "700",
    marginBottom: 450,
    textAlign: "center",
    color: "#000000",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#ffffff",
  },
  button: {
    height: 56,
    backgroundColor: "#043193",
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
    color: "#043193",
    fontSize: 14,
  },
});
