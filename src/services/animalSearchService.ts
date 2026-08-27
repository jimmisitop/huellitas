import AsyncStorage from "@react-native-async-storage/async-storage";

const API_KEY = process.env.EXPO_PUBLIC_SERPAPI_KEY;

const SERPAPI_ENDPOINT = "https://serpapi.com/search.json";
const MONTHLY_QUOTA_LIMIT = 90;
const QUOTA_STORAGE_KEY = "animalSearch:monthlyQuota";

export interface AnimalTipResult {
  id: string;
  title: string;
  subtitle: string;
  source: string;
  domain: string;
  url: string;
  isPopular?: boolean;
}

const SITES = [
  "aspca.org",
  "petmd.com",
  "humanesociety.org",
  "vcahospitals.com",
  "webmd.com",
  "royalcanin.com",
  "thesprucepets.com",
];

const DOMAIN_NAME_MAP: Record<string, string> = {
  "aspca.org": "ASPCA",
  "www.aspca.org": "ASPCA",
  "petmd.com": "PetMD",
  "www.petmd.com": "PetMD",
  "humanesociety.org": "Humane Society",
  "www.humanesociety.org": "Humane Society",
  "vcahospitals.com": "VCA Hospitals",
  "www.vcahospitals.com": "VCA Hospitals",
  "webmd.com": "WebMD Pets",
  "pets.webmd.com": "WebMD Pets",
  "royalcanin.com": "Royal Canin",
  "www.royalcanin.com": "Royal Canin",
  "thesprucepets.com": "The Spruce Pets",
  "www.thesprucepets.com": "The Spruce Pets",
};

function getSourceName(displayedLink: string): string {
  const domain = displayedLink.split("›")[0].trim();
  return DOMAIN_NAME_MAP[domain] ?? domain;
}

function getDomainFromUrl(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

const POPULAR_TOPIC_SETS = [
  "cuidados del perro entrenamiento nutricion vacunas",
  "gatos domesticos comportamiento higiene dental",
  "razas de perros alergias estres ansiedad mascotas",
  "cuidados veterinarios suplementos emergencias mascotas",
  "problemas digestivos mascotas exoticas adopcion responsable",
];

function getMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}`;
}

interface QuotaState {
  period: string;
  count: number;
}

async function readQuotaState(): Promise<QuotaState> {
  try {
    const raw = await AsyncStorage.getItem(QUOTA_STORAGE_KEY);
    if (!raw) return { period: getMonthKey(), count: 0 };
    const parsed: QuotaState = JSON.parse(raw);
    if (parsed.period !== getMonthKey()) {
      return { period: getMonthKey(), count: 0 };
    }
    return parsed;
  } catch (error) {
    console.warn("No se pudo leer el contador de cuota, asumiendo 0:", error);
    return { period: getMonthKey(), count: 0 };
  }
}

async function writeQuotaState(state: QuotaState): Promise<void> {
  try {
    await AsyncStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("No se pudo guardar el contador de cuota:", error);
  }
}

export async function getRemainingQuota(): Promise<number> {
  const state = await readQuotaState();
  return Math.max(0, MONTHLY_QUOTA_LIMIT - state.count);
}

interface CacheEntry {
  timestamp: number;
  data: AnimalTipResult[];
}

const popularCache = new Map<number, CacheEntry>(); // key = índice del set del día
const searchCache = new Map<string, CacheEntry>(); // key = término buscado

const SEARCH_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas
const POPULAR_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas

function isCacheValid(
  entry: CacheEntry | undefined,
  ttl: number,
): entry is CacheEntry {
  return !!entry && Date.now() - entry.timestamp < ttl;
}

async function serpApiSearch(
  query: string,
  num: number = 5,
): Promise<AnimalTipResult[]> {
  if (!API_KEY) {
    console.warn("Falta EXPO_PUBLIC_SERPAPI_KEY en el .env");
    return [];
  }

  const quotaState = await readQuotaState();
  if (quotaState.count >= MONTHLY_QUOTA_LIMIT) {
    console.warn(
      `Límite mensual de ${MONTHLY_QUOTA_LIMIT} búsquedas alcanzado. Se omite la llamada a la API.`,
    );
    return [];
  }

  const params = new URLSearchParams({
    engine: "google",
    q: query,
    api_key: API_KEY,
    num: String(num),
    hl: "es",
    safe: "active",
  });

  try {
    const response = await fetch(`${SERPAPI_ENDPOINT}?${params.toString()}`);

    if (!response.ok) {
      const errText = await response.text();
      console.error("SerpApi error:", response.status, errText);
      return [];
    }

    await writeQuotaState({ period: quotaState.period, count: quotaState.count + 1 });

    const data = await response.json();

    if (!data.organic_results) {
      return [];
    }

    return data.organic_results.map((item: any, index: number) => ({
      id: `${query}_${index}_${item.link}`,
      title: item.title,
      subtitle: item.snippet ?? "",
      source: getSourceName(item.displayed_link ?? getDomainFromUrl(item.link)),
      domain: getDomainFromUrl(item.link),
      url: item.link,
    }));
  } catch (error) {
    console.error("Error llamando a SerpApi:", error);
    return [];
  }
}

/** Búsqueda en tiempo real. Filtra por sitios verificados. */
export async function searchAnimalTips(
  searchTerm: string,
): Promise<AnimalTipResult[]> {
  const trimmed = searchTerm.trim();
  if (!trimmed) return [];

  const cacheKey = trimmed.toLowerCase();
  const cached = searchCache.get(cacheKey);
  if (isCacheValid(cached, SEARCH_CACHE_TTL_MS)) {
    return cached.data;
  }

  const siteFilter = SITES.map((s) => `site:${s}`).join(" OR ");
  const query = `(${siteFilter}) ${trimmed}`;

  const results = await serpApiSearch(query, 7);

  searchCache.set(cacheKey, { timestamp: Date.now(), data: results });
  return results;
}

/** Temas populares que rotan diariamente. */
export async function getPopularSuggestions(): Promise<AnimalTipResult[]> {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86400000,
  );
  const setIndex = dayOfYear % POPULAR_TOPIC_SETS.length;

  const cached = popularCache.get(setIndex);
  if (isCacheValid(cached, POPULAR_CACHE_TTL_MS)) {
    return cached.data;
  }

  const topic = POPULAR_TOPIC_SETS[setIndex];
  const siteFilter = SITES.map((s) => `site:${s}`).join(" OR ");
  const query = `(${siteFilter}) ${topic}`;

  const results = await serpApiSearch(query, 7);
  const data = results.map((item) => ({
    ...item,
    isPopular: true,
    subtitle: "Tema popular",
  }));

  popularCache.set(setIndex, { timestamp: Date.now(), data });
  return data;
}
