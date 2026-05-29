"use client"

import { useRef, useState } from "react"
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const BASE = process.env.NODE_ENV === "production" ? "/bmidia-site" : ""
const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]
const CLIP_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]

// ─── Word Reveal — clip-path por palavra ─────────────────────────────────────

function WordReveal({
  words,
  delay = 0,
}: {
  words: Array<string | React.ReactNode>
  delay?: number
}) {
  return (
    <>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden leading-tight mr-[0.28em] last:mr-0"
        >
          <motion.span
            className="inline-block"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            transition={{
              delay: delay + i * 0.08,
              duration: 0.9,
              ease: CLIP_EASE,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </>
  )
}

// ─── GSAP Section Reveal ──────────────────────────────────────────────────────

function GsapSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!ref.current) return
      const items = gsap.utils.toArray<HTMLElement>(".gsap-reveal", ref.current)
      if (!items.length) return

      gsap.fromTo(
        items,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.15,
          delay,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 82%",
            once: true,
          },
        }
      )
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

function GsapItem({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`gsap-reveal ${className}`}>{children}</div>
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav() {
  const { scrollY } = useScroll()
  const bg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(4,0,34,0)", "rgba(4,0,34,0.97)"]
  )

  return (
    <motion.nav
      style={{ backgroundColor: bg }}
      className="fixed top-0 left-0 right-0 z-50 px-8 md:px-14 py-5 flex items-center justify-between"
    >
      <div className="flex flex-col">
        <span className="font-playfair text-xl tracking-wide text-branco">
          B Mídia
        </span>
        <span className="font-playfair italic text-[10px] tracking-[0.2em] text-cinza leading-tight">
          estratégia &amp; posicionamento
        </span>
      </div>

      <div className="hidden md:flex items-center gap-12">
        {[
          { label: "Método", href: "#metodo" },
          { label: "Serviços", href: "#servicos" },
          { label: "A agência", href: "#agencia" },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="font-inter text-xs tracking-[0.18em] text-cinza hover:text-branco transition-colors duration-300 uppercase"
          >
            {label}
          </a>
        ))}
      </div>

      <motion.a
        href="#cta"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="hidden md:inline-block font-inter text-xs tracking-[0.18em] uppercase border border-cinzaclaro/30 text-cinzaclaro px-6 py-3 hover:border-branco hover:text-branco transition-all duration-300"
      >
        Quero conversar
      </motion.a>
    </motion.nav>
  )
}

// ─── Hero — Parallax Multi-Camadas ───────────────────────────────────────────

