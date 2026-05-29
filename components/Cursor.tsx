"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function Cursor() {
  const [mounted, setMounted] = useState(false)
  const [clicking, setClicking] = useState(false)

  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  const dotX = useSpring(mouseX, { damping: 60, stiffness: 600 })
  const dotY = useSpring(mouseY, { damping: 60, stiffness: 600 })
  const ringX = useSpring(mouseX, { damping: 28, stiffness: 280 })
  const ringY = useSpring(mouseY, { damping: 28, stiffness: 280 })

  useEffect(() => {
    setMounted(true)

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    const onDown = () => setClicking(true)
    const onUp = () => setClicking(false)

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mousedown", onDown)
    window.addEventListener("mouseup", onUp)

    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mousedown", onDown)
      window.removeEventListener("mouseup", onUp)
    }
  }, [mouseX, mouseY])

  if (!mounted) return null

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-branco"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ width: clicking ? 6 : 4, height: clicking ? 6 : 4 }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-branco/40"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ width: clicking ? 28 : 34, height: clicking ? 28 : 34, opacity: clicking ? 0.6 : 1 }}
        transition={{ duration: 0.2 }}
      />
    </>
  )
}
