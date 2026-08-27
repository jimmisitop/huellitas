import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "../../../../store/useAuthStore";
import { getPetById, updatePet } from "../../../../services/petService";
import { uploadPetAvatar } from "../../../../services/storageService";
import { PetFormData } from "../../../../types";
import "../../../../../global.css";

const SPECIES_OPTIONS = ["Perro", "Gato", "Ave", "Conejo", "Otro"] as const;

export default function EditPetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();
  const router = useRouter();

  const [name, setName] = useState("");
  const [species, setSpecies] = useState<PetFormData["species"]>("Perro");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [existingPhotoURL, setExistingPhotoURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadPet = useCallback(async () => {
    if (!id) return;
    try {
      const pet = await getPetById(id);
      if (pet) {
        setName(pet.name);
        setSpecies(pet.species);
        setBreed(pet.breed);
        setAge(String(pet.age));
        setDescription(pet.description);
        setTags(pet.tags.join(", "));
        setExistingPhotoURL(pet.photoURL ?? null);
      }
    } catch (error) {
      console.error("Error loading pet:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => loadPet(), 0);
    return () => clearTimeout(timer);
  }, [loadPet]);

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

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Ingresa el nombre de tu mascota");
      return;
    }
    if (!breed.trim()) {
      Alert.alert("Error", "Ingresa la raza");
      return;
    }
    if (!age.trim() || isNaN(Number(age))) {
      Alert.alert("Error", "Ingresa una edad válida");
      return;
    }
    if (!user || !id) return;

    setSaving(true);
    try {
      // Subir nueva foto si se seleccionó
      let photoURL = existingPhotoURL;
      if (photoUri) {
        photoURL = await uploadPetAvatar(user.uid, id, photoUri);
      }

      // Actualizar mascota
      await updatePet(id, {
        name: name.trim(),
        species,
        breed: breed.trim(),
        age: Number(age),
        description: description.trim(),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        photoURL: photoURL ?? undefined,
      });

      Alert.alert("¡Listo!", "Mascota actualizada", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error updating pet:", error);
      Alert.alert("Error", "No se pudo actualizar la mascota");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#2448C5" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        <View className="px-6 py-6 gap-4">
          {/* Foto */}
          <TouchableOpacity
            onPress={handlePickImage}
            className="w-full h-48 bg-gray-100 rounded-2xl items-center justify-center overflow-hidden"
          >
            {photoUri ? (
              <Image
                source={{ uri: photoUri }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : existingPhotoURL ? (
              <Image
                source={{ uri: existingPhotoURL }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="items-center">
                <Ionicons name="camera-outline" size={48} color="#9CA3AF" />
                <Text className="text-gray-400 mt-2">Cambiar foto</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Nombre */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">Nombre *</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-4 text-base text-gray-900"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Especie */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2">Especie *</Text>
            <View className="flex-row flex-wrap gap-2">
              {SPECIES_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setSpecies(option)}
                  className={`px-4 py-2 rounded-full border ${
                    species === option
                      ? "bg-primary-500 border-primary-500"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <Text className={`font-medium ${species === option ? "text-white" : "text-gray-700"}`}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Raza */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">Raza *</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-4 text-base text-gray-900"
              value={breed}
              onChangeText={setBreed}
            />
          </View>

          {/* Edad */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">Edad (años) *</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-4 text-base text-gray-900"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </View>

          {/* Descripción */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">Descripción</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-4 text-base text-gray-900"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Tags */}
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">Características</Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-4 text-base text-gray-900"
              value={tags}
              onChangeText={setTags}
              placeholder="Juguetón, Amigable (separados por coma)"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Botón guardar */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            className="bg-primary-500 rounded-xl py-4 items-center mt-4"
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-bold">Guardar Cambios</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
