import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram } from "lucide-react"

export default function SiteFooter() {
  return (
    <footer className="bg-[#002868] text-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="American Corner Oran Logo" width={40} height={40} className="h-10 w-10" />
              <span className="text-xl font-bold">American Corner Oran</span>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              A partnership between the U.S. Embassy in Algeria and local institutions to promote mutual understanding.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://www.facebook.com/americancorneroran/?locale=fr_FR"
                className="text-white hover:text-[#bf0a30]"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/americancorneroran/?hl=en"
                className="text-white hover:text-[#bf0a30]"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#about" className="text-sm text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-sm text-gray-300 hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#programs" className="text-sm text-gray-300 hover:text-white">
                  Programs
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-sm text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <address className="not-italic">
              <p className="text-sm text-gray-300 mb-2">University of Oran 2 Mohamed Ben Ahmed</p>
              <p className="text-sm text-gray-300 mb-2">Oran, Algeria</p>
              <p className="text-sm text-gray-300 mb-2">Phone: +213 XX XX XX XX</p>
              <p className="text-sm text-gray-300">Email: americancorneroran@example.com</p>
            </address>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-gray-300">
          <p>© {new Date().getFullYear()} American Corner Oran. All rights reserved.</p>
          <p className="mt-2">A partnership between the U.S. Embassy in Algeria and local institutions.</p>
        </div>
      </div>
    </footer>
  )
}
