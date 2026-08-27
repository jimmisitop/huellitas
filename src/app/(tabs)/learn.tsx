import { useState } from "react";
import { ScrollView, View } from "react-native";
import "../../../global.css";
import AnimalTipsSection from "../../components/animalTipsSection";
import SearchBar from "../../components/searchBar";

export default function LearnScreen() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView className="flex-1 pt-4">
        {/* Search Bar */}
        <SearchBar
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSearch={() => { /* TODO: implementar búsqueda */ }}
        />

        {/* Animal Tips Section */}
        <AnimalTipsSection searchTerm={searchTerm} />
      </ScrollView>
    </View>
  );
}
