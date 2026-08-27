import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/useAuthStore";
import { getPetsByUser, deletePet } from "../../services/petService";
import { Pet } from "../../types";
import "../../../global.css";

export default function MyPetsScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPets = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getPetsByUser(user.uid);
      setPets(data);
    } catch (error) {
      console.error("Error loading pets:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  // Recargar cada vez que la pantalla gana foco
  useFocusEffect(
    useCallback(() => {
      loadPets();
    }, [loadPets]),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadPets();
  };

  const handleDelete = async (petId: string) => {
    try {
      await deletePet(petId);
      setPets((prev) => prev.filter((p) => p.id !== petId));
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  const renderPetCard = ({ item }: { item: Pet }) => (
    <TouchableOpacity
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-md mx-4 mb-4 overflow-hidden"
      onPress={() => router.push(`/(tabs)/pet/${item.id}` as any)}
    >
      {/* Foto */}
      <View className="h-48 bg-gray-200 dark:bg-gray-800">
        {item.photoURL ? (
          <Image
            source={{ uri: item.photoURL }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="paw-outline" size={60} color="#D1D5DB" />
          </View>
        )}
      </View>

      {/* Info */}
      <View className="p-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              {item.name}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {item.species} • {item.breed} • {item.age} {item.age === 1 ? "año" : "años"}
            </Text>
          </View>

          {/* Botón eliminar */}
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            className="p-2"
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>

        {/* Tags */}
        {item.tags.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mt-3">
            {item.tags.slice(0, 3).map((tag, index) => (
              <View
                key={index}
                className="bg-primary-100 dark:bg-primary-900 rounded-full px-3 py-1"
              >
                <Text className="text-xs font-medium text-primary-600 dark:text-primary-300">
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-white dark:bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#2448C5" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-950">
      {pets.length === 0 ? (
        /* Empty State */
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="paw-outline" size={80} color="#D1D5DB" />
          <Text className="text-xl font-bold text-gray-900 dark:text-white mt-4 mb-2">
            Sin mascotas aún
          </Text>
          <Text className="text-gray-500 dark:text-gray-400 text-center mb-6">
            Agrega tu primera mascota para empezar a llevar su control
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/pet/create" as any)}
            className="bg-primary-500 rounded-xl px-6 py-3 flex-row items-center gap-2"
          >
            <Ionicons name="add" size={20} color="white" />
            <Text className="text-white font-bold text-base">
              Agregar Mascota
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={pets}
            renderItem={renderPetCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          />

          {/* FAB — Agregar mascota */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/pet/create" as any)}
            className="absolute bottom-6 right-6 bg-primary-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
          >
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
