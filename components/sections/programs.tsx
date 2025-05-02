import { Button } from "@/components/ui/button";
import { ProgramCard } from "@/components/program-card";
import { CardCarousel } from "@/components/card-carousel";

export default function Programs() {
  const programs = [
    {
      title: "English Conversation Club",
      description:
        "Weekly sessions to practice English with native speakers and fellow learners in a friendly environment.",
      date: "Every Tuesday, 4:00 PM",
      image: "/program-english.jpg",
    },
    {
      title: "American Film Screenings",
      description:
        "Regular screenings of classic and contemporary American films followed by discussions.",
      date: "First Friday of each month, 6:00 PM",
      image: "/program-film.jpg",
    },
    {
      title: "Entrepreneurship Workshop Series",
      description:
        "Learn business skills, innovation strategies, and connect with mentors to develop your entrepreneurial ideas.",
      date: "Monthly workshops, check calendar for details",
      image: "/program-business.jpg",
    },
    {
      title: "STEM Education Initiative",
      description:
        "Hands-on activities and projects exploring science, technology, engineering, and mathematics.",
      date: "Wednesdays, 3:00 PM",
      image: "/program-stem.jpg",
    },
    {
      title: "Cultural Exchange Events",
      description:
        "Celebrations of American holidays and traditions, providing opportunities for cultural exchange.",
      date: "Throughout the year, check calendar",
      image: "/program-cultural.jpg",
    },
  ];

  return (
    <section id="programs" className="py-16 bg-white">
      <div className="container">
        <h2 className="text-3xl font-bold text-center text-[#002868] mb-12">
          Featured Programs
        </h2>
        <CardCarousel>
          {programs.map((program, index) => (
            <ProgramCard
              key={index}
              title={program.title}
              description={program.description}
              date={program.date}
              image={program.image}
            />
          ))}
        </CardCarousel>
        <div className="mt-12 text-center">
          <Button className="bg-[#bf0a30] hover:bg-[#a00926]">
            View All Programs
          </Button>
        </div>
      </div>
    </section>
  );
}
