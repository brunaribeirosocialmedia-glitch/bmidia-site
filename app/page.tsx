"use client"

import { useRef, useState } from "react"
import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion"

const BASE = process.env.NODE_ENV === "production" ? "/bmidia-site" : ""
const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

// ─── Animation Variants ───────────────────────────────────────────────────────

const fadeItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.25, 0.4, 0.25, 1] },
  },
}

// ─── Reusable Animated Section ───────────────────────────────────────────────

function FadeSection({
  children,
  className = "",
  delay = 0,
  amount = 0.15,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  amount?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.13, delayChildren: delay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function FadeItem({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <motion.div variants={fadeItem} className={className}>{children}</motion.div>
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
        <span className="font-playfair text-xl tracking-wide text-branco">B Mídia</span>
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

// ─── Hero ─────────────────────────────────────────────────────────────────────

function TextReveal({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <div style={{ overflow: "hidden" }}>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay, duration: 0.9, ease: EASE_EXPO }}
      >
        {children}
      </motion.div>
    </div>
  )
}

function Hero() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const bgX = useSpring(mouseX, { stiffness: 60, damping: 25 })
  const bgY = useSpring(mouseY, { stiffness: 60, damping: 25 })
  const { scrollY } = useScroll()
  const imageScrollY = useTransform(scrollY, [0, 700], [0, 150])

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { width, height, left, top } = e.currentTarget.getBoundingClientRect()
    mouseX.set(((e.clientX - left) / width - 0.5) * -40)
    mouseY.set(((e.clientY - top) / height - 0.5) * -40)
  }

  return (
    <section
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0) }}
    >
      {/* Background image — parallax */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ x: bgX, y: bgY, scale: 1.15 }}
      >
        <motion.img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=80"
          alt=""
          className="w-full h-full object-cover"
          style={{ y: imageScrollY }}
        />
      </motion.div>

      {/* Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(4,0,34,0.88)" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-4xl mx-auto w-full">
        {/* Logo com flip rotateY */}
        <TextReveal delay={0.1}>
          <motion.img
            src={`${BASE}/logo-branca.png.png`}
            alt="B Mídia"
            className="h-16 w-auto mx-auto mb-5"
            initial={{ rotateY: 0 }}
            animate={{ rotateY: 360 }}
            transition={{ duration: 1.2, ease: EASE_EXPO, delay: 0.3 }}
            style={{ transformPerspective: 800 }}
            onError={(e) => {
              const el = e.target as HTMLImageElement
              el.replaceWith(Object.assign(document.createElement("span"), {
                textContent: "B",
                style: "font-family:var(--font-playfair);font-size:5rem;font-style:italic;color:#f8f8f6;display:block;margin-bottom:1.25rem",
              }))
            }}
          />
        </TextReveal>

        {/* Eyebrow — abaixo da logo */}
        <TextReveal delay={0.3}>
          <span className="font-inter text-[0.72rem] tracking-[0.28em] uppercase text-cinza block mb-6">
            B Mídia — Florianópolis, SC
          </span>
        </TextReveal>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.7, ease: EASE_EXPO }}
          className="origin-center mb-8"
          style={{ width: 60, height: "0.5px", backgroundColor: "rgba(255,255,255,0.15)" }}
        />

        {/* Headline — flutuação infinita após entrar */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, delay: 2.5 }}
        >
          <h1
            className="font-playfair text-[2.2rem] md:text-[3.5rem] text-branco mb-8"
            style={{ letterSpacing: "0.02em", lineHeight: 1.35 }}
          >
            <TextReveal delay={0.5}>
              <span className="block">Sua marca não precisa</span>
            </TextReveal>
            <TextReveal delay={0.7}>
              <span className="block">de mais posts.</span>
            </TextReveal>
            <TextReveal delay={0.9}>
              <span className="block">
                Precisa ser{" "}
                <em className="italic text-cinzaclaro">reconhecida.</em>
              </span>
            </TextReveal>
          </h1>
        </motion.div>

        {/* Subline */}
        <TextReveal delay={1.2}>
          <p className="font-inter text-[0.95rem] tracking-[0.08em] text-cinza mb-12">
            Comunicação sem observação é decoração.
          </p>
        </TextReveal>

        {/* CTA Button */}
        <TextReveal delay={1.5}>
          <motion.a
            href="#cta"
            whileHover={{ scale: 1.04, backgroundColor: "#f8f8f6", color: "#040022" }}
            whileTap={{ scale: 0.97 }}
            className="inline-block font-inter text-[0.72rem] tracking-[0.18em] uppercase text-cinzaclaro transition-colors duration-300"
            style={{ border: "0.5px solid #e1e1e1", padding: "0.8rem 2rem" }}
          >
            Vamos entender sua marca
          </motion.a>
        </TextReveal>
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
      <FadeSection>
        <FadeItem>
          <span className="font-inter text-[10px] tracking-[0.28em] text-cinza uppercase block mb-7">
            O cenário atual
          </span>
        </FadeItem>
        <FadeItem>
          <h2 className="font-playfair text-3xl md:text-4xl text-branco leading-[1.28] mb-8">
            Muitos negócios postam
            <br />
            todos os dias.
            <br />
            <em className="italic text-cinzaclaro">Poucos são lembrados.</em>
          </h2>
        </FadeItem>
        <FadeItem>
          <p className="font-inter text-sm text-cinza leading-relaxed max-w-sm">
            O problema não é a falta de conteúdo. É a falta de intenção por
            trás de cada publicação. Presença sem estratégia é ruído. E ruído
            não converte — ele afasta.
          </p>
        </FadeItem>
      </FadeSection>

      <FadeSection delay={0.18}>
        {problemas.map((p, i) => (
          <FadeItem key={i}>
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
          </FadeItem>
        ))}
      </FadeSection>
    </section>
  )
}

