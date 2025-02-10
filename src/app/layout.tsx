import Navigation from "@/src/components/Navigation";
import Logo from "@/src/components/Logo";
import "@/src/styles/globals.css";
import { ReactNode } from "react";
import { Metadata } from "next";

import { Josefin_Sans } from "next/font/google";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});

console.log(josefin);

export const metadata: Metadata = {
  title: {
    template: "%s - The Wild Oasis",
    default: "Welcome - Wild Oasis",
  },
  description:
    "Luxurious cabin hotel located in the heart of the italian" +
    " Dolomites, surrounded by beautiful mountains and dark forests",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${josefin.className} bg-primary-950 text-primary-100 min-h-screen`}
      >
        <header>
          <Logo />
        </header>
        <Navigation />
        <main>{children}</main>
        <footer>Copyright by The Wild Oasis</footer>
      </body>
    </html>
  );
}
