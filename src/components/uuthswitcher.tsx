'use client';

import { useState } from "react";
import RegisterForm from "./register-form";
import LoginForm from "./login-form";

interface AuthSwitcherProps {
  setIsAnimated: (value: boolean) => void;
}


export default function AuthSwitcher({ setIsAnimated }: AuthSwitcherProps) {
  const [mode, setMode] = useState<"register" | "login">("register");

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setMode("login")}
          className={`px-4 py-2 rounded ${mode === "login" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Sign In
        </button>
        <button
          onClick={() => setMode("register")}
          className={`px-4 py-2 rounded ${mode === "register" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Sign Up
        </button>
      </div>

      {mode === "register" ? <RegisterForm setIsAnimated={setIsAnimated} /> : 
        <LoginForm setIsAnimated={setIsAnimated} />}
    </div>
  );
}
