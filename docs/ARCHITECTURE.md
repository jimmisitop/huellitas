# 🏗 Arquitectura del Proyecto

## Visión General

Huellitas sigue una arquitectura **modular y basada en archivos** utilizando Expo Router para la navegación, con una clara separación entre UI, lógica de negocio y persistencia.

```
┌─────────────────────────────────────────────────────────────┐
│                        UI Layer                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Screens   │  │ Components  │  │   Styles    │         │
│  │  (app/)     │  │(components/)│  │(NativeWind) │         │
│  └──────┬──────┘  └──────┬──────┘  └─────────────┘         │
│         │                │                                  │
│         ▼                ▼                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  State Layer                         │   │
│  │  ┌─────────────┐  ┌─────────────┐                   │   │
│  │  │   Zustand   │  │   useState  │                   │   │
│  │  │   (global)  │  │   (local)   │                   │   │
│  │  └──────┬──────┘  └──────┬──────┘                   │   │
│  └─────────┼────────────────┼──────────────────────────┘   │
│            │                │                               │
│            ▼                ▼                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                 Services Layer                       │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │   │
│  │  │  Auth    │ │   Pet    │ │   User   │ │Cloudin.│ │   │
│  │  │ Service  │ │ Service  │ │ Service  │ │Service │ │   │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───┬────┘ │   │
│  └───────┼─────────────┼─────────────┼────────────┼──────┘   │
│          │             │             │            │          │
│          ▼             ▼             ▼            ▼          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                Backend Services                      │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │   │
│  │  │ Firebase │ │Cloudinary│ │ SerpApi  │            │   │
│  │  │  Auth +  │ │ Storage  │ │ Search   │            │   │
│  │  │ Firestore│ │          │ │          │            │   │
│  │  └──────────┘ └──────────┘ └──────────┘            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura de Capas

### 1. UI Layer (`src/app/` + `src/components/`)

Responsable de renderizar la interfaz y capturar eventos del usuario.

**Conexiones:**
- Lee estado de **Zustand Store** (global) y **useState** (local)
- Llama funciones de **Services Layer**
- No accede directamente a Firebase/Cloudinary

**Ejemplo de flujo:**
```typescript
// En profile.tsx (Screen)
const { user } = useAuthStore();  // Lee de Zustand
const [profile, setProfile] = useState(null);  // Estado local

useEffect(() => {
  getUserByUid(user.uid).then(setProfile);  // Llama a Service
}, []);
```

### 2. State Layer (`src/store/`)

Gestiona el estado global de la aplicación.

**Zustand Store (`useAuthStore`):**
```typescript
interface AuthState {
  user: User | null;           // Usuario autenticado
  isAuthenticated: boolean;    // Estado de autenticación
  isLoading: boolean;          // Estado de carga inicial
  
  login: (email, password) => Promise<void>;
  register: (email, password, displayName) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;  // Verificar sesión existente
}
```

**Persistencia:**
- Zustand + AsyncStorage para mantener la sesión entre reinicios
- La inicialización verifica si hay una sesión activa en Firebase

### 3. Services Layer (`src/services/`)

Contiene toda la lógica de negocio y comunicación con APIs externas.

| Service | Responsabilidad | Dependencias |
|---------|-----------------|--------------|
| `firebase.ts` | Inicialización de Firebase | `firebase/app`, `firebase/auth`, `firebase/firestore` |
| `authService.ts` | Login, registro, recuperar contraseña | `firebase/auth` |
| `petService.ts` | CRUD de mascotas | `firebase/firestore` |
| `userService.ts` | CRUD de usuarios | `firebase/firestore` |
| `storageService.ts` | Upload de archivos | `cloudinary.ts` |
| `cloudinary.ts` | Integración con Cloudinary API | `expo-file-system` |
| `animalSearchService.ts` | Búsqueda de información animal | SerpApi HTTP |

**Principios:**
- Cada service es una función pura (input → output)
- Manejo de errores con try/catch
- Logging para debugging (`console.warn`)
- No dependen de UI ni Estado

### 4. Backend Services (Externos)

Servicios de terceros que proveen funcionalidad backend:

```
┌─────────────────────────────────────────────────────┐
│                  Firebase                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │  Firebase   │  │   Cloud     │  │   Firebase  │ │
│  │    Auth     │  │  Firestore  │  │  Messaging  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                 Cloudinary                          │
│  ┌─────────────────────────────────────────────┐   │
│  │              Image Storage                   │   │
│  │  - Upload (unsigned preset)                 │   │
│  │  - Transformations (on-the-fly)             │   │
│  │  - CDN global                               │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│                   SerpApi                           │
│  ┌─────────────────────────────────────────────┐   │
│  │           Animal Information Search          │   │
│  │  - Google Search results                    │   │
│  │  - Knowledge Graph data                     │   │
│  │  - Cached results (AsyncStorage)            │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 Flujos de Datos

