import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/header/header";
import Footer from "../components/footer";
import Providers from "@/providers/providers";

export const metadata: Metadata = {
  title: "Electonic elephant",
  description: "Created by tmzzz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
