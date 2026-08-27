import { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "../../store/useAuthStore";
import { getUserByUid, updateUserProfile } from "../../services/userService";
import { uploadUserAvatar } from "../../services/storageService";
import { getPetsByUser } from "../../services/petService";
import { User } from "../../types";
import "../../../global.css";

export default function ProfileScreen() {
  const { user: authUser, logout } = useAuthStore();

  const [profile, setProfile] = useState<User | null>(null);
  const [petCount, setPetCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Edit mode
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!authUser) return;
    try {
      const [userData, pets] = await Promise.all([
        getUserByUid(authUser.uid),
        getPetsByUser(authUser.uid),
      ]);
      setProfile(userData);
      setPetCount(pets.length);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile]),
  );

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleStartEdit = () => {
    setEditName(profile?.displayName ?? authUser?.displayName ?? "");
    setPhotoUri(null);
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setPhotoUri(null);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert("Error", "El nombre no puede estar vacío");
      return;
    }
    if (!authUser) return;

    setSaving(true);
    try {
      let photoURL = profile?.photoURL ?? authUser.photoURL ?? undefined;

      // Subir nueva foto si se seleccionó
      if (photoUri) {
        try {
          photoURL = await uploadUserAvatar(authUser.uid, photoUri);
        } catch (uploadError: any) {
          console.warn("[Profile] Error subiendo foto:", uploadError?.message);
          // Si falla el upload, continuar solo con el nombre
          Alert.alert(
            "Foto no subida",
            "No se pudo subir la foto, pero el nombre se guardará.",
          );
          photoURL = profile?.photoURL ?? authUser.photoURL ?? undefined;
        }
      }

      // Actualizar en Firestore (solo incluir photoURL si tiene valor)
      const updatePayload: { displayName: string; photoURL?: string } = {
        displayName: editName.trim(),
      };
      if (photoURL) {
        updatePayload.photoURL = photoURL;
      }
      await updateUserProfile(authUser.uid, updatePayload);

      // Actualizar estado local
      setProfile((prev) =>
        prev
          ? { ...prev, displayName: editName.trim(), photoURL: photoURL ?? prev.photoURL }
          : prev,
      );
      setEditing(false);
      setPhotoUri(null);
      Alert.alert("¡Listo!", "Perfil actualizado");
    } catch (error: any) {
      console.error("[Profile] Error updating profile:", error?.message, error);
      Alert.alert("Error", `No se pudo actualizar el perfil: ${error?.message ?? "desconocido"}`);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro de que quieres cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.error("Error logging out:", error);
          }
        },
      },
    ]);
  };

  const displayName = profile?.displayName ?? authUser?.displayName ?? "Usuario";
  const email = profile?.email ?? authUser?.email ?? "";
  const photoURL = profile?.photoURL ?? authUser?.photoURL;

  if (loading) {
    return (
      <View className="flex-1 bg-white dark:bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#2448C5" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50 dark:bg-gray-950"
    >
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        {/* Avatar + Nombre */}
        <View className="items-center pt-8 pb-6">
          <TouchableOpacity onPress={editing ? handlePickImage : undefined}>
            <View className="relative">
              {photoUri ? (
                <Image
                  source={{ uri: photoUri }}
                  className="w-28 h-28 rounded-full"
                />
              ) : photoURL ? (
                <Image
                  source={{ uri: photoURL }}
                  className="w-28 h-28 rounded-full"
                />
              ) : (
                <View className="w-28 h-28 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center">
                  <Ionicons name="person" size={48} color="#2448C5" />
                </View>
              )}
              {editing && (
                <View className="absolute bottom-0 right-0 bg-primary-500 rounded-full p-2">
                  <Ionicons name="camera" size={16} color="white" />
                </View>
              )}
            </View>
          </TouchableOpacity>

          {editing ? (
            <TextInput
              className="bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-lg font-bold text-gray-900 dark:text-white text-center mt-4 w-64 border border-gray-200 dark:border-gray-700"
              value={editName}
              onChangeText={setEditName}
              placeholder="Tu nombre"
              placeholderTextColor="#9CA3AF"
            />
          ) : (
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
              {displayName}
            </Text>
          )}

          <Text className="text-gray-500 dark:text-gray-400 text-base mt-1">
            {email}
          </Text>
        </View>

        {/* Stats */}
        <View className="flex-row justify-center gap-8 mb-6">
          <View className="items-center">
            <Text className="text-2xl font-bold text-primary-500">{petCount}</Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {petCount === 1 ? "Mascota" : "Mascotas"}
            </Text>
          </View>
        </View>

        {/* Acciones */}
        <View className="mx-4 gap-3">
          {editing ? (
            <>
              <TouchableOpacity
                onPress={handleSaveProfile}
                disabled={saving}
                className="bg-primary-500 rounded-xl py-4 flex-row items-center justify-center gap-2"
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={20} color="white" />
                    <Text className="text-white font-bold text-base">
                      Guardar Cambios
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCancelEdit}
                className="bg-gray-200 dark:bg-gray-800 rounded-xl py-4 flex-row items-center justify-center gap-2"
              >
                <Ionicons name="close" size={20} color="#6B7280" />
                <Text className="text-gray-600 dark:text-gray-300 font-bold text-base">
                  Cancelar
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={handleStartEdit}
                className="bg-white dark:bg-gray-900 rounded-xl py-4 flex-row items-center gap-3 px-4 shadow-sm"
              >
                <Ionicons name="create-outline" size={22} color="#2448C5" />
                <Text className="text-gray-900 dark:text-white font-medium text-base flex-1">
                  Editar Perfil
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogout}
                className="bg-white dark:bg-gray-900 rounded-xl py-4 flex-row items-center gap-3 px-4 shadow-sm"
              >
                <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                <Text className="text-red-500 font-medium text-base flex-1">
                  Cerrar Sesión
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Info de la app */}
        <View className="mx-4 mt-8 mb-12">
          <Text className="text-center text-gray-400 dark:text-gray-600 text-sm">
            🐾 Huellitas v1.0.0
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
