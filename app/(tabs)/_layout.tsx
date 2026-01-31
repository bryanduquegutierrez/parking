import { Tabs } from 'expo-router';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MaterialCommunityIcons } from "@expo/vector-icons";




export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      
      <Tabs.Screen
        name="parking"
        options={{
          title: 'Parking',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={28} name="parking" color={color} />,
        }}
      />

      <Tabs.Screen
        name="gasStation"
        options={{
          title: 'Gas Station',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="gas-station" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="streetParking"
        options={{
          title: 'Street Parking',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="car" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="barcode-scan" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
