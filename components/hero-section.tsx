"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Users, Code2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setIsLoaded(true)
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        if (rect.bottom > 0) {
          setScrollY(window.scrollY * 0.4)
        }
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden min-h-[90vh] flex items-center">
      <div className="absolute inset-0 -z-20" style={{ transform: `translateY(${scrollY}px)` }}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{
            backgroundImage: "url('/modern-university-campus-computer-science-building.jpg')",
          }}
        />
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/85 via-background/90 to-background" />

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />

      {/* Animated floating tech particles */}
      <div className="absolute inset-0 -z-5 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-30 animate-float-particle"
            style={{
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              background: i % 2 === 0 ? 
                `radial-gradient(circle, var(--primary), transparent)` : 
                `radial-gradient(circle, var(--accent), transparent)`,
              left: `${20 + i * 15}%`,
              top: `${10 + i * 10}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${6 + i * 1}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full px-4 sm:container sm:mx-auto py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          {/* Animated badge */}
          <div 
            className={`mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-lg transition-all duration-700 ${
              isLoaded ? 'animate-float-up' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
            </span>
            Registration Now Open for 2025/2026
          </div>

          {/* Animated gradient heading */}
          <h1 
            className={`mb-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl drop-shadow-sm transition-all duration-700 ${
              isLoaded ? 'animate-float-up' : 'opacity-0 translate-y-8'
            }`}
            style={{ animationDelay: '0.1s' }}
          >
            <span className="block">Welcome to</span>
            <span className="gradient-text">Compssa Department</span>
          </h1>

          {/* Animated subtitle */}
          <p 
            className={`mb-8 text-lg text-muted-foreground text-pretty leading-relaxed max-w-2xl mx-auto transition-all duration-700 ${
              isLoaded ? 'animate-float-up' : 'opacity-0 translate-y-8'
            }`}
            style={{ animationDelay: '0.2s' }}
          >
            Empowering the next generation of innovators through cutting-edge education, research excellence, and
            industry partnerships. Join us in shaping the future of technology.
          </p>

          {/* Animated CTA buttons */}
          <div 
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ${
              isLoaded ? 'animate-float-up' : 'opacity-0 translate-y-8'
            }`}
            style={{ animationDelay: '0.3s' }}
          >
            <a href="#offerings">
              <Button 
                size="lg" 
                className="gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 btn-tech"
              >
                <BookOpen className="h-4 w-4" />
                Explore Programs
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <a href="#staff">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 btn-tech"
              >
                <Users className="h-4 w-4" />
                Meet Our Team
              </Button>
            </a>
          </div>

          {/* Scroll indicator */}
          <div className={`mt-16 flex justify-center transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="animate-bounce">
              <Code2 className="h-6 w-6 text-primary/60" />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative blur elements */}
      <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </div>
    </section>
  )
}
