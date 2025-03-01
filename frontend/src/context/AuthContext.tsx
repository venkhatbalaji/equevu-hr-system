"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAdmin: boolean;
  login: (password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAdmin: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const adminSession = localStorage.getItem("admin_token");
    if (adminSession === "1") {
      setIsAdmin(true);
      router.push("/admin");
    }
  }, [router]);

  const login = (password: string) => {
    if (password === "admin123") {
      localStorage.setItem("admin_token", "1");
      setIsAdmin(true);
      router?.push("/admin");
    } else {
      alert("Invalid password");
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setIsAdmin(false);
    router?.push("/");
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
