"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ScrollAnimatorProps {
  children: React.ReactNode
  className?: string
  animation?: "float-up" | "fade-in-scale" | "slide-in-left" | "slide-in-right"
  delay?: number
}

export function ScrollAnimator({
  children,
  className,
  animation = "float-up",
  delay = 0,
}: ScrollAnimatorProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  const animationMap: Record<string, string> = {
    "float-up": "animate-float-up",
    "fade-in-scale": "animate-fade-in-scale",
    "slide-in-left": "animate-slide-in-left",
    "slide-in-right": "animate-slide-in-right",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700",
        isVisible ? animationMap[animation] : "opacity-0 translate-y-8",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
