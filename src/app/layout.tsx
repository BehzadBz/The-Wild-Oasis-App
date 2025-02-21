import "@/src/styles/globals.css";
import { ReactNode } from "react";
import { Metadata } from "next";

import { Josefin_Sans } from "next/font/google";
import Header from "@/src/components/Header";
import { ReservationProvider } from "@/src/context/ReservationContext";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/src/context/AuthContext";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});

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
    <SessionProvider>
      <AuthProvider>
        <html lang="en">
          <body
            className={`${josefin.className} bg-primary-950 text-primary-100 min-h-screen flex flex-col antialiased`}
          >
            <Header />
            <div className="flex-1 px-8 py-12">
              <main className="max-w-7xl mx-auto">
                <ReservationProvider>{children}</ReservationProvider>
              </main>
            </div>
          </body>
        </html>
      </AuthProvider>
    </SessionProvider>
  );
}
