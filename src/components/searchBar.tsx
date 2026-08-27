import { Ionicons } from "@expo/vector-icons";
import { TextInput, TouchableOpacity, View } from "react-native";
import "../../global.css";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
}

export default function SearchBar({ value, onChangeText, onSearch }: SearchBarProps) {
  return (
    <View className="mx-4 mb-4">
      <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3">
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          className="flex-1 ml-3 text-gray-900 dark:text-white text-base"
          placeholder="Buscar información sobre mascotas..."
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSearch}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText("")}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