function Hero() {
  const heroRef = useRef<HTMLElement>(null)

  // Scroll parallax — mapeado pelo progresso do hero saindo da tela
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  // Layer 1 (bg): 0.3× velocidade de scroll — sobe 30vh enquanto página sobe 100vh
  const layer1Y = useTransform(scrollYProgress, [0, 1], ["0vh", "70vh"])
  // Layer 2 (headline): 0.6× velocidade
  const layer2Y = useTransform(scrollYProgress, [0, 1], ["0vh", "40vh"])
  // Layer 3 (subline + CTA): 1× (normal) — sem transform

  // Mouse parallax — direção oposta ao cursor, max 25px
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const bgMouseX = useSpring(mouseX, { stiffness: 60, damping: 25 })
  const bgMouseY = useSpring(mouseY, { stiffness: 60, damping: 25 })

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { width, height } = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX / width - 0.5) * -50)
    mouseY.set((e.clientY / height - 0.5) * -50)
  }

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0)
        mouseY.set(0)
      }}
    >
      {/* ── LAYER 1: Imagem de fundo — 0.3× velocidade scroll ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: layer1Y }}
      >
        <motion.div
          className="w-full h-full"
          style={{ x: bgMouseX, y: bgMouseY, scale: 1.2 }}
        >
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
            data-cursor="image"
          />
        </motion.div>
        {/* Overlay dentro da layer 1 — acompanha a imagem */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(4,0,34,0.90) 0%, rgba(4,0,34,0.85) 70%, rgba(4,0,34,1) 100%)",
          }}
        />
      </motion.div>

      {/* ── LAYER 2: Logo + Headline — 0.6× velocidade scroll ── */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ y: layer2Y }}
      >
        <div className="px-8 max-w-4xl mx-auto w-full text-center">
          {/* Logo — rotateY 0→360 em 1.4s */}
          <div style={{ overflow: "hidden" }}>
            <motion.img
              src={`${BASE}/logo-branca.png.png`}
              alt="B Mídia"
              className="h-16 w-auto mx-auto mb-5"
              initial={{ y: 80, opacity: 0, rotateY: 0 }}
              animate={{ y: 0, opacity: 1, rotateY: 360 }}
              transition={{
                y: { duration: 0.9, ease: EASE_EXPO, delay: 0.15 },
                opacity: { duration: 0.9, ease: EASE_EXPO, delay: 0.15 },
                rotateY: { duration: 1.4, ease: EASE_EXPO, delay: 0.25 },
              }}
              style={{ transformPerspective: 800 }}
              onError={(e) => {
                const el = e.target as HTMLImageElement
                el.replaceWith(
                  Object.assign(document.createElement("span"), {
                    textContent: "B",
                    style:
                      "font-family:var(--font-playfair);font-size:5rem;font-style:italic;color:#f8f8f6;display:block;margin-bottom:1.25rem",
                  })
                )
              }}
            />
          </div>

          {/* Eyebrow */}
          <div style={{ overflow: "hidden" }}>
            <motion.span
              className="font-inter text-[0.72rem] tracking-[0.28em] uppercase text-cinza block mb-6"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.9, ease: EASE_EXPO }}
            >
              B Mídia — Florianópolis, SC
            </motion.span>
          </div>

          {/* Linha decorativa */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.7, ease: EASE_EXPO }}
            className="origin-center mb-8 mx-auto"
            style={{
              width: 60,
              height: "0.5px",
              backgroundColor: "rgba(255,255,255,0.15)",
            }}
          />

          {/* Headline — clip-path por palavra + flutuação infinita */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity,
              delay: 3.2,
            }}
          >
            <h1
              className="font-playfair text-[2.2rem] md:text-[3.5rem] text-branco mb-8"
              style={{ letterSpacing: "0.02em", lineHeight: 1.35 }}
            >
              <span className="block">
                <WordReveal
                  words={["Sua", "marca", "não", "precisa"]}
                  delay={0.85}
                />
              </span>
              <span className="block">
                <WordReveal words={["de", "mais", "posts."]} delay={1.05} />
              </span>
              <span className="block">
                <WordReveal
                  words={[
                    "Precisa",
                    "ser",
                    <em key="em" className="italic text-cinzaclaro">
                      reconhecida.
                    </em>,
                  ]}
                  delay={1.25}
                />
              </span>
            </h1>
          </motion.div>
        </div>
      </motion.div>

      {/* ── LAYER 3: Subline + CTA — 1× velocidade (normal) ── */}
      <div className="absolute bottom-20 left-0 right-0 flex flex-col items-center pointer-events-auto px-8">
        <motion.p
          className="font-inter text-[0.95rem] tracking-[0.08em] text-cinza mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.9, ease: EASE_EXPO }}
        >
          Comunicação sem observação é decoração.
        </motion.p>

        <motion.a
          href="#cta"
          whileHover={{ scale: 1.04, backgroundColor: "#f8f8f6", color: "#040022" }}
          whileTap={{ scale: 0.97 }}
          className="inline-block font-inter text-[0.72rem] tracking-[0.18em] uppercase text-cinzaclaro transition-colors duration-300"
          style={{ border: "0.5px solid #e1e1e1", padding: "0.8rem 2rem" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1, duration: 0.9, ease: EASE_EXPO }}
        >
          Vamos entender sua marca
        </motion.a>
      </div>
    </section>
  )
}

// ─── Problema ────────────────────────────────────────────────────────────────

const problemas = [
  "Postam todo dia sem saber por quê.",
  "Investem em produção visual antes de ter posicionamento.",
  "Contratam quem entrega conteúdo, não quem entende o negócio.",
  "Confundem engajamento com resultado.",
  "Têm presença digital que não reflete o valor real.",
]

