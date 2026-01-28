import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

export default function RootLayout() {
  const [logged, setLogged] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      if (Platform.OS === "web") {
        // 🌐 Web → localStorage
        const user = localStorage.getItem("user");
        setLogged(!!user);
      } else {
        // 📱 Móvil → SecureStore
        const user = await SecureStore.getItemAsync("user");
        setLogged(!!user);
      }
    };

    checkSession();
  }, []);

  if (logged === null) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!logged ? (
        <>
          <Stack.Screen name="auth" />
          <Stack.Screen name="register" />
        </>
      ) : (
        <Stack.Screen name="(tabs)" />
      )}
    </Stack>
  );
}
