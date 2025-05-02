import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function Contact() {
  return (
    <section id="contact" className="py-16 bg-[#002868] text-white">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Visit Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#bf0a30] mt-1" />
                  <div>
                    <p className="font-medium">Address:</p>
                    <p>American Corner Oran</p>
                    <p>University of Oran 2 Mohamed Ben Ahmed</p>
                    <p>Oran, Algeria</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[#bf0a30]" />
                  <div>
                    <p className="font-medium">Phone:</p>
                    <p>+213 XX XX XX XX</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[#bf0a30]" />
                  <div>
                    <p className="font-medium">Email:</p>
                    <p>americancorneroran@example.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-[#bf0a30] mt-1" />
                  <div>
                    <p className="font-medium">Operating Hours:</p>
                    <p>Monday - Thursday: 9:00 AM - 5:00 PM</p>
                    <p>Friday: 9:00 AM - 12:00 PM</p>
                    <p>Saturday - Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 flex gap-4">
              <Button className="bg-white text-[#002868] hover:bg-gray-100">Get Directions</Button>
              <Button className="bg-[#bf0a30] hover:bg-[#a00926]">Contact Us</Button>
            </div>
          </div>
          <div className="h-[400px] w-full rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3266.2283323689!2d-0.6418!3d35.7039!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQyJzE0LjAiTiAwwrAzOCczMC41Ilc!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="American Corner Oran Location"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}
