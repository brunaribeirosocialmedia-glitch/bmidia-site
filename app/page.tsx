"use client"

import { useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const BASE = process.env.NODE_ENV === "production" ? "/bmidia-site" : ""

// ─── Fundo fluido reutilizável ────────────────────────────────────────────────

function FluidBackground({ variant = 1 }: { variant?: 1 | 2 | 3 | 4 | 5 }) {
  const configs = {
    1: {
      shapes: [
        { d: "M -80 0 C 300 60 250 -60 700 100 C 950 220 700 380 1050 300 C 1250 250 1350 440 1540 380 L 1540 0 Z", fill: "#080535", op: 0.6 },
        { d: "M 1540 900 C 1100 800 950 920 680 740 C 440 600 600 440 320 510 C 120 570 -20 430 -80 500 L -80 900 Z", fill: "#060330", op: 0.55 },
        { d: "M 200 0 C 380 120 240 280 460 400 C 640 510 820 340 900 480 C 980 610 820 740 980 900 L 200 900 Z", fill: "#07042e", op: 0.3 },
      ],
      lines: [
        { d: "M -80 160 C 250 80 480 260 720 170 C 940 90 1080 290 1380 210 C 1460 185 1510 240 1540 220", stroke: "rgba(160,140,220,0.07)", w: 1 },
        { d: "M -80 500 C 180 420 360 560 600 470 C 800 395 980 580 1220 490 C 1380 430 1460 510 1540 480", stroke: "rgba(160,140,220,0.05)", w: 0.8 },
        { d: "M 350 0 C 480 70 390 160 580 195 C 720 220 820 140 1000 175 C 1120 200 1180 130 1300 100", stroke: "rgba(160,140,220,0.05)", w: 0.6 },
      ],
    },
    2: {
      shapes: [
        { d: "M 1540 0 C 1100 100 900 -50 600 150 C 350 280 500 450 200 380 C 50 340 -50 480 -80 440 L -80 0 Z", fill: "#070430", op: 0.55 },
        { d: "M -80 900 C 300 820 480 960 780 800 C 1020 660 880 500 1160 560 C 1340 600 1440 480 1540 520 L 1540 900 Z", fill: "#060330", op: 0.5 },
      ],
      lines: [
        { d: "M 1540 200 C 1200 140 980 300 720 210 C 480 130 280 320 -80 240", stroke: "rgba(160,140,220,0.06)", w: 1 },
        { d: "M 1540 580 C 1260 500 1040 660 780 560 C 560 470 320 640 -80 540", stroke: "rgba(160,140,220,0.04)", w: 0.7 },
      ],
    },
    3: {
      shapes: [
        { d: "M -80 0 C 400 -40 600 200 900 80 C 1140 -20 1300 180 1540 120 L 1540 0 Z", fill: "#080435", op: 0.55 },
        { d: "M -80 900 C 200 860 400 960 700 880 C 950 810 1100 920 1540 870 L 1540 900 Z", fill: "#050228", op: 0.6 },
        { d: "M 600 0 C 700 200 560 380 720 520 C 860 640 1040 500 1100 680 C 1160 840 1040 900 1200 900 L 600 900 Z", fill: "#07042e", op: 0.28 },
      ],
      lines: [
        { d: "M -80 300 C 200 220 480 400 760 290 C 1020 190 1220 380 1540 300", stroke: "rgba(160,140,220,0.07)", w: 0.9 },
        { d: "M -80 620 C 300 540 580 700 860 600 C 1100 510 1300 680 1540 600", stroke: "rgba(160,140,220,0.04)", w: 0.7 },
        { d: "M 200 0 C 340 100 260 220 440 270 C 600 310 700 210 860 250", stroke: "rgba(160,140,220,0.05)", w: 0.5 },
      ],
    },
    4: {
      shapes: [
        { d: "M -80 200 C 300 100 500 300 800 180 C 1050 80 1250 260 1540 160 L 1540 0 L -80 0 Z", fill: "#080432", op: 0.5 },
        { d: "M -80 700 C 200 640 500 780 800 680 C 1060 590 1280 740 1540 660 L 1540 900 L -80 900 Z", fill: "#060330", op: 0.55 },
      ],
      lines: [
        { d: "M -80 380 C 300 280 600 460 900 350 C 1160 250 1360 420 1540 360", stroke: "rgba(160,140,220,0.06)", w: 0.9 },
        { d: "M -80 500 C 250 440 520 580 820 480 C 1080 390 1300 540 1540 470", stroke: "rgba(160,140,220,0.04)", w: 0.6 },
      ],
    },
    5: {
      shapes: [
        { d: "M 0 0 C 480 80 720 -60 1100 100 C 1300 180 1440 80 1540 120 L 1540 0 Z", fill: "#090535", op: 0.5 },
        { d: "M 0 900 C 360 820 640 940 960 840 C 1200 760 1380 880 1540 820 L 1540 900 Z", fill: "#060330", op: 0.6 },
        { d: "M 760 0 C 840 180 700 360 860 500 C 1000 620 1200 480 1260 660 C 1320 820 1200 900 1540 900 L 1540 0 Z", fill: "#07042c", op: 0.25 },
      ],
      lines: [
        { d: "M -80 250 C 300 160 600 340 920 220 C 1180 120 1380 300 1540 240", stroke: "rgba(160,140,220,0.08)", w: 1 },
        { d: "M -80 650 C 240 560 540 720 840 610 C 1100 510 1320 680 1540 610", stroke: "rgba(160,140,220,0.05)", w: 0.7 },
        { d: "M 500 0 C 620 90 520 200 700 240 C 860 275 980 180 1140 210", stroke: "rgba(160,140,220,0.05)", w: 0.55 },
      ],
    },
  }

  const c = configs[variant]

  return (
    <svg
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1440 900"
    >
      {c.shapes.map((s, i) => (
        <path key={i} d={s.d} fill={s.fill} opacity={s.op} />
      ))}
      {c.lines.map((l, i) => (
        <path key={i} d={l.d} fill="none" stroke={l.stroke} strokeWidth={l.w} />
      ))}
    </svg>
  )
}
const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]
const CLIP_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]

