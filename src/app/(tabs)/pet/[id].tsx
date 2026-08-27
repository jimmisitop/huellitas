import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getPetById, deletePet } from "../../../services/petService";
import { Pet } from "../../../types";
import "../../../../global.css";

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPet = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getPetById(id);
      setPet(data);
    } catch (error) {
      console.error("Error loading pet:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // setTimeout evita la detección de setState síncrono en React Compiler
    const timer = setTimeout(() => loadPet(), 0);
    return () => clearTimeout(timer);
  }, [loadPet]);

  const handleDelete = () => {
    Alert.alert(
      "Eliminar mascota",
      `¿Estás seguro de que quieres eliminar a ${pet?.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePet(id!);
              router.back();
            } catch (error) {
              console.error("Error deleting pet:", error);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white dark:bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#2448C5" />
      </View>
    );
  }

  if (!pet) {
    return (
      <View className="flex-1 bg-white dark:bg-black items-center justify-center px-8">
        <Ionicons name="alert-circle-outline" size={60} color="#D1D5DB" />
        <Text className="text-lg text-gray-500 mt-4">Mascota no encontrada</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView className="flex-1">
        {/* Foto principal */}
        <View className="h-80 bg-gray-200 dark:bg-gray-800">
          {pet.photoURL ? (
            <Image
              source={{ uri: pet.photoURL }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="paw-outline" size={80} color="#D1D5DB" />
            </View>
          )}
        </View>

        {/* Info */}
        <View className="px-6 py-4">
          {/* Nombre y especie */}
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-3xl font-bold text-gray-900 dark:text-white">
              {pet.name}
            </Text>
            <View className="bg-primary-100 dark:bg-primary-900 rounded-full px-3 py-1">
              <Text className="text-sm font-medium text-primary-600 dark:text-primary-300">
                {pet.species}
              </Text>
            </View>
          </View>

          {/* Raza y edad */}
          <Text className="text-gray-500 dark:text-gray-400 text-base mb-4">
            {pet.breed} • {pet.age} {pet.age === 1 ? "año" : "años"}
          </Text>

          {/* Descripción */}
          <Text className="text-gray-700 dark:text-gray-300 text-base leading-6 mb-6">
            {pet.description}
          </Text>

          {/* Tags */}
          {pet.tags.length > 0 && (
            <View className="mb-6">
              <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Características
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {pet.tags.map((tag, index) => (
                  <View
                    key={index}
                    className="bg-primary-100 dark:bg-primary-900 rounded-full px-4 py-2"
                  >
                    <Text className="text-sm font-medium text-primary-600 dark:text-primary-300">
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Botones de acción */}
          <View className="gap-3 mt-4">
            <TouchableOpacity
              onPress={() => router.push(`/(tabs)/pet/edit/${pet.id}` as any)}
              className="bg-primary-500 rounded-xl py-4 flex-row items-center justify-center gap-2"
            >
              <Ionicons name="create-outline" size={20} color="white" />
              <Text className="text-white font-bold text-base">Editar Mascota</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              className="bg-red-50 border border-red-200 rounded-xl py-4 flex-row items-center justify-center gap-2"
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text className="text-red-500 font-bold text-base">Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