function Problema() {
  return (
    <section
      id="metodo"
      className="px-8 md:px-14 lg:px-20 py-28 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 border-t border-cinza/10"
    >
      <GsapSection>
        <GsapItem>
          <span className="font-inter text-[10px] tracking-[0.28em] text-cinza uppercase block mb-7">
            O cenário atual
          </span>
        </GsapItem>
        <GsapItem>
          <h2 className="font-playfair text-3xl md:text-4xl text-branco leading-[1.28] mb-8">
            Muitos negócios postam
            <br />
            todos os dias.
            <br />
            <em className="italic text-cinzaclaro">Poucos são lembrados.</em>
          </h2>
        </GsapItem>
        <GsapItem>
          <p className="font-inter text-sm text-cinza leading-relaxed max-w-sm">
            O problema não é a falta de conteúdo. É a falta de intenção por
            trás de cada publicação. Presença sem estratégia é ruído. E ruído
            não converte — ele afasta.
          </p>
        </GsapItem>
      </GsapSection>

      <GsapSection delay={0.18}>
        {problemas.map((p, i) => (
          <GsapItem key={i}>
            <motion.div
              className="flex gap-6 py-5 border-b border-cinza/10 last:border-0 items-start"
              whileHover="rowHover"
            >
              <motion.span
                variants={{ rowHover: { opacity: 0.9 } }}
                style={{ opacity: 0.25 }}
                className="font-playfair italic text-cinza text-sm shrink-0 mt-0.5 tabular-nums"
                transition={{ duration: 0.2 }}
              >
                {String(i + 1).padStart(2, "0")}
              </motion.span>
              <motion.p
                variants={{ rowHover: { color: "#f8f8f6" } }}
                className="font-inter text-sm text-cinzaclaro leading-relaxed"
                transition={{ duration: 0.2 }}
              >
                {p}
              </motion.p>
            </motion.div>
          </GsapItem>
        ))}
      </GsapSection>
    </section>
  )
}

// ─── Método ──────────────────────────────────────────────────────────────────

const metodos = [
  {
    num: "01",
    val: 1,
    title: "Observação primeiro",
    text: "Antes de criar qualquer conteúdo, observamos o negócio, o público e o que já funciona.",
  },
  {
    num: "02",
    val: 2,
    title: "Consistência bate frequência",
    text: "Uma marca com intenção três vezes por semana converte mais do que uma que posta todo dia sem direção.",
  },
  {
    num: "03",
    val: 3,
    title: "Marca é percepção",
    text: "Uma marca bem comunicada não precisa convencer. Ela é reconhecida.",
  },
  {
    num: "04",
    val: 4,
    title: "Poucos projetos, muita entrega",
    text: "Não trabalhamos com carteira grande. Presença real dentro de cada conta.",
  },
]

function Metodo() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Reveal dos cards + counter-up nos números grandes
  useGSAP(
    () => {
      if (!gridRef.current) return

      // Revela os GsapItems do grid (sem GsapSection pai)
      const revealEls = gsap.utils.toArray<HTMLElement>(".gsap-reveal", gridRef.current)
      if (revealEls.length) {
        gsap.fromTo(
          revealEls,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 82%",
              once: true,
            },
          }
        )
      }

      // Counter-up nos números grandes
      const numEls = gridRef.current.querySelectorAll("[data-counter]")
      numEls.forEach((el) => {
        const target = parseInt((el as HTMLElement).dataset.counter || "0", 10)
        const obj = { val: 0 }
        gsap.to(obj, {
          val: target,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
          onUpdate() {
            ;(el as HTMLElement).textContent = String(
              Math.round(obj.val)
            ).padStart(2, "0")
          },
        })
      })
    },
    { scope: gridRef }
  )

  return (
    <section
      ref={sectionRef}
      id="servicos"
      className="px-8 md:px-14 lg:px-20 py-28 border-t border-cinza/10"
    >
      <GsapSection className="mb-16">
        <GsapItem>
          <span className="font-inter text-[10px] tracking-[0.28em] text-cinza uppercase block mb-5">
            Método
          </span>
        </GsapItem>
        <GsapItem>
          <h2 className="font-playfair text-3xl md:text-4xl text-branco">
            Como a B Mídia pensa
          </h2>
        </GsapItem>
      </GsapSection>

      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      >
        {metodos.map((m, i) => (
          <GsapItem
            key={m.num}
            className={[
              i < 3
                ? "border-b lg:border-b-0 lg:border-r border-cinza/10"
                : "border-b lg:border-b-0 border-cinza/10",
            ].join(" ")}
          >
            <motion.div
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.04)" }}
              transition={{ duration: 0.3 }}
              className={[
                "px-8 py-10 h-full",
                i === 0 ? "lg:pl-0" : "",
                i === 3 ? "lg:pr-0" : "",
              ].join(" ")}
            >
              {/* Número grande com counter-up */}
              <span
                className="font-playfair italic text-[5.5rem] leading-none text-cinza/[0.08] block mb-5 select-none"
                data-counter={m.val}
              >
                {m.num}
              </span>
              <h3 className="font-playfair text-xl text-branco mb-3">
                {m.title}
              </h3>
              <p className="font-inter text-sm text-cinza leading-relaxed">
                {m.text}
              </p>
            </motion.div>
          </GsapItem>
        ))}
      </div>
    </section>
  )
}

