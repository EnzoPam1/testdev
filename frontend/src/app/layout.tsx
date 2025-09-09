import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AuroraBackground from "@/components/AuroraBackground";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-montserrat",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "JEB Incubator",
  description: "Incubator platform to showcase innovative projects",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body
        suppressHydrationWarning
        className={`${montserrat.variable} ${openSans.variable} antialiased`}
      >
        {/* Aurora lent + plein écran derrière tout */}
        <AuroraBackground speed={0.25} opacity={0.3} amplitude={0.85} blend={0.42} overscan={1.12}/>

        {/* Contenu au-dessus */}
        <div className="page-wrap" style={{ position: "relative", zIndex: 1 }}>
          <Header />
          <main className="page-main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
