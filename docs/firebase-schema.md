# Huellitas — Esquema de Firestore

## Estructura de colecciones

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

## Storage (Cloudinary)

Las fotos se almacenan en Cloudinary (25GB gratis, sin tarjeta).

```
Cloudinary: huellitas/pets/{ownerUid}/{petId}/
├── photo_123_abc.jpg   (foto principal)
└── photo_456_def.jpg   (fotos adicionales)
```

Credenciales en .env:
```
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=...
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=huellitas_unsigned
```

## Relaciones

| Relación | Tipo | Descripción |
|----------|------|-------------|
| users → pets | 1:N | Un usuario tiene muchas mascotas |
| pets → photos | 1:N | Una mascota tiene muchas fotos |
| users ↔ favorites ↔ pets | M:N | Favoritos muchos a muchos |

## Reglas de seguridad (RLS)

| Operación | Colección | Regla |
|-----------|-----------|-------|
| Leer | users | Cualquier autenticado |
| Escribir | users | Solo el propio uid |
| Leer | pets | Cualquier autenticado |
| CRUD | pets | Solo el ownerUid |
| CRUD | favorites | Solo el userUid |
| Leer | storage | Cualquier autenticado |
| Subir/Borrar storage | Solo el ownerUid |

## Cómo desplegar las reglas

```bash
# Instalar Firebase CLI (si no lo tienes)
npm install -g firebase-tools

# Login
firebase login

# Inicializar en el proyecto
firebase init

# Desplegar reglas
firebase deploy --only firestore:rules
firebase deploy --only storage
```

## Seed data (opcional)

Para probar desde el dashboard de Firebase:
1. Crear un usuario con Auth (email/password)
2. Copiar su UID
3. Crear documento en `users/{uid}`
4. Crear mascotas en `pets/` con `ownerUid` = ese UID
