import type { Metadata } from "next"
import "./globals.css"
import LenisProvider from "@/components/LenisProvider"
import PageTransitionOverlay from "@/components/PageTransitionOverlay"

export const metadata: Metadata = {
  title: "B Mídia — Estratégia e Posicionamento",
  description: "Comunicação estratégica para marcas que querem ser reconhecidas. Florianópolis, SC.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Questrial&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-indigo text-cinzaclaro antialiased overflow-x-hidden">
        <LenisProvider>
          <PageTransitionOverlay />
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}
