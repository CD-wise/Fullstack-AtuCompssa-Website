import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, User } from "lucide-react"
import type { Staff } from "@/lib/types"
import { ScrollAnimator } from "@/components/scroll-animator"

interface StaffSectionProps {
  staff: Staff[]
}

const staffTypeLabels: Record<string, string> = {
  dean: "Dean",
  hod: "Head of Department",
  faculty: "Faculty",
  staff: "Staff",
  executive: "Department Executive",
}

export function StaffSection({ staff }: StaffSectionProps) {
  // Group staff by type
  const groupedStaff = staff.reduce(
    (acc, member) => {
      const type = member.staff_type
      if (!acc[type]) acc[type] = []
      acc[type].push(member)
      return acc
    },
    {} as Record<string, Staff[]>,
  )

  const executiveTypes = ["executive"]
  const staffTypes = ["dean", "hod", "faculty", "staff"]

  const hasExecutives = executiveTypes.some((type) => groupedStaff[type]?.length > 0)
  const hasStaff = staffTypes.some((type) => groupedStaff[type]?.length > 0)

  const renderStaffGroup = (types: string[], sectionTitle: string, sectionDescription: string, badgeText: string) => {
    const hasMembers = types.some((type) => groupedStaff[type]?.length > 0)
    if (!hasMembers) return null

    return (
      <div className="mb-16 last:mb-0">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <Badge variant="outline" className="mb-4 px-4 py-1">
            {badgeText}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            <span className="gradient-text">{sectionTitle}</span>
          </h2>
          <p className="text-muted-foreground text-lg">{sectionDescription}</p>
        </div>

        {types.map((type) => {
          const members = groupedStaff[type]
          if (!members || members.length === 0) return null

          return (
            <div key={type} className="mb-12 last:mb-0">
              <h3 className="text-xl font-semibold mb-6 text-center text-primary">{staffTypeLabels[type] || type}</h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {members.map((member, idx) => (
                  <ScrollAnimator
                    key={member.id}
                    animation="float-up"
                    delay={idx * 75}
                  >
                    <Card
                      className="card-glow group transition-all duration-300 border-2 border-primary/20 shadow-md overflow-hidden hover:-translate-y-1"
                    >
                      <CardContent className="pt-8 pb-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="relative mb-5">
                            <div className="absolute -inset-1 bg-gradient-to-br from-primary via-primary/50 to-accent rounded-full opacity-75 group-hover:opacity-100 transition-opacity blur-sm" />
                            <div className="relative h-16 w-16 sm:h-28 sm:w-28 overflow-hidden rounded-full bg-muted ring-4 ring-card">
                              {member.image_url ? (
                                <img
                                  src={member.image_url || "/placeholder.svg"}
                                  alt={member.name}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                                  <User className="h-8 w-8 sm:h-12 sm:w-12 text-primary/60" />
                                </div>
                              )}
                            </div>
                          </div>
                          <h4 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors duration-300">
                            {member.name}
                          </h4>
                          <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary hover:bg-primary/20">
                            {member.role}
                          </Badge>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            {member.email && (
                              <a
                                href={`mailto:${member.email}`}
                                className="flex items-center justify-center gap-2 hover:text-primary transition-colors duration-300"
                              >
                                <Mail className="h-4 w-4" />
                                <span className="truncate max-w-[180px]">{member.email}</span>
                              </a>
                            )}
                            {member.phone && (
                              <a
                                href={`tel:${member.phone}`}
                                className="flex items-center justify-center gap-2 hover:text-primary transition-colors duration-300"
                              >
                                <Phone className="h-4 w-4" />
                                <span>{member.phone}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollAnimator>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <section id="staff" className="py-20 bg-secondary/30 relative overflow-hidden">
      {/* Tech background accent */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {renderStaffGroup(
          executiveTypes,
          "Department Executive",
          "Meet our student leaders driving departmental initiatives and fostering community.",
          "Leadership",
        )}

        {renderStaffGroup(
          staffTypes,
          "Our Staff",
          "Meet our dedicated faculty and staff committed to your academic success.",
          "Meet The Staff",
        )}

        {staff.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Staff directory coming soon.</p>
          </div>
        )}
      </div>
    </section>
  )
}
