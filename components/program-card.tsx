import Image from "next/image"
import { Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ProgramCardProps {
  title: string
  description: string
  date: string
  image: string
}

export function ProgramCard({ title, description, date, image }: ProgramCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
      <CardHeader>
        <CardTitle className="text-[#002868]">{title}</CardTitle>
        <CardDescription className="flex items-center gap-1 text-[#bf0a30]">
          <Calendar className="h-4 w-4" />
          <span>{date}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700">{description}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Learn More
        </Button>
      </CardFooter>
    </Card>
  )
}
