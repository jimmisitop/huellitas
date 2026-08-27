import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import "../../global.css";
import {
    AnimalTipResult,
    getPopularSuggestions,
    searchAnimalTips,
} from "../services/animalSearchService";
import AnimalTipCard from "./animalTipCard";

WebBrowser.maybeCompleteAuthSession();

interface AnimalTipsSectionProps {
  searchTerm: string;
}

const DEBOUNCE_MS = 400;

export default function AnimalTipsSection({
  searchTerm,
}: AnimalTipsSectionProps) {
  const [popularSuggestions, setPopularSuggestions] = useState<
    AnimalTipResult[]
  >([]);
  const [loadingPopular, setLoadingPopular] = useState(true);

  const [results, setResults] = useState<AnimalTipResult[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // Ref para cancelar el debounce anterior y evitar stale closures
  const searchAbortRef = useRef<AbortController | null>(null);

  // Carga temas populares al montar y los refresca cada hora
  useEffect(() => {
    let isMounted = true;

    const loadPopular = async () => {
      setLoadingPopular(true);
      const data = await getPopularSuggestions();
      if (isMounted) {
        setPopularSuggestions(data);
        setLoadingPopular(false);
      }
    };

    loadPopular();
    const interval = setInterval(loadPopular, 3600000); // cada hora
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Limpiar resultados cuando el campo se vacía
  useEffect(() => {
    if (!searchTerm.trim()) {
      const timer = setTimeout(() => {
        setResults([]);
        setLoadingSearch(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  // Búsqueda en tiempo real con debounce mientras el usuario escribe
  useEffect(() => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    // Cancelar búsqueda anterior
    searchAbortRef.current?.abort();
    const controller = new AbortController();
    searchAbortRef.current = controller;

    const timeoutId = setTimeout(async () => {
      setLoadingSearch(true);
      try {
        const data = await searchAnimalTips(trimmed);
        if (!controller.signal.aborted) {
          setResults(data);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        if (!controller.signal.aborted) {
          setLoadingSearch(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  const handleOpenLink = async (url: string): Promise<void> => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      console.error("Error opening link:", error);
    }
  };

  const isSearching = searchTerm.trim().length > 0;

  return (
    <View className="flex-1">
      {isSearching ? (
        <>
          <Text className="text-lg font-bold text-gray-900 dark:text-white mx-4 mb-3">
            Resultados para \u201C{searchTerm}\u201D
          </Text>
          {loadingSearch ? (
            <View className="items-center justify-center py-10">
              <ActivityIndicator size="small" />
            </View>
          ) : results.length > 0 ? (
            <FlatList
              data={results}
              renderItem={({ item }) => (
                <AnimalTipCard
                  title={item.title}
                  subtitle={item.subtitle}
                  source={item.source}
                  onPress={() => handleOpenLink(item.url)}
                />
              )}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-600 dark:text-gray-400 text-center px-4">
                No se encontraron resultados
              </Text>
            </View>
          )}
        </>
      ) : (
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900 dark:text-white mx-4 mb-3">
            Temas Populares
          </Text>
          {loadingPopular ? (
            <View className="items-center justify-center py-10">
              <ActivityIndicator size="small" />
            </View>
          ) : popularSuggestions.length > 0 ? (
            <FlatList
              data={popularSuggestions}
              renderItem={({ item }) => (
                <AnimalTipCard
                  title={item.title}
                  subtitle={item.subtitle}
                  source={item.source}
                  isPopular={true}
                  onPress={() => handleOpenLink(item.url)}
                />
              )}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          ) : (
            <View className="items-center justify-center px-4 py-10">
              <Text className="text-gray-600 dark:text-gray-400 text-center text-base">
                Escribe una búsqueda para encontrar información verificada
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}