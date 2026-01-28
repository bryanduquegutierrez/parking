import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function RegisterScreen() {
  // 👇 TODO ESTO VA AQUÍ
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
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <TextInput
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable onPress={handleRegister}>
        <Text>Registrarse</Text>
      </Pressable>
    </View>
  );
}
