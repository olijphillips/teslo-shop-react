import { useAuthStore } from "@/auth/store/auth.store";
import type { PropsWithChildren } from "react";
import { Navigate } from "react-router";

export const AuthenticatedRouted = ({ children }: PropsWithChildren) => {
  const { authStatus } = useAuthStore();

  if (authStatus === "checking") return null; //aqui no regreso ninguna ruta

  if (authStatus === "not-authenticated") return <Navigate to="/auth/login" />;

  return children;
};
export const NotAuthenticatedRouted = ({ children }: PropsWithChildren) => {
  const { authStatus } = useAuthStore();

  if (authStatus === "checking") return null; //aqui no regreso ninguna ruta

  if (authStatus === "authenticated") return <Navigate to="/" />; // va pal home

  return children;
};

export const AdminRoute = ({ children }: PropsWithChildren) => {
  const { authStatus, isAdmin } = useAuthStore();

  if (authStatus === "checking") return null; //aqui no regreso ninguna ruta

  if (authStatus === "not-authenticated") return <Navigate to="/auth/login" />; // va pal login

  if (!isAdmin()) return <Navigate to="/" />; // esto por si quiere entrar por el URL

  return children; // y si esta autenticado y es admin lo dejamos pasar. Implicito router pasa a la pagina de admin
};
