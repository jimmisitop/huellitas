import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { User } from "../types";

const USERS_COLLECTION = "users";

function toUser(docSnap: any): User {
  const data = docSnap.data();
  return {
    uid: docSnap.id,
    displayName: data.displayName,
    email: data.email,
    photoURL: data.photoURL,
    createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
    updatedAt: data.updatedAt?.toMillis?.() ?? Date.now(),
  };
}

/** Crear o actualizar perfil de usuario (upsert) */
export async function upsertUser(user: {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
}): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, user.uid);
  const existing = await getDoc(docRef);

  if (existing.exists()) {
    await updateDoc(docRef, {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL ?? null,
      updatedAt: Timestamp.now(),
    });
  } else {
    const now = Timestamp.now();
    await setDoc(docRef, {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }
}


export async function getUserByUid(uid: string): Promise<User | null> {
  const docSnap = await getDoc(doc(db, USERS_COLLECTION, uid));
  if (!docSnap.exists()) return null;
  return toUser(docSnap);
}

/** Actualizar perfil. Crea el doc si no existe (merge). */
export async function updateUserProfile(
  uid: string,
  data: { displayName?: string; photoURL?: string },
): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, uid);
  // Filtrar valores undefined para no sobrescribir campos existentes con null
  const updateData: Record<string, any> = {
    updatedAt: Timestamp.now(),
  };
  if (data.displayName !== undefined) {
    updateData.displayName = data.displayName;
  }
  if (data.photoURL !== undefined) {
    updateData.photoURL = data.photoURL;
  }
  // setDoc con merge: true crea el doc si no existe, o mergea si ya existe
  await setDoc(docRef, updateData, { merge: true });
}
