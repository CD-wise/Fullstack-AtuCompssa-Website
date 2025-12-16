"use client"

import Image from "next/image"
import React from "react"

interface LogoProps {
  size?: number
  className?: string
}

export function Logo({ size = 96, className }: LogoProps) {
  return (
    <Image
      src="/compssa-logo.png"
      alt="Compssa Department logo"
      width={size}
      height={size}
      className={className}
      priority={true}
    />
  )
}

export default Logo
