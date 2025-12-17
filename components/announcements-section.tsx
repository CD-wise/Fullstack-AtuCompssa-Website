"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell } from "lucide-react"
import type { Announcement } from "@/lib/types"
import { ScrollAnimator } from "@/components/scroll-animator"
import Image from "next/image"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface AnnouncementsSectionProps {
  announcements: Announcement[]
}

export function AnnouncementsSection({ announcements }: AnnouncementsSectionProps) {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Display all announcements
  const displayedAnnouncements = announcements

  return (
    <section id="announcements" className="py-12 sm:py-20 relative overflow-hidden">
      {/* Tech background accent */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

      <div className="w-full px-4 sm:container sm:mx-auto relative z-10">
        <ScrollAnimator className="mx-auto max-w-2xl text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-2 sm:mb-4">
            <span className="gradient-text">Announcements</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg">
            Stay informed with the latest news and updates from the department.
          </p>
        </ScrollAnimator>

        <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
          {displayedAnnouncements.map((announcement, idx) => (
            <ScrollAnimator
              key={announcement.id}
              animation="slide-in-left"
              delay={idx * 100}
            >
              <div className="group">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start">
                  {/* Image Square - Full width on mobile, 32x32 on desktop */}
                  {announcement.image_url && (
                    <div className="relative w-full sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden border-2 border-primary/20 h-32">
                      <Image
                        src={announcement.image_url}
                        alt={announcement.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  {/* Announcement Card - Main content */}
                  <Card className={`card-glow flex-1 w-full sm:w-auto border-2 border-primary/20 bg-gradient-to-r from-card to-card/50 transition-all duration-300 group-hover:-translate-x-1`}>
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                    
                    <CardHeader className="pb-2 sm:pb-3 relative z-10 flex-1">
                      <div className="flex items-start gap-2 sm:gap-4">
                        <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-300">
                          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col items-start justify-between gap-1 sm:gap-2">
                            <CardTitle className="text-base sm:text-lg group-hover:text-primary transition-colors duration-300 break-words line-clamp-2">{announcement.title}</CardTitle>
                            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                              {formatDate(announcement.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 pl-11 sm:pl-14 relative z-10">
                      <CardDescription className="text-sm sm:text-base leading-relaxed line-clamp-3">{announcement.content}</CardDescription>
                      <Button
                        variant="link"
                        className="mt-3 px-0 h-auto text-primary hover:text-primary/80"
                        onClick={() => setSelectedAnnouncement(announcement)}
                      >
                        Read More →
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </ScrollAnimator>
          ))}
        </div>

        {announcements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No announcements at the moment.</p>
          </div>
        )}
      </div>

      {/* Full Announcement Dialog */}
      <Dialog open={!!selectedAnnouncement} onOpenChange={() => setSelectedAnnouncement(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedAnnouncement && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedAnnouncement.title}</DialogTitle>
                <p className="text-sm text-muted-foreground mt-2">{formatDate(selectedAnnouncement.created_at)}</p>
              </DialogHeader>

              {selectedAnnouncement.image_url && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-primary/20 mt-4">
                  <Image
                    src={selectedAnnouncement.image_url}
                    alt={selectedAnnouncement.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="prose prose-sm max-w-none mt-6">
                <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
                  {selectedAnnouncement.content}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