### Flujo de Autenticación

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Login   │────▶│  Auth    │────▶│ Zustand  │────▶│  Router  │
│  Screen  │     │ Service  │     │  Store   │     │ Guard    │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │               │                │                │
     │  signIn()     │  onAuthState   │  isAuthenticated│
     │──────────────▶│───────────────▶│───────────────▶│
     │               │                │                │
     │               │                │   Redirect to  │
     │               │                │   /tabs or /(auth)
     │               │                │◀───────────────│
```

### Flujo de CRUD de Mascotas

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│   Pet    │────▶│   Pet    │────▶│ Firestore│
│  Screen  │     │ Service  │     │          │
└──────────┘     └──────────┘     └──────────┘
     │               │                │
     │  create()     │  addDoc()      │
     │──────────────▶│───────────────▶│
     │               │                │
     │               │  Pet created   │
     │◀──────────────│◀───────────────│
     │               │                │
     │  setState()   │                │
     │  (update UI)  │                │
```

### Flujo de Upload de Imagen

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Image   │────▶│ Storage  │────▶│Cloudinary│────▶│ Firestore│
│  Picker  │     │ Service  │     │   API    │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
     │               │                │                │
     │  uri          │  File/blob     │  upload()      │
     │──────────────▶│───────────────▶│───────────────▶│
     │               │                │                │
     │               │                │  URL           │
     │◀──────────────│◀───────────────│◀───────────────│
     │               │                │                │
     │               │  save URL to   │                │
     │               │  Firestore     │                │
     │               │───────────────▶│───────────────▶│
```

---

## 🗄 Persistencia

### Firestore Collections

| Colección | Documentos | Índices |
|-----------|------------|---------|
| `users` | 1 por usuario | Ninguno necesario |
| `pets` | N por usuario | `(ownerUid ASC, createdAt DESC)` |
| `pets/{id}/photos` | N por mascota | Ninguno necesario |
| `favorites` | N por usuario | Ninguno necesario |

### AsyncStorage Keys

| Key | Contenido | TTL |
|-----|-----------|-----|
| `auth-storage` | Zustand auth state | Persistente |
| `serpapi_cache_*` | Resultados de búsqueda | 24 horas |
| `serpapi_quota` | Contador de uso diario | Resetea diariamente |

---

## 🔒 Seguridad

### Firestore Rules

```javascript
// Usuarios: solo el propio uid puede escribir
match /users/{uid} {
  allow read: if request.auth != null;
  allow write: if request.auth.uid == uid;
}

// Mascotas: el owner tiene control total
match /pets/{petId} {
  allow read: if request.auth != null;
  allow write: if resource.data.ownerUid == request.auth.uid;
}
```

### Variables Sensibles

| Variable | Ubicación | Exposed en Bundle |
|----------|-----------|-------------------|
| `FIREBASE_API_KEY` | `.env` | Sí (necesario para cliente) |
| `CLOUDINARY_CLOUD_NAME` | `.env` | Sí (necesario para upload) |
| `SERPAPI_KEY` | `.env` | ⚠️ Sí (riesgo: puede ser extraído) |

**Recomendación para producción:**
- Mover SerpApi a un backend proxy
- Usar Firebase Functions para uploads controlados

---

## 📱 Navegación

### Estructura de Rutas (Expo Router)

```
src/app/
├── _layout.tsx                    # Root layout (providers)
├── (auth)/                        # Auth stack (no tabs)
│   ├── _layout.tsx               # Stack navigator
│   ├── login.tsx                 # /login
│   ├── register.tsx              # /register
│   └── forgot-password.tsx       # /forgot-password
│
└── (tabs)/                        # Main tabs
    ├── _layout.tsx               # Tab navigator
    ├── index.tsx                 # / (Inicio)
    ├── my-pets.tsx               # /my-pets
    ├── learn.tsx                 # /learn
    ├── profile.tsx               # /profile
    └── pet/                      # Sub-rutas (hidden from tabs)
        ├── create.tsx            # /pet/create
        ├── [id].tsx              # /pet/:id
        └── edit/
            └── [id].tsx          # /pet/edit/:id
