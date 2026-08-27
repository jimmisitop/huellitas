import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "./firebase";
import { upsertUser } from "./userService";

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
}

function firebaseUserToAuthUser(user: FirebaseUser): AuthUser {
  return {
    uid: user.uid,
    email: user.email ?? "",
    displayName: user.displayName ?? "",
    photoURL: user.photoURL,
  };
}

/** Registrar nuevo usuario. Crea Auth + documento en Firestore. */
export async function register(
  email: string,
  password: string,
  displayName: string,
): Promise<AuthUser> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  // Actualizar el nombre de perfil en Firebase Auth
  await updateProfile(credential.user, { displayName });

  // Crear documento en Firestore
  await upsertUser({
    uid: credential.user.uid,
    displayName,
    email,
  });

  return firebaseUserToAuthUser(credential.user);
}

/** Iniciar sesión. */
export async function login(
  email: string,
  password: string,
): Promise<AuthUser> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return firebaseUserToAuthUser(credential.user);
}


export async function logout(): Promise<void> {
  await signOut(auth);
}


export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

/** Suscribirse a cambios de sesión. Retorna unsubscribe. */
export function onAuthChange(callback: (user: AuthUser | null) => void): () => void {
  return onAuthStateChanged(auth, (firebaseUser) => {
    callback(firebaseUser ? firebaseUserToAuthUser(firebaseUser) : null);
  });
}
