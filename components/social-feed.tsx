"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface SocialFeedProps {
  type: "facebook" | "instagram"
  url: string
}

export function SocialFeed({ type, url }: SocialFeedProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading of social media feed
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  // In a real implementation, this would fetch and display actual social media content
  // For now, we'll show placeholder content
  return (
    <div className="space-y-6">
      {type === "facebook" ? (
        <>
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-[#002868] flex items-center justify-center text-white font-bold">
                AC
              </div>
              <div>
                <p className="font-semibold">American Corner Oran</p>
                <p className="text-xs text-gray-500">2 days ago</p>
              </div>
            </div>
            <p className="text-sm mb-3">
              Join us this Thursday for our English Conversation Club! Practice your English skills in a friendly
              environment. All levels welcome!
            </p>
            <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center">
              <p className="text-gray-500">Event Poster Image</p>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-[#002868] flex items-center justify-center text-white font-bold">
                AC
              </div>
              <div>
                <p className="font-semibold">American Corner Oran</p>
                <p className="text-xs text-gray-500">5 days ago</p>
              </div>
            </div>
            <p className="text-sm mb-3">
              Thank you to everyone who attended our workshop on "Entrepreneurship in the Digital Age" yesterday.
              Special thanks to our guest speaker from Silicon Valley!
            </p>
            <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center">
              <p className="text-gray-500">Workshop Photo</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-[#bf0a30] flex items-center justify-center text-white font-bold">
                AC
              </div>
              <div>
                <p className="font-semibold">@americancorneroran</p>
                <p className="text-xs text-gray-500">3 days ago</p>
              </div>
            </div>
            <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center mb-3">
              <p className="text-gray-500">Instagram Post Image</p>
            </div>
            <p className="text-sm">
              Celebrating American Independence Day at American Corner Oran! Thanks to everyone who joined us for this
              special event. #4thOfJuly #AmericanCornerOran
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-[#bf0a30] flex items-center justify-center text-white font-bold">
                AC
              </div>
              <div>
                <p className="font-semibold">@americancorneroran</p>
                <p className="text-xs text-gray-500">1 week ago</p>
              </div>
            </div>
            <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center mb-3">
              <p className="text-gray-500">Instagram Post Image</p>
            </div>
            <p className="text-sm">
              New books have arrived at our library! Come check out the latest additions to our collection.
              #ReadingIsFun #AmericanLiterature
            </p>
          </div>
        </>
      )}
      <div className="text-center">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-[#002868] hover:underline"
        >
          View more on {type === "facebook" ? "Facebook" : "Instagram"} →
        </a>
      </div>
    </div>
  )
}
