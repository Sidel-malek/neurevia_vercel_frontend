// hooks/useAuth.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth";

type AuthState = {
  isAuthenticated: boolean | null;
  user: any | null;
  loading: boolean;
};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: null,
    user: null,
    loading: true,
  });

  const router = useRouter();

  useEffect(() => {
    (async () => {
      await checkAuth();
    })();
  }, []);

  const checkAuth = async () => {
    const result = await authService.checkAuth();
    setAuthState({
      isAuthenticated: result.authenticated,
      user: result.user || null,
      loading: false,
    });
    return result.authenticated;
  };

  const login = async (credentials: { username: string; password: string }) => {
    const result = await authService.login(credentials);
    if (result.success) {
      setAuthState({
        isAuthenticated: true,
        user: result.data,
        loading: false,
      });
      // optionnel : stocker user en session si tu veux persist
      sessionStorage.setItem("user", JSON.stringify(result.data));
    } else {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    }
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setAuthState({ isAuthenticated: false, user: null, loading: false });
    router.push("/auth");
  };

  return {
    ...authState,
    login,
    logout,
    checkAuth,
  };
}
