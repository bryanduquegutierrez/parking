import * as Location from "expo-location";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../services/supabase";

/* ───────────────── TYPES ───────────────── */

type FuelType = "gasolina95E5" |"gasolina95E10" | "95E5Premium" | "98E5" | "98E10" | "GasoleoA" | "GasoleoB" | "GasoleoPremium" | "Adblue";
type SortType = "distancia" | "precio";

type GasStation = {
  id: number;
  location: string;
  localidad: string;
  latitude: number;
  longitude: number;
  servicio: string;
  gasolina95E5?: number;
  gasolina98E5?: number;
  gasoleoA?: number;
  gasoleoB?: number;
};

export default function GasStationsScreen() {
  const [stations, setStations] = useState<GasStation[]>([]);
  const [provincias, setProvincias] = useState<string[]>([]);
  const [localidades, setLocalidades] = useState<string[]>([]);
  const [selectedProvincia, setSelectedProvincia] = useState<string | null>(null);
  const [selectedLocalidad, setSelectedLocalidad] = useState<string | null>(null);
  const [fuelType, setFuelType] = useState<FuelType>("gasolina95E5");
  const [sortType, setSortType] = useState<SortType>("distancia");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"provincia" | "localidad">("provincia");
  const [search, setSearch] = useState("");
  const [userLocation, setUserLocation] = useState<Location.LocationObjectCoords | null>(null);

  /* ───────────── HELPERS (Definidos antes de usarlos) ───────────── */
  const distanceKm = (s: GasStation) => {
    if (!userLocation || !s.latitude || !s.longitude) return 0;
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(s.latitude - userLocation.latitude);
    const dLon = toRad(s.longitude - userLocation.longitude);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(userLocation.latitude)) * Math.cos(toRad(s.latitude)) * Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  /* ───────────── LÓGICA DE ORDENACIÓN ───────────── */
  const sortedStations = useMemo(() => {
    const list = [...stations];
    if (sortType === "distancia" && userLocation) {
      return list.sort((a, b) => distanceKm(a) - distanceKm(b));
    } else if (sortType === "precio") {
      return list.sort((a, b) => {
        const valA = a[fuelType] ?? 999;
        const valB = b[fuelType] ?? 999;
        return valA - valB;
      });
    }
    return list;
  }, [stations, sortType, fuelType, userLocation]);

  /* ───────────── EFECTOS Y FETCH ───────────── */
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation(loc.coords);
    })();
  }, []);

  useEffect(() => { fetchProvincias(); }, []);

  const fetchProvincias = async () => {
    const { data, error } = await supabase.from("v_provincias_unicas").select("*");
    if (!error && data) setProvincias(data.map((d) => d.Provincia).filter(Boolean).sort());
  };

  useEffect(() => {
    if (selectedProvincia) fetchLocalidades(selectedProvincia);
  }, [selectedProvincia]);

  const fetchLocalidades = async (prov: string) => {
    const { data, error } = await supabase.from("gas_stations").select("Localidad").eq("Provincia", prov);
    if (!error && data) {
      const unique = Array.from(new Set(data.map((d: any) => d.Localidad))).filter(Boolean).sort() as string[];
      setLocalidades(unique);
    }
  };

  const formatAndSetStations = (data: any[]) => {
    const formatted: GasStation[] = data.map((p: any) => ({
      id: p.Id,
      location: p.Direccion,
      localidad: p.Localidad,
      servicio: p.Servicio,
      latitude: parseFloat(p.Latitud?.toString().replace(",", ".") || "0"),
      longitude: parseFloat(p.Longitud?.toString().replace(",", ".") || "0"),
      gasolina95E5: p.gasolina95E5 ? parseFloat(p.gasolina95E5.toString().replace(",", ".")) : undefined,
      gasolina98E5: p.gasolina98E5 ? parseFloat(p.gasolina98E5.toString().replace(",", ".")) : undefined,
      gasoleoA: p.gasoleoA ? parseFloat(p.gasoleoA.toString().replace(",", ".")) : undefined,
    }));
    setStations(formatted);
  };

  const fetchStations = async () => {
    if (!selectedLocalidad || selectedLocalidad === "Cercanas a mí") return;
    setLoading(true);
    const { data, error } = await supabase.from("gas_stations").select("*").eq("Localidad", selectedLocalidad);
    setLoading(false);
    if (!error && data) formatAndSetStations(data);
  };

  const fetchNearbyStations = async () => {
    if (!userLocation) return;
    setLoading(true);
    setSelectedLocalidad("Cercanas a mí");
    const { data, error } = await supabase.rpc("get_nearby_gas_stations", {
      user_lat: userLocation.latitude,
      user_lon: userLocation.longitude,
      max_dist_km: 15,
    });
    setLoading(false);
    if (!error && data) formatAndSetStations(data);
  };

  useEffect(() => { fetchStations(); }, [selectedLocalidad]);
