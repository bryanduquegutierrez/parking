import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import adsJson from "../../scripts/ads_data.json";


export const ADS_DATA: Ad[] = (adsJson as any[]).map((ad) => ({
  id: ad.id,
  price: parseFloat(ad.price), // <-- aquí convertimos a number
  location: ad.location,
  description: ad.description,
  latitude: ad.latitude,
  longitude: ad.longitude,
}));



import {
  Alert,
  FlatList,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Ad = {
  id: string;
  price: number;
  location: string;
  description: string;
  latitude: number;
  longitude: number;
};

type FilterType = "price" | "distance";

export default function GasStationScreen() {
  const [filter, setFilter] = useState<FilterType>("price");
  const [modalVisible, setModalVisible] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  /* OBTENER UBICACIÓN REAL */
  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location access is required");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    getLocation();
  }, []);

  const getDistanceKm = (ad: Ad) => {
    if (!userLocation) return Infinity;

    const toRad = (value: number) => (value * Math.PI) / 180;

    const R = 6371; // radio Tierra km
    const dLat = toRad(ad.latitude - userLocation.latitude);
    const dLon = toRad(ad.longitude - userLocation.longitude);

    const lat1 = toRad(userLocation.latitude);
    const lat2 = toRad(ad.latitude);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  /* 🔄 ORDENAR */
  const sortedAds = [...ADS_DATA].sort((a, b) =>
    filter === "price"
      ? a.price - b.price
      : getDistanceKm(a) - getDistanceKm(b)
  );

  /*ABRIR MAPAS */
  const openMaps = (lat: number, lng: number) => {
    const url =
      Platform.OS === "ios"
        ? `maps://?daddr=${lat},${lng}`
        : `google.navigation:q=${lat},${lng}`;

    Linking.openURL(url);
  };

  const renderItem = ({ item }: { item: Ad }) => {
    const distance = getDistanceKm(item);

    return (
      <View style={styles.card}>
        <Text style={styles.price}>{item.price.toFixed(2)} €/L</Text>

        <Pressable onPress={() => openMaps(item.latitude, item.longitude)}>
          <Text style={styles.location}>{item.location}</Text>
        </Pressable>

        <Text style={styles.description}>{item.description}</Text>

        {filter === "distance" && userLocation && (
          <Text style={styles.distance}>
            📍 {distance.toFixed(1)} km away
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          Gas Stations Prices
        </Text>

        <Pressable onPress={() => setModalVisible(true)}>
          <Ionicons name="filter" size={22} color="#2563eb" />
        </Pressable>
      </View>

      {/* LISTA */}
      <FlatList
        data={sortedAds}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />

      {/* MODAL FILTRO */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modal}>
            <Pressable
              style={styles.modalOption}
              onPress={() => {
                setFilter("price");
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalText}>💶 Order by price</Text>
            </Pressable>

            <Pressable
              style={styles.modalOption}
              onPress={() => {
                setFilter("distance");
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalText}>📍 Order by distance</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 80,
    paddingBottom: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.3,
  },

  list: {
    paddingTop: 4,
    paddingBottom: 24,
  },

  card: {
    height: 160,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    padding: 16,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  price: {
    fontSize: 28,
    fontWeight: "800",
    color: "#16a34a",
  },
  location: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2563eb",
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  distance: {
    marginTop: 6,
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: 260,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
  },
  modalOption: {
    paddingVertical: 12,
  },
  modalText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
