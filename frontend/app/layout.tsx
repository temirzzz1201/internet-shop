import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/header/header';
import Footer from '../components/footer';
import Providers from '@/providers/providers';
import { Grid, GridItem } from '@chakra-ui/react';

export const metadata: Metadata = {
  title: 'Electonic elephant',
  description: 'Created by tmzzz',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
    <body className="flex flex-col min-h-screen">
      <Providers>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </Providers>
    </body>
  </html>
  );
}
