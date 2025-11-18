'use client'
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import Image from "next/image"

interface NavbarProps {
  transparent?: boolean;
}


const Navbar = ({ transparent = false }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navbarClass = `sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || !transparent ? "bg-white shadow-md" : "bg-white/50"}`;
  const textClass = isScrolled || !transparent ? "text-gray-800" : "text-white";
  const pathname = usePathname();
  return (
    <nav className={navbarClass}>
      <div className="container mx-auto px-6  flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center  ">
          <Link href="/" className="flex items-center">
            <div className="relative h-16 w-16 mr-3">
                <Image
                    src="/images/neurevia__.png"
                    alt="Brain illustration"
                    width={80}
                    height={80}
                    className="object-contain"
                />
            </div>
            <span className={`text-2xl font-bold  ${isScrolled || !transparent ? "text-primary" : "text-white"}`}>Neurev</span>
            <span className={`text-2xl font-bold  ${textClass}`}>IA</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/home"
            className={` transition-colors ${pathname === '/home' ? 'text-blue-600 ' : `${textClass} hover:text-blue-600`}`}
          >
            Home
          </Link>
          <Link
            href="/home/howItWorks"
            className={` transition-colors ${pathname === '/home/howItWorks' ? 'text-blue-600 ' : `${textClass}  hover:text-blue-600`}`}
          >
            How it Works
          </Link>
          <Link
            href="/home/aboutUs"
            className={` transition-colors ${pathname === '/home/aboutUs' ? 'text-blue-600 ' : `${textClass}  hover:text-blue-600`}`}
          >
            About
          </Link>
          <Link
            href="/home/pricing"
            className={` transition-colors ${pathname === '/home/pricing' ? 'text-blue-600 ' : `${textClass}  hover:text-blue-600`}`}
          >
            Pricing
          </Link>
          <Link
            href="/home/blog"
            className={` transition-colors ${pathname === '/home/blog' ? 'text-blue-600 ' : `${textClass}  hover:text-blue-600 `}`}
          >
            Blog
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
         <Link href= "/auth">
          <Button
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white h-10 w-20"
          >
            Login
          </Button>
         </Link>

        <Link href= "/auth?mode=register" >
          <Button className="bg-blue-600 text-white hover:bg-blue-700 h-10 w-20">
          Sign Up
          </Button>
        </Link>
        </div>



        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className={`${textClass} focus:outline-none`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="flex flex-col px-4 py-6 space-y-4">
            <Link
              href="/home"
              className="text-gray-800 hover:text-blue-600 transition-colors"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <Link
              href="#services"
              className="text-gray-800 hover:text-blue-600 transition-colors"
              onClick={toggleMobileMenu}
            >
              Services
            </Link>
            <Link
              href="/aboutUs"
              className="text-gray-800 hover:text-blue-600 transition-colors"
              onClick={toggleMobileMenu}
            >
              About Us
            </Link>
            <Link
              href="#contact"
              className="text-gray-800 hover:text-blue-600 transition-colors"
              onClick={toggleMobileMenu}
            >
              Contact
            </Link>
            <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
             <Link href= "/auth">
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white w-full"
              >
                Login
              </Button>
             </Link>
             <Link href= "/auth?mode=register" >
              <Button className="bg-blue-600 text-white hover:bg-blue-700 w-full">
                Sign Up
              </Button>
             </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
