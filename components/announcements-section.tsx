import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell } from "lucide-react"
import type { Announcement } from "@/lib/types"
import { ScrollAnimator } from "@/components/scroll-animator"

interface AnnouncementsSectionProps {
  announcements: Announcement[]
}

export function AnnouncementsSection({ announcements }: AnnouncementsSectionProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <section id="announcements" className="py-20 relative overflow-hidden">
      {/* Tech background accent */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

      <div className="w-full px-4 sm:container sm:mx-auto relative z-10">
        <ScrollAnimator className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            <span className="gradient-text">Announcements</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Stay informed with the latest news and updates from the department.
          </p>
        </ScrollAnimator>

        <div className="mx-auto max-w-3xl space-y-4">
          {announcements.map((announcement, idx) => (
            <ScrollAnimator
              key={announcement.id}
              animation="slide-in-left"
              delay={idx * 100}
            >
              <Card className="card-glow group border-2 border-primary/20 bg-gradient-to-r from-card to-card/50 transition-all duration-300 hover:-translate-x-1">
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                
                <CardHeader className="pb-3 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-300">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">{announcement.title}</CardTitle>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatDate(announcement.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pl-18 relative z-10">
                  <CardDescription className="text-base leading-relaxed ml-14">{announcement.content}</CardDescription>
                </CardContent>
              </Card>
            </ScrollAnimator>
          ))}
        </div>

        {announcements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No announcements at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}
