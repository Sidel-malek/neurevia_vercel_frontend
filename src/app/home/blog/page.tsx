"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, Search, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NeurolAnimation from "@/hook/NeurolAnimation"

export default function BlogPage() {
  // Animation on scroll
  const [isVisible, setIsVisible] = useState({
    hero: false,
    featured: false,
    articles: false,
    newsletter: false,
  })

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "featured", "articles", "newsletter"]
      sections.forEach((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= window.innerHeight * 0.75) {
            setIsVisible((prev) => ({ ...prev, [section]: true }))
          }
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    // Initial check
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Blog posts data
  const featuredPosts = [
    {
      id: 1,
      title: "Computer‑aided diagnosis of Alzheimer’s disease and neurocognitive disorders with multimodal Bi‑Vision Transformer (BiViT)",
      excerpt:
        "Our research team has developed a new convolutional neural network that can detect subtle changes in brain structure up to 8 years before clinical symptoms appear.",
      image: "/images/Pathologies-vieillissement-demences-vasculaires-700x465-1.jpg",
      date: "August 2, 2023",
      author: "S. Muhammad Ahmed Hassan Shah et al",
      category: "Research",
      tags: ["Vision transformers" , "Deep learning" , "Computer vision", "Medical image processing" , "Alzheimer disease", "Cognitive disorders"],
    },
    {
      id: 2,
      title: " The effects of machine learning algorithms in magnetic resonance imaging (MRI), and biomarkers on early detection of Alzheimer’s disease",
      excerpt:
        "A novel approach that integrates voice analysis, gait patterns, and neuroimaging data to predict Parkinson's disease with unprecedented accuracy.",
      image: "/images/AdobeStock_1023879568-scaled.jpeg",
      date: "April 18, 2025",
      author: "Dr. Michael Chen",
      category: "Technology",
      tags: ["Parkinson's", "Machine Learning", "Biomarkers"],
    },
  ]

  const blogPosts = [
    {
      id: 3,
      title: " Deep learning for Alzheimer prediction using brain biomarkers",
      excerpt:
        "How attention-based transformer architectures are revolutionizing the analysis of temporal changes in brain MRI sequences for neurodegenerative disease monitoring.",
      image: "/placeholder.svg?height=300&width=400",
      date: "April 10, 2025",
      author: "Nitika Goenka & Shamik Tiwari",
      category: "Technology",
      tags: ["Neuroimaging" ," Alzheimer disease" , "Deep learning" , "Convolutional networks"],
    },
    {
      id: 4,
      title: "Explainable AI: Making Neural Network Decisions Transparent in Medical Diagnosis",
      excerpt:
        "New techniques for interpreting complex neural network decisions are helping neurologists understand and trust AI-assisted diagnoses of neurodegenerative conditions.",
      image: "/placeholder.svg?height=300&width=400",
      date: "April 5, 2025",
      author: "James Wilson",
      category: "AI Ethics",
      tags: ["Explainable AI", "Medical Ethics", "Neural Networks"],
    },
    {
      id: 5,
      title: "Digital Biomarkers: Smartphone-Based Early Detection of Cognitive Decline",
      excerpt:
        "How everyday smartphone interactions can be analyzed to detect subtle patterns associated with early cognitive changes in Alzheimer's disease.",
      image: "/placeholder.svg?height=300&width=400",
      date: "March 28, 2025",
      author: "Dr. Emily Zhang",
      category: "Innovation",
      tags: ["Digital Biomarkers", "Cognitive Assessment", "Mobile Health"],
    },
    {
      id: 6,
      title: "Federated Learning for Privacy-Preserving Analysis of Patient Data",
      excerpt:
        "A new approach to training AI models across multiple hospitals without sharing sensitive patient data is accelerating research in neurodegenerative diseases.",
      image: "/placeholder.svg?height=300&width=400",
      date: "March 20, 2025",
      author: "Dr. Robert Kim",
      category: "Data Privacy",
      tags: ["Federated Learning", "Data Privacy", "Collaborative Research"],
    },
    {
      id: 7,
      title: "The Gut-Brain Connection: AI Models Linking Microbiome Data to Neurodegeneration",
      excerpt:
        "Emerging research using machine learning to analyze gut microbiome composition and its relationship to neurodegenerative disease progression.",
      image: "/placeholder.svg?height=300&width=400",
      date: "March 15, 2025",
      author: "Dr. Lisa Patel",
      category: "Research",
      tags: ["Microbiome", "Systems Biology", "Biomarkers"],
    },
    {
      id: 8,
      title: "Transfer Learning: Adapting Models from General Medical Imaging to Neurodegenerative Diseases",
      excerpt:
        "How pre-trained neural networks from broader medical imaging applications are being fine-tuned for specialized detection of neurodegenerative patterns.",
      image: "/placeholder.svg?height=300&width=400",
      date: "March 8, 2025",
      author: "Dr. Thomas Lee",
      category: "Technology",
      tags: ["Transfer Learning", "Neural Networks", "Medical Imaging"],
    },
  ]

  const categories = ["All", "Research", "Technology", "Innovation", "AI Ethics", "Data Privacy"]
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredPosts =
    activeCategory === "All" ? blogPosts : blogPosts.filter((post) => post.category === activeCategory)

  return (
    <div className="flex min-h-screen flex-col">
      <NeurolAnimation/>
      <main className="flex-1">
        {/* Hero Section */}
        <section
          id="hero"
          className="relative py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white overflow-hidden"
        >
          <div className="container relative z-10">
            <div
              className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${isVisible.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-6">NeurerIA Research & Insights</h1>
              <p className="text-lg text-gray-700 mb-8">
                Explore the latest breakthroughs in AI-powered early detection and monitoring of neurodegenerative
                diseases. Our blog features cutting-edge research, technology insights, and clinical applications.
              </p>
              <div className="max-w-lg mx-auto relative">
                <Input
                  type="text"
                  placeholder="Search articles..."
                  className="pl-10 pr-4 py-6 text-base rounded-full"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          {/* Abstract neural network background */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-green-500 rounded-full animate-pulse animation-delay-500"></div>
            <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-purple-500 rounded-full animate-pulse animation-delay-1000"></div>
            <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-red-500 rounded-full animate-pulse animation-delay-700"></div>
            <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-yellow-500 rounded-full animate-pulse animation-delay-300"></div>
          </div>
        </section>

        {/* Featured Articles */}
        <section id="featured" className="py-16 bg-white">
          <div className="container">
            <div
              className={`mb-12 transition-all duration-1000 ${isVisible.featured ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Featured Articles</h2>
              <p className="text-gray-600">Readings related to our current projects</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <div
                  key={post.id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isVisible.featured ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="relative h-64 w-full">
                    <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary hover:bg-primary/90">{post.category}</Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-primary transition-colors">
                      <Link href={`/blog/${post.id}`}>{post.title}</Link>
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-6">
                      <Button variant="link" className="p-0 h-auto font-medium flex items-center gap-2">
                        Read More <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Articles */}
        <section id="articles" className="py-16 bg-gray-50">
          <div className="container">
            <div
              className={`mb-12 transition-all duration-1000 ${isVisible.articles ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Latest Articles</h2>
              <p className="text-gray-600">Explore our collection of research and insights</p>
            </div>

            <div
              className={`mb-8 transition-all duration-1000 ${isVisible.articles ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: "200ms" }}
            >
              <Tabs defaultValue="All" className="w-full">
                <TabsList className="mb-8 flex flex-wrap h-auto bg-transparent space-x-2">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      onClick={() => setActiveCategory(category)}
                      className={`rounded-full px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-white`}
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value="All" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map((post, index) => (
                      <div
                        key={post.id}
                        className={`bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${isVisible.articles ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                        style={{ transitionDelay: `${300 + index * 100}ms` }}
                      >
                        <div className="relative h-48 w-full">
                          <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                          <div className="absolute top-3 left-3">
                            <Badge
                              className={`
                              ${post.category === "Research" ? "bg-blue-600" : ""}
                              ${post.category === "Technology" ? "bg-purple-600" : ""}
                              ${post.category === "Innovation" ? "bg-green-600" : ""}
                              ${post.category === "AI Ethics" ? "bg-orange-600" : ""}
                              ${post.category === "Data Privacy" ? "bg-red-600" : ""}
                              hover:bg-opacity-90
                            `}
                            >
                              {post.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-bold mb-2 line-clamp-2 hover:text-primary transition-colors">
                            <Link href={`/blog/${post.id}`}>{post.title}</Link>
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-3">{post.excerpt}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{post.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{post.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                {categories.slice(1).map((category) => (
                  <TabsContent key={category} value={category} className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {blogPosts
                        .filter((post) => post.category === category)
                        .map((post, index) => (
                          <div
                            key={post.id}
                            className={`bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${isVisible.articles ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                            style={{ transitionDelay: `${300 + index * 100}ms` }}
                          >
                            <div className="relative h-48 w-full">
                              <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                              <div className="absolute top-3 left-3">
                                <Badge
                                  className={`
                                  ${post.category === "Research" ? "bg-blue-600" : ""}
                                  ${post.category === "Technology" ? "bg-purple-600" : ""}
                                  ${post.category === "Innovation" ? "bg-green-600" : ""}
                                  ${post.category === "AI Ethics" ? "bg-orange-600" : ""}
                                  ${post.category === "Data Privacy" ? "bg-red-600" : ""}
                                  hover:bg-opacity-90
                                `}
                                >
                                  {post.category}
                                </Badge>
                              </div>
                            </div>
                            <div className="p-5">
                              <h3 className="text-lg font-bold mb-2 line-clamp-2 hover:text-primary transition-colors">
                                <Link href={`/blog/${post.id}`}>{post.title}</Link>
                              </h3>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-3">{post.excerpt}</p>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span>{post.author}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{post.date}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Pagination */}
            <div
              className={`flex justify-center mt-12 transition-all duration-1000 ${isVisible.articles ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: "600ms" }}
            >
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="rounded-full">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>
                <Button variant="outline" size="sm" className="rounded-full bg-primary text-white hover:bg-primary/90">
                  1
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  2
                </Button>
                <Button variant="outline" size="sm" className="rounded-full">
                  3
                </Button>
                <span className="mx-2">...</span>
                <Button variant="outline" size="sm" className="rounded-full">
                  8
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Topics */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Popular Topics</h2>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/blog/topic/alzheimers"
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
                >
                  Alzheimer&apos;s Disease
                </Link>
                <Link
                  href="/blog/topic/parkinsons"
                  className="px-4 py-2 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors"
                >
                  Parkinson&apos;s Disease
                </Link>
                <Link
                  href="/blog/topic/deep-learning"
                  className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors"
                >
                  Deep Learning
                </Link>
                <Link
                  href="/blog/topic/early-detection"
                  className="px-4 py-2 bg-orange-50 text-orange-700 rounded-full hover:bg-orange-100 transition-colors"
                >
                  Early Detection
                </Link>
                <Link
                  href="/blog/topic/biomarkers"
                  className="px-4 py-2 bg-red-50 text-red-700 rounded-full hover:bg-red-100 transition-colors"
                >
                  Biomarkers
                </Link>
                <Link
                  href="/blog/topic/neuroimaging"
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors"
                >
                  Neuroimaging
                </Link>
                <Link
                  href="/blog/topic/clinical-trials"
                  className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-full hover:bg-yellow-100 transition-colors"
                >
                  Clinical Trials
                </Link>
                <Link
                  href="/blog/topic/ai-ethics"
                  className="px-4 py-2 bg-pink-50 text-pink-700 rounded-full hover:bg-pink-100 transition-colors"
                >
                  AI Ethics
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section
          id="newsletter"
          className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white"
        >
          <div className="container">
            <div
              className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${isVisible.newsletter ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-lg mb-8 text-blue-100">
                Subscribe to our newsletter to receive the latest research findings, technology updates, and event
                announcements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                <Button className="bg-white text-blue-700 hover:bg-blue-50">Subscribe</Button>
              </div>
              <p className="text-sm mt-4 text-blue-200">
                We respect your privacy. You can unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
)
}