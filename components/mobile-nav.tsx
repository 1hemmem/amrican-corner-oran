"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4 mt-8">
          <Link href="#about" className="text-lg font-medium hover:text-[#bf0a30]" onClick={() => setOpen(false)}>
            About
          </Link>
          <Link href="#services" className="text-lg font-medium hover:text-[#bf0a30]" onClick={() => setOpen(false)}>
            Services
          </Link>
          <Link href="#programs" className="text-lg font-medium hover:text-[#bf0a30]" onClick={() => setOpen(false)}>
            Programs
          </Link>
          <Link href="#contact" className="text-lg font-medium hover:text-[#bf0a30]" onClick={() => setOpen(false)}>
            Contact
          </Link>
          <Button className="mt-4 bg-[#bf0a30] hover:bg-[#a00926]">Visit Us</Button>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