// ─── Word Reveal ─────────────────────────────────────────────────────────────

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
            transition={{ delay: delay + i * 0.08, duration: 0.9, ease: CLIP_EASE }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </>
  )
}

// ─── Section Reveal ───────────────────────────────────────────────────────────

const fadeItem: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
}

function RevealSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.12 })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.13, delayChildren: delay } },
      }}
      className={`relative z-10 ${className}`}
    >
      {children}
    </motion.div>
  )
}

function RevealItem({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div variants={fadeItem} className={className}>
      {children}
    </motion.div>
  )
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav() {
  const { scrollY } = useScroll()
  const bg = useTransform(scrollY, [0, 80], ["rgba(4,0,34,0)", "rgba(4,0,34,0.97)"])

  return (
    <motion.nav
      style={{ backgroundColor: bg }}
      className="fixed top-0 left-0 right-0 z-50 px-8 md:px-14 py-5 flex items-center justify-between"
    >
      <div className="flex flex-col">
        <span className="font-cormorant text-xl tracking-wide text-branco">B Mídia</span>
        <span className="font-cormorant italic text-[10px] tracking-[0.2em] text-cinza leading-tight">
          estratégia e posicionamento
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
            className="font-questrial text-xs tracking-[0.18em] text-cinza hover:text-branco transition-colors duration-300 uppercase"
          >
            {label}
          </a>
        ))}
      </div>

      <a
        href="#cta"
        className="hidden md:inline-block font-questrial text-xs tracking-[0.18em] uppercase border border-cinzaclaro/30 text-cinzaclaro px-6 py-3 hover:border-branco hover:text-branco transition-all duration-300 rounded-[6px]"
      >
        Quero conversar
      </a>
    </motion.nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })

  const layer1Y = useTransform(scrollYProgress, [0, 1], ["0vh", "70vh"])
  const layer2Y = useTransform(scrollYProgress, [0, 1], ["0vh", "40vh"])

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
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0) }}
    >
      {/* Layer 1: Fundo com linhas fluidas dançando */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: layer1Y }}>
        {/* Base navy */}
        <div className="absolute inset-0" style={{ background: "#040022" }} />

        <FluidBackground variant={1} />

        {/* Vinheta suave nas bordas */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 35%, rgba(2,0,15,0.65) 100%)",
          }}
        />
      </motion.div>

      {/* Conteúdo unificado — fluxo de coluna sem sobreposição */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-8"
        style={{ y: layer2Y }}
      >
        <div className="max-w-3xl mx-auto w-full text-center flex flex-col items-center">
          {/* Logo */}
          <div style={{ overflow: "hidden", perspective: "800px" }}>
            <motion.img
              src={`${BASE}/logo-bm%C3%ADdia-branco.png`}
              alt="B Mídia"
              style={{
                height: 200,
                width: "auto",
                objectFit: "contain",
                display: "block",
                margin: "0 auto 1.75rem",
              }}
              initial={{ opacity: 0, rotateY: 0 }}
              animate={{ opacity: 1, rotateY: 360 }}
              transition={{
                opacity: { duration: 2.0, ease: "easeOut", delay: 0.3 },
                rotateY: { duration: 4.5, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 },
              }}
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = "none"
              }}
            />
          </div>

          {/* Linha decorativa */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 1.6, duration: 1.4, ease: EASE_EXPO }}
            className="origin-center mb-8"
            style={{ width: 60, height: "0.5px", backgroundColor: "rgba(255,255,255,0.15)" }}
          />

          {/* Headline */}
          <div style={{ overflow: "hidden" }} className="mb-10">
            <motion.h1
              className="font-cormorant text-[1.6rem] md:text-[2.2rem] text-branco text-center"
              style={{ letterSpacing: "0.02em", lineHeight: 1.4 }}
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ delay: 1.9, duration: 1.6, ease: [0.76, 0, 0.24, 1] }}
            >
              Sua marca não precisa de mais publicações.
              <br />
              Precisa ser <em className="italic text-cinzaclaro">reconhecida.</em>
            </motion.h1>
          </div>

          {/* Subfrase */}
          <motion.p
            className="font-questrial text-[0.9rem] tracking-[0.08em] text-cinza mb-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2, duration: 1.4, ease: EASE_EXPO }}
          >
            Comunicação sem observação é decoração.
          </motion.p>

          {/* CTA */}
          <motion.a
            href="#cta"
            whileHover={{ backgroundColor: "#f8f8f6", color: "#040022" }}
            whileTap={{ scale: 0.97 }}
            className="inline-block font-questrial text-[0.72rem] tracking-[0.18em] uppercase text-cinzaclaro transition-colors duration-300 rounded-[6px]"
            style={{ border: "0.5px solid #e1e1e1", padding: "0.8rem 2rem" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.7, duration: 1.4, ease: EASE_EXPO }}
          >
            Vamos entender sua marca
          </motion.a>
        </div>
      </motion.div>
    </section>
  )
}