// ─── Serviços ─────────────────────────────────────────────────────────────────

const servicos = [
  { title: "Estratégia e Posicionamento", tags: ["Diagnóstico", "Linha Editorial"] },
  { title: "Gestão de Redes Sociais", tags: ["Instagram", "Stories", "Reels"] },
  { title: "Copywriting e Conteúdo", tags: ["Copy", "Legendas", "Roteiros"] },
  { title: "Identidade de Comunicação", tags: ["Tom de Voz", "Pilares", "Visual"] },
  { title: "Calendário Editorial", tags: ["Planejamento", "Calendário"] },
  { title: "Design e Produção Visual", tags: ["Design", "Edição", "Arte"] },
]

// Card 3D — rotação responsiva ao mouse com lerp suave
function ServicoCard({ title, tags }: { title: string; tags: string[] }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const rotX = useMotionValue(0)
  const rotY = useMotionValue(0)
  const sRotX = useSpring(rotX, { stiffness: 120, damping: 22 })
  const sRotY = useSpring(rotY, { stiffness: 120, damping: 22 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const { width, height, left, top } = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - left) / width - 0.5
    const y = (e.clientY - top) / height - 0.5
    rotX.set(-y * 8)
    rotY.set(x * 8)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        rotX.set(0)
        rotY.set(0)
        setHovered(false)
      }}
      style={{ rotateX: sRotX, rotateY: sRotY, transformPerspective: 1000 }}
      className="p-8 border border-cinza/10 relative overflow-hidden bg-indigo h-full"
    >
      {/* Borda inferior animada no hover */}
      <motion.div
        className="absolute bottom-0 left-0 h-px bg-branco/50"
        animate={{ width: hovered ? "100%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.25, 0.4, 0.25, 1] }}
      />
      <motion.h3
        className="font-playfair text-xl text-branco mb-5 leading-snug"
        animate={{ opacity: hovered ? 1 : 0.82 }}
        transition={{ duration: 0.3 }}
      >
        {title}
      </motion.h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="font-inter text-[10px] tracking-[0.18em] text-cinza/50 border border-cinza/20 px-3 py-1 uppercase"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

function Servicos() {
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!gridRef.current) return
      const items = gsap.utils.toArray<HTMLElement>(".servico-card", gridRef.current)
      gsap.fromTo(
        items,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.09,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 82%",
            once: true,
          },
        }
      )
    },
    { scope: gridRef }
  )

  return (
    <section className="px-8 md:px-14 lg:px-20 py-28 border-t border-cinza/10">
      <GsapSection className="mb-16">
        <GsapItem>
          <span className="font-inter text-[10px] tracking-[0.28em] text-cinza uppercase block mb-5">
            Serviços
          </span>
        </GsapItem>
        <GsapItem>
          <h2 className="font-playfair text-3xl md:text-4xl text-branco">
            O que a B Mídia oferece
          </h2>
        </GsapItem>
      </GsapSection>

      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-cinza/10"
      >
        {servicos.map((s) => (
          <div key={s.title} className="servico-card bg-indigo">
            <ServicoCard {...s} />
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Para Quem ────────────────────────────────────────────────────────────────

const paraQuemSim = [
  "Marcas que entendem comunicação como investimento.",
  "Negócios que querem ser reconhecidos, não apenas vistos.",
  "Quem quer construir no longo prazo.",
  "Quem valoriza qualidade acima de volume.",
  "Quem está pronto para aparecer com consistência.",
]

const paraQuemNao = [
  "Quem quer só animar o Instagram.",
  "Quem busca resultado imediato sem processo.",
  "Quem precisa de volume sem critério.",
  "Quem não está disposto a construir junto.",
  "Quem escolhe só por preço.",
]

function ParaQuem() {
  return (
    <section
      id="agencia"
      className="px-8 md:px-14 lg:px-20 py-28 border-t border-cinza/10 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24"
    >
      <GsapSection>
        <GsapItem>
          <h2 className="font-playfair text-2xl md:text-3xl text-branco mb-10">
            Para quem a B Mídia <em className="italic">é</em>
          </h2>
        </GsapItem>
        {paraQuemSim.map((item, i) => (
          <GsapItem key={i}>
            <motion.div
              className="flex gap-5 py-4 border-b border-cinza/10 last:border-0 items-start"
              whileHover={{ x: 6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <span className="text-xs mt-1 shrink-0 font-inter text-branco/25">
                ✦
              </span>
              <p className="font-inter text-sm leading-relaxed text-cinzaclaro">
                {item}
              </p>
            </motion.div>
          </GsapItem>
        ))}
      </GsapSection>

      <GsapSection delay={0.2}>
        <GsapItem>
          <h2 className="font-playfair text-2xl md:text-3xl text-branco mb-10">
            Para quem <em className="italic">não é</em>
          </h2>
        </GsapItem>
        {paraQuemNao.map((item, i) => (
          <GsapItem key={i}>
            <motion.div
              className="flex gap-5 py-4 border-b border-cinza/10 last:border-0 items-start"
              whileHover={{ x: 6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <span className="text-xs mt-1 shrink-0 font-inter text-cinza/30">
                —
              </span>
              <p className="font-inter text-sm leading-relaxed text-cinza">
                {item}
              </p>
            </motion.div>
          </GsapItem>
        ))}
      </GsapSection>
    </section>
  )
}

// ─── Sobre Bruna ──────────────────────────────────────────────────────────────

function SobreBruna() {
  const photoContainerRef = useRef<HTMLDivElement>(null)
  const photoImgRef = useRef<HTMLImageElement>(null)

  // Parallax vertical sutil na foto — GSAP scrub
  useGSAP(
    () => {
      if (!photoContainerRef.current || !photoImgRef.current) return
      gsap.fromTo(
        photoImgRef.current,
        { y: "0%" },
        {
          y: "-20%",
          ease: "none",
          scrollTrigger: {
            trigger: photoContainerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      )
    },
    { scope: photoContainerRef }
  )

  return (
    <section className="px-8 md:px-14 lg:px-20 py-28 border-t border-cinza/10 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
      {/* Coluna esquerda — Foto com parallax */}
      <GsapSection>
        <GsapItem>
          <div
            ref={photoContainerRef}
            className="bg-[#0a0030] aspect-[3/4] overflow-hidden"
          >
            <img
              ref={photoImgRef}
              src={`${BASE}/foto-bruna.jpg`}
              alt="Bruna Ribeiro"
              className="w-full h-[120%] object-cover object-top"
              style={{ filter: "grayscale(15%) contrast(1.05)" }}
              data-cursor="image"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = "none"
              }}
            />
          </div>
        </GsapItem>
      </GsapSection>

      {/* Coluna direita — Texto */}
      <GsapSection delay={0.2} className="flex flex-col justify-center">
        <GsapItem>
          <span className="font-inter text-[10px] tracking-[0.28em] text-cinza uppercase block mb-8">
            A agência
          </span>
        </GsapItem>
        <GsapItem>
          <blockquote className="font-playfair italic text-2xl md:text-3xl text-branco leading-[1.42] mb-10">
            &ldquo;Minha maior força é perceber o que a marca ainda não sabe
            dizer sobre si mesma.&rdquo;
          </blockquote>
        </GsapItem>
        <GsapItem>
          <p className="font-inter text-sm text-cinza leading-relaxed mb-5">
            A B Mídia nasceu da convicção de que comunicação estratégica não é
            privilégio de grandes empresas. É o que transforma um bom produto em
            uma marca que as pessoas procuram.
          </p>
        </GsapItem>
        <GsapItem>
          <p className="font-inter text-sm text-cinza leading-relaxed mb-5">
            Trabalhamos com poucos clientes de forma intencional. Cada projeto
            recebe atenção real — não de um time enorme, mas de quem entende o
            seu negócio como se fosse o próprio.
          </p>
        </GsapItem>
        <GsapItem>
          <p className="font-inter text-sm text-cinza leading-relaxed mb-12">
            O resultado não é viral. É reconhecimento. É construção.
          </p>
        </GsapItem>
        <GsapItem>
          <div className="border-t border-cinza/20 pt-7">
            <p className="font-playfair text-branco text-lg tracking-wide">
              Bruna Ribeiro
            </p>
            <p className="font-inter text-[10px] tracking-[0.25em] text-cinza mt-1.5 uppercase">
              Fundadora e Estrategista
            </p>
          </div>
        </GsapItem>
      </GsapSection>
    </section>
  )
}

// ─── CTA Final ───────────────────────────────────────────────────────────────

function CtaFinal() {
  return (
    <section
      id="cta"
      className="px-8 md:px-14 py-36 border-t border-cinza/10 flex flex-col items-center text-center"
    >
      <GsapSection className="max-w-2xl mx-auto w-full">
        <GsapItem>
          <span className="font-inter text-[10px] tracking-[0.3em] text-cinza uppercase block mb-9">
            Próximo passo
          </span>
        </GsapItem>
        <GsapItem>
          <h2 className="font-playfair text-3xl md:text-5xl text-branco leading-[1.22] mb-8">
            Vamos entender o que sua marca
            <br />
            <em className="italic">precisa comunicar</em>
          </h2>
        </GsapItem>
        <GsapItem>
          <p className="font-inter text-sm text-cinza leading-relaxed mb-14 max-w-sm mx-auto">
            O primeiro passo é uma conversa. Sem compromisso, sem roteiro de
            vendas.
          </p>
        </GsapItem>
        <GsapItem>
          <motion.a
            href="https://brunaribeirosocialmedia-glitch.github.io/portfolio/briefing/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block font-inter text-xs tracking-[0.22em] uppercase bg-branco text-indigo px-12 py-5 hover:bg-cinzaclaro transition-colors duration-300"
          >
            Quero essa conversa
          </motion.a>
        </GsapItem>
      </GsapSection>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="px-8 md:px-14 py-10 border-t border-cinza/10 flex flex-col md:flex-row items-center justify-between gap-5">
      <div className="flex flex-col items-center md:items-start">
        <span className="font-playfair text-lg text-branco tracking-wide">
          B Mídia
        </span>
        <span className="font-playfair italic text-[10px] text-cinza tracking-widest">
          estratégia &amp; posicionamento
        </span>
      </div>

      <p className="font-inter text-[10px] tracking-[0.2em] text-cinza/50 uppercase">
        © {new Date().getFullYear()} B Mídia. Todos os direitos reservados.
      </p>

      <a
        href="https://instagram.com/brunaribeirosocialmedia"
        target="_blank"
        rel="noopener noreferrer"
        className="font-inter text-[10px] tracking-[0.18em] text-cinza hover:text-branco transition-colors duration-300 uppercase"
      >
        @brunaribeirosocialmedia
      </a>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <main className="bg-indigo min-h-screen">
      <Nav />
      <Hero />
      <Problema />
      <Metodo />
      <Servicos />
      <ParaQuem />
      <SobreBruna />
      <CtaFinal />
      <Footer />
    </main>
  )
}
