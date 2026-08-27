import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2448C5",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          borderTopColor: "#E5E7EB",
        },
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerTitle: () => (
            <Text className="text-2xl font-bold text-primary-500">
              🐾 Huellitas
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="my-pets"
        options={{
          title: "Mis Mascotas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="paw" size={size} color={color} />
          ),
          headerTitle: () => (
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              Mis Mascotas
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "Aprender",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
          headerTitle: () => (
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              Aprender
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          headerTitle: () => (
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              Perfil
            </Text>
          ),
        }}
      />

      {/* Ocultar rutas de mascotas del tab bar — son sub-pantallas de Mis Mascotas */}
      <Tabs.Screen
        name="pet/create"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen
        name="pet/[id]"
        options={{ href: null, headerShown: false }}
      />
      <Tabs.Screen
        name="pet/edit/[id]"
        options={{ href: null, headerShown: false }}
      />
    </Tabs>
  );
}
