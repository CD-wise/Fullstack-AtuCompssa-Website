"use client"

import Image from "next/image"
import { ScrollAnimator } from "@/components/scroll-animator"

interface HeadMessageSectionProps {
  imageUrl: string
  name: string
  title: string
  message: string
}

export function HeadMessageSection({ imageUrl, name, title, message }: HeadMessageSectionProps) {
  // Debug: log the imageUrl
  console.log('HeadMessageSection received imageUrl:', imageUrl)
  
  // Determine if this is Head of Department or Faculty Dean
  const isHeadOfDepartment = title.toLowerCase().includes("head")
  const label = isHeadOfDepartment ? "Message from Head of Department" : "Message from Faculty Dean"
  
  return (
    <section className="py-12 sm:py-20 relative overflow-hidden">
      {/* Gradient background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full px-4 sm:container sm:mx-auto relative z-10">
        <div className="max-w-6xl mx-auto">
          <ScrollAnimator>
            {/* Unified container without background */}
            <div className="rounded-3xl overflow-hidden">
              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">
                {/* Left: Image with label on top */}
                <div className="flex flex-col">
                  {/* Label on top of image */}
                  <div className="px-6 pt-6 pb-2">
                    <p className="text-white font-extrabold text-lg sm:text-xl font-serif tracking-wider drop-shadow-lg">{label}</p>
                  </div>
                  
                  {/* Image */}
                  <div className="flex-1 px-6 pb-6">
                    <div className="relative w-full h-full min-h-96 sm:min-h-96 rounded-2xl overflow-hidden shadow-lg">
                      <Image
                        src={imageUrl}
                        alt={name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Message content (no card, integrated with green bg) */}
                <div className="p-6 sm:p-8 flex flex-col justify-center">
                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="text-2xl sm:text-3xl font-bold mb-1 text-white">{name}</h3>
                    <p className="text-white/80 font-semibold text-sm sm:text-base">{title}</p>
                  </div>

                  {/* Divider */}
                  <div className="h-1 w-12 bg-primary rounded-full mb-6" />

                  {/* Message with styling */}
                  <div className="bg-slate-100 rounded-xl p-6 mb-6 border-l-4 border-primary">
                    <p className="text-sm sm:text-base leading-relaxed text-slate-800">
                      {message}
                    </p>
                  </div>

                  {/* Bottom accent */}
                  <div className="flex items-center gap-2 text-slate-500">
                    <div className="h-0.5 flex-1 bg-slate-300" />
                    <span className="text-xs tracking-widest">MESSAGE</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimator>
        </div>
      </div>
    </section>
  )
}
