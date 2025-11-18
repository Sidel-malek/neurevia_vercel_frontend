'use client'; // Si tu es avec Next.js 13/14 (App Router)
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // ou 'next/navigation' si App Router
import Navbar from '@/components/homeComponents/Navbar';
export default function IntroPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/home'); // Redirection après 3 secondes
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div>
      <div className="flex items-center justify-center h-screen bg-white">
      <div className="animate-bounce text-blue-600 text-5xl font-bold">Neurev</div>
      <div className="animate-bounce text-gray-800 text-5xl font-bold"> IA </div>
      </div>
    </div>
    
  );
}
