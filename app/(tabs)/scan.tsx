import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [points, setPoints] = useState(120);

  useEffect(() => {
    if (!permission) requestPermission();
  }, []);

  const handleScanTicket = () => {
    const earnedPoints = 20;
    setPoints((prev) => prev + earnedPoints);
    Alert.alert("Ticket scanned ✅", `You earned ${earnedPoints} points`);
  };

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text>Camera permission required</Text>
        <Pressable onPress={requestPermission}>
          <Text style={{ color: "#2563eb", marginTop: 10 }}>
            Grant permission
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Scan receipt</Text>

        <View style={styles.pointsBadge}>
          <Ionicons name="star" size={16} color="#facc15" />
          <Text style={styles.pointsText}>{points} pts</Text>
        </View>
      </View>

      {/* CAMERA */}
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} />
      </View>

      {/* BUTTON */}
      <Pressable style={styles.scanButton} onPress={handleScanTicket}>
        <Ionicons name="scan-outline" size={26} color="#fff" />
        <Text style={styles.scanText}>Scan ticket</Text>
      </Pressable>

      <Text style={styles.info}>
        Scan fuel receipts to earn points
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  header: {
    paddingTop: 70,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: { fontSize: 22, fontWeight: "700", color: "#fff" },

  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f2933",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pointsText: { color: "#fff", marginLeft: 6 },

  cameraContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 20,
    overflow: "hidden",
  },
  camera: { flex: 1 },

  scanButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2563eb",
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  scanText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },

  info: {
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 13,
    marginBottom: 24,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
