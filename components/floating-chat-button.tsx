"use client"

import React from "react"
import { Button } from "@/components/ui/button"

export default function FloatingChatButton() {
  const href = "https://atu-cps-chatbot.vercel.app/"

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 pointer-events-auto">
      <div className="group relative">
        {/* pulse circle behind the button */}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="block w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-yellow-400 opacity-20 blur-sm animate-pulse" aria-hidden></span>
        </span>

        <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Open Compssa AI Chatbot">
          <Button className="relative z-10 rounded-full p-2 sm:p-3 w-12 h-12 sm:w-14 sm:h-14 shadow-lg bg-gradient-to-tr from-yellow-400 to-yellow-500 hover:scale-105 transform transition-transform" aria-hidden>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="3" y="7" width="18" height="11" rx="2" />
              <path d="M8 11h.01" />
              <path d="M16 11h.01" />
              <path d="M12 18v2" />
              <path d="M9 4v3" />
              <path d="M15 4v3" />
            </svg>
          </Button>
        </a>

        {/* tooltip */}
        <div className="pointer-events-none absolute bottom-full right-1/2 translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="whitespace-nowrap rounded-md bg-black/85 text-white text-xs py-1 px-2">Chat with Compssa AI</div>
        </div>
      </div>
    </div>
  )
}
