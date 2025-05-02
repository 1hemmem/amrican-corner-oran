import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-[#002868] mb-6">
              Our Mission
            </h2>
            <p className="text-gray-700 mb-4">
              The American Corner Oran is a partnership between the U.S. Embassy
              in Algeria and local institutions. We provide a space where
              Algerians can connect, practice English, learn about American
              culture, and explore opportunities for study and professional
              development in the United States.
            </p>
            <p className="text-gray-700 mb-6">
              Our mission is to foster mutual understanding between the people
              of Algeria and the United States through cultural exchange,
              educational programs, and community engagement.
            </p>
            <Button className="bg-[#002868] hover:bg-[#001d4c]">
              About Us
            </Button>
          </div>
          <div className="md:w-1/2 relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden">
            <Image
              src="/about-image.jpg"
              alt="American Corner Oran Facility"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
