// ============================================================
// Tipos de dominio — Huellitas
// Sincronizados con las colecciones de Firestore
// ============================================================

/** Perfil del usuario (colección 'users') */
export interface User {
  uid: string;            // ID de Firebase Auth
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: number;      // timestamp en ms
  updatedAt: number;
}

/** Mascota (colección 'pets') */
export interface Pet {
  id: string;             // auto-generado por Firestore
  ownerUid: string;       // → User.uid
  name: string;
  species: "Perro" | "Gato" | "Ave" | "Conejo" | "Otro";
  breed: string;
  age: number;
  description: string;
  tags: string[];
  photoURL?: string;      // foto principal (URL de Storage)
  createdAt: number;
  updatedAt: number;
}

/** Foto adicional de mascota (subcolección 'pets/{id}/photos') */
export interface PetPhoto {
  id: string;
  url: string;
  caption?: string;
  createdAt: number;
}

/** Favorito (colección 'favorites') */
export interface Favorite {
  id: string;
  userUid: string;        // → User.uid
  petId: string;          // → Pet.id
  createdAt: number;
}

// ============================================================
// Tipos auxiliares para formularios
// ============================================================

/** Datos para crear/actualizar una mascota (sin campos auto-generados) */
export type PetFormData = Omit<Pet, "id" | "ownerUid" | "createdAt" | "updatedAt">;
