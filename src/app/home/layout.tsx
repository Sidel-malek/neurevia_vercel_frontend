import Footer from "@/components/homeComponents/footer"
import Navbar from "@/components/homeComponents/Navbar"
import NeurolAnimation from "@/hook/NeurolAnimation"

// app/(homepage)/layout.tsx

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="homepage-layout">
      <Navbar/>
      {children}
      <Footer/>
    </div>
  )
}
