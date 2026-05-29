"use client"

import { useRef, useState } from "react"
import Image from "next/image"

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ""
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion"

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
        visible: {
          transition: { staggerChildren: 0.13, delayChildren: delay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function FadeItem({
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
      {/* Logo */}
      <div className="flex flex-col">
        <span className="font-playfair text-xl tracking-wide text-branco">
          B Mídia
        </span>
        <span className="font-playfair italic text-[10px] tracking-[0.2em] text-cinza leading-tight">
          estratégia &amp; posicionamento
        </span>
      </div>

      {/* Links */}
      <div className="hidden md:flex items-center gap-10">
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

      {/* CTA */}
      <motion.a
        href="#cta"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="hidden md:inline-block font-inter text-xs tracking-[0.18em] uppercase border border-cinzaclaro/30 text-cinzaclaro px-6 py-3 hover:border-branco hover:text-branco transition-all duration-300"
      >
        Quero conversar
      </motion.a>
    </motion.nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

const heroContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.22, delayChildren: 0.35 },
  },
}

const heroItem: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
}

function Hero() {
  return (
    <section className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={heroContainer}
        className="flex flex-col justify-center px-8 md:px-14 lg:px-20 py-32 md:py-0"
      >
        <motion.span
          variants={heroItem}
          className="font-inter text-[10px] tracking-[0.3em] text-cinza uppercase mb-10"
        >
          B Mídia — Florianópolis, SC
        </motion.span>

        <motion.h1
          variants={heroItem}
          className="font-playfair text-4xl md:text-5xl lg:text-[3.4rem] text-branco leading-[1.18] mb-7"
        >
          Sua marca não precisa
          <br />
          de mais posts.
          <br />
          Precisa ser{" "}
          <em className="italic text-cinzaclaro">reconhecida.</em>
        </motion.h1>

        <motion.p
          variants={heroItem}
          className="font-playfair italic text-cinza text-xl md:text-2xl mb-14 max-w-sm leading-relaxed"
        >
          Comunicação sem observação é decoração.
        </motion.p>

        <motion.div variants={heroItem}>
          <motion.a
            href="#cta"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block font-inter text-xs tracking-[0.2em] uppercase border border-branco/50 text-branco px-9 py-4 hover:bg-branco hover:text-indigo transition-all duration-300"
          >
            Vamos entender sua marca
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Right — photo placeholder */}
      <div className="relative hidden md:block min-h-[500px] bg-[#0a0030]">
        <Image
          src={`${BASE}/foto-hero.jpg`}
          alt="B Mídia"
          fill
          className="object-cover object-top opacity-60"
          unoptimized
          onError={(e) => {
            e.currentTarget.style.display = "none"
          }}
        />
        <div
          className="absolute inset-y-0 left-0 w-32 pointer-events-none"
          style={{
            background: "linear-gradient(to right, #040022, transparent)",
          }}
        />
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
            <div className="flex gap-6 py-5 border-b border-cinza/10 last:border-0 items-start">
              <span className="font-playfair italic text-cinza/25 text-sm shrink-0 mt-0.5 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-inter text-sm text-cinzaclaro leading-relaxed">
                {p}
              </p>
            </div>
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
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.14 } },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      >
        {metodos.map((m, i) => (
          <motion.div
            key={m.num}
            variants={fadeItem}
            whileHover={{ backgroundColor: "rgba(248,248,246,0.025)" }}
            className={[
              "px-8 py-10 transition-colors duration-300",
              i < 3 ? "border-b lg:border-b-0 lg:border-r border-cinza/10" : "border-b lg:border-b-0 border-cinza/10",
              i === 0 ? "lg:pl-0" : "",
              i === 3 ? "lg:pr-0" : "",
            ].join(" ")}
          >
            <span className="font-playfair italic text-[5.5rem] leading-none text-cinza/8 block mb-5 select-none">
              {m.num}
            </span>
            <h3 className="font-playfair text-xl text-branco mb-3">
              {m.title}
            </h3>
            <p className="font-inter text-sm text-cinza leading-relaxed">
              {m.text}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

// ─── Serviços ─────────────────────────────────────────────────────────────────

const servicos = [
  {
    title: "Estratégia e Posicionamento",
    tags: ["Diagnóstico", "Linha Editorial"],
  },
  {
    title: "Gestão de Redes Sociais",
    tags: ["Instagram", "Stories", "Reels"],
  },
  {
    title: "Copywriting e Conteúdo",
    tags: ["Copy", "Legendas", "Roteiros"],
  },
  {
    title: "Identidade de Comunicação",
    tags: ["Tom de Voz", "Pilares", "Visual"],
  },
  {
    title: "Calendário Editorial",
    tags: ["Planejamento", "Calendário"],
  },
  {
    title: "Design e Produção Visual",
    tags: ["Design", "Edição", "Arte"],
  },
]

function ServicoCard({ title, tags }: { title: string; tags: string[] }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      variants={fadeItem}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
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
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.09 } },
        }}
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
          <FadeItem key={i}>
            <div className="flex gap-5 py-4 border-b border-cinza/10 last:border-0 items-start">
              <span className="text-branco/25 text-xs mt-1 shrink-0 font-inter">
                ✦
              </span>
              <p className="font-inter text-sm text-cinzaclaro leading-relaxed">
                {item}
              </p>
            </div>
          </FadeItem>
        ))}
      </FadeSection>

      <FadeSection delay={0.2}>
        <FadeItem>
          <h2 className="font-playfair text-2xl md:text-3xl text-branco mb-10">
            Para quem <em className="italic">não é</em>
          </h2>
        </FadeItem>
        {paraQuemNao.map((item, i) => (
          <FadeItem key={i}>
            <div className="flex gap-5 py-4 border-b border-cinza/10 last:border-0 items-start">
              <span className="text-cinza/30 text-xs mt-1 shrink-0 font-inter">
                —
              </span>
              <p className="font-inter text-sm text-cinza leading-relaxed">
                {item}
              </p>
            </div>
          </FadeItem>
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
          <div className="relative">
            <div className="absolute -top-3 -left-3 -bottom-3 -right-3 border border-cinza/15" />
            <div className="relative bg-[#0a0030] aspect-[3/4] overflow-hidden">
              <Image
                src={`${BASE}/foto-bruna.jpg`}
                alt="Bruna Ribeiro"
                fill
                className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-700"
                unoptimized
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
            </div>
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
            <p className="font-playfair text-branco text-lg tracking-wide">
              Bruna Ribeiro
            </p>
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
            O primeiro passo é uma conversa. Sem compromisso, sem roteiro de
            vendas.
          </p>
        </FadeItem>
        <FadeItem>
          <motion.a
            href="https://brunaribeirosocialmedia-glitch.github.io/portfolio/briefing/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
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