// ─── Método ──────────────────────────────────────────────────────────────────

const metodos = [
  {
    num: "01",
    title: "Observação primeiro",
    text: "Antes de criar qualquer conteúdo, observamos o negócio, o público e o que já funciona.",
  },
  {
    num: "02",
    title: "Consistência bate frequência",
    text: "Uma marca com intenção três vezes por semana converte mais do que uma que posta todo dia sem direção.",
  },
  {
    num: "03",
    title: "Marca é percepção",
    text: "Uma marca bem comunicada não precisa convencer. Ela é reconhecida.",
  },
  {
    num: "04",
    title: "Poucos projetos, muita entrega",
    text: "Não trabalhamos com carteira grande. Presença real dentro de cada conta.",
  },
]

function Metodo() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section
      id="servicos"
      className="px-8 md:px-14 lg:px-20 py-28 border-t border-cinza/10"
    >
      <FadeSection className="mb-16">
        <FadeItem>
          <span className="font-inter text-[10px] tracking-[0.28em] text-cinza uppercase block mb-5">
            Método
          </span>
        </FadeItem>
        <FadeItem>
          <h2 className="font-playfair text-3xl md:text-4xl text-branco">
            Como a B Mídia pensa
          </h2>
        </FadeItem>
      </FadeSection>

      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.14 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      >
        {metodos.map((m, i) => (
          <motion.div
            key={m.num}
            variants={fadeItem}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.04)" }}
            transition={{ duration: 0.3 }}
            className={[
              "px-8 py-10",
              i < 3 ? "border-b lg:border-b-0 lg:border-r border-cinza/10" : "border-b lg:border-b-0 border-cinza/10",
              i === 0 ? "lg:pl-0" : "",
              i === 3 ? "lg:pr-0" : "",
            ].join(" ")}
          >
            <span className="font-playfair italic text-[5.5rem] leading-none text-cinza/8 block mb-5 select-none">
              {m.num}
            </span>
            <h3 className="font-playfair text-xl text-branco mb-3">{m.title}</h3>
            <p className="font-inter text-sm text-cinza leading-relaxed">{m.text}</p>
          </motion.div>
        ))}
      </motion.div>
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

function ServicoCard({ title, tags }: { title: string; tags: string[] }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      variants={fadeItem}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.04)" }}
      transition={{ duration: 0.3 }}
      className="p-8 border border-cinza/10 relative overflow-hidden bg-indigo"
    >
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
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section className="px-8 md:px-14 lg:px-20 py-28 border-t border-cinza/10">
      <FadeSection className="mb-16">
        <FadeItem>
          <span className="font-inter text-[10px] tracking-[0.28em] text-cinza uppercase block mb-5">
            Serviços
          </span>
        </FadeItem>
        <FadeItem>
          <h2 className="font-playfair text-3xl md:text-4xl text-branco">
            O que a B Mídia oferece
          </h2>
        </FadeItem>
      </FadeSection>

      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-cinza/10"
      >
        {servicos.map((s) => (
          <ServicoCard key={s.title} {...s} />
        ))}
      </motion.div>
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

