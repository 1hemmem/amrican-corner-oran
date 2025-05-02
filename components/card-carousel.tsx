"use client";
import type React from "react";
import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";

interface CardCarouselProps {
  children: React.ReactNode;
}

export function CardCarousel({ children }: CardCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    skipSnaps: false,
    dragFree: false, // Changed to false to ensure it always snaps properly
    containScroll: "trimSnaps",
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Scroll to a specific index
  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  // Scroll to previous slide with precise control
  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    const prevIndex = Math.max(0, selectedIndex - 1);
    scrollTo(prevIndex);
  }, [emblaApi, scrollTo, selectedIndex]);

  // Scroll to next slide with precise control
  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    const nextIndex = Math.min(scrollSnaps.length - 1, selectedIndex + 1);
    scrollTo(nextIndex);
  }, [emblaApi, scrollTo, selectedIndex, scrollSnaps.length]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    // Update selected index
    setSelectedIndex(emblaApi.selectedScrollSnap());

    // Update button states
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    // Store all valid scroll snap positions
    setScrollSnaps(emblaApi.scrollSnapList());

    // Set up event listeners
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      onSelect();
    });

    // Initial state
    onSelect();

    // Cleanup
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {Array.isArray(children) ? (
            children.map((child, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] min-w-0"
              >
                {child}
              </div>
            ))
          ) : (
            <div className="flex-[0_0_100%] min-w-0">{children}</div>
          )}
        </div>
      </div>
      <div className="flex justify-center mt-6 gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={scrollPrev}
          disabled={!prevBtnEnabled}
          className="rounded-full bg-white border-gray-200 shadow-sm"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous slide</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={scrollNext}
          disabled={!nextBtnEnabled}
          className="rounded-full bg-white border-gray-200 shadow-sm"
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next slide</span>
        </Button>
      </div>
    </div>
  );
}
