import { Inter, Noto_Sans_Kannada, Instrument_Serif } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "../components/ui/SmoothScrollProvider";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const kannada = Noto_Sans_Kannada({ subsets: ["kannada"], weight: ['400', '700'], variable: '--font-kannada' });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: ['400'], variable: '--font-instrument' });

export const metadata = {
  title: "Sahaayak | Karnataka's Civic Accountability Platform",
  description: "Dreamy, futuristic, and transparent civic-tech portal for Karnataka.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${kannada.variable} ${instrument.variable}`}>
      <body className={inter.className}>
        <LanguageProvider>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
