'use client';
import NavLinks from './navlinks/nav-links';
import Image from 'next/image';
import logoSrc from '@/app/images/logo.svg';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full h-14 bg-slate-500 flex justify-between items-center px-5 mb-12">
      <div className="container">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/">
              <Image className="w-9 h-9" src={logoSrc} alt="logo" />
            </Link>
          </div>
          <div>
            <NavLinks />
          </div>
        </div>
      </div>
    </header>
  );
}
