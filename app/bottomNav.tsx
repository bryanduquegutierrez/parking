import { useRouter } from 'expo-router';
import { JSX } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function BottomNav(): JSX.Element {
  const router = useRouter();

  return (
    <View style={styles.nav}>
      <Pressable onPress={() => router.push('/tabs/home')}>
        <Text style={styles.text}>Pantalla 1</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/tabs/settings')}>
        <Text style={styles.text}>Pantalla 2</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#222',
    paddingVertical: 15
  },
  text: { color: 'white', fontSize: 18 }
});
