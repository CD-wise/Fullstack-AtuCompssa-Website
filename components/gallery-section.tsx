"use client"

import React, { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { GalleryImage } from "@/lib/types"
import { ScrollAnimator } from "@/components/scroll-animator"

interface GallerySectionProps {
  images: GalleryImage[]
}

export function GallerySection({ images }: GallerySectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-slide carousel
  useEffect(() => {
    if (!isAutoPlay || images.length === 0) return

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000) // Change image every 5 seconds

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [isAutoPlay, images.length])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    setIsAutoPlay(false)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
    setIsAutoPlay(false)
  }

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlay(false)
  }

  if (images.length === 0) {
    return null
  }

  const sortedImages = [...images].sort((a, b) => a.display_order - b.display_order)
  const currentImage = sortedImages[currentIndex]

  return (
    <section id="gallery" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-background/95 to-background">
      <div className="max-w-6xl mx-auto">
        {/* Section heading with scroll animation */}
        <ScrollAnimator animation="fade-in-scale">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text mb-4">
              Department Gallery
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Explore images from our department activities and events
            </p>
          </div>
        </ScrollAnimator>

        {/* Carousel container */}
        <ScrollAnimator animation="fade-in-scale" delay={100}>
          <Card className="relative overflow-hidden card-glow group">
            {/* Main image carousel */}
            <div
              className="relative w-full aspect-video sm:aspect-[16/9] md:aspect-[21/9] bg-black/10 overflow-hidden"
              onMouseEnter={() => setIsAutoPlay(false)}
              onMouseLeave={() => setIsAutoPlay(true)}
            >
              {sortedImages.map((image, index) => (
                <div
                  key={image.id}
                  className={`absolute inset-0 transition-all duration-700 ease-out ${
                    index === currentIndex
                      ? "opacity-100 translate-x-0"
                      : index < currentIndex
                        ? "opacity-0 -translate-x-full"
                        : "opacity-0 translate-x-full"
                  }`}
                >
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Image overlay with info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4 sm:p-6 md:p-8">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2">
                      {image.title}
                    </h3>
                    {image.description && (
                      <p className="text-white/80 text-sm sm:text-base max-w-2xl line-clamp-2">
                        {image.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Navigation buttons */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110"
                onClick={handlePrevious}
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110"
                onClick={handleNext}
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center items-center gap-2 sm:gap-3 py-4 px-4 bg-muted/50 backdrop-blur-sm">
              {sortedImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex
                      ? "w-3 h-3 sm:w-4 sm:h-4 bg-primary scale-110"
                      : "w-2 h-2 sm:w-3 sm:h-3 bg-primary/40 hover:bg-primary/60 cursor-pointer"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>

            {/* Image counter */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs sm:text-sm font-medium">
              {currentIndex + 1} / {sortedImages.length}
            </div>
          </Card>
        </ScrollAnimator>
      </div>
    </section>
  )
}
