"use client"

import React, { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Copy, Search, ExternalLink, Zap } from "lucide-react"
import type { Club } from "@/lib/types"
import { ScrollAnimator } from "@/components/scroll-animator"

interface ClubsSectionProps {
  clubs: Club[]
}

export function ClubsSection({ clubs }: ClubsSectionProps) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return clubs
    return clubs.filter((c) => c.title.toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q))
  }, [clubs, query])

  const handleCopy = async (text: string) => {
    if (!navigator.clipboard) return
    try {
      await navigator.clipboard.writeText(text)
      // Optionally show toast; keeping simple as project uses a toast hook elsewhere
    } catch (e) {
      console.error("Copy failed", e)
    }
  }

  return (
    <section id="clubs" className="py-20 bg-secondary/10 relative overflow-hidden">
      {/* Tech background accent */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollAnimator className="mx-auto max-w-2xl text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="h-5 w-5 text-accent" />
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="gradient-text">Compssa Clubs & Channels</span>
            </h2>
            <Zap className="h-5 w-5 text-accent" />
          </div>
          <p className="text-muted-foreground text-lg">Find student clubs, channels and ways to join or contact them.</p>
        </ScrollAnimator>

        <ScrollAnimator className="mx-auto max-w-3xl mb-6">
          <div className="flex items-center gap-2 relative">
            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/20 to-accent/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <Input
              placeholder="Search clubs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="relative backdrop-blur-sm border-primary/20 bg-card/50 focus:ring-primary/50"
            />
            <div className="p-2 rounded-md bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 group-hover:border-primary/50 transition-all duration-300">
              <Search className="h-4 w-4 text-primary" />
            </div>
          </div>
        </ScrollAnimator>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((club, idx) => (
            <ScrollAnimator
              key={club.id}
              animation="float-up"
              delay={idx * 100}
            >
              <Card className="card-glow group border-2 border-primary/20 bg-gradient-to-br from-card to-card/50 transition-all duration-300">
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />

                <CardHeader className="relative z-10">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">{club.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{club.description}</p>

                  {club.links && club.links.length > 0 && (
                    <div className="space-y-2">
                      {club.links.map((link, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2 group/link p-2 rounded-md hover:bg-primary/5 transition-colors duration-300">
                          <a href={link} target="_blank" rel="noreferrer" className="text-sm text-primary hover:text-primary/80 group-hover/link:underline flex items-center gap-2">
                            <ExternalLink className="h-4 w-4 group-hover/link:scale-110 transition-transform" />
                            <span className="truncate max-w-[200px]">{link}</span>
                          </a>
                          <div className="flex items-center gap-2 opacity-0 group-hover/link:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" onClick={() => handleCopy(link)} className="h-8 w-8 hover:bg-primary/10">
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </ScrollAnimator>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No clubs found.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default ClubsSection
