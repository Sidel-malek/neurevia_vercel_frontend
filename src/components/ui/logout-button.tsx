// components/ui/logout-button.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
  setIsLoading(true);
  try {
    const response = await fetch(`${apiUrl}/api/logout/`, {
      method: "POST",
      credentials: "include", // send the HttpOnly cookie
    });

    // regardless of response, backend should have deleted cookie
    router.push("/auth");
  } catch (error) {
    console.error("Logout error:", error);
    router.push("/auth");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      disabled={isLoading}
      className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-slate-900/50 group transition-colors"
    >
      <LogOut className="mr-2 h-4 w-4 group-hover:text-red-500 transition-colors" />
      <span>{isLoading ? "Logging out..." : "Logout"}</span>
    </Button>
  );
}