```

### Flujo de Navegación

```
App Start
    │
    ▼
┌─────────────────────┐
│   Check Auth State  │
│   (Zustand init)    │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌─────────┐  ┌─────────┐
│  Auth   │  │  Tabs   │
│  Stack  │  │  Stack  │
└─────────┘  └─────────┘
     │           │
     ▼           ▼
  Login     ┌─────────┐
  Register  │  Tabs   │
  Forgot    │ Inicio  │
            │ Mascotas│
            │ Aprender│
            │ Perfil  │
            └─────────┘
```

---

## 🧩 Componentes

### Árbol de Componentes

```
App
├── AuthStack
│   ├── LoginScreen
│   ├── RegisterScreen
│   └── ForgotPasswordScreen
│
└── TabsStack
    ├── HomeScreen
    │   ├── AnimalTipsSection
    │   │   ├── SearchBar
    │   │   └── AnimalTipCard
    │   ├── StoryCard
    │   └── ReelCard
    │
    ├── MyPetsScreen
    │   └── (lista de mascotas)
    │
    ├── LearnScreen
    │   └── (contenido educativo)
    │
    ├── ProfileScreen
    │   ├── Avatar (expo-image-picker)
    │   ├── UserInfo
    │   └── EditMode
    │
    └── PetScreens
        ├── CreatePetScreen
        ├── PetDetailScreen
        │   ├── PetProfileHeader
        │   ├── VaccinesSection
        │   └── VeterinaryVisitsSection
        └── EditPetScreen
```

---

## 🚀 Performance

### Optimizaciones Implementadas

1. **Debounce en Búsqueda**: 500ms delay para evitar llamadas excesivas a SerpApi
2. **Cache de Resultados**: AsyncStorage con TTL de 24 horas
3. **Lazy Loading**: Screens se cargan bajo demanda (Expo Router)
4. **Memoización**: Componentes con React.memo cuando es necesario
5. **Optimistic Updates**: Estado local se actualiza antes de la respuesta del server

### Bundle Size

| Categoría | Tamaño Aprox. |
|-----------|---------------|
| React Native | ~2MB |
| Expo SDK | ~5MB |
| Firebase | ~3MB |
| Otros | ~2MB |
| **Total** | **~12MB** |

---

## 🔧 Configuración de Herramientas

### TypeScript

```json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### ESLint

- Configuración de Expo (`eslint-config-expo`)
- Reglas de React Compiler habilitadas
- Prettier para formateo

### NativeWind

- TailwindCSS v3.4
- Modo oscuro automático (`userInterfaceStyle: "automatic"`)
- Clases utility-first

---

## 📊 Métricas de Calidad

| Métrica | Estado |
|---------|--------|
| TypeScript Errors | 0 |
| ESLint Errors | 0 |
| ESLint Warnings | 0 |
| Test Coverage | Pendiente |
| Build Status | ✅ Exitoso (previo) |

---

## 🗺 Roadmap Técnico

### Completado ✅
- [x] Estructura base del proyecto
- [x] Autenticación con Firebase
- [x] CRUD de mascotas
- [x] Upload de imágenes (Cloudinary)
- [x] Perfil de usuario
- [x] Búsqueda de información
- [x] Dark mode
- [x] Firestore rules desplegadas
- [x] Índices compuestos

### Pendiente 📋
- [ ] Tests unitarios (Jest)
- [ ] Tests de integración (Detox)
- [ ] Push notifications
- [ ] Chat entre usuarios
- [ ] Sistema de likes/comentarios
- [ ] Geolocalización de mascotas
- [ ] Veterinarios cercanos
- [ ] Recordatorios de vacunas
- [ ] Exportar datos (PDF)
- [ ] Moderación de contenido

---

## 📚 Recursos

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)

---

*Última actualización: Enero 2025*