// ─── Problema ─────────────────────────────────────────────────────────────────

const problemas = [
  "Postam todo dia sem saber por que.",
  "Investem em produção visual antes de ter posicionamento.",
  "Contratam quem entrega conteúdo, não quem entende o negócio.",
  "Confundem engajamento com resultado.",
  "Têm presença digital que não reflete o valor real.",
]

function Problema() {
  return (
    <section
      id="metodo"
      className="relative px-8 md:px-14 lg:px-20 py-28 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 border-t border-cinza/10 overflow-hidden"
    >
      <FluidBackground variant={2} />
      <RevealSection>
        <RevealItem>
          <span className="font-questrial text-[10px] tracking-[0.28em] text-cinza uppercase block mb-7">
            O cenário atual
          </span>
        </RevealItem>
        <RevealItem>
          <h2 className="font-cormorant text-3xl md:text-4xl text-branco leading-[1.28] mb-8">
            Muitos negócios postam
            <br />
            todos os dias.
            <br />
            <em className="italic text-cinzaclaro">Poucos são lembrados.</em>
          </h2>
        </RevealItem>
        <RevealItem>
          <p className="font-questrial text-sm text-cinza leading-relaxed max-w-sm">
            O problema não é a falta de conteúdo. É a falta de intenção por
            trás de cada publicação. Presença sem estratégia é ruído. E ruído
            não converte, ele afasta.
          </p>
        </RevealItem>
      </RevealSection>

      <RevealSection delay={0.18}>
        {problemas.map((p, i) => (
          <RevealItem key={i}>
            <motion.div
              className="flex gap-6 py-5 border-b border-cinza/10 last:border-0 items-start"
              whileHover="rowHover"
            >
              <motion.span
                variants={{ rowHover: { opacity: 0.9 } }}
                style={{ opacity: 0.25 }}
                className="font-cormorant italic text-cinza text-sm shrink-0 mt-0.5 tabular-nums"
                transition={{ duration: 0.2 }}
              >
                {String(i + 1).padStart(2, "0")}
              </motion.span>
              <motion.p
                variants={{ rowHover: { color: "#f8f8f6" } }}
                className="font-questrial text-sm text-cinzaclaro leading-relaxed"
                transition={{ duration: 0.2 }}
              >
                {p}
              </motion.p>
            </motion.div>
          </RevealItem>
        ))}
      </RevealSection>
    </section>
  )
}

