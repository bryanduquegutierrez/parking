import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function AuthScreen() {
  // 👇 AQUÍ SE DECLARAN (scope correcto)
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
      router.replace("/home");
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <View style={{ padding: 24 }}>
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

      <Pressable onPress={handleLogin}>
        <Text>Entrar</Text>
      </Pressable>
    </View>
  );
}
