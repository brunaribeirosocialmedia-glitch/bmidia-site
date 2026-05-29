"use client"

import { useEffect } from "react"
import { motion, useAnimation } from "framer-motion"

export default function PageTransitionOverlay() {
  const controls = useAnimation()

  useEffect(() => {
    controls.set({ x: "-100%" })

    const handleClick = async (e: MouseEvent) => {
      const target = e.target as Element
      const anchor = target.closest("a[href^='#']") as HTMLAnchorElement | null
      if (!anchor) return

      const href = anchor.getAttribute("href")
      if (!href || href === "#") return

      const targetEl = document.querySelector(href)
      if (!targetEl) return

      e.preventDefault()

      await controls.start({
        x: "0%",
        transition: { duration: 0.35, ease: [0.76, 0, 0.24, 1] },
      })

      targetEl.scrollIntoView({ behavior: "instant" as ScrollBehavior })

      await controls.start({
        x: "100%",
        transition: { duration: 0.35, ease: [0.76, 0, 0.24, 1] },
      })

      controls.set({ x: "-100%" })
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [controls])

  return (
    <motion.div
      className="fixed inset-0 z-[9990] pointer-events-none bg-indigo"
      animate={controls}
    />
  )
}
