// import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import Cookies from "js-cookie";
// import { useRouter, usePathname } from "next/navigation";
// import { useDispatch } from "react-redux";
// import { setUserData } from "@/services/authSlice";

// interface AuthContextType {
//   isAuthenticated: boolean;
//   login: (token: string, userData: UserData) => void;
//   logout: () => void;
//   userData: UserData | null;
// }

// interface UserData {
//   userName: string;
//   email: string;
//   fullName: string;
//   typeOfUser: string;
//   createdAt: string;
//   lastLoginTime: string;
// }

// const AuthContextNormal = createContext<AuthContextType | undefined>(undefined);

// export function AuthProviderNormal({ children }: { children: ReactNode }) {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [userData, setUserDataState] = useState<UserData | null>(null);
//   const router = useRouter();
//   const pathname = usePathname();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const token = Cookies.get("auth-token");
//     const storedUserData = Cookies.get("user-data");
//     setIsAuthenticated(!!token);
//     setUserDataState(storedUserData ? JSON.parse(storedUserData) : null);
//   }, []);

//   const login = (token: string, userData: UserData) => {
//     // Guardar token y datos del usuario en cookies
//     Cookies.set("auth-token", token, { expires: new Date(Date.now() + 30 * 60 * 1000) });
//     Cookies.set("user-data", JSON.stringify(userData), { expires: new Date(Date.now() + 30 * 60 * 1000) });
    
//     // Actualizar estado de autenticación
//     setIsAuthenticated(true);
//     setUserDataState(userData);
    
//     // Guardar datos del usuario en Redux

//     // Redirigir al usuario
//     router.push("/companies");
//   };

//   const logout = () => {
//     Cookies.remove("auth-token");
//     Cookies.remove("user-data");
//     setIsAuthenticated(false);
//     setUserDataState(null);
//     router.push("/login");
//   };

//   return (
//     <AuthContextNormal.Provider value={{ isAuthenticated, login, logout, userData }}>
//       {children}
//     </AuthContextNormal.Provider>
//   );
// }

// export function useAuthNormal() {
//   const context = useContext(AuthContextNormal);
//   if (!context) {
//     throw new Error("useAuth debe ser usado dentro de un AuthProvider");
//   }
//   return context;
// }
