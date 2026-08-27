import { Text, View } from "react-native";
import "../../global.css";

interface Vaccine {
  name: string;
  date: string;
  nextDue: string;
}

interface VaccinesSectionProps {
  vaccines: Vaccine[];
}

export default function VaccinesSection({ vaccines }: VaccinesSectionProps) {
  return (
    <View className="mx-4 mb-4">
      <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">
        Vacunas
      </Text>
      <View className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-4">
        {vaccines.map((vaccine, index) => (
          <View
            key={index}
            className={`pb-3 ${index !== vaccines.length - 1 ? "border-b border-gray-200 dark:border-gray-700 mb-3" : ""}`}
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-base font-semibold text-gray-900 dark:text-white">
                {vaccine.name}
              </Text>
              <View className="bg-green-100 dark:bg-green-900 rounded-full px-3 py-1">
                <Text className="text-xs font-semibold text-green-600 dark:text-green-200">
                  Aplicada
                </Text>
              </View>
            </View>
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Aplicada: {vaccine.date}
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              Próxima: {vaccine.nextDue}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
