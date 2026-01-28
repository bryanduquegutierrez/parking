import { JSX } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function home(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pantalla 1</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 30 }
});
