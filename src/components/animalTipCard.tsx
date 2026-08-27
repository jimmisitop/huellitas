import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import "../../global.css";

// 1. Define the explicit types for your props
interface AnimalTipCardProps {
  title: string;
  subtitle?: string; // Made optional since some search results might omit it
  source: string;
  onPress: () => void;
  isPopular?: boolean; // Optional boolean
}

// 2. Assign the interface to the component properties
export default function AnimalTipCard({
  title,
  subtitle,
  source,
  onPress,
  isPopular = false,
}: AnimalTipCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 mb-3 mx-4 flex-row items-center justify-between"
    >
      <View className="flex-1">
        <View className="flex-row items-center gap-2 mb-1">
          <Text className="text-base font-semibold text-gray-900 dark:text-white flex-1">
            {title}
          </Text>
          {/* Optional: Visual Anchor Badge for Popular Tags */}
          {isPopular && (
            <View className="bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full">
              <Text className="text-[10px] font-bold text-amber-700 dark:text-amber-300">
                POPULAR
              </Text>
            </View>
          )}
        </View>

        {subtitle && (
          <Text className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            {subtitle}
          </Text>
        )}
        <View className="flex-row items-center">
          <Ionicons name="checkmark-circle" size={14} color="#2448C5" />
          <Text className="text-xs text-gray-600 dark:text-gray-400 ml-1">
            {source}
          </Text>
        </View>
      </View>
      <Ionicons name="open-outline" size={20} color="#813A8E" />
    </TouchableOpacity>
  );
}
