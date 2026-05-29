import type { Metadata } from "next"
import "@fontsource/playfair-display"
import "@fontsource/playfair-display/700.css"
import "@fontsource/inter/300.css"
import "@fontsource/inter/400.css"
import "./globals.css"
import Cursor from "@/components/Cursor"

export const metadata: Metadata = {
  title: "B Mídia — Estratégia & Posicionamento",
  description: "Comunicação estratégica para marcas que querem ser reconhecidas. Florianópolis, SC.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-indigo text-cinzaclaro antialiased overflow-x-hidden">
        <Cursor />
        {children}
      </body>
    </html>
  )
}
