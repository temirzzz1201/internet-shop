import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/header/header';
import Footer from '../components/footer';
import Providers from '@/providers/providers';

export const metadata: Metadata = {
  title: 'Electronic Elephant',
  description: 'Created by tmzzz',
  openGraph: {
    type: 'website',
    url: 'https://your-site.com', // Замените на ваш реальный URL
    title: 'Electronic Elephant',
    description: 'Created by tmzzz',
    images: [
      {
        url: 'https://your-site.com/images/preview.jpg', // Путь к вашему изображению
        width: 1200,
        height: 630,
        alt: 'Electronic Elephant Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Electronic Elephant',
    description: 'Created by tmzzz',
    images: ['https://your-site.com/images/preview.jpg'], // Путь к вашему изображению
  },
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
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
