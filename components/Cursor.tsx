"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"

type CursorState = "default" | "link" | "image"

export default function Cursor() {
  const [mounted, setMounted] = useState(false)
  const [cursorState, setCursorState] = useState<CursorState>("default")
  const [clicking, setClicking] = useState(false)

  const mouseX = useMotionValue(-200)
  const mouseY = useMotionValue(-200)

  // Inner dot — lerp ~0.9, very snappy
  const dotX = useSpring(mouseX, { stiffness: 900, damping: 65 })
  const dotY = useSpring(mouseY, { stiffness: 900, damping: 65 })

  // Outer ring — lerp ~0.08, heavy trailing drag
  const ringX = useSpring(mouseX, { stiffness: 45, damping: 14 })
  const ringY = useSpring(mouseY, { stiffness: 45, damping: 14 })

  useEffect(() => {
    setMounted(true)

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)

      const el = e.target as Element
      if (el.closest("img, picture, video, [data-cursor='image']")) {
        setCursorState("image")
      } else if (el.closest("a, button, [role='button'], label, [data-cursor='link']")) {
        setCursorState("link")
      } else {
        setCursorState("default")
      }
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

  const ringSize =
    cursorState === "image" ? 90 :
    cursorState === "link" ? 70 :
    clicking ? 28 : 40

  const ringOpacity =
    cursorState === "link" ? 0.4 :
    clicking ? 0.7 : 1

  return (
    <>
      {/* Inner dot — mix-blend-mode difference */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-branco"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "difference",
          width: 6,
          height: 6,
        }}
      />

      {/* Outer ring — trailing */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full flex items-center justify-center overflow-hidden"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          border: "0.5px solid rgba(248,248,246,0.65)",
        }}
        animate={{ width: ringSize, height: ringSize, opacity: ringOpacity }}
        transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <AnimatePresence>
          {cursorState === "image" && (
            <motion.span
              key="ver"
              className="font-inter text-[9px] tracking-[0.18em] text-branco uppercase select-none"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.18 }}
            >
              VER
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