// ─── Método — cards expandíveis ───────────────────────────────────────────────

const metodos = [
  {
    num: "01",
    title: "Observação",
    summary:
      "Antes de qualquer execução, observo. O que a marca entrega? O que o digital já comunica? Onde está o gap?",
    detail:
      "Analiso o perfil existente, o tom de voz atual, o que os concorrentes comunicam e o que o público espera. A pergunta central é sempre: o que essa marca entrega é maior do que o que ela mostra? Quando a resposta é sim, é onde começo a trabalhar. Não inicio nenhum projeto sem essa leitura. Criação sem observação é decoração.",
  },
  {
    num: "02",
    title: "Diagnóstico",
    summary:
      "Identifico o principal problema de comunicação e chego ao briefing com uma hipótese de posicionamento já formada.",
    detail:
      "O briefing não é um formulário preenchido. É um alinhamento estratégico. Chego à reunião com hipóteses, não com perguntas abertas. A marca tem diferencial claro ou está genérica? O público está sendo endereçado corretamente? O tom cria aproximação ou distância? Esse diagnóstico define tudo que vem depois.",
  },
  {
    num: "03",
    title: "Estratégia",
    summary:
      "Defino os pilares de conteúdo, a identidade de comunicação e o calendário editorial com intenção real por trás de cada peça.",
    detail:
      "Cada post existe por uma razão estratégica. Posicionamento, autoridade, conversão ou aproximação. Nunca para manter frequência. O calendário editorial é um instrumento de construção de percepção, não uma lista de tarefas. Entrego: identidade de comunicação, pilares de conteúdo, pauta mensal e guia de voz da marca.",
  },
  {
    num: "04",
    title: "Execução",
    summary:
      "Copywriting, design, edição e análise. Com IA integrada ao fluxo para escalar capacidade sem perder qualidade.",
    detail:
      "Redijo as legendas, reviso os visuais e coordeno a produção com foco em coerência estética e consistência de voz. Uso inteligência artificial como ferramenta de pesquisa, curadoria e geração de rascunhos, sempre com revisão estratégica humana. Entrego: conteúdo aprovado, agendado e analisado mensalmente.",
  },
]

