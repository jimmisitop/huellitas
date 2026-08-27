import { Image, View } from "react-native";
import "../../global.css";

interface PetProfileHeaderProps {
  photo: string;
}

export default function PetProfileHeader({ photo }: PetProfileHeaderProps) {
  return (
    <View className="rounded-xl px-4 pt-4">
      {/* Pet Photo */}
      <View className="w-full h-96 rounded-t-xl overflow-hidden">
        <Image source={{ uri: photo }} className="w-full h-full" />
      </View>
    </View>
  );
}
