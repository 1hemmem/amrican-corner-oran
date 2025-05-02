import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import MobileNav from "@/components/mobile-nav"

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="American Corner Oran Logo" width={40} height={40} className="h-10 w-10" />
          <span className="text-xl font-bold text-[#002868]">American Corner Oran</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#about" className="text-sm font-medium hover:text-[#bf0a30]">
            About
          </Link>
          <Link href="#services" className="text-sm font-medium hover:text-[#bf0a30]">
            Services
          </Link>
          <Link href="#programs" className="text-sm font-medium hover:text-[#bf0a30]">
            Programs
          </Link>
          <Link href="#contact" className="text-sm font-medium hover:text-[#bf0a30]">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button className="hidden md:flex bg-[#bf0a30] hover:bg-[#a00926]">Visit Us</Button>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
