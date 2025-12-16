import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Users, BookOpen, Award, Code2 } from "lucide-react"
import Link from "next/link"
import { ScrollAnimator } from "@/components/scroll-animator"

export function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80 animate-gradient-shift" />

      {/* Animated decorative patterns */}
      <div className="absolute inset-0 opacity-10 overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-full animate-pulse-glow"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating animated decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/10 blur-2xl animate-float-particle" />
      <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-white/10 blur-3xl animate-float-particle" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-accent/20 blur-xl animate-float-particle" style={{ animationDelay: "2s" }} />

      <div className="w-full px-4 sm:container sm:mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollAnimator className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 hover:bg-white/30 transition-all duration-300">
            <Code2 className="h-4 w-4 text-white animate-bounce" />
            <span className="text-white/90 text-sm font-medium">Transform Your Future in Tech</span>
            <Code2 className="h-4 w-4 text-white animate-bounce" style={{ animationDelay: "0.2s" }} />
          </ScrollAnimator>

          <ScrollAnimator className="text-4xl md:text-5xl font-bold text-white mb-6 text-balance" animation="slide-in-right" delay={100}>
            Ready to Join Our <span className="gradient-text">Tech Community</span>?
          </ScrollAnimator>

          <ScrollAnimator className="text-lg md:text-xl text-white/85 mb-10 leading-relaxed max-w-2xl mx-auto text-pretty" animation="fade-in-scale" delay={200}>
            The Compssa Department offers world-class education, cutting-edge research opportunities, and a vibrant community of innovators. Take the first step towards a transformative journey in technology.
          </ScrollAnimator>

          {/* Animated stats row */}
          <ScrollAnimator className="grid grid-cols-3 gap-4 md:gap-8 mb-10 max-w-xl mx-auto" animation="float-up" delay={300}>
            <div className="text-center group hover:scale-110 transition-transform duration-300">
              <div className="flex items-center justify-center mb-2 group-hover:rotate-12 transition-transform">
                <Users className="h-6 w-6 text-white/80 group-hover:text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white">500+</div>
              <div className="text-sm text-white/70 group-hover:text-white/90 transition-colors">Students</div>
            </div>
            <div className="text-center group hover:scale-110 transition-transform duration-300">
              <div className="flex items-center justify-center mb-2 group-hover:rotate-12 transition-transform">
                <BookOpen className="h-6 w-6 text-white/80 group-hover:text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white">20+</div>
              <div className="text-sm text-white/70 group-hover:text-white/90 transition-colors">Programs</div>
            </div>
            <div className="text-center group hover:scale-110 transition-transform duration-300">
              <div className="flex items-center justify-center mb-2 group-hover:rotate-12 transition-transform">
                <Award className="h-6 w-6 text-white/80 group-hover:text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white">95%</div>
              <div className="text-sm text-white/70 group-hover:text-white/90 transition-colors">Success Rate</div>
            </div>
          </ScrollAnimator>

          <ScrollAnimator className="flex flex-col sm:flex-row items-center justify-center gap-4" animation="bounce-in" delay={400}>
            <Link href="/auth/login">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 gap-2 px-8 btn-tech"
              >
                Get Started Today
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#offerings">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white/50 text-white hover:bg-white/10 hover:border-white bg-transparent gap-2 px-8 btn-tech transition-all duration-300"
              >
                Explore Programs
              </Button>
            </a>
          </ScrollAnimator>
        </div>
      </div>
    </section>
  )
}
