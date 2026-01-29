import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SettingsScreen() {
  const [username, setUsername] = useState("");
  const [points, setPoints] = useState(0);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Cargar usuario y puntos al iniciar
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await SecureStore.getItemAsync("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUsername(user.username);
        setPoints(user.points || 0);
      }
    };

    loadUser();
  }, []);

  // 🔒 Cambiar contraseña
  const handleChangePassword = async () => {
    const storedUser = await SecureStore.getItemAsync("user");

    if (!storedUser) {
      Alert.alert("Error", "No se encontró el usuario");
      return;
    }

    const user = JSON.parse(storedUser);

    if (oldPassword !== user.password) {
      Alert.alert("Error", "Contraseña actual incorrecta");
      return;
    }

    const updatedUser = {
      ...user,
      password: newPassword,
    };

    await SecureStore.setItemAsync("user", JSON.stringify(updatedUser));
    Alert.alert("Éxito", "Contraseña actualizada correctamente");
    setOldPassword("");
    setNewPassword("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Usuario:</Text>
        <Text style={styles.info}>{username}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Change password</Text>

        <TextInput
          style={styles.input}
          placeholder="Current password"
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="New password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />

        <Pressable style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Actualizar contraseña</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  info: {
    fontSize: 18,
    color: "#2563eb",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  button: {
    height: 50,
    backgroundColor: "#2563eb",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
