"use client"

import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"

const navLinks = [
  { href: "#offerings", label: "What We Offer" },
  { href: "#gallery", label: "Gallery" },
  { href: "#events", label: "Events" },
  { href: "#staff", label: "Staff Directory" },
  { href: "#announcements", label: "Announcements" },
  { href: "#clubs", label: "Clubs & Channels" },
]

export function TopTabs() {
  return (
    <div className="sticky top-0 z-60">
      <div className="container mx-auto px-4">
        <div className={cn("flex flex-col sm:flex-row items-center justify-between h-auto sm:h-14 rounded-b-lg py-3 sm:py-0 gap-3 sm:gap-0", "backdrop-blur bg-card/40 border-b border-primary/10")}>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full justify-center sm:justify-start flex-1">
            <div className="flex items-center justify-center">
              <Logo size={96} className="w-12 sm:w-24 md:w-28" />
            </div>
            <nav className="inline-flex items-center gap-4 sm:gap-6 overflow-x-auto py-2 justify-center text-xs sm:text-sm">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-medium text-muted-foreground hover:text-foreground hover:text-primary/80 whitespace-nowrap transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopTabs
