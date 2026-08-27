import { create } from "zustand";
import {
  AuthUser,
  login as authLogin,
  register as authRegister,
  logout as authLogout,
  resetPassword as authResetPassword,
  onAuthChange,
} from "../services/authService";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  initialize: () => () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: () => {
    const unsubscribe = onAuthChange((user) => {
      set({ user, isInitialized: true, isLoading: false });
    });
    return unsubscribe;
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authLogin(email, password);
      set({ user, isLoading: false });
    } catch (error: any) {
      console.warn("[Auth] Login error:", error.code, error.message);
      const message = getFirebaseErrorMessage(error.code);
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  register: async (email, password, displayName) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authRegister(email, password, displayName);
      set({ user, isLoading: false });
    } catch (error: any) {
      console.warn("[Auth] Register error:", error.code, error.message);
      const message = getFirebaseErrorMessage(error.code);
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authLogout();
      set({ user: null, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  resetPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await authResetPassword(email);
      set({ isLoading: false });
    } catch (error: any) {
      const message = getFirebaseErrorMessage(error.code);
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

function getFirebaseErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    "auth/user-not-found": "No existe una cuenta con este email",
    "auth/wrong-password": "Contraseña incorrecta",
    "auth/email-already-in-use": "Este email ya está registrado",
    "auth/invalid-email": "Email no válido",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres",
    "auth/too-many-requests": "Demasiados intentos. Espera un momento",
    "auth/invalid-credential": "Email o contraseña incorrectos",
    "auth/network-request-failed": "Error de conexión. Verifica tu internet",
    "auth/operation-not-allowed": "Método no habilitado. Ve a Firebase Console → Authentication → Sign-in method y activa Email/Password",
    "auth/admin-restricted-operation": "Operación restringida. Activa Authentication en Firebase Console",
  };
  console.warn("[Auth] Error code:", code);
  return messages[code] ?? `Error: ${code}`;
}
