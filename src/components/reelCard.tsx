import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import "../../global.css";

interface ReelCardProps {
  title: string;
  author: string;
  description: string;
  likes: string | number;
  image: string;
}

export default function ReelCard({ title, author, description, likes, image }: ReelCardProps) {
  return (
    <View className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-4 mb-4 mx-4">
      {/* Header */}
      <View className="flex-row items-center mb-3">
        <View className="w-10 h-10 rounded-3xl bg-primary-500 mr-2"></View>
        <View className="flex-1">
          <Text className="text-base font-bold text-gray-900 dark:text-white">
            {author}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            Hace 2h
          </Text>
        </View>
      </View>

      {/* Content Image */}
      <View className="w-full h-96 bg-gray-200 dark:bg-gray-800 rounded-xl mb-3 overflow-hidden">
        <Image source={{ uri: image }} className="w-full h-full" />
      </View>

      {/* Title and Description */}
      <Text className="text-lg font-bold text-gray-900 dark:text-white mb-1">
        {title}
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        {description}
      </Text>

      {/* Interaction Buttons */}
      <View className="flex-row justify-start gap-5">
        <TouchableOpacity className="flex-row items-center">
          <Ionicons name="heart-outline" size={20} color="#813A8E" />
          <Text className="text-sm text-gray-600 dark:text-gray-300 ml-2">
            {likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center">
          <Ionicons name="chatbubble-outline" size={20} color="#666" />
          <Text className="text-sm text-gray-600 dark:text-gray-300 ml-2">
            12
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center">
          <Ionicons name="share-social-outline" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
