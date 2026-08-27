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
import { Link } from "expo-router";
import { useAuthStore } from "../../store/useAuthStore";
import "../../../global.css";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const { resetPassword, isLoading, error, clearError } = useAuthStore();

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Ingresa tu email");
      return;
    }

    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch {
      // El error ya está en el store
    }
  };

  if (sent) {
    return (
      <View className="flex-1 bg-white justify-center px-8">
        <View className="items-center">
          <Text className="text-5xl mb-4">📧</Text>
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Email enviado
          </Text>
          <Text className="text-gray-500 text-center text-base mb-8">
            Revisa tu bandeja de entrada y sigue las instrucciones para
            restablecer tu contraseña.
          </Text>
          <Link href={"/(auth)/login" as any} asChild>
            <TouchableOpacity className="bg-primary-500 rounded-xl py-4 px-8">
              <Text className="text-white text-base font-bold">
                Volver al Login
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-8">
        {/* Título */}
        <View className="items-center mb-10">
          <Text className="text-5xl mb-4">🔐</Text>
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Recuperar contraseña
          </Text>
          <Text className="text-gray-500 text-center text-base">
            Ingresa tu email y te enviaremos un enlace para restablecer tu
            contraseña.
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

          {/* Botón Enviar */}
          <TouchableOpacity
            onPress={handleReset}
            disabled={isLoading}
            className="bg-primary-500 rounded-xl py-4 items-center mt-2"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-bold">
                Enviar enlace
              </Text>
            )}
          </TouchableOpacity>

          {/* Volver */}
          <View className="flex-row justify-center mt-6">
            <Link href={"/(auth)/login" as any} asChild>
              <TouchableOpacity>
                <Text className="text-primary-500 font-bold">
                  ← Volver al login
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
