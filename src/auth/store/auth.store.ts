import { create } from "zustand";
import { loginAction } from "../actions/login.action";
import type { User } from "@/interfaces/user.interface";
import { checkAuthAction } from "../actions/check-auth.action";
import { registerAction } from "../actions/register.action";

type AuthStatus = "authenticated" | "not-authenticated" | "checking";

type AuthState = {
  //Properties
  user: User | null;
  token: string | null;
  authStatus: AuthStatus;

  //Getters
  isAdmin: () => boolean;

  //Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
  register: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<boolean>;
};

// Aqui creo el store y se manda como input de la funcion

export const useAuthStore = create<AuthState>()((set, get) => ({
  //Implementación del store

  user: null,
  token: null,
  authStatus: "checking",

  //Getters
  isAdmin: () => {
    const roles = get().user?.roles || [];
    return roles.includes("admin");
  },

  //Actions
  login: async (email: string, password: string) => {
    try {
      const data = await loginAction(email, password);
      localStorage.setItem("token", data.token);
      console.log("Todo salio bien:", { email, password });
      set({ user: data.user, token: data.token, authStatus: "authenticated" });
      return true;
    } catch (error) {
      localStorage.removeItem("token");
      console.log(error);

      set({ user: null, token: null, authStatus: "not-authenticated" });
      return false;
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, authStatus: "not-authenticated" });
  },

  checkAuthStatus: async () => {
    try {
      // estoy porque hay user y token sino falla
      const { user, token } = await checkAuthAction();
      set({
        user: user,
        token: token,
        authStatus: "authenticated",
      });

      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      set({
        user: undefined,
        token: undefined,
        authStatus: "not-authenticated",
      });
      return false;
    }
  },

  register: async (email: string, password: string, fullName: string) => {
    try {
      const data = await registerAction(email, password, fullName);
      localStorage.setItem("token", data.token);
      console.log("Registrado:", { email, password, fullName });
      set({ user: data.user, token: data.token, authStatus: "authenticated" });
      return true;
    } catch (error) {
      localStorage.removeItem("token");
      console.log(error);

      set({ user: null, token: null, authStatus: "not-authenticated" });
      return false;
    }
  },
}));
