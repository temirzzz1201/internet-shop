import Link from "next/link";
import Image from "next/image";
import profileSrc from '../app/images/profile1.svg'
import logoSrc from '../app/images/logo.svg'


export default function Header() {
  return (
    <header className="w-full h-14 bg-slate-500 flex justify-between items-center px-5 mb-12">
      <div className="container">
        <nav className="w-full flex justify-between items-center">
          <Link className="text-slate-50 font-medium mr-3" href="/">
            <Image className="w-7 h-7" src={logoSrc} alt="logo" />
          </Link>
          <ul className="flex">
            <li className="mr-3">
              <Link className="text-slate-50 font-medium" href="/">Home</Link>
            </li>
            <li className="mr-3">
              <Link className="text-slate-50 font-medium" href="/login">Login</Link>
            </li>
            <li className="mr-3">
              <Link className="text-slate-50 font-medium" href="/about">About</Link>
            </li>
            <li className="mr-5">
              <Link href="/profile">
                <Image className="w-5 h-5" src={profileSrc} alt="profile" />
              </Link>
            </li>
            <li>
              <Link className="text-slate-50 font-medium mr-3" href="/admin">Admin</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
