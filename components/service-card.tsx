import { BookOpen, Languages, Laptop, GraduationCap, Theater, Briefcase } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ServiceCardProps {
  title: string
  description: string
  icon: string
}

export function ServiceCard({ title, description, icon }: ServiceCardProps) {
  const getIcon = (): JSX.Element => {
    switch (icon) {
      case "BookOpen":
        return <BookOpen className="h-10 w-10 text-[#bf0a30]" />
      case "Languages":
        return <Languages className="h-10 w-10 text-[#bf0a30]" />
      case "Laptop":
        return <Laptop className="h-10 w-10 text-[#bf0a30]" />
      case "GraduationCap":
        return <GraduationCap className="h-10 w-10 text-[#bf0a30]" />
      case "Theater":
        return <Theater className="h-10 w-10 text-[#bf0a30]" />
      case "Briefcase":
        return <Briefcase className="h-10 w-10 text-[#bf0a30]" />
      default:
        return <BookOpen className="h-10 w-10 text-[#bf0a30]" />
    }
  }

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center gap-4">
        {getIcon()}
        <CardTitle className="text-[#002868]">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{description}</p>
      </CardContent>
    </Card>
  )
}
