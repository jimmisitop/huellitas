# 🔌 Referencia de Servicios

Documentación de la API de cada service del proyecto.

---

## 📁 Índice

- [Firebase Service](#firebase-service)
- [Auth Service](#auth-service)
- [Pet Service](#pet-service)
- [User Service](#user-service)
- [Storage Service](#storage-service)
- [Cloudinary Service](#cloudinary-service)
- [Animal Search Service](#animal-search-service)

---

## Firebase Service

**Archivo:** `src/services/firebase.ts`

Inicialización de Firebase y exportación de instancias.

### Exports

```typescript
import { app, auth, db } from "@/services/firebase";
```

| Export | Tipo | Descripción |
|--------|------|-------------|
| `app` | `FirebaseApp` | Instancia de la app Firebase |
| `auth` | `Auth` | Servicio de autenticación |
| `db` | `Firestore` | Instancia de Firestore |

---

## Auth Service

**Archivo:** `src/services/authService.ts`

Funciones de autenticación con Firebase Auth.

### Funciones

#### `login(email: string, password: string): Promise<UserCredential>`

Inicia sesión con email y contraseña.

```typescript
import { login } from "@/services/authService";

const result = await login("usuario@email.com", "password123");
console.log(result.user.uid); // UID del usuario
```

**Parámetros:**
| Nombre | Tipo | Requerido | Descripción |
|--------|------|-----------|-------------|
| `email` | `string` | Sí | Email del usuario |
| `password` | `string` | Sí | Contraseña |

**Retorna:** `Promise<UserCredential>`

**Errores:**
- `auth/user-not-found` - No existe usuario con ese email
- `auth/wrong-password` - Contraseña incorrecta
- `auth/invalid-email` - Email inválido
- `auth/too-many-requests` - Demasiados intentos

---

#### `register(email: string, password: string, displayName: string): Promise<UserCredential>`

Registra un nuevo usuario.

```typescript
import { register } from "@/services/authService";

const result = await register("nuevo@email.com", "password123", "Juan Pérez");
```

**Parámetros:**
| Nombre | Tipo | Requerido | Descripción |
|--------|------|-----------|-------------|
| `email` | `string` | Sí | Email del usuario |
| `password` | `string` | Sí | Contraseña (mínimo 6 caracteres) |
| `displayName` | `string` | Sí | Nombre para mostrar |

**Retorna:** `Promise<UserCredential>`

**Errores:**
- `auth/email-already-in-use` - Email ya registrado
- `auth/weak-password` - Contraseña muy débil
- `auth/invalid-email` - Email inválido

---

#### `sendPasswordReset(email: string): Promise<void>`

Envía email de recuperación de contraseña.

```typescript
import { sendPasswordReset } from "@/services/authService";

await sendPasswordReset("usuario@email.com");
```

**Parámetros:**
| Nombre | Tipo | Requerido | Descripción |
|--------|------|-----------|-------------|
| `email` | `string` | Sí | Email del usuario |

**Retorna:** `Promise<void>`

---

#### `logout(): Promise<void>`

Cierra la sesión del usuario actual.

```typescript
import { logout } from "@/services/authService";

await logout();
```

**Retorna:** `Promise<void>`

---

## Pet Service

**Archivo:** `src/services/petService.ts`

CRUD de mascotas en Firestore.

### Funciones

#### `createPet(data: PetFormData): Promise<string>`

Crea una nueva mascota.

```typescript
import { createPet } from "@/services/petService";

const petId = await createPet({
  name: "Max",
  species: "Perro",
  breed: "Labrador",
  age: 3,
  description: "Perro muy juguetón",
  tags: ["juguetón", "amigable"],
  photoURL: "https://cloudinary.com/foto.jpg",
});
```

**Parámetros:**
| Nombre | Tipo | Requerido | Descripción |
|--------|------|-----------|-------------|
| `data` | `PetFormData` | Sí | Datos de la mascota |

**Retorna:** `Promise<string>` - ID de la mascota creada

---

#### `getPetById(petId: string): Promise<Pet | null>`

Obtiene una mascota por su ID.

```typescript
import { getPetById } from "@/services/petService";

const pet = await getPetById("abc123");
if (pet) {
  console.log(pet.name); // "Max"
}
```

**Parámetros:**
| Nombre | Tipo | Requerido | Descripción |
|--------|------|-----------|-------------|
| `petId` | `string` | Sí | ID de la mascota |

**Retorna:** `Promise<Pet | null>`

---

#### `getPetsByUser(userUid: string): Promise<Pet[]>`

Obtiene todas las mascotas de un usuario.

```typescript
import { getPetsByUser } from "@/services/petService";

const pets = await getPetsByUser("user123");
console.log(pets.length); // 3
```

**Parámetros:**
| Nombre | Tipo | Requerido | Descripción |
|--------|------|-----------|-------------|
| `userUid` | `string` | Sí | UID del usuario |

**Retorna:** `Promise<Pet[]>` - Ordenadas por `createdAt` descendente

**Índice requerido:** `(ownerUid ASC, createdAt DESC)`

---

#### `updatePet(petId: string, data: Partial<PetFormData>): Promise<void>`

Actualiza una mascota existente.

```typescript
import { updatePet } from "@/services/petService";

await updatePet("abc123", {
  name: "Max Actualizado",
  age: 4,
});
```

**Parámetros:**
| Nombre | Tipo | Requerido | Descripción |
|--------|------|-----------|-------------|
| `petId` | `string` | Sí | ID de la mascota |
| `data` | `Partial<PetFormData>` | Sí | Campos a actualizar |

**Retorna:** `Promise<void>`

---

#### `deletePet(petId: string): Promise<void>`

Elimina una mascota.

```typescript
import { deletePet } from "@/services/petService";

await deletePet("abc123");
```

**Parámetros:**
| Nombre | Tipo | Requerido | Descripción |
|--------|------|-----------|-------------|
| `petId` | `string` | Sí | ID de la mascota |

**Retorna:** `Promise<void>`

---

## User Service

**Archivo:** `src/services/userService.ts`

CRUD de usuarios en Firestore.

### Funciones

#### `upsertUser(user: { uid: string; email: string; displayName?: string }): Promise<void>`

Crea o actualiza el documento del usuario.

```typescript
import { upsertUser } from "@/services/userService";

await upsertUser({
  uid: "user123",
  email: "usuario@email.com",
  displayName: "Juan Pérez",
});
```

**Parámetros:**
| Nombre | Tipo | Requerido | Descripción |
|--------|------|-----------|-------------|
| `user.uid` | `string` | Sí | UID de Firebase Auth |
| `user.email` | `string` | Sí | Email del usuario |
| `user.displayName` | `string` | No | Nombre para mostrar |

**Retorna:** `Promise<void>`

---

#### `getUserByUid(uid: string): Promise<User | null>`

Obtiene el perfil del usuario por UID.

```typescript
import { getUserByUid } from "@/services/userService";

const user = await getUserByUid("user123");
if (user) {
  console.log(user.displayName); // "Juan Pérez"
}
```

**Parámetros:**
| Nombre | Tipo | Requerido | Descripción |
|--------|------|-----------|-------------|
| `uid` | `string` | Sí | UID del usuario |

**Retorna:** `Promise<User | null>`

---

#### `updateUserProfile(uid: string, data: { displayName?: string; photoURL?: string }): Promise<void>`

Actualiza el perfil del usuario.

```typescript
import { updateUserProfile } from "@/services/userService";

await updateUserProfile("user123", {
  displayName: "Juan Actualizado",
  photoURL: "https://cloudinary.com/nueva-foto.jpg",
});
```

**Parámetros:**
| Nombre | Tipo | Requerido | Descripción |
|--------|------|-----------|-------------|
| `uid` | `string` | Sí | UID del usuario |
| `data.displayName` | `string` | No | Nuevo nombre |
| `data.photoURL` | `string` | No | Nueva URL de foto |

**Retorna:** `Promise<void>`

**Nota:** Usa `setDoc` con `merge: true`, así que crea el documento si no existe.

---

## Storage Service

**Archivo:** `src/services/storageService.ts`

Funciones para subir archivos.

### Funciones

#### `uploadUserAvatar(uri: string): Promise<string>`

Sube una foto de perfil a Cloudinary.

```typescript
import { uploadUserAvatar } from "@/services/storageService";

const photoURL = await uploadUserAvatar("file:///path/to/image.jpg");
console.log(photoURL); // "https://res.cloudinary.com/.../image.jpg"
```

**Parámetros:**
| Nombre | Tipo | Requerido | Descripción |
|--------|------|-----------|-------------|
| `uri` | `string` | Sí | URI local de la imagen |

**Retorna:** `Promise<string>` - URL de la imagen en Cloudinary

**Errores:**
- Cloudinary no configurado
- Error de red
- Formato de imagen no soportado

---

## Cloudinary Service

**Archivo:** `src/services/cloudinary.ts`

Integración directa con la API de Cloudinary.

### Funciones

#### `uploadImage(uri: string, folder?: string): Promise<string>`

Sube una imagen a Cloudinary.

```typescript
import { uploadImage } from "@/services/cloudinary";

const url = await uploadImage("file:///path/to/image.jpg", "pets/user123");
```

**Parámetros:**
| Nombre | Tipo | Requerido | Descripción |
|--------|------|-----------|-------------|
| `uri` | `string` | Sí | URI local de la imagen |
| `folder` | `string` | No | Carpeta destino en Cloudinary |

**Retorna:** `Promise<string>` - URL pública de la imagen

**Variables de entorno requeridas:**
- `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

---

## Animal Search Service

**Archivo:** `src/services/animalSearchService.ts`

Búsqueda de información animal usando SerpApi.

### Funciones

#### `searchAnimals(query: string): Promise<AnimalSearchResult[]>`

Busca información sobre animales.

```typescript
import { searchAnimals } from "@/services/animalSearchService";

const results = await searchAnimals("cuidados de perro labrador");
console.log(results);
// [{ title: "...", snippet: "...", link: "..." }, ...]
```

**Parámetros:**
| Nombre | Tipo | Requerido | Descripción |
|--------|------|-----------|-------------|
| `query` | `string` | Sí | Término de búsqueda |

**Retorna:** `Promise<AnimalSearchResult[]>`

**Características:**
- Debounce de 500ms para evitar llamadas excesivas
- Cache de resultados por 24 horas (AsyncStorage)
- Control de cuota: 100 búsquedas/día

---

#### `getAnimalTips(species: string): Promise<AnimalTip[]>`

Obtiene tips de cuidado para una especie.

```typescript
import { getAnimalTips } from "@/services/animalSearchService";

const tips = await getAnimalTips("Perro");
console.log(tips);
// [{ title: "...", content: "...", icon: "..." }, ...]
```

**Parámetros:**
| Nombre | Tipo | Requerido | Descripción |
|--------|------|-----------|-------------|
| `species` | `string` | Sí | Especie del animal |

**Retorna:** `Promise<AnimalTip[]>`

---

#### `getQuotaInfo(): Promise<QuotaInfo>`

Obtiene información sobre la cuota de búsquedas.

```typescript
import { getQuotaInfo } from "@/services/animalSearchService";

const quota = await getQuotaInfo();
console.log(quota);
// { used: 15, remaining: 85, total: 100 }
```

**Retorna:** `Promise<QuotaInfo>`

---

## Zustand Store

**Archivo:** `src/store/useAuthStore.ts`

Store de estado global para autenticación.

### Estado

```typescript
interface AuthState {
  user: User | null;           // Usuario autenticado
  isAuthenticated: boolean;    // ¿Hay sesión activa?
  isLoading: boolean;          // ¿Cargando inicialmente?
}
```

### Acciones

```typescript
interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}
```

### Uso

```typescript
import { useAuthStore } from "@/store/useAuthStore";

function MiComponente() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuthStore();

  if (isLoading) return <Loading />;

  if (!isAuthenticated) {
    return <LoginForm onSubmit={login} />;
  }

  return (
    <View>
      <Text>Hola, {user.displayName}</Text>
      <Button onPress={logout} title="Cerrar sesión" />
    </View>
  );
}
```

---

## 📝 Notas

1. **Todos los services** manejan errores con `try/catch` y lanzan excepciones
2. **Firebase Auth** maneja la sesión automáticamente
3. **Firestore** usa reglas de seguridad que verifican el UID del usuario
4. **Cloudinary** usa uploads unsigned (sin autenticación del servidor)
5. **SerpApi** tiene una cuota limitada (100/día en plan gratuito)
