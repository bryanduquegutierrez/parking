import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  // 🔥 Estos valores luego pueden venir de backend o SecureStore
  const points = 140;
  const liters = 186.4;

  const NEXT_REWARD_POINTS = 200;
  const remainingPoints = Math.max(
    NEXT_REWARD_POINTS - points,
    0
  );

  return (
    <View style={styles.container}>
      {/* DASHBOARD */}
      <View style={styles.card}>
        <Text style={styles.title}>Your fuel stats</Text>

        {/* POINTS */}
        <View style={styles.row}>
          <Ionicons name="star" size={22} color="#facc15" />
          <Text style={styles.label}>Points</Text>
          <Text style={styles.value}>{points}</Text>
        </View>

        {/* LITERS */}
        <View style={styles.row}>
          <Ionicons name="speedometer" size={22} color="#22c55e" />
          <Text style={styles.label}>Fuel used</Text>
          <Text style={styles.value}>{liters.toFixed(1)} L</Text>
        </View>

        {/* REWARD */}
        <View style={styles.rewardBox}>
          <Ionicons name="gift" size={20} color="#2563eb" />
          <Text style={styles.rewardText}>
            {remainingPoints === 0
              ? "Reward available 🎉"
              : `Only ${remainingPoints} points left for your next reward`}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingTop: 80,
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 24,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  label: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
    color: "#374151",
    fontWeight: "500",
  },

  value: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  rewardBox: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff6ff",
    padding: 14,
    borderRadius: 14,
  },

  rewardText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "500",
    color: "#1e3a8a",
    flex: 1,
  },
});
