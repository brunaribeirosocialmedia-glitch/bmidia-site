"use client"

import { useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Scroll suave via CSS — sem Lenis para manter compatibilidade com GSAP ScrollTrigger no export estático
export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Atualiza ScrollTrigger a cada scroll nativo
    const onScroll = () => ScrollTrigger.update()
    window.addEventListener("scroll", onScroll, { passive: true })

    // Smooth scroll para âncoras via CSS — já está no globals.css
    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return <>{children}</>
}
