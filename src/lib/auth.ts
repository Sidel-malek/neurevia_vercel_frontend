// lib/auth.ts
export class AuthService {
  private readonly  apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
;

  async login(credentials: { username: string; password: string }): Promise<{ success: boolean; data?: any }> {
    try {
      const response = await fetch(`${this.apiUrl}/api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // IMPORTANT: pour envoyer/recevoir les cookies
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      return response.ok ? { success: true, data } : { success: false, data };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        data: { error: "Network error. Please check your connection." },
      };
    }
  }

  // Retourne un objet { authenticated: boolean, user?: any }
  async checkAuth(): Promise<{ authenticated: boolean; user?: any }> {
    try {
      const response = await fetch(`${this.apiUrl}/api/check-auth/`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) return { authenticated: false };

      const data = await response.json();
      // Si l'API renvoie déjà { authenticated, user }, on renvoie tel quel.
      if (data && typeof data === "object" && "authenticated" in data) {
        return data;
      }
      // Sinon on suppose que la réponse est les infos user => authenticated true
      return { authenticated: true, user: data };
    } catch (error) {
      console.error("checkAuth error:", error);
      return { authenticated: false };
    }
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${this.apiUrl}/api/logout/`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.clearClientSideData();
    }
  }

  private clearClientSideData(): void {
    sessionStorage.removeItem("user");
    localStorage.removeItem("user_preferences");
  }
}

export const authService = new AuthService();
