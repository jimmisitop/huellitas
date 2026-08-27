<div align="center">

# 🐾 Huellitas

**Red social para tus mascotas**

Postea imágenes, guarda las citas del veterinario, registra sus vacunas y aprende a cuidar a tu mejor amigo 🐕

[![Expo](https://img.shields.io/badge/Expo-SDK_57-blue.svg)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.86-green.svg)](https://reactnative.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange.svg)](https://firebase.google.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg)](https://typescriptlang.org)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Stack Tecnológico](#stack-tecnológico)
- [Capturas](#capturas)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Funcionalidades](#funcionalidades)
- [Guía de Desarrollo](#guía-de-desarrollo)
- [Build y Deployment](#build-y-deployment)
- [Base de Datos](#base-de-datos)
- [Testing](#testing)
- [Changelog](#changelog)
- [Licencia](#licencia)

---

## 📝 Descripción

**Huellitas** es una aplicación móvil construida con React Native y Expo que funciona como una red social dedicada a las mascotas. Los usuarios pueden:

- 📸 **Publicar fotos** de sus mascotas
- 🏥 **Registrar citas veterinarias** y vacunas
- 📚 **Aprender** sobre el cuidado de animales con contenido curado
- 🔍 **Buscar información** sobre diferentes especies y razas
- 👤 **Gestionar su perfil** con foto y datos personales

### Objetivo

Crear una comunidad donde los dueños de mascotas puedan compartir la vida de sus compañeros peludos, mantener un historial médico organizado y aprender mejores prácticas de cuidado animal.

---

## 🛠 Stack Tecnológico

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React Native | 0.86 | Framework UI multiplataforma |
| Expo | SDK 57 | Plataforma de desarrollo |
| Expo Router | 57.0.3 | Navegación basada en archivos |
| NativeWind | 4.2.6 | TailwindCSS para React Native |
| Zustand | 5.0.15 | Gestión de estado ligera |
| TypeScript | 6.0 | Tipado estático |

### Backend / Servicios
| Servicio | Propósito |
|----------|-----------|
| Firebase Auth | Autenticación (email/password) |
| Cloud Firestore | Base de datos NoSQL |
| Cloudinary | Almacenamiento de imágenes (25GB gratis) |
| SerpApi | Búsqueda de información animal |

### Herramientas de Desarrollo
| Herramienta | Propósito |
|-------------|-----------|
| ESLint | Linting con reglas de Expo |
| Prettier | Formateo de código |
| EAS Build | Builds en la nube |
| Firebase CLI | Despliegue de reglas |

---

## 📱 Capturas

> *Las capturas de pantalla se agregarán después del primer build*

**Pantallas principales:**
- 🔐 Login / Registro / Recuperar contraseña
- 🏠 Feed principal con tips de animales
- 🐕 Lista de mascotas del usuario
- ➕ Crear / Editar mascota
- 📖 Sección de aprendizaje
- 👤 Perfil de usuario con edición

---

## ✅ Requisitos Previos

- **Node.js** 18+ 
- **pnpm** (recomendado) o npm
- **Expo CLI** (`npx expo`)
- **Firebase CLI** (para desplegar reglas)
- **Cuenta de Firebase** (proyecto `huellitas-9477e`)
- **Cuenta de Cloudinary** (plan gratuito)
- **SerpApi key** (plan gratuito: 100 búsquedas/mes)

---

## 🚀 Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/jimmisitop/huellitas.git
cd huellitas

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno (ver sección Configuración)
cp .env.example .env

# 4. Iniciar el servidor de desarrollo
pnpm start
```

---

## ⚙️ Configuración

### Variables de Entorno

Crea el archivo `.env` en la raíz del proyecto:

```env
# Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=huellitas-9477e
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id

# Cloudinary (obtener en https://console.cloudinary.com/settings)
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=huellitas_unsigned

# SerpApi (obtener en https://serpapi.com/manage-api-key)
EXPO_PUBLIC_SERPAPI_KEY=tu_api_key
```

### Obtener las credenciales

#### Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona el proyecto `huellitas-9477e`
3. Ve a ⚙️ Configuración del proyecto → General
4. En "Tus apps", selecciona la app web (o crea una)
5. Copia los valores de `firebaseConfig`

#### Cloudinary
1. Ve a [Cloudinary Dashboard](https://console.cloudinary.com/)
2. En Settings → Cloud Name, copia el nombre
3. En Settings → Upload → Upload presets, crea uno unsigned:
   - Nombre: `huellitas_unsigned`
   - Modo: Unsigned
   - Folder: `huellitas`

#### SerpApi
1. Ve a [SerpApi](https://serpapi.com/)
2. Crea una cuenta (plan gratuito: 100 búsquedas/mes)
3. Ve a Dashboard → API Key
4. Copia la key

---

## 📁 Estructura del Proyecto

```
huellitas/
├── 📄 app.json              # Configuración de Expo
├── 📄 eas.json              # Configuración de EAS Build
├── 📄 firebase.json         # Configuración de Firebase CLI
├── 📄 tailwind.config.js    # Configuración de NativeWind
├── 📄 tsconfig.json         # Configuración de TypeScript
├── 📄 .env                  # Variables de entorno (NO commitear)
│
├── 📁 assets/               # Recursos estáticos
│   └── 📁 images/           # Iconos, splash screens
│
├── 📁 docs/                 # Documentación
│   └── 📄 firebase-schema.md # Esquema de Firestore
│
├── 📁 scripts/              # Scripts de Firebase
│   ├── 📄 firestore.rules   # Reglas de seguridad
│   └── 📄 firestore.indexes.json # Índices compuestos
│
├── 📁 QA/                   # Quality Assurance
│   └── 📄 test-cases.md     # Test cases y bug reports
│
└── 📁 src/                  # Código fuente
    ├── 📁 app/              # Rutas (Expo Router)
    │   ├── 📄 _layout.tsx   # Layout raíz (providers)
    │   ├── 📁 (auth)/       # Rutas de autenticación
    │   │   ├── 📄 _layout.tsx
    │   │   ├── 📄 login.tsx
    │   │   ├── 📄 register.tsx
    │   │   └── 📄 forgot-password.tsx
    │   └── 📁 (tabs)/       # Rutas principales (tabs)
    │       ├── 📄 _layout.tsx    # Layout de tabs
    │       ├── 📄 index.tsx      # Inicio (feed)
    │       ├── 📄 my-pets.tsx    # Mis mascotas
    │       ├── 📄 learn.tsx      # Aprender
    │       ├── 📄 profile.tsx    # Perfil de usuario
    │       └── 📁 pet/           # Sub-rutas de mascotas
    │           ├── 📄 create.tsx
    │           ├── 📄 [id].tsx
    │           └── 📁 edit/
    │               └── 📄 [id].tsx
    │
    ├── 📁 components/       # Componentes reutilizables
    │   ├── 📄 animalTipCard.tsx
    │   ├── 📄 animalTipsSection.tsx
    │   ├── 📄 headertitleStyles.tsx
    │   ├── 📄 petProfileActions.tsx
    │   ├── 📄 petProfileHeader.tsx
    │   ├── 📄 reelCard.tsx
    │   ├── 📄 searchBar.tsx
    │   ├── 📄 storyCard.tsx
    │   ├── 📄 vaccinesSection.tsx
    │   └── 📄 veterinaryVisitsSection.tsx
    │
    ├── 📁 services/         # Lógica de negocio y APIs
    │   ├── 📄 firebase.ts        # Inicialización de Firebase
    │   ├── 📄 authService.ts     # Autenticación
    │   ├── 📄 petService.ts      # CRUD de mascotas
    │   ├── 📄 userService.ts     # CRUD de usuarios
    │   ├── 📄 storageService.ts  # Upload de archivos
    │   ├── 📄 cloudinary.ts      # Integración con Cloudinary
    │   └── 📄 animalSearchService.ts # Búsqueda con SerpApi
    │
    ├── 📁 store/            # Estado global (Zustand)
    │   └── 📄 useAuthStore.ts
    │
    ├── 📁 types/            # Definiciones TypeScript
    │   └── 📄 index.ts
    │
    ├── 📁 constants/        # Datos constantes
    │   ├── 📄 petProfile.json
    │   └── 📄 reelsUsersFake.json
    │
    └── 📁 hooks/            # Custom hooks (futuro)
```

---

## 🎯 Funcionalidades

### ✅ Implementadas (Fases 0-8)

#### 🔐 Autenticación (Fase 2)
- [x] Login con email/password
- [x] Registro de nuevos usuarios
- [x] Recuperar contraseña
- [x] Persistencia de sesión (Zustand + AsyncStorage)
- [x] Rutas protegidas (redirige a login si no hay sesión)

#### 🐕 Gestión de Mascotas (Fase 4)
- [x] Crear mascota con foto
- [x] Ver detalle de mascota
- [x] Editar mascota
- [x] Eliminar mascota (con confirmación)
- [x] Galería de fotos por mascota
- [x] Registro de vacunas
- [x] Registro de visitas veterinarias

#### 🔍 Búsqueda (Fase 5)
- [x] Búsqueda de información animal (SerpApi)
- [x] Debounce para evitar llamadas excesivas
- [x] Cache de resultados (AsyncStorage)
- [x] Control de cuota (100 búsquedas/mes)
- [x] Tips de cuidado animal

#### 👤 Perfil de Usuario (Fase 6)
- [x] Ver perfil con avatar, nombre, email
- [x] Editar nombre y foto de perfil
- [x] Conteo de mascotas
- [x] Cerrar sesión
- [x] Upload de avatar a Cloudinary

#### 🎨 UI/UX
- [x] Dark mode automático
- [x] NativeWind (TailwindCSS)
- [x] Iconos con @expo/vector-icons
- [x] Animaciones con react-native-reanimated
- [x] Estados de loading y error
- [x] Empty states descriptivos

---

## 🧑‍💻 Guía de Desarrollo

### Comandos Principales

```bash
# Iniciar servidor de desarrollo
pnpm start

# Ejecutar en Android
pnpm android

# Ejecutar en iOS
pnpm ios

# Ejecutar en web
pnpm web

# Linting
pnpm lint

# Typecheck
npx tsc --noEmit
```

### Agregar una Nueva Pantalla

1. Crea el archivo en `src/app/(tabs)/tu-pantalla.tsx`
2. Agrega el tab en `src/app/(tabs)/_layout.tsx`:

```tsx
<Tabs.Screen
  name="tu-pantalla"
  options={{
    title: "Tu Pantalla",
    tabBarIcon: ({ color, size }) => (
      <Icon name="tu-icono" size={size} color={color} />
    ),
  }}
/>
```

### Agregar un Nuevo Componente

1. Crea el archivo en `src/components/tu-componente.tsx`
2. Importa y usa en la pantalla que necesites:

```tsx
import { TuComponente } from "@/components/tu-componente";

export default function MiPantalla() {
  return <TuComponente prop={valor} />;
}
```

### Agregar una Nueva Función al Service

1. Abre el service correspondiente en `src/services/`
2. Agrega la función:

```typescript
export async function miFuncion(param: Tipo): Promise<Retorno> {
  try {
    // Lógica aquí
    return resultado;
  } catch (error) {
    console.error("Error en miFuncion:", error);
    throw error;
  }
}
```

### Convenciones de Código

- **Componentes**: Functional components con hooks
- **Nombres**: PascalCase para componentes, camelCase para funciones/variables
- **Archivos**: kebab-case para archivos (`pet-card.tsx`)
- **Imports**: Usar `@/` como alias de `src/`
- **Estilos**: NativeWind (TailwindCSS classes)
- **Estados**: Zustand para estado global, useState/useEffect para local

---

## 📦 Build y Deployment

### Build de Desarrollo

```bash
# Build de desarrollo (reversible)
npx eas build --platform android --profile development
npx eas build --platform ios --profile development
```

### Build de Preview (APK)

```bash
# Build de preview para testing
npx eas build --platform android --profile preview
```

### Build de Producción

```bash
# Build para producción
npx eas build --platform android --profile production
npx eas build --platform ios --profile production
```

### Desplegar Reglas de Firestore

```bash
# Login en Firebase (si no lo has hecho)
firebase login

# Desplegar reglas
firebase deploy --only firestore:rules

# Desplegar índices
firebase deploy --only firestore:indexes
```

---

## 🗄 Base de Datos

### Estructura de Firestore

```
firestore
├── users/{uid}
│   ├── displayName: string
│   ├── email: string
│   ├── photoURL: string | null
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
│
├── pets/{petId}
│   ├── ownerUid: string          → users.uid
│   ├── name: string
│   ├── species: "Perro" | "Gato" | "Ave" | "Conejo" | "Otro"
│   ├── breed: string
│   ├── age: number
│   ├── description: string
│   ├── tags: string[]
│   ├── photoURL: string | null
│   ├── createdAt: timestamp
│   ├── updatedAt: timestamp
│   │
│   └── photos/{photoId}          ← subcolección
│       ├── url: string
│       ├── caption: string | null
│       └── createdAt: timestamp
│
└── favorites/{favId}
    ├── userUid: string           → users.uid
    ├── petId: string             → pets.id
    └── createdAt: timestamp
```

### Reglas de Seguridad

| Operación | Colección | Regla |
|-----------|-----------|-------|
| Leer | users | Cualquier autenticado |
| Escribir | users | Solo el propio uid |
| Leer | pets | Cualquier autenticado |
| CRUD | pets | Solo el ownerUid |
| CRUD | favorites | Solo el userUid |

📖 Documentación completa: [docs/firebase-schema.md](docs/firebase-schema.md)

---

## 🧪 Testing

### Test Cases

Todos los test cases están documentados en [QA/test-cases.md](QA/test-cases.md).

### Bugs Corregidos

| # | Bug | Archivo | Estado |
|---|-----|---------|--------|
| 1 | photoURL undefined se envía a Firestore | profile.tsx, userService.ts | ✅ |
| 2 | Cloudinary sin cloud name | cloudinary.ts | ✅ |
| 3 | Firestore permissions no desplegadas | firebase.json | ✅ |
| 4 | FormDataPart unsupported (React Native) | cloudinary.ts | ✅ |
| 5 | No document to update (upsert faltaba) | userService.ts | ✅ |
| 6 | Deprecated readAsStringAsync | cloudinary.ts | ✅ |
| 7 | Transformation parameter not allowed | cloudinary.ts | ✅ |
| 8 | Rutas pet/ se muestran como tabs | _layout.tsx | ✅ |

---

## 📄 Changelog

### v1.0.0 (2025-01-XX)

**Funcionalidades:**
- Autenticación completa (login, registro, forgot password)
- CRUD de mascotas con fotos
- Perfil de usuario con edición
- Búsqueda de información animal
- Dark mode automático

**Correcciones:**
- 8 bugs críticos corregidos (ver QA/test-cases.md)

**Técnico:**
- Migrado a Expo SDK 57
- Firestore rules desplegadas
- Índices compuestos configurados

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una branch para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -m 'Add nueva funcionalidad'`)
4. Push a la branch (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📝 Licencia

MIT License - Ver [LICENSE](LICENSE)

---

## 👨‍💻 Autor

**Jimy** - [@jimmisitop](https://github.com/jimmisitop)

---

<div align="center">

Hecho con ❤️ para las mascotas 🐾

</div>
