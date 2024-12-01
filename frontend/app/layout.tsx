import type { Metadata } from 'next';
import '../assets/styles/globals.css';
import Header from '../components/header/header';
import Footer from '../components/footer';
import Providers from '@/providers/providers';
import elephant from '@/assets/elephant.ico';

export const metadata: Metadata = {
  title: 'Electronic Elephant',
  description: 'Created by tmzzz',
  icons: {
    icon: [{ rel: 'icon', url: elephant.src }],
  },
  openGraph: {
    type: 'website',
    url: 'https://electro-elephant.ru/',
    title: 'Electronic Elephant',
    description: 'Created by tmzzz',
    images: [
      {
        url: 'https://your-site.com/images/preview.jpg',
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
    images: ['https://your-site.com/images/preview.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-screen bg-white">
        <Providers>
          <Header />
          <main className="flex-grow mt-28">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
