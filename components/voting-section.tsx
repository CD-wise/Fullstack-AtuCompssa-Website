"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollAnimator } from "@/components/scroll-animator"

interface VotingSectionProps {
  enabled: boolean
  url?: string | null
}

export function VotingSection({ enabled, url }: VotingSectionProps) {
  if (!enabled || !url) return null

  return (
    <ScrollAnimator animationType="fade-in-scale">
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">Student Voting</h3>
              <p className="text-sm text-muted-foreground">Participate in the current department vote.</p>
            </div>
            <div>
              <Link href={url} target="_blank" rel="noopener noreferrer">
                <Button className="btn-tech" asChild>
                  <span>Go to Voting System</span>
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </ScrollAnimator>
  )
}
