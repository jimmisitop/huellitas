# 📋 Changelog

Todas las cambios notables de Huellitas serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto adheres a [Semantic Versioning](https://semver.org/lang/es/).

---

## [1.0.0] - 2025-01-XX

### 🚀 Funcionalidades Nuevas

#### Autenticación (Fase 2)
- ✅ Login con email/password
- ✅ Registro de nuevos usuarios
- ✅ Recuperación de contraseña
- ✅ Persistencia de sesión (Zustand + AsyncStorage)
- ✅ Rutas protegidas (redirige a login si no hay sesión)
- ✅ Manejo de errores de autenticación

#### Gestión de Mascotas (Fase 4)
- ✅ Crear mascota con foto
- ✅ Ver detalle de mascota
- ✅ Editar mascota
- ✅ Eliminar mascota (con confirmación)
- ✅ Galería de fotos por mascota
- ✅ Registro de vacunas
- ✅ Registro de visitas veterinarias
- ✅ Upload de fotos a Cloudinary

#### Perfil de Usuario (Fase 6)
- ✅ Ver perfil con avatar, nombre, email
- ✅ Editar nombre y foto de perfil
- ✅ Conteo de mascotas del usuario
- ✅ Cerrar sesión
- ✅ Upload de avatar a Cloudinary
- ✅ Validación de campos (nombre no vacío)

#### Búsqueda (Fase 5)
- ✅ Búsqueda de información animal (SerpApi)
- ✅ Debounce para evitar llamadas excesivas (500ms)
- ✅ Cache de resultados (AsyncStorage, TTL 24h)
- ✅ Control de cuota (100 búsquedas/mes)
- ✅ Tips de cuidado animal
- ✅ Empty states para búsqueda

#### UI/UX
- ✅ Dark mode automático
- ✅ NativeWind (TailwindCSS para React Native)
- ✅ Iconos con @expo/vector-icons
- ✅ Animaciones con react-native-reanimated
- ✅ Estados de loading y error
- ✅ Empty states descriptivos
- ✅ Splash screen personalizado

#### Navegación
- ✅ 4 tabs principales: Inicio, Mis Mascotas, Aprender, Perfil
- ✅ Sub-rutas para mascotas (create, detail, edit)
- ✅ Rutas de autenticación (login, register, forgot-password)

### 🐛 Bugs Corregidos

| # | Bug | Severidad | Archivos |
|---|-----|-----------|----------|
| 1 | photoURL undefined se enviaba a Firestore | Alta | profile.tsx, userService.ts |
| 2 | Cloudinary sin cloud name configurado | Alta | cloudinary.ts |
| 3 | Firestore rules no desplegadas | Alta | firebase.json |
| 4 | FormDataPart unsupported en React Native | Alta | cloudinary.ts |
| 5 | No document to update en perfil | Alta | userService.ts |
| 6 | Deprecated readAsStringAsync | Media | cloudinary.ts |
| 7 | Transformation parameter not allowed | Alta | cloudinary.ts |
| 8 | Rutas pet/ se mostraban como tabs | Media | _layout.tsx |

📖 Documentación completa: [QA/test-cases.md](QA/test-cases.md)

### 🛠 Mejoras Técnicas

- ✅ Migrado a Expo SDK 57
- ✅ React Native 0.86
- ✅ TypeScript 6.0
- ✅ React Compiler habilitado
- ✅ ESLint 0 errores, 0 warnings
- ✅ Firestore rules desplegadas
- ✅ Índices compuestos configurados
- ✅ Firebase CLI instalado y configurado

### 📚 Documentación

- ✅ README.md completo con setup y guía
- ✅ ARCHITECTURE.md con diagramas y estructura
- ✅ CONTRIBUTING.md con guías para contribuidores
- ✅ .env.example con variables de entorno
- ✅ docs/firebase-schema.md actualizado
- ✅ QA/test-cases.md con 22 test cases

---

## [0.9.0] - 2025-01-15 (Pre-release)

### 🚀 Funcionalidades
- Estructura base del proyecto
- Configuración de Expo, TypeScript, NativeWind
- Configuración de Firebase
- Estructura de componentes

### 🛠 Configuración
- Expo SDK 57
- React Native 0.86
- NativeWind 4.2.6
- Firebase 12.17.1
- Zustand 5.0.15

---

## [0.8.0] - 2025-01-10 (Pre-release)

### 🚀 Funcionalidades
- Proyecto inicial creado con Expo
- Configuración básica de navegación
- Estructura de carpetas

---

## Links

- [Repositorio](https://github.com/jimmisitop/huellitas)
- [Documentación](docs/)
- [Test Cases](QA/test-cases.md)
