import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Linkedin, Mail } from "lucide-react"
import Image from "next/image"

const teamMembers = [
  {
    name: "Bekhoucha Wafaa Fatima",
    role: "Co-Founder",
    description:
      "AI enthusiast and co-founder of Neurevia, currently pursuing a Master's degree at ESI Sidi Bel Abbès. Focused on the application of deep learning in early detection of neurodegenerative diseases.",
    avatar: "/images/malek.jpeg",
  },
  {
    name: "Sid el Mrabet Malek Aya",
    role: "Co-Founder",
    description:
      "Co-founder of Neurevia and Master's student at ESI SBA, with a strong interest in applying AI to healthcare diagnostics, particularly in neuroimaging.",
    avatar: "/images/malek.jpeg",
  },
  {
    name: "Rabab Bousmaha",
    role: "Academic Supervisor",
    description:
      "Professor and researcher at ESI Sidi Bel Abbès, supervising Neurevia under the legal framework of ministerial resolution 1275. Expert in applied AI and medical data analysis.",
    avatar: "/images/malek.jpeg",
  },
]

export default function TeamSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-4">
            <Badge variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700">
              Leadership
            </Badge>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Leadership Team</h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
            NeurevIA is led by a multidisciplinary team of experts in neurology, artificial intelligence, and healthcare
            technology.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2"
            >
              <CardContent className="p-8 text-center">
                {/* Avatar */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 p-1">
                  <Image
                      src={member.avatar || "/placeholder.svg"}
                      alt={member.name}
                      width={200}  // Largeur fixe
                      height={200} // Hauteur fixe
                      className="w-full h-full rounded-full object-cover bg-gray-100"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                </div>

                {/* Name and Role */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                    {member.role}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-6 text-sm">{member.description}</p>

                {/* Social Links */}
                <div className="flex justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  )
}
