import { tesloApi } from "@/api/tesloApi";
import type { AuthResponse } from "../interfaces/auth.response";

export const checkAuthAction = async (): Promise<AuthResponse> => {
  const token = localStorage.getItem("token");

  if (!token) throw new Error("No token found");

  try {
    const { data } = await tesloApi.get<AuthResponse>("/auth/check-status");
    //acuerdese que Axios le agrega el token en el interceptor

    localStorage.setItem("token", data.token);
    return data;
  } catch (error) {
    localStorage.removeItem("token");
    throw new Error("Failed to authenticate");
    console.log(error);
  }
};
