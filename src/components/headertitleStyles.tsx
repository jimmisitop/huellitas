import { Text, View } from "react-native";

export default function HeaderTitleStyles({ children }: { children: string }) {
  return (
    <View>
      <Text className="text-lg font-bold text-primary-500 dark:text-primary-400">
        {children}
      </Text>
    </View>
  );
}