const openInMaps = async (lat: number, lon: number, label: string) => {
  const latLng = `${lat},${lon}`;
  const cleanedLabel = encodeURIComponent(label);

  // Esta URL es "mágica": iOS la intercepta y abre la App de Google Maps si existe
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latLng}`;
  
  // Respaldo para Apple Maps si quieres que sea la segunda opción
  const appleMapsUrl = `maps:0,0?q=${cleanedLabel}@${latLng}`;

  if (Platform.OS === 'ios') {
    try {
      // Intentamos abrir la URL de Google primero
      const supported = await Linking.canOpenURL(googleMapsUrl);
      
      if (supported) {
        await Linking.openURL(googleMapsUrl);
      } else {
        await Linking.openURL(appleMapsUrl);
      }
    } catch (error) {
      // Si falla cualquier cosa, Apple Maps siempre está ahí
      Linking.openURL(appleMapsUrl);
    }
  } else {
    // Android sigue igual, ya que funciona bien
    Linking.openURL(`geo:0,0?q=${latLng}(${cleanedLabel})`);
  }
};
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSubtitle}>{selectedProvincia ?? "Provincia"}</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>{selectedLocalidad ?? "Localidad"}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.sortBtn} 
          onPress={() => setSortType(sortType === "distancia" ? "precio" : "distancia")}
        >
          <Text style={styles.sortBtnText}>
            {sortType === "distancia" ? " Distancia" : " Precio"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.fuelSelector}>
        {(["gasolina95E5", "gasolina98E5", "gasoleoA"] as FuelType[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.fuelBadge, fuelType === f && styles.activeFuelBadge]}
            onPress={() => setFuelType(f)}
          >
            <Text style={[styles.fuelText, fuelType === f && { color: "#fff" }]}>
              {f === "gasolina95E5" ? "G95" : f === "gasolina98E5" ? "G98" : "Diésel"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={sortedStations}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          renderItem={({ item }) => (
             <TouchableOpacity onPress={() => openInMaps(item.latitude, item.longitude, item.location)}>
            <View style={styles.card}>
             
                <Text style={styles.cardTitle}>{item.location}</Text>
              
              <View style={styles.distRow}>
                {userLocation && <Text style={styles.distText}>📍{distanceKm(item).toFixed(2)} km</Text>}
              </View>

              <View style={styles.distText}>
                {userLocation && <Text style={styles.cardTitle}>Tipo de servicio: {item.servicio}</Text>}
              </View>

              <View style={styles.priceGridContainer}>
                <View style={styles.priceColumn}>
                  <Text style={styles.priceLabelMin}>G95</Text>
                  <Text style={[styles.priceValueSmall, fuelType === "gasolina95E5" && styles.priceActive]}>
                    {item.gasolina95E5 ? `${item.gasolina95E5}€` : "-"}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.priceColumn}>
                  <Text style={styles.priceLabelMin}>G98</Text>
                  <Text style={[styles.priceValueSmall, fuelType === "gasolina98E5" && styles.priceActive]}>
                    {item.gasolina98E5 ? `${item.gasolina98E5}€` : "-"}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.priceColumn}>
                  <Text style={styles.priceLabelMin}>Diésel</Text>
                  <Text style={[styles.priceValueSmall, fuelType === "gasoleoA" && styles.priceActive]}>
                    {item.gasoleoA ? `${item.gasoleoA}€` : "-"}
                  </Text>
                </View>
              </View>
            </View>
            </TouchableOpacity>

          )}
        />
      )}

      {/* BOTONES FLOTANTES */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.mainBtn} onPress={() => { setModalType("provincia"); setModalVisible(true); }}>
          <Text style={styles.mainBtnText}>Filtrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mainBtn, { backgroundColor: "#16a34a" }]} onPress={fetchNearbyStations}>
          <Text style={styles.mainBtnText}> Más cercanas a mi</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar {modalType}</Text>
            <FlatList
              data={(modalType === "provincia" ? provincias : localidades).filter((i) =>
                i?.toLowerCase().includes(search.toLowerCase())
              )}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalItem} onPress={() => {
                  if (modalType === "provincia") {
                    setSelectedProvincia(item);
                    setModalType("localidad");
                    setSearch("");
                  } else {
                    setSelectedLocalidad(item);
                    setModalVisible(false);
                    setSearch("");
                  }
                }}>
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <View style={styles.searchContainer}>
              <TextInput placeholder={`Buscar ${modalType}...`} value={search} onChangeText={setSearch} style={styles.input} />
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <Text style={{ color: "white", fontWeight: "bold" }}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f3f4f6", paddingTop: Platform.OS === "android" ? 30 : 0 },
  header: { flexDirection: "row", alignItems: "center", padding: 20, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#eee" },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#1f2937" },
  headerSubtitle: { fontSize: 11, color: "#6b7280", textTransform: "uppercase" },
  sortBtn: { backgroundColor: "#f3f4f6", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: "#e5e7eb" },
  sortBtnText: { fontSize: 13, fontWeight: "700", color: "#2563eb" },
  fuelSelector: { flexDirection: "row", justifyContent: "space-around", padding: 12, backgroundColor: "#fff" },
  fuelBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "#e5e7eb" },
  activeFuelBadge: { backgroundColor: "#2563eb" },
  fuelText: { fontSize: 12, fontWeight: "700", color: "#4b5563" },

  card: {
  backgroundColor: "#fff",
  borderRadius: 20,           // Bordes más suaves
  padding: 10,                // Más espacio interno (antes 16)
  marginBottom: 8,           // Más separación entre tarjetas
  marginHorizontal: 8,
  elevation: 4,               // Sombra más profunda en Android
  shadowColor: "#000",        // Sombra más elegante en iOS
  shadowOpacity: 0.12,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 3 },
},
cardTitle: { 
  fontSize: 15,               // Título más grande (antes 15)
  fontWeight: "600",          // Más negrita
  color: "#111827",
  marginBottom: 4,
},
cardSub: { 
  fontSize: 14,               // Localidad más legible
  color: "#6b7280", 
  marginBottom: 12,           // Más espacio antes de la distancia
},
distText: { 
  fontSize: 15,               // Distancia más destacada
  fontWeight: "700", 
  color: "#2563eb",
  marginBottom: 10,
},
priceGridContainer: { 
  flexDirection: "row", 
  justifyContent: "space-between", 
  alignItems: "center", 
  backgroundColor: "#f8fafc", 
  padding: 15,                // Contenedor de precios más alto
  borderRadius: 15, 
  borderWidth: 1, 
  borderColor: "#e2e8f0",
  marginTop: 5,
},
priceLabelMin: { 
  fontSize: 11,               // Etiquetas (G95, G98) más claras
  fontWeight: "700", 
  color: "#64748b", 
  marginBottom: 4 
},
priceValueSmall: { 
  fontSize: 16,               // Números de precio más grandes
  fontWeight: "600", 
  color: "#334155" 
},
priceActive: { 
  color: "#16a34a", 
  fontSize: 20,               // El precio seleccionado resalta mucho más
  fontWeight: "900" 
},
  distRow: { marginBottom: 10 },
  priceColumn: { flex: 1, alignItems: "center" },
  divider: { width: 1, height: "60%", backgroundColor: "#cbd5e1" },
  bottomActions: { position: "absolute", bottom: 30, left: 20, right: 20, flexDirection: "row" },
  mainBtn: { flex: 1, backgroundColor: "#2563eb", paddingVertical: 12, borderRadius: 16, marginHorizontal: 5, alignItems: "center", elevation: 5 },
  mainBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#fff", borderTopLeftRadius: 25, borderTopRightRadius: 25, height: "85%", padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
  modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  modalItemText: { fontSize: 16 },
  searchContainer: { paddingTop: 10, paddingBottom: 20 },
  input: { backgroundColor: "#f3f4f6", borderRadius: 12, padding: 15, fontSize: 16, marginBottom: 10 },
  closeBtn: { backgroundColor: "#ef4444", padding: 12, borderRadius: 12, alignItems: "center" },
});