# 🗄 Base de Datos

Documentación completa de la estructura de Firestore, reglas de seguridad e índices.

---

## 📋 Índice

- [Visión General](#visión-general)
- [Colecciones](#colecciones)
- [Reglas de Seguridad](#reglas-de-seguridad)
- [Índices](#índices)
- [Consultas Comunes](#consultas-comunes)
- [Mantenimiento](#mantenimiento)

---

## Visión General

Huellitas usa **Cloud Firestore** como base de datos principal. Firestore es una base de datos NoSQL en la nube que se sincroniza en tiempo real entre el cliente y el servidor.

### Características

- **NoSQL**: Documentos y colecciones (no tablas)
- **En tiempo real**: Suscripciones a cambios
- **Offline-first**: Cache local automático
- **Reglas de seguridad**: Control de acceso a nivel de campo
- **Índices compuestos**: Para consultas complejas

### Configuración

- **Proyecto**: `huellitas-9477e`
- **Reglas**: `scripts/firestore.rules`
- **Índices**: `scripts/firestore.indexes.json`

---

## Colecciones

### 📁 users

Almacena los perfiles de los usuarios.

```
users/{uid}
├── uid: string                    // ID de Firebase Auth
├── displayName: string            // Nombre para mostrar
├── email: string                  // Email del usuario
├── photoURL: string | null        // URL de foto de perfil (Cloudinary)
├── createdAt: timestamp           // Fecha de creación
└── updatedAt: timestamp           // Última actualización
```

**Ejemplo de documento:**
```json
{
  "uid": "h0rFkHALi6PVDhlal76Dn0ewEys1",
  "displayName": "Juan Pérez",
  "email": "juan@email.com",
  "photoURL": "https://res.cloudinary.com/.../avatar.jpg",
  "createdAt": "2025-01-20T10:30:00Z",
  "updatedAt": "2025-01-20T15:45:00Z"
}
```

**Relaciones:**
- `users.uid` ← `pets.ownerUid` (1:N)
- `users.uid` ← `favorites.userUid` (1:N)

---

### 📁 pets

Almacena las mascotas de los usuarios.

```
pets/{petId}
├── id: string                     // ID auto-generado
├── ownerUid: string               // → users.uid
├── name: string                   // Nombre de la mascota
├── species: string                // "Perro" | "Gato" | "Ave" | "Conejo" | "Otro"
├── breed: string                  // Raza
├── age: number                    // Edad en años
├── description: string            // Descripción
├── tags: string[]                 // Etiquetas
├── photoURL: string | null        // Foto principal (Cloudinary)
├── createdAt: timestamp           // Fecha de creación
├── updatedAt: timestamp           // Última actualización
│
└── photos/{photoId}               // ← Subcolección
    ├── id: string                 // ID auto-generado
    ├── url: string                // URL de la foto
    ├── caption: string | null     // Descripción opcional
    └── createdAt: timestamp       // Fecha de creación
```

**Ejemplo de documento:**
```json
{
  "id": "abc123def456",
  "ownerUid": "h0rFkHALi6PVDhlal76Dn0ewEys1",
  "name": "Max",
  "species": "Perro",
  "breed": "Labrador Retriever",
  "age": 3,
  "description": "Perro muy juguetón y amigable",
  "tags": ["juguetón", "amigable", "entrenado"],
  "photoURL": "https://res.cloudinary.com/.../max.jpg",
  "createdAt": "2025-01-20T10:30:00Z",
  "updatedAt": "2025-01-20T15:45:00Z"
}
```

**Subcolección photos:**
```json
{
  "id": "photo789",
  "url": "https://res.cloudinary.com/.../max-parque.jpg",
  "caption": "Max en el parque",
  "createdAt": "2025-01-20T12:00:00Z"
}
```

**Relaciones:**
- `pets.ownerUid` → `users.uid` (N:1)
- `pets/photos` ← Subcolección de `pets` (1:N)

---

### 📁 favorites

Almacena los favoritos de los usuarios.

```
favorites/{favId}
├── id: string                     // ID auto-generado
├── userUid: string                // → users.uid
├── petId: string                  // → pets.id
└── createdAt: timestamp           // Fecha de creación
```

**Ejemplo de documento:**
```json
{
  "id": "fav123",
  "userUid": "h0rFkHALi6PVDhlal76Dn0ewEys1",
  "petId": "abc123def456",
  "createdAt": "2025-01-20T10:30:00Z"
}
```

**Relaciones:**
- `favorites.userUid` → `users.uid` (N:1)
- `favorites.petId` → `pets.id` (N:1)

---

## Reglas de Seguridad

### Archivo: `scripts/firestore.rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ============================================================
    // USERS — cada usuario solo lee/escribe su propio perfil
    // ============================================================
    match /users/{uid} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == uid;
      allow update: if request.auth != null && request.auth.uid == uid;
      allow delete: if false; // no se borran perfiles
    }

    // ============================================================
    // PETS — el dueño tiene control total; otros pueden leer
    // ============================================================
    match /pets/{petId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null
                    && request.resource.data.ownerUid == request.auth.uid;
      allow update: if request.auth != null
                    && resource.data.ownerUid == request.auth.uid;
      allow delete: if request.auth != null
                    && resource.data.ownerUid == request.auth.uid;

      // Subcolección de fotos adicionales
      match /photos/{photoId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null
                     && get(/databases/$(database)/documents/pets/$(petId)).data.ownerUid == request.auth.uid;
      }
    }

    // ============================================================
    // FAVORITES — cada usuario gestiona sus favoritos
    // ============================================================
    match /favorites/{favId} {
      allow read: if request.auth != null
                  && resource.data.userUid == request.auth.uid;
      allow create: if request.auth != null
                    && request.resource.data.userUid == request.auth.uid;
      allow delete: if request.auth != null
                    && resource.data.userUid == request.auth.uid;
    }
  }
}
```

### Resumen de Permisos

| Operación | users | pets | pets/photos | favorites |
|-----------|-------|------|-------------|-----------|
| **Leer** | Auth required | Auth required | Auth required | Solo propio |
| **Crear** | Solo propio uid | Solo ownerUid | Solo owner | Solo propio |
| **Actualizar** | Solo propio uid | Solo ownerUid | Solo owner | ❌ No |
| **Eliminar** | ❌ No | Solo ownerUid | Solo owner | Solo propio |

### Despliegue

```bash
# Instalar Firebase CLI (si no lo tienes)
npm install -g firebase-tools

# Login
firebase login

# Desplegar reglas
firebase deploy --only firestore:rules
```

---

## Índices

### Archivo: `scripts/firestore.indexes.json`

```json
{
  "indexes": [
    {
      "collectionGroup": "pets",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "ownerUid", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

### Índices Configurados

| Colección | Campos | Orden | Propósito |
|-----------|--------|-------|-----------|
| `pets` | `ownerUid` ASC, `createdAt` DESC | Ascendente, Descendente | Obtener mascotas de un usuario ordenadas por fecha |

### Despliegue

```bash
firebase deploy --only firestore:indexes
```

---

## Consultas Comunes

### Obtener perfil de usuario

```typescript
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

const userDoc = await getDoc(doc(db, "users", uid));
if (userDoc.exists()) {
  const user = userDoc.data();
}
```

### Obtener mascotas de un usuario

```typescript
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

const q = query(
  collection(db, "pets"),
  where("ownerUid", "==", userUid),
  orderBy("createdAt", "desc")
);

const snapshot = await getDocs(q);
const pets = snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));
```

### Obtener mascota por ID

```typescript
import { doc, getDoc } from "firebase/firestore";

const petDoc = await getDoc(doc(db, "pets", petId));
if (petDoc.exists()) {
  const pet = { id: petDoc.id, ...petDoc.data() };
}
```

### Crear mascota

```typescript
import { collection, addDoc, Timestamp } from "firebase/firestore";

const docRef = await addDoc(collection(db, "pets"), {
  ownerUid: user.uid,
  name: "Max",
  species: "Perro",
  breed: "Labrador",
  age: 3,
  description: "Perro juguetón",
  tags: ["amigable"],
  photoURL: null,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
});

console.log("Mascota creada:", docRef.id);
```

### Actualizar mascota

```typescript
import { doc, updateDoc, Timestamp } from "firebase/firestore";

await updateDoc(doc(db, "pets", petId), {
  name: "Max Actualizado",
  age: 4,
  updatedAt: Timestamp.now(),
});
```

### Eliminar mascota

```typescript
import { doc, deleteDoc } from "firebase/firestore";

await deleteDoc(doc(db, "pets", petId));
```

### Crear/Actualizar perfil de usuario (upsert)

```typescript
import { doc, setDoc, Timestamp } from "firebase/firestore";

// Crea si no existe, actualiza si existe (merge)
await setDoc(doc(db, "users", uid), {
  uid,
  displayName,
  email,
  photoURL: photoURL || null,
  updatedAt: Timestamp.now(),
}, { merge: true });
```

---

## Mantenimiento

### Backup de Datos

```bash
# Exportar datos (requiere gcloud CLI)
gcloud firestore export gs://huellitas-9477e-backup/$(date +%Y%m%d)
```

### Limpiar Datos de Prueba

```bash
# Desde Firebase Console
# 1. Ir a Firestore Database
# 2. Seleccionar colección
# 3. Eliminar documentos manualmente
# O usar scripts de limpieza (ver scripts/cleanup.js)
```

### Monitoreo

- **Firebase Console**: https://console.firebase.google.com/project/huellitas-9477e/firestore
- **Métricas**: Lecturas, escrituras, eliminaciones
- **Costos**: Revisar en Firebase Console → Usage

### Costos Estimados

| Operación | Costo |
|-----------|-------|
| Lectura | $0.06 / 100,000 |
| Escritura | $0.18 / 100,000 |
| Eliminación | $0.02 / 100,000 |
| Almacenamiento | $0.18 / GB / mes |

**Nota:** Firestore tiene un tier gratuito generoso:
- 50,000 lecturas/día
- 20,000 escrituras/día
- 1 GB de almacenamiento

---

## 📝 Notas

1. **Timestamps**: Siempre usar `Timestamp.now()` de Firestore, no `Date.now()` de JavaScript
2. **IDs**: Firestore genera IDs automáticamente con `addDoc`
3. **Subcolecciones**: `photos` es una subcolección de `pets`, no una colección separada
4. **Reglas**: Cada operación verifica `request.auth.uid` para seguridad
5. **Índices**: Se crean automáticamente al ejecutar consultas con múltiples `where`
