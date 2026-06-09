import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import useInactivity from "../hooks/useInactivity";
import Inactividad from "@/components/ui/Modals/Inactividad";
import { logoutBackend } from "@/app/login/services/logout";
import { refreshAuthToken } from "@/lib/services/refreshToken";
import SessionTerminatedModal from "@/components/ui/Modals/SessionTerminatedModal";
import { reactivateUser } from "../services/download/downAction";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, userData: UserData) => void;
  logout: () => void;
  logoutInactividad: () => void;
  userData: UserData | null;
}


interface UserData {
  userName: string;
  email: string;
  fullName: string;
  typeOfUser: string;
  createdAt: string;
  lastLoginTime: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AppProvider({ children }: { readonly children: ReactNode }) {
  // Local states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  // Modal de sesión terminada
  const [sessionTerminatedModalOpen, setSessionTerminatedModalOpen] = useState(false);
  const [isUserInactive, setIsUserInactive] = useState(false);
  // Router para redireccionar al usuario al hacer logout y referencia para evitar múltiples llamadas a logout
  const router = useRouter();
  const isLoggingOutRef = useRef(false);

  // para verificar si hay datos de usuario en localStorage al cargar la aplicación y controlar los warning
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    const currentPath = window.location.pathname;

    // Si la ruta contiene "login", no mostramos el warning
    if (currentPath.toLowerCase().includes("/login")) {
      setIsAuthenticated(false);
      setUserData(null);
      return;
    }

    if (storedUserData && storedUserData !== "undefined") {
      try {
        const parsedData = JSON.parse(storedUserData);
        setIsAuthenticated(true);
        setUserData(parsedData);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        setIsAuthenticated(false);
        setUserData(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserData(null);
    }
  }, []);  

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
  
    if (storedUserData && storedUserData !== "undefined") {
      try {
        const parsedData = JSON.parse(storedUserData);
        setIsAuthenticated(true);
        setUserData(parsedData);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        setIsAuthenticated(false);
        setUserData(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserData(null);
    }
  }, []);

  const login = (token: string, userData: UserData) => {
    Cookies.set("auth-token", token, { expires: 1 }); // Guardar token en las cookies durante 24 horas / día
    Cookies.set("user-data", JSON.stringify(userData), { expires: 1 }); // Guardar datos del usuario en las cookies durante 24 horas / 1 día
    setIsAuthenticated(true);
    setUserData(userData);
  };

  const logout = useCallback(async () => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    try {
      await logoutBackend(true);
    } catch (error) {
      console.error("Error en logoutBackend:", error);
    }

    Object.keys(Cookies.get()).forEach((cookieName) => Cookies.remove(cookieName));
    localStorage.removeItem("userData"); // Limpiar datos del usuario
    localStorage.setItem("force-logout", "true");

    setIsAuthenticated(false);
    setUserData(null);
  
    window.location.replace("/login");
  }, [router]);


  const logoutInactividad = async () => {
    console.log("Ejecutando logout por inactividad...");

    try {
      await logoutBackend(false);
    } catch (error) {
      console.error("Error en logoutBackend:", error);
    }

    Object.keys(Cookies.get()).forEach((cookieName) => Cookies.remove(cookieName));
    localStorage.removeItem("userData");
    localStorage.setItem("force-logout", "true");

    setIsAuthenticated(false);
    setUserData(null);

    window.location.replace("/login");
  };

  useInactivity(
    () => {
      setIsWarningVisible(true); // Muestra advertencia a los 14 minutos
      setTimeout(() => {
        setIsUserInactive(true); // Usuario inactivo después de 10 min
      }, 600000 - 840000); // Se ejecuta 10 min después del inicio
    },
    840000, // 14 minutos
    [
      "/login",
      "/login/admin",
      "/recuperar-contrasenia/nueva-contrasenia",
      "/recuperar-contrasenia-user/nueva-contrasenia",
    ]
  );
  

  const refrreshToken = async () => {
    await refreshAuthToken();
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshAuthToken();
    }, 2100000); 

    return () => clearInterval(intervalId);
  }, []);

  // Interceptor de fetch que revisa respuestas 401
  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      
      // Si la respuesta es 401 y no estamos en proceso de logout...
      if (response.status === 401 && !isLoggingOutRef.current) {
        const currentPath = window.location.pathname;

        // Si NO estamos en una página de login, mostramos el modal de sesión terminada
        if (!currentPath.startsWith("/login")) {
          setSessionTerminatedModalOpen(true);
          return Promise.reject(new Error("Unauthorized"));
        }
      }
      return response;
    };
  
    return () => {
      window.fetch = originalFetch; // Restauramos fetch original
    };
  }, [logout]);
  
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "force-logout" && event.newValue === "true") {
        logout();
      }
    };
  
    window.addEventListener("storage", handleStorageChange);
  
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [logout]);
    
  
  useEffect(() => {
    const handleUserActivity = async () => {
      if (isUserInactive) {
        console.log("Reactivando usuario...");
        await reactivateUser();
        setIsUserInactive(false); // Reseteamos el estado de inactividad
      }
    };
  
    // Escuchar clics y movimientos del mouse
    window.addEventListener("click", handleUserActivity);
  
    return () => {
      window.removeEventListener("click", handleUserActivity);
    };
  }, [isUserInactive]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userData, logoutInactividad }}>
      {children}
      <Inactividad
        refresh={refrreshToken}
        open={isWarningVisible}
        setOpen={setIsWarningVisible}
        onConfirm={() => setIsWarningVisible(false)}
        onTimeout={logoutInactividad}
      />
      {/* Modal de sesión terminada */}
      <SessionTerminatedModal
        open={sessionTerminatedModalOpen}
        onClose={() => {
          setSessionTerminatedModalOpen(false);
          logout();
        }}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
}