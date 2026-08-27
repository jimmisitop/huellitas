import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Link, router } from "expo-router";
import { useAuthStore } from "../../store/useAuthStore";
import "../../../global.css";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Ingresa email y contraseña");
      return;
    }

    try {
      await login(email.trim(), password);
      router.replace("/(tabs)" as any);
    } catch {
      // El error ya está en el store
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-8">
        {/* Logo / Título */}
        <View className="items-center mb-12">
          <Text className="text-4xl font-bold text-primary-500">
            🐾 Huellitas
          </Text>
          <Text className="text-gray-500 mt-2 text-base">
            Inicia sesión para continuar
          </Text>
        </View>

        {/* Error */}
        {error && (
          <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <Text className="text-red-600 text-sm text-center">{error}</Text>
          </View>
        )}

        {/* Formulario */}
        <View className="gap-4">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Email
            </Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-4 text-base text-gray-900"
              placeholder="tu@email.com"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) clearError();
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-4 text-base text-gray-900"
              placeholder="••••••••"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) clearError();
              }}
              secureTextEntry
            />
          </View>

          {/* Olvidé mi contraseña */}
          <Link href={"/(auth)/forgot-password" as any} asChild>
            <TouchableOpacity className="self-end">
              <Text className="text-primary-500 text-sm font-medium">
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>
          </Link>

          {/* Botón Login */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className="bg-primary-500 rounded-xl py-4 items-center mt-2"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-bold">Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          {/* Link a registro */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-500">¿No tienes cuenta? </Text>
            <Link href={"/(auth)/register" as any} asChild>
              <TouchableOpacity>
                <Text className="text-primary-500 font-bold">Regístrate</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
