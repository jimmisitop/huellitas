# ⚡ Inicio Rápido

Guía para configurar el proyecto en menos de 5 minutos.

---

## 📋 Requisitos

- [ ] Node.js 18+ instalado
- [ ] pnpm instalado (`npm install -g pnpm`)
- [ ] Git instalado
- [ ] Cuenta de GitHub
- [ ] Expo CLI (`npx expo`)

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/jimmisito/huellitas.git
cd huellitas
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales (ver [Configuración](#configuración)).

### 4. Iniciar el servidor

```bash
pnpm start
```

¡Listo! La app debería abrirse en tu navegador o emulador.

---

## ⚙️ Configuración

### Variables de Entorno

Edita el archivo `.env` con estos valores:

```env
# Firebase (obtener en https://console.firebase.google.com/)
EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=huellitas-9477e.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=huellitas-9477e
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=huellitas-9477e.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id

# Cloudinary (obtener en https://console.cloudinary.com/)
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=huellitas_unsigned

# SerpApi (obtener en https://serpapi.com/)
EXPO_PUBLIC_SERPAPI_KEY=tu_api_key
```

### Obtener las credenciales

#### Firebase (5 minutos)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona el proyecto `huellitas-9477e`
3. Ve a ⚙️ Configuración del proyecto → General
4. En "Tus apps", haz click en el icono web `</>`
5. Copia los valores de `firebaseConfig`
6. En Authentication → Sign-in method, habilita **Email/Password**

#### Cloudinary (3 minutos)

1. Ve a [Cloudinary](https://console.cloudinary.com/) y crea una cuenta
2. En Dashboard, copia el **Cloud Name**
3. Ve a Settings → Upload → Upload presets
4. Haz click en "Add upload preset"
5. Configura:
   - Nombre: `huellitas_unsigned`
   - Signing Mode: **Unsigned**
   - Folder: `huellitas`
6. Guarda

#### SerpApi (2 minutos)

1. Ve a [SerpApi](https://serpapi.com/) y crea una cuenta
2. En Dashboard, copia la **API Key**
3. Plan gratuito: 100 búsquedas/día

---

## 📱 Ejecutar la App

### En el navegador (más rápido)

```bash
pnpm web
```

### En Android (emulador o dispositivo)

```bash
# Instalar Expo Go en tu dispositivo Android
# Escanear el QR code que aparece en:
pnpm android
```

### En iOS (solo macOS)

```bash
# Instalar Expo Go desde App Store
# Escanear el QR code que aparece en:
pnpm ios
```

---

## 🧪 Verificar que Funciona

1. **Login**: Intenta crear una cuenta con email/password
2. **Mascotas**: Crea una mascota con foto
3. **Perfil**: Edita tu nombre y foto de perfil
4. **Búsqueda**: Busca "cuidados de perro"

Si todo funciona, ¡estás listo para desarrollar! 🎉

---

## 🛠 Comandos Útiles

```bash
# Iniciar servidor de desarrollo
pnpm start

# Ejecutar en plataforma específica
pnpm android
pnpm ios
pnpm web

# Linting (verificar código)
pnpm lint

# Typecheck (verificar tipos)
npx tsc --noEmit

# Build de producción
npx eas build --platform android --profile preview
```

---

## 📁 Estructura del Proyecto

```
src/
├── app/              # Pantallas (Expo Router)
│   ├── (auth)/       # Login, Registro, Forgot Password
│   └── (tabs)/       # Tabs principales
├── components/       # Componentes reutilizables
├── services/         # Lógica de negocio (Firebase, Cloudinary)
├── store/            # Estado global (Zustand)
├── types/            # Definiciones TypeScript
└── constants/        # Datos constantes
```

---

## 🐛 Solución de Problemas

### "Firebase: No API key found"

Verifica que `.env` tenga `EXPO_PUBLIC_FIREBASE_API_KEY` configurado.

### "Cloudinary: Cloud name no configurado"

Verifica que `.env` tenga `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME` configurado.

### "Missing or insufficient permissions"

Las reglas de Firestore no están desplegadas. Ejecuta:

```bash
firebase login
firebase deploy --only firestore:rules
```

### "Expo: Unable to resolve module"

Elimina `node_modules` y reinstala:

```bash
rm -rf node_modules
pnpm install
```

### La app no carga en el navegador

Asegúrate de que el servidor esté corriendo:

```bash
pnpm start
```

---

## 📚 Recursos

- [Documentación del Proyecto](../README.md)
- [Arquitectura](./ARCHITECTURE.md)
- [Referencia de Servicios](./SERVICES.md)
- [Base de Datos](./DATABASE.md)
- [Guía de Contribución](../CONTRIBUTING.md)

---

## ❓ ¿Necesitas Ayuda?

1. Revisa la documentación en `docs/`
2. Busca en los issues del repositorio
3. Abre un issue con tu pregunta

---

¡Bienvenido al proyecto! 🐾
