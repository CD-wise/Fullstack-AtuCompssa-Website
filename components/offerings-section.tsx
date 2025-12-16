import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, BookOpen, Award, Lightbulb, Building, Monitor } from "lucide-react"
import type { DepartmentOffering } from "@/lib/types"
import { ScrollAnimator } from "@/components/scroll-animator"

const iconMap: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="h-6 w-6" />,
  BookOpen: <BookOpen className="h-6 w-6" />,
  Award: <Award className="h-6 w-6" />,
  Lightbulb: <Lightbulb className="h-6 w-6" />,
  Building: <Building className="h-6 w-6" />,
  Monitor: <Monitor className="h-6 w-6" />,
}

interface OfferingsSectionProps {
  offerings: DepartmentOffering[]
}

export function OfferingsSection({ offerings }: OfferingsSectionProps) {
  return (
    <section id="offerings" className="py-20 bg-secondary/30 relative overflow-hidden">
      {/* Tech background accent */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <div className="w-full px-4 sm:container sm:mx-auto relative z-10">
        <ScrollAnimator className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            <span className="gradient-text">What We Offer</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Discover our comprehensive programs and facilities designed to prepare you for success in the tech industry.
          </p>
        </ScrollAnimator>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offerings.map((offering, idx) => (
            <ScrollAnimator 
              key={offering.id}
              animation="float-up"
              delay={idx * 100}
            >
              <Card className="card-glow group relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card to-card/50">
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <CardHeader className="relative z-10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/50">
                    {offering.icon && iconMap[offering.icon] ? iconMap[offering.icon] : <BookOpen className="h-6 w-6" />}
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{offering.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-base leading-relaxed">{offering.description}</CardDescription>
                </CardContent>
              </Card>
            </ScrollAnimator>
          ))}
        </div>

        {offerings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No offerings available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}
