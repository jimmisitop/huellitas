import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import "../../global.css";

type PetProfileActionsProps = {
  onShowVaccines: () => void;
  onShowVisits: () => void;
  onEdit: () => void;
  name: string;
  species: string;
  breed: string;
  age: number;
  description: string;
  tags: string[];
};

export default function PetProfileActions({
  onShowVaccines,
  onShowVisits,
  onEdit,
  name,
  species,
  breed,
  age,
  description,
  tags,
}: PetProfileActionsProps) {
  return (
    <View className="mx-4 gap-3 mb-4 bg-white dark:bg-black -mt-6 rounded-t-3xl shadow-lg p-4">
      {/* Pet Info */}
      <View className="mb-3">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          {name}
        </Text>
        <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {breed} • {age} años
        </Text>
      </View>

      {/* Description */}
      <Text className="text-sm text-gray-700 dark:text-gray-300">
        {description}
      </Text>

      {/* Tags */}
      <View>
        <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Características
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {tags.map((tag, index) => (
              <View
                key={index}
                className="bg-primary-100 dark:bg-primary-900 rounded-full px-4 py-2"
              >
                <Text className="text-sm font-semibold text-primary-600 dark:text-primary-200">
                  {tag}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <TouchableOpacity
        onPress={onShowVaccines}
        className="flex-row items-center justify-between bg-blue-100 dark:bg-blue-900 rounded-xl p-4"
      >
        <View className="flex-row items-center">
          <Ionicons name="medical" size={24} color="#2448C5" />
          <Text className="text-base font-semibold text-blue-600 dark:text-blue-200 ml-3">
            Vacunas
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#2448C5" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onShowVisits}
        className="flex-row items-center justify-between bg-green-100 dark:bg-green-900 rounded-xl p-4"
      >
        <View className="flex-row items-center">
          <Ionicons name="calendar" size={24} color="#D6F014" />
          <Text className="text-base font-semibold text-green-600 dark:text-green-200 ml-3">
            Visitas Veterinarias
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#D6F014" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onEdit}
        className="flex-row items-center justify-between bg-purple-100 dark:bg-purple-900 rounded-xl p-4"
      >
        <View className="flex-row items-center">
          <Ionicons name="create" size={24} color="#813A8E" />
          <Text className="text-base font-semibold text-purple-600 dark:text-purple-200 ml-3">
            Editar Perfil
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#813A8E" />
      </TouchableOpacity>
    </View>
  );
}