function Metodo() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0)

  return (
    <section
      id="servicos"
      className="relative px-8 md:px-14 lg:px-20 py-28 border-t border-cinza/10 overflow-hidden"
      style={{ background: "rgba(255,255,255,0.015)" }}
    >
      <FluidBackground variant={3} />
      <RevealSection className="mb-14">
        <RevealItem>
          <span className="font-questrial text-[10px] tracking-[0.28em] text-cinza uppercase block mb-5">
            Método
          </span>
        </RevealItem>
        <RevealItem>
          <h2 className="font-cormorant text-3xl md:text-4xl text-branco">
            Como a B Mídia pensa
          </h2>
        </RevealItem>
      </RevealSection>

      {/* Grid 4 colunas lado a lado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-cinza/10 mb-px">
        {metodos.map((m, i) => (
          <motion.div
            key={m.num}
            onClick={() => setActiveIndex(activeIndex === i ? null : i)}
            animate={{
              backgroundColor:
                activeIndex === i ? "rgba(255,255,255,0.04)" : "rgba(4,0,34,1)",
            }}
            transition={{ duration: 0.3 }}
            className="cursor-pointer p-8 relative overflow-hidden rounded-[6px]"
          >
            <span className="font-cormorant italic text-cinza/20 text-5xl block mb-5 leading-none tabular-nums">
              {m.num}
            </span>
            <h3 className="font-cormorant text-lg text-branco mb-3 leading-snug">{m.title}</h3>
            <p className="font-questrial text-xs text-cinza leading-relaxed">{m.summary}</p>

            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[2px] origin-left"
              style={{ backgroundColor: "#7B79F7" }}
              animate={{ scaleX: activeIndex === i ? 1 : 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            />
          </motion.div>
        ))}
      </div>

      {/* Detalhe expandido abaixo do grid inteiro */}
      <AnimatePresence initial={false} mode="wait">
        {activeIndex !== null && (
          <motion.div
            key={activeIndex}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.25, 0.4, 0.25, 1] }}
            className="overflow-hidden bg-cinza/5"
          >
            <p className="font-questrial text-sm text-cinza/80 leading-relaxed px-10 py-8 max-w-3xl">
              {metodos[activeIndex].detail}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
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
  { title: "Captação de Conteúdo", tags: ["Foto", "Vídeo", "Produção"] },
  { title: "Catálogo Interativo", tags: ["Catálogo", "Digital", "Vendas"] },
]

