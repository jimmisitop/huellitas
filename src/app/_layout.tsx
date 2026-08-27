import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Slot, useRouter, useSegments } from "expo-router";
import { useAuthStore } from "../store/useAuthStore";
import "../../global.css";

export default function RootLayout() {
  const { user, isInitialized, initialize } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const inAuthGroup = segments[0]?.includes("auth") ?? false;

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login" as any);
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)" as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isInitialized, segments]);

  if (!isInitialized) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#2448C5" />
      </View>
    );
  }

  return <Slot />;
}
