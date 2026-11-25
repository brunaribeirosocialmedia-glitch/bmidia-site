// Botão flutuante de WhatsApp, fixo no canto inferior direito de todas as páginas.
const NUMERO = "5548998670342"
const MENSAGEM = "Oi, B Mídia! Vim pelo site e quero conversar sobre a minha marca."

export default function WhatsAppFlutuante() {
  const link = `https://wa.me/${NUMERO}?text=${encodeURIComponent(MENSAGEM)}`

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar com a B Mídia no WhatsApp"
      className="whats-flutuante group fixed right-5 bottom-5 md:right-8 md:bottom-8 z-[9000] flex items-center gap-3"
    >
      <span className="hidden md:block font-questrial text-xs tracking-[0.2em] uppercase text-branco bg-indigo/80 backdrop-blur border border-cinza/30 rounded-full px-4 py-2 opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
        Fale com a gente
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-branco text-indigo shadow-[0_12px_30px_-8px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-110">
        <span className="whats-pulso absolute inset-0 rounded-full border border-branco" aria-hidden="true" />
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.8-1.1-4.6-4-4.8-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 .9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z" />
        </svg>
      </span>
    </a>
  )
}