function ParaQuemItem({ item, marker, dim }: { item: string; marker: string; dim?: boolean }) {
  return (
    <FadeItem>
      <motion.div
        className="flex gap-5 py-4 border-b border-cinza/10 last:border-0 items-start"
        whileHover={{ x: 6 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <span className={`text-xs mt-1 shrink-0 font-inter ${dim ? "text-cinza/30" : "text-branco/25"}`}>
          {marker}
        </span>
        <p className={`font-inter text-sm leading-relaxed ${dim ? "text-cinza" : "text-cinzaclaro"}`}>
          {item}
        </p>
      </motion.div>
    </FadeItem>
  )
}

function ParaQuem() {
  return (
    <section
      id="agencia"
      className="px-8 md:px-14 lg:px-20 py-28 border-t border-cinza/10 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24"
    >
      <FadeSection>
        <FadeItem>
          <h2 className="font-playfair text-2xl md:text-3xl text-branco mb-10">
            Para quem a B Mídia <em className="italic">é</em>
          </h2>
        </FadeItem>
        {paraQuemSim.map((item, i) => (
          <ParaQuemItem key={i} item={item} marker="✦" />
        ))}
      </FadeSection>

      <FadeSection delay={0.2}>
        <FadeItem>
          <h2 className="font-playfair text-2xl md:text-3xl text-branco mb-10">
            Para quem <em className="italic">não é</em>
          </h2>
        </FadeItem>
        {paraQuemNao.map((item, i) => (
          <ParaQuemItem key={i} item={item} marker="—" dim />
        ))}
      </FadeSection>
    </section>
  )
}

// ─── Sobre Bruna ──────────────────────────────────────────────────────────────

function SobreBruna() {
  return (
    <section className="px-8 md:px-14 lg:px-20 py-28 border-t border-cinza/10 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
      {/* Left — Photo */}
      <FadeSection>
        <FadeItem>
          <div className="bg-[#0a0030] aspect-[3/4] overflow-hidden">
            <motion.img
              src={`${BASE}/foto-bruna.jpg`}
              alt="Bruna Ribeiro"
              className="w-full h-full object-cover object-top"
              style={{ filter: "grayscale(15%) contrast(1.05)" }}
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = "none"
              }}
            />
          </div>
        </FadeItem>
      </FadeSection>

      {/* Right — Text */}
      <FadeSection delay={0.2} className="flex flex-col justify-center">
        <FadeItem>
          <span className="font-inter text-[10px] tracking-[0.28em] text-cinza uppercase block mb-8">
            A agência
          </span>
        </FadeItem>
        <FadeItem>
          <blockquote className="font-playfair italic text-2xl md:text-3xl text-branco leading-[1.42] mb-10">
            &ldquo;Minha maior força é perceber o que a marca ainda não sabe
            dizer sobre si mesma.&rdquo;
          </blockquote>
        </FadeItem>
        <FadeItem>
          <p className="font-inter text-sm text-cinza leading-relaxed mb-5">
            A B Mídia nasceu da convicção de que comunicação estratégica não é
            privilégio de grandes empresas. É o que transforma um bom produto em
            uma marca que as pessoas procuram.
          </p>
        </FadeItem>
        <FadeItem>
          <p className="font-inter text-sm text-cinza leading-relaxed mb-5">
            Trabalhamos com poucos clientes de forma intencional. Cada projeto
            recebe atenção real — não de um time enorme, mas de quem entende o
            seu negócio como se fosse o próprio.
          </p>
        </FadeItem>
        <FadeItem>
          <p className="font-inter text-sm text-cinza leading-relaxed mb-12">
            O resultado não é viral. É reconhecimento. É construção.
          </p>
        </FadeItem>
        <FadeItem>
          <div className="border-t border-cinza/20 pt-7">
            <p className="font-playfair text-branco text-lg tracking-wide">Bruna Ribeiro</p>
            <p className="font-inter text-[10px] tracking-[0.25em] text-cinza mt-1.5 uppercase">
              Fundadora e Estrategista
            </p>
          </div>
        </FadeItem>
      </FadeSection>
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
      <FadeSection className="max-w-2xl mx-auto w-full">
        <FadeItem>
          <span className="font-inter text-[10px] tracking-[0.3em] text-cinza uppercase block mb-9">
            Próximo passo
          </span>
        </FadeItem>
        <FadeItem>
          <h2 className="font-playfair text-3xl md:text-5xl text-branco leading-[1.22] mb-8">
            Vamos entender o que sua marca
            <br />
            <em className="italic">precisa comunicar</em>
          </h2>
        </FadeItem>
        <FadeItem>
          <p className="font-inter text-sm text-cinza leading-relaxed mb-14 max-w-sm mx-auto">
            O primeiro passo é uma conversa. Sem compromisso, sem roteiro de vendas.
          </p>
        </FadeItem>
        <FadeItem>
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
        </FadeItem>
      </FadeSection>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="px-8 md:px-14 py-10 border-t border-cinza/10 flex flex-col md:flex-row items-center justify-between gap-5">
      <div className="flex flex-col items-center md:items-start">
        <span className="font-playfair text-lg text-branco tracking-wide">B Mídia</span>
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
