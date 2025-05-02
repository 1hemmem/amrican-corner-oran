import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative">
      {/* Dark blue overlay to improve contrast */}
      <div className="absolute inset-0 bg-[#001f4d]/80 z-10" />
      {/* Optional: keep gradient if you still want that red-to-blue effect on top */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#002868]/70 to-[#bf0a30]/70 z-20 opacity-50" />
      <div className="relative h-[500px] w-full">
        <Image
          src="/hero-image.jpg"
          alt="American Corner Oran"
          fill
          className="object-cover"
          priority
        />
        <div className="container relative z-30 flex h-full flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Welcome to American Corner Oran
          </h1>
          <p className="mt-4 max-w-2xl text-lg sm:text-xl">
            A space for cultural exchange, learning, and collaboration between
            Algeria and the United States
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Button className="bg-white text-[#002868] hover:bg-gray-100">
              Learn More
            </Button>
            <Button className="bg-[#bf0a30] hover:bg-[#a00926]">
              Our Programs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
