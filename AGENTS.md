# 🤖 Guía para Agentes de IA

Esta guía contiene información para agentes de IA que trabajen en el proyecto Huellitas.

---

## 📋 Resumen del Proyecto

**Huellitas** es una app móvil de red social para mascotas construida con:
- **Expo SDK 57** + **React Native 0.86**
- **TypeScript 6.0** con strict mode
- **NativeWind 4.2.6** (TailwindCSS para React Native)
- **Firebase** (Auth + Firestore)
- **Cloudinary** (almacenamiento de imágenes)
- **Zustand** (gestión de estado)

---

## 🚨 Reglas Importantes

### 1. Documentación Oficial

**SIEMPRE** consultar la documentación exacta de Expo antes de escribir código:

```
https://docs.expo.dev/versions/v57.0.0/
```

### 2. Variables de Entorno

Las variables de entorno se acceden con `EXPO_PUBLIC_`:

```typescript
const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
```

### 3. Navegación

Usar **Expo Router** (basado en archivos), NO React Navigation:

```typescript
import { useRouter } from "expo-router";
const router = useRouter();
```

### 4. Estilos

Usar **NativeWind** (TailwindCSS), NO StyleSheet:

```tsx
<View className="flex-1 bg-white p-4">
  <Text className="text-lg font-bold">Título</Text>
</View>
```

### 5. Estado Global

Usar **Zustand**, NO Redux ni Context:

```typescript
import { useAuthStore } from "@/store/useAuthStore";
const { user, isAuthenticated } = useAuthStore();
```

---

## 📁 Estructura de Archivos

```
src/
├── app/                    # Rutas (Expo Router)
│   ├── _layout.tsx        # Layout raíz
│   ├── (auth)/            # Rutas de autenticación
│   └── (tabs)/            # Rutas principales (tabs)
├── components/            # Componentes reutilizables
├── services/              # Lógica de negocio
├── store/                 # Estado global (Zustand)
├── types/                 # Definiciones TypeScript
└── constants/             # Datos constantes
```

---

## 🔧 Comandos Disponibles

```bash
# Desarrollo
pnpm start              # Iniciar servidor
pnpm android            # Ejecutar en Android
pnpm ios                # Ejecutar en iOS
pnpm web                # Ejecutar en web

# Verificación
pnpm lint               # Linting
npx tsc --noEmit        # Typecheck

# Build
npx eas build --platform android --profile preview
```

---

## 📚 Documentación del Proyecto

| Archivo | Contenido |
|---------|-----------|
| `README.md` | Descripción general, setup, funcionalidades |
| `docs/ARCHITECTURE.md` | Arquitectura técnica, diagramas, flujos |
| `docs/SERVICES.md` | API de cada service |
| `docs/DATABASE.md` | Esquema Firestore, reglas, consultas |
| `docs/QUICKSTART.md` | Guía rápida de inicio |
| `docs/firebase-schema.md` | Esquema de Firestore |
| `CONTRIBUTING.md` | Guía para contribuidores |
| `CHANGELOG.md` | Historial de cambios |
| `QA/test-cases.md` | Test cases y bugs corregidos |

---

## 🎯 Convenciones de Código

### Nomenclatura

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Componentes | PascalCase | `PetCard.tsx` |
| Funciones | camelCase | `createPet()` |
| Variables | camelCase | `petName` |
| Constantes | UPPER_SNAKE_CASE | `MAX_PHOTOS` |
| Archivos (componentes) | kebab-case | `pet-card.tsx` |
| Archivos (servicios) | camelCase | `petService.ts` |

### TypeScript

- Usar tipos explícitos, nunca `any`
- Interfaces para props de componentes
- Types para uniones de strings

### Errores

- Manejar errores con `try/catch`
- Usar `console.warn` para logging (no `console.log`)
- Lanzar excepciones para que el componente maneje el error

---

## 🗄 Servicios Principales

| Service | Archivo | Función |
|---------|---------|---------|
| Firebase | `src/services/firebase.ts` | Inicialización |
| Auth | `src/services/authService.ts` | Login, registro, logout |
| Pet | `src/services/petService.ts` | CRUD de mascotas |
| User | `src/services/userService.ts` | CRUD de usuarios |
| Storage | `src/services/storageService.ts` | Upload de archivos |
| Cloudinary | `src/services/cloudinary.ts` | Integración Cloudinary |
| Search | `src/services/animalSearchService.ts` | Búsqueda de animales |

---

## 🔒 Seguridad

- Nunca commitear archivos `.env`
- Usar reglas de Firestore para control de acceso
- Uploads de Cloudinary son unsigned (sin autenticación del servidor)
- SerpApi key está expuesta en el bundle (mover a proxy en producción)

---

## 🐛 Bugs Conocidos

Ver `QA/test-cases.md` para bugs corregidos y test cases.

---

## 📱 Plataformas

- **Android**: Package `com.jimmisito.huellitas`
- **iOS**: Configurar en Xcode
- **Web**: Soporte limitado (algunas funciones no disponibles)

---

*Última actualización: Enero 2025*
