"use client"

import { useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger, useGSAP)

const BASE = process.env.NODE_ENV === "production" ? "/bmidia-site" : ""

// ─── Fundo contínuo do site inteiro ──────────────────────────────────────────

// ─── Ponto de luz ─────────────────────────────────────────────────────────────

function LightDot({ top, left, size, op, delay = 0 }: {
  top: string; left: string; size: number; op: number; delay?: number
}) {
  return (
    <motion.div
      style={{
        position: "absolute",
        top, left,
        width: size,
        height: size,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(210,200,255,1) 0%, transparent 70%)",
        opacity: op,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 0,
      }}
      animate={{ opacity: [op, op * 2, op] }}
      transition={{ duration: 4 + delay * 0.5, ease: "easeInOut", repeat: Infinity, delay }}
    />
  )
}

function SiteBackground() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      {/* Pontos ao longo do site inteiro — posições estratégicas */}
      {[
        // Topo — cantos
        { top: "3%",  left: "6%",   size: 260, op: 0.07, delay: 0 },
        { top: "5%",  left: "94%",  size: 220, op: 0.07, delay: 1.2 },
        // Seção problema
        { top: "18%", left: "2%",   size: 180, op: 0.06, delay: 0.5 },
        { top: "22%", left: "96%",  size: 200, op: 0.06, delay: 1.8 },
        { top: "25%", left: "50%",  size: 140, op: 0.04, delay: 2.1 },
        // Seção método
        { top: "35%", left: "8%",   size: 160, op: 0.05, delay: 0.8 },
        { top: "38%", left: "92%",  size: 190, op: 0.06, delay: 1.5 },
        // Seção serviços
        { top: "50%", left: "3%",   size: 200, op: 0.06, delay: 1.0 },
        { top: "52%", left: "97%",  size: 170, op: 0.05, delay: 2.3 },
        { top: "55%", left: "45%",  size: 120, op: 0.04, delay: 0.3 },
        // Seção como trabalhamos
        { top: "64%", left: "10%",  size: 180, op: 0.06, delay: 1.7 },
        { top: "67%", left: "90%",  size: 160, op: 0.05, delay: 0.6 },
        // Seção sobre — maior atrás da foto
        { top: "76%", left: "22%",  size: 380, op: 0.09, delay: 1.1 },
        { top: "80%", left: "85%",  size: 150, op: 0.05, delay: 2.0 },
        // CTA e footer
        { top: "90%", left: "5%",   size: 300, op: 0.09, delay: 0.9 },
        { top: "92%", left: "95%",  size: 320, op: 0.1,  delay: 1.4 },
        { top: "96%", left: "50%",  size: 260, op: 0.08, delay: 0.2 },
        { top: "88%", left: "30%",  size: 200, op: 0.06, delay: 1.8 },
        { top: "94%", left: "70%",  size: 180, op: 0.06, delay: 0.7 },
      ].map((d, i) => (
        <LightDot key={i} {...d} />
      ))}
    </div>
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
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const contentX = useTransform(mouseX, v => v * 0.04)
  const contentY = useTransform(mouseY, v => v * 0.04)
  const shapeX = useTransform(mouseX, v => v * 0.12)
  const shapeY = useTransform(mouseY, v => v * 0.12)

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { width, height } = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX / width - 0.5) * 120)
    mouseY.set((e.clientY / height - 0.5) * 120)
  }

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0) }}
    >
      {/* Pontos de luz do hero */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { top: "10%",  left: "6%",  size: 260, op: 0.1,  delay: 0 },
          { top: "60%",  left: "3%",  size: 180, op: 0.08, delay: 1.1 },
          { top: "85%",  left: "12%", size: 140, op: 0.07, delay: 2.0 },
          { top: "8%",   left: "90%", size: 240, op: 0.1,  delay: 0.6 },
          { top: "50%",  left: "94%", size: 170, op: 0.08, delay: 1.8 },
          { top: "78%",  left: "86%", size: 150, op: 0.07, delay: 0.3 },
          { top: "30%",  left: "18%", size: 100, op: 0.06, delay: 1.4 },
          { top: "70%",  left: "78%", size: 110, op: 0.06, delay: 0.9 },
        ].map((dot, i) => (
          <LightDot key={i} {...dot} />
        ))}
      </div>


      {/* Conteúdo com leve reação ao mouse */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-8 pt-20"
        style={{ x: contentX, y: contentY }}
      >
        <div className="max-w-3xl mx-auto w-full text-center flex flex-col items-center">
          {/* Logo */}
          <div style={{ overflow: "hidden", perspective: "800px" }}>
            <motion.img
              src={`${BASE}/logo-bm%C3%ADdia-branco.png`}
              alt="B Mídia"
              style={{
                height: "clamp(100px, 15vw, 200px)",
                width: "auto",
                objectFit: "contain",
                display: "block",
                margin: "0 auto 1.75rem",
              }}
              initial={{ opacity: 0, rotateY: 0 }}
              animate={{ opacity: 1, rotateY: 360 }}
              transition={{
                opacity: { duration: 0.7, ease: "easeOut", delay: 0.1 },
                rotateY: { duration: 3.0, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 },
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
            transition={{ delay: 0.5, duration: 0.8, ease: EASE_EXPO }}
            className="origin-center mb-8"
            style={{ width: 60, height: "0.5px", backgroundColor: "rgba(255,255,255,0.15)" }}
          />

          {/* Headline */}
          <div style={{ overflow: "hidden" }} className="mb-8 px-4 w-full">
            <motion.h1
              className="font-cormorant text-[1.5rem] sm:text-[1.8rem] md:text-[2.4rem] lg:text-[2.8rem] text-branco text-center"
              style={{ letterSpacing: "0.02em", lineHeight: 1.35 }}
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ delay: 0.4, duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
            >
              Sua marca não precisa
              <br className="sm:hidden" /> de mais publicações.
            </motion.h1>
            <motion.h1
              className="font-cormorant text-[1.5rem] sm:text-[1.8rem] md:text-[2.4rem] lg:text-[2.8rem] text-branco text-center"
              style={{ letterSpacing: "0.02em", lineHeight: 1.35 }}
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ delay: 0.65, duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
            >
              Precisa ser <em className="italic text-cinzaclaro">reconhecida.</em>
            </motion.h1>
          </div>

          {/* Subfrase */}
          <motion.p
            className="font-questrial text-[0.8rem] sm:text-[0.9rem] tracking-[0.08em] text-cinza mb-8 text-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.9, ease: EASE_EXPO }}
          >
            Comunicação sem observação é decoração.
          </motion.p>

          {/* CTA */}
          <motion.a
            href="#cta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.9, ease: EASE_EXPO }}
            whileHover={{ backgroundColor: "#f8f8f6", color: "#040022" }}
            whileTap={{ scale: 0.97 }}
            className="inline-block font-questrial text-[0.68rem] sm:text-[0.72rem] tracking-[0.15em] sm:tracking-[0.18em] uppercase text-cinzaclaro transition-colors duration-300 rounded-[6px]"
            style={{ border: "0.5px solid #e1e1e1", padding: "0.75rem 1.6rem" }}
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
      className="relative px-8 md:px-14 lg:px-20 py-28 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24"
    >
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
      className="relative px-8 md:px-14 lg:px-20 py-28"
      style={{ background: "transparent" }}
    >
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-cinza/10">
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

            {/* Detalhe expandido dentro do próprio card */}
            <AnimatePresence initial={false}>
              {activeIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                  className="overflow-hidden"
                >
                  <p className="font-questrial text-xs text-cinza/80 leading-relaxed mt-4">
                    {m.detail}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[2px] origin-left"
              style={{ backgroundColor: "#7B79F7" }}
              animate={{ scaleX: activeIndex === i ? 1 : 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            />
          </motion.div>
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
    <section className="relative px-8 md:px-14 lg:px-20 py-28">
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
    title: "Não trabalho com todo mundo",
    text: "Não trabalhamos com carteira cheia. Cada cliente recebe atenção real, estratégia própria e acompanhamento próximo.",
  },
  {
    title: "Sem promessa de viral",
    text: "Não vendemos seguidores nem viralização. Vendemos consistência estratégica que constrói percepção de valor ao longo do tempo.",
  },
]

function ComoTrabalhamos() {
  return (
    <section
      id="agencia"
      className="relative px-8 md:px-14 lg:px-20 py-28"
      style={{ background: "transparent" }}
    >

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
      className="relative px-8 md:px-14 lg:px-20 py-28 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24"
      style={{ background: "transparent" }}
    >
      {/* Foto */}
      <RevealSection className="w-full flex justify-center md:block">
        <RevealItem className="w-full flex justify-center md:block">
          <div ref={photoContainerRef} className="relative aspect-[3/4] md:ml-[8rem]" style={{ maxWidth: "420px", width: "72%" }}>
            {/* Ponto de luz atrás da foto */}
            <div style={{
              position: "absolute",
              top: "42%", left: "38%",
              width: 680, height: 680,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(210,200,255,1) 0%, transparent 65%)",
              opacity: 0.28,
              transform: "translate(-50%, -50%)",
              zIndex: 0,
            }} />
            <img
              ref={photoImgRef}
              src={`${BASE}/foto-bruna.png.png`}
              alt="Bruna Ribeiro"
              className="w-full h-full object-cover object-center"
              style={{
                zIndex: 1,
                position: "relative",
                transform: "scale(1.28)",
                maskImage: "radial-gradient(ellipse 75% 82% at 50% 42%, black 30%, rgba(0,0,0,0.8) 55%, transparent 78%)",
                WebkitMaskImage: "radial-gradient(ellipse 75% 82% at 50% 42%, black 30%, rgba(0,0,0,0.8) 55%, transparent 78%)",
              }}
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
      className="relative px-8 md:px-14 py-36 flex flex-col items-center text-center"
      style={{ background: "transparent" }}
    >
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
      className="relative z-10 px-8 md:px-14 py-10 flex flex-col md:flex-row items-center justify-between gap-5"
      style={{ background: "transparent" }}
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
    <main className="bg-indigo min-h-screen relative">
      <SiteBackground />
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
