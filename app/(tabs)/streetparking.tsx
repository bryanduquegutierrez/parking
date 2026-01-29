import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";

export default function ParkingMap() {
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    const getLocation = async () => {
      // Pedimos permisos
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "No se puede acceder a tu ubicación");
        return;
      }

      // Obtenemos la ubicación actual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setRegion((prev) => ({
        ...prev,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }));
    };

    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        followsUserLocation={true}
        region={region} // La cámara sigue al usuario
      >
        <Marker
          coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
          title="Mi Destino"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
