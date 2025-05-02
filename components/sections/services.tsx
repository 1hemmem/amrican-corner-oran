import { ServiceCard } from "@/components/service-card"
import { CardCarousel } from "@/components/card-carousel"

export default function Services() {
  const services = [
    {
      title: "Library Resources",
      description:
        "Access to books, e-books, magazines, and multimedia materials about American culture, history, and society.",
      icon: "BookOpen",
    },
    {
      title: "English Language Programs",
      description: "Conversation clubs, language resources, and workshops to improve English language skills.",
      icon: "Languages",
    },
    {
      title: "Technology Access",
      description: "Free internet access, computers, and digital resources for research and learning.",
      icon: "Laptop",
    },
    {
      title: "Information on U.S. Education",
      description:
        "Resources and advising on study opportunities in the United States, including scholarships and exchange programs.",
      icon: "GraduationCap",
    },
    {
      title: "Cultural Events",
      description:
        "Film screenings, art exhibitions, music performances, and other cultural activities showcasing American arts and culture.",
      icon: "Theater",
    },
    {
      title: "Professional Development",
      description: "Workshops, seminars, and training sessions on leadership, entrepreneurship, and career skills.",
      icon: "Briefcase",
    },
  ]

  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center text-[#002868] mb-12">Our Services</h2>
        <CardCarousel>
          {services.map((service, index) => (
            <ServiceCard key={index} title={service.title} description={service.description} icon={service.icon} />
          ))}
        </CardCarousel>
      </div>
    </section>
  )
}
