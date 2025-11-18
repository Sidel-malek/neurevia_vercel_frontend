import 'tailwindcss'
import Link from "next/link"
import { Button } from "@/components/ui/button"

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="mx-4 md:mx-12 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center font-bold text-xl">
            <span className="text-primary">Neurev</span>
            <span>IA</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/home" className="text-sm font-medium">
              Home
            </Link>
            <Link href="#services" className="text-sm font-medium">
              Services We Do
            </Link>
            <Link href="#contact" className="text-sm font-medium">
              Contact Us
            </Link>
            <Link href="/aboutUs" className="text-sm font-medium">
              About Us
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium">
            Login
          </Link>
          <Button size="sm" className='text-white'>Sign Up</Button>
        </div>
      </div>
    </header>
  )
}

export default Header;
