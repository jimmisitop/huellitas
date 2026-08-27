import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Pet, PetFormData } from "../types";

const PETS_COLLECTION = "pets";

function toPet(docSnap: any): Pet {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ownerUid: data.ownerUid,
    name: data.name,
    species: data.species,
    breed: data.breed,
    age: data.age,
    description: data.description,
    tags: data.tags ?? [],
    photoURL: data.photoURL,
    createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
    updatedAt: data.updatedAt?.toMillis?.() ?? Date.now(),
  };
}

/** Crear una mascota nueva */
export async function createPet(ownerUid: string, data: PetFormData): Promise<string> {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, PETS_COLLECTION), {
    ownerUid,
    name: data.name,
    species: data.species,
    breed: data.breed,
    age: data.age,
    description: data.description,
    tags: data.tags,
    photoURL: data.photoURL ?? null,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
}


export async function getPetsByUser(ownerUid: string): Promise<Pet[]> {
  const q = query(
    collection(db, PETS_COLLECTION),
    where("ownerUid", "==", ownerUid),
    orderBy("createdAt", "desc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(toPet);
}


export async function getPetById(petId: string): Promise<Pet | null> {
  const docSnap = await getDoc(doc(db, PETS_COLLECTION, petId));
  if (!docSnap.exists()) return null;
  return toPet(docSnap);
}


export async function updatePet(petId: string, data: Partial<PetFormData>): Promise<void> {
  const docRef = doc(db, PETS_COLLECTION, petId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}


export async function deletePet(petId: string): Promise<void> {
  await deleteDoc(doc(db, PETS_COLLECTION, petId));
}