function ServicoCard({ title, tags }: { title: string; tags: string[] }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{ backgroundColor: hovered ? "rgba(255,255,255,0.025)" : "rgba(4,0,34,1)" }}
      transition={{ duration: 0.5 }}
      className="p-8 relative overflow-hidden bg-indigo/80 h-full border border-cinza/10 rounded-2xl"
    >
      {/* Linha contínua base — sempre visível, muito sutil */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-cinza/10" />

      {/* Linha de destaque no hover — cobre o card inteiro */}
      <motion.div
        className="absolute bottom-0 left-0 h-px origin-left"
        style={{ backgroundColor: "rgba(194,194,194,0.35)", right: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
      />

      <motion.h3
        className="font-cormorant text-xl text-branco mb-5 leading-snug"
        animate={{ opacity: hovered ? 1 : 0.75 }}
        transition={{ duration: 0.4 }}
      >
        {title}
      </motion.h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="font-questrial text-[10px] tracking-[0.18em] text-cinza/50 border border-cinza/20 px-3 py-1 uppercase"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

function Servicos() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.08 })

  return (
    <section className="relative px-8 md:px-14 lg:px-20 py-28 border-t border-cinza/10 overflow-hidden">
      <FluidBackground variant={4} />
      <RevealSection className="mb-16">
        <RevealItem>
          <span className="font-questrial text-[10px] tracking-[0.28em] text-cinza uppercase block mb-5">
            Serviços
          </span>
        </RevealItem>
        <RevealItem>
          <h2 className="font-cormorant text-3xl md:text-4xl text-branco">
            O que a B Mídia oferece
          </h2>
        </RevealItem>
      </RevealSection>

      {/* Grid sem gap para linha contínua funcionar entre os cards */}
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {servicos.map((s, i) => (
          <motion.div
            key={s.title}
            variants={fadeItem}
            className="bg-indigo rounded-2xl overflow-hidden"
          >
            <ServicoCard {...s} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

// ─── Como Trabalhamos ─────────────────────────────────────────────────────────

const blocos = [
  {
    title: "Diagnóstico antes de tudo",
    text: "Antes de criar qualquer peça, entendemos onde sua marca está e o que ela precisa comunicar. Sem essa leitura, qualquer conteúdo é decoração.",
  },
  {
    title: "Presença real, não gestão automática",
    text: "Não trabalhamos com carteira cheia. Cada cliente recebe atenção real, estratégia própria e acompanhamento próximo.",
  },
  {
    title: "Resultado construído, não prometido",
    text: "Não vendemos seguidores nem viralização. Vendemos consistência estratégica que constrói percepção de valor ao longo do tempo.",
  },
]

function ComoTrabalhamos() {
  return (
    <section
      id="agencia"
      className="relative px-8 md:px-14 lg:px-20 py-28 border-t border-cinza/10 overflow-hidden"
      style={{ background: "rgba(255,255,255,0.015)" }}
    >
      <FluidBackground variant={1} />

      <RevealSection className="max-w-2xl mb-16">
        <RevealItem>
          <span className="font-questrial text-[10px] tracking-[0.28em] text-cinza uppercase block mb-5">
            Como trabalhamos
          </span>
        </RevealItem>
        <RevealItem>
          <h2 className="font-cormorant text-3xl md:text-4xl text-branco mb-6">
            Intenção em cada etapa
          </h2>
        </RevealItem>
        <RevealItem>
          <p className="font-questrial text-sm text-cinza leading-relaxed">
            Cada cliente passa por um diagnóstico antes de qualquer entrega.
            Porque comunicação sem leitura é improviso, e improviso não é o que vendemos.
          </p>
        </RevealItem>
      </RevealSection>

      <RevealSection className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
        {blocos.map((b, i) => (
          <RevealItem key={i}>
            <div className="w-8 h-px bg-branco/20 mb-7" />
            <h3 className="font-cormorant text-lg text-branco mb-4 leading-snug">
              {b.title}
            </h3>
            <p className="font-questrial text-sm text-cinza leading-relaxed">{b.text}</p>
          </RevealItem>
        ))}
      </RevealSection>
    </section>
  )
}

// ─── Sobre Bruna ──────────────────────────────────────────────────────────────

function SobreBruna() {
  const photoContainerRef = useRef<HTMLDivElement>(null)
  const photoImgRef = useRef<HTMLImageElement>(null)

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
    <section
      className="relative px-8 md:px-14 lg:px-20 py-28 border-t border-cinza/10 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 overflow-hidden"
      style={{ background: "rgba(255,255,255,0.015)" }}
    >
      <FluidBackground variant={5} />
      {/* Foto */}
      <RevealSection>
        <RevealItem>
          <div ref={photoContainerRef} className="bg-[#0a0030] aspect-[3/4] overflow-hidden">
            <img
              ref={photoImgRef}
              src={`${BASE}/foto-bruna.jpg`}
              alt="Bruna Ribeiro"
              className="w-full h-[120%] object-cover object-top"
              style={{ filter: "grayscale(15%) contrast(1.05)" }}
              onError={(e) => { ;(e.target as HTMLImageElement).style.display = "none" }}
            />
          </div>
        </RevealItem>
      </RevealSection>

      {/* Texto */}
      <RevealSection delay={0.2} className="flex flex-col justify-center">
        <RevealItem>
          <span className="font-questrial text-[10px] tracking-[0.28em] text-cinza uppercase block mb-8">
            A agência
          </span>
        </RevealItem>
        <RevealItem>
          <blockquote className="font-cormorant italic text-2xl md:text-3xl text-branco leading-[1.42] mb-10">
            &ldquo;Comecei a observar marcas muito antes de entender que isso tinha nome.&rdquo;
          </blockquote>
        </RevealItem>
        <RevealItem>
          <p className="font-questrial text-sm text-cinza leading-relaxed mb-5">
            Sempre fui a pessoa que notava quando um negócio bom comunicava mal.
            Quando o produto era sério mas o Instagram parecia feito às pressas.
            Quando o atendimento era impecável mas ninguém de fora sabia disso.
          </p>
        </RevealItem>
        <RevealItem>
          <p className="font-questrial text-sm text-cinza leading-relaxed mb-5">
            A B Mídia nasceu disso. Não de uma fórmula, mas de uma forma de enxergar.
            O que faço não é gestão de redes. É traduzir o que uma marca já é em algo
            que o cliente certo consegue sentir.
          </p>
        </RevealItem>
        <RevealItem>
          <p className="font-questrial text-sm text-cinza leading-relaxed mb-8">
            Não inicio nenhum projeto sem antes entender o negócio.
            Execução sem leitura é improviso.
          </p>
        </RevealItem>
        <RevealItem>
          <p className="font-questrial text-xs tracking-[0.2em] text-cinza/50 uppercase mb-12">
            Atendemos negócios locais que querem ser reconhecidos além do bairro.
          </p>
        </RevealItem>
        <RevealItem>
          <div className="border-t border-cinza/20 pt-7">
            <p className="font-alexbrush text-branco text-4xl leading-none mb-1">Bruna Ribeiro</p>
            <p className="font-questrial text-[10px] tracking-[0.25em] text-cinza mt-2 uppercase">
              Fundadora e Estrategista, B Mídia
            </p>
          </div>
        </RevealItem>
      </RevealSection>
    </section>
  )
}

// ─── CTA Final ────────────────────────────────────────────────────────────────

function CtaFinal() {
  return (
    <section
      id="cta"
      className="px-8 md:px-14 py-36 border-t border-cinza/10 flex flex-col items-center text-center"
      style={{ background: "#020015" }}
    >
      <FluidBackground variant={3} />
      <RevealSection className="max-w-2xl mx-auto w-full">
        <RevealItem>
          <span className="font-questrial text-[10px] tracking-[0.3em] text-cinza uppercase block mb-9">
            Próximo passo
          </span>
        </RevealItem>
        <RevealItem>
          <h2 className="font-cormorant text-3xl md:text-5xl text-branco leading-[1.22] mb-8">
            Vamos entender o que sua marca precisa comunicar.
          </h2>
        </RevealItem>
        <RevealItem>
          <p className="font-questrial text-sm text-cinza leading-relaxed mb-14 max-w-md mx-auto">
            Se você chegou até aqui, provavelmente já sabe que quer mais do que posts.
            Essa conversa começa com uma pergunta simples: o que sua marca ainda não
            conseguiu comunicar?
          </p>
        </RevealItem>
        <RevealItem>
          <motion.a
            href="https://brunaribeirosocialmedia-glitch.github.io/portfolio/briefing/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block font-questrial text-xs tracking-[0.22em] uppercase bg-branco text-indigo px-12 py-5 hover:bg-cinzaclaro transition-colors duration-300 rounded-[6px]"
          >
            Quero essa conversa
          </motion.a>
        </RevealItem>
      </RevealSection>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      className="px-8 md:px-14 py-10 border-t border-cinza/10 flex flex-col md:flex-row items-center justify-between gap-5"
      style={{ background: "#020015" }}
    >
      <div className="flex flex-col items-center md:items-start">
        <span className="font-cormorant text-lg text-branco tracking-wide">B Mídia</span>
        <span className="font-cormorant italic text-[10px] text-cinza tracking-widest">
          estratégia e posicionamento
        </span>
      </div>

      <p className="font-questrial text-[10px] tracking-[0.2em] text-cinza/50 uppercase">
        &copy; {new Date().getFullYear()} B Mídia. Todos os direitos reservados.
      </p>

      <a
        href="https://instagram.com/agenciabmidia_"
        target="_blank"
        rel="noopener noreferrer"
        className="font-questrial text-[10px] tracking-[0.18em] text-cinza hover:text-branco transition-colors duration-300 uppercase"
      >
        @agenciabmidia_
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
      <ComoTrabalhamos />
      <SobreBruna />
      <CtaFinal />
      <Footer />
    </main>
  )
}
