"use client"

import React, { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X } from "lucide-react"

const navLinks = [
  { href: "#offerings", label: "What We Offer" },
  { href: "#gallery", label: "Gallery" },
  { href: "#events", label: "Events" },
  { href: "#staff", label: "Staff Directory" },
  { href: "#announcements", label: "Announcements" },
  { href: "#clubs", label: "Clubs & Channels" },
]

export function TopTabs() {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavClick = () => {
    setIsOpen(false)
  }

  return (
    <div className="sticky top-0 z-60 w-full overflow-x-hidden">
      <div className="w-full px-4 sm:container sm:mx-auto">
        <div className={cn("flex flex-row items-center justify-between h-14 rounded-b-lg py-0", "backdrop-blur bg-card/40 border-b border-primary/10")}>
          {/* Logo - visible on all sizes */}
          <div className="flex items-center justify-start flex-shrink-0">
            <Logo size={96} className="w-10 sm:w-24 md:w-28" />
          </div>

          {/* Desktop Navigation - hidden on mobile */}
          <nav className="hidden sm:flex items-center gap-4 text-sm flex-1 ml-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-medium text-muted-foreground hover:text-foreground hover:text-primary/80 transition-colors duration-300 whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Theme Toggle + Hamburger */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />
            
            {/* Hamburger Menu - visible on mobile only */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="sm:hidden p-2 hover:bg-primary/10 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - visible when open */}
        {isOpen && (
          <div className="sm:hidden bg-card/50 backdrop-blur border-b border-primary/10 py-3">
            <nav className="flex flex-col gap-3 px-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className="font-medium text-muted-foreground hover:text-foreground hover:text-primary/80 transition-colors duration-300 px-4 py-2 rounded-md hover:bg-primary/5 block"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}

export default TopTabs
