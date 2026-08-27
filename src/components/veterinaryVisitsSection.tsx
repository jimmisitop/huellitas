import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import "../../global.css";

interface VetVisit {
  date: string;
  reason: string;
  veterinarian: string;
}

interface VeterinaryVisitsSectionProps {
  visits: VetVisit[];
}

export default function VeterinaryVisitsSection({ visits }: VeterinaryVisitsSectionProps) {
  return (
    <View className="mx-4 mb-4">
      <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
        Visitas Veterinarias
      </Text>
      <View className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4">
        {visits.map((visit, index) => (
          <View
            key={index}
            className={`pb-3 ${index !== visits.length - 1 ? "border-b border-gray-200 dark:border-gray-700 mb-3" : ""}`}
          >
            <View className="flex-row items-start mb-2">
              <Ionicons name="calendar" size={20} color="#0066cc" />
              <Text className="text-base font-semibold text-gray-900 dark:text-white ml-2">
                {visit.date}
              </Text>
            </View>
            <Text className="text-sm text-gray-700 dark:text-gray-300 ml-7 mb-1">
              {visit.reason}
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400 ml-7">
              Dr/Dra. {visit.veterinarian}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
