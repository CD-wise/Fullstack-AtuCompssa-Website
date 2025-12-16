import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, ImageIcon } from "lucide-react"
import type { Event } from "@/lib/types"
import { ScrollAnimator } from "@/components/scroll-animator"

interface EventsSectionProps {
  events: Event[]
}

export function EventsSection({ events }: EventsSectionProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return null
    const [hours, minutes] = timeStr.split(":")
    const date = new Date()
    date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const isUpcoming = (dateStr: string) => {
    return new Date(dateStr) >= new Date()
  }

  return (
    <section id="events" className="py-20 relative overflow-hidden">
      {/* Tech background accent */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="w-full px-4 sm:container sm:mx-auto relative z-10">
        <ScrollAnimator className="mx-auto max-w-2xl text-center mb-12">
          <Badge variant="outline" className="mb-4 px-4 py-1">
            Stay Updated
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            <span className="gradient-text">Upcoming Events</span>
          </h2>
          <p className="text-muted-foreground text-lg">Stay updated with our latest events, workshops, and seminars.</p>
        </ScrollAnimator>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event, idx) => (
            <ScrollAnimator 
              key={event.id}
              animation="float-up"
              delay={idx * 100}
            >
              <Card
                className="card-glow group overflow-hidden relative border-2 border-primary/20"
              >
                <div className="aspect-[16/10] overflow-hidden bg-muted relative">
                  {event.image_url ? (
                    <img
                      src={event.image_url || "/placeholder.svg"}
                      alt={event.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10">
                      <div className="text-center">
                        <ImageIcon className="h-12 w-12 text-primary/30 mx-auto mb-2" />
                        <span className="text-sm text-muted-foreground">Event Image</span>
                      </div>
                    </div>
                  )}
                  {/* Badge overlay on image */}
                  <div className="absolute top-3 left-3">
                    <Badge variant={isUpcoming(event.event_date) ? "default" : "secondary"} className="shadow-lg">
                      {isUpcoming(event.event_date) ? "Upcoming" : "Past"}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors duration-300">
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base line-clamp-2 mb-4">{event.description}</CardDescription>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span>{formatDate(event.event_date)}</span>
                    </div>
                    {event.event_time && (
                      <div className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        <span>{formatTime(event.event_time)}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        <span className="truncate max-w-[120px]">{event.location}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimator>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No events scheduled at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}
