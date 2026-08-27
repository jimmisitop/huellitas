import { Image, Text, TouchableOpacity, View } from "react-native";
import "../../global.css";

interface StoryCardProps {
  author: string;
  hasViewed: boolean;
  image: string;
}

export default function StoryCard({ author, hasViewed, image }: StoryCardProps) {
  return (
    <TouchableOpacity className="items-center mr-3">
      <View
        className={`w-24 h-36 aspect-2/3 object-cover rounded-xl border-2 ${hasViewed ? "border-gray-300 dark:border-gray-700" : "border-primary-500"} p-0.5 overflow-hidden`}
      >
        <Image source={{ uri: image }} className="w-full h-full rounded-lg" />
      </View>
      <Text className="text-xs text-gray-700 dark:text-gray-300 mt-2 w-16 text-center truncate">
        {author.split(" ")[0]}
      </Text>
    </TouchableOpacity>
  );
}
