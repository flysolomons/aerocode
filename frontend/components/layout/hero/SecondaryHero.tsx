"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// props: card title, image

interface SecondaryHeroProps {
  title: string;
  image: string;
  breadcrumbs?: string;
  onColorCalculated?: (color: string) => void;
}

export default function SecondaryHero({
  title,
  image,
  breadcrumbs,
  onColorCalculated,
}: SecondaryHeroProps) {
  useEffect(() => {
    const calculateAverageColor = async () => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = image;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // First, calculate the scaling factor
        const HERO_HEIGHT = 400; // Our fixed container height
        const scalingFactor = HERO_HEIGHT / img.height;
        const scaledWidth = img.width * scalingFactor;

        // Draw the entire image as it would appear in the hero
        canvas.width = scaledWidth;
        canvas.height = HERO_HEIGHT;

        // Draw the full image scaled to match hero dimensions
        ctx.drawImage(img, 0, 0, scaledWidth, HERO_HEIGHT);

        // Now get just the bottom 10 rows of the visible portion
        const bottomPixels = ctx.getImageData(
          0, // x start
          HERO_HEIGHT - 50, // y start (10px from bottom)
          scaledWidth, // width
          50 // height (10 rows)
        ).data;

        let r = 0,
          g = 0,
          b = 0;

        for (let i = 0; i < bottomPixels.length; i += 4) {
          r += bottomPixels[i];
          g += bottomPixels[i + 1];
          b += bottomPixels[i + 2];
        }

        const pixelCount = bottomPixels.length / 4;
        const avgColor = `rgb(${Math.round(r / pixelCount)}, ${Math.round(
          g / pixelCount
        )}, ${Math.round(b / pixelCount)}
        )`;

        onColorCalculated?.(avgColor);
      };
    };

    calculateAverageColor();
  }, [image, onColorCalculated]);
  const renderBreadcrumbs = () => {
    if (!breadcrumbs) return null;

    const breadcrumbParts = breadcrumbs.split("/").filter(Boolean);

    // Helper function to format labels
    const formatLabel = (part: string, index: number) => {
      const isAfterNews =
        breadcrumbParts.includes("news") &&
        index > breadcrumbParts.indexOf("news");
      return isAfterNews
        ? "Article"
        : part
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    }; // If we have 3 or fewer parts, show all
    if (breadcrumbParts.length <= 3) {
      return (
        <Breadcrumb>
          <BreadcrumbList className="text-white justify-center gap-1 sm:gap-1.5">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="text-white hover:text-white/80">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {breadcrumbParts.map((part, index) => {
              const href = "/" + breadcrumbParts.slice(0, index + 1).join("/");
              const label = formatLabel(part, index);
              const isLast = index === breadcrumbParts.length - 1;

              return (
                <React.Fragment key={index}>
                  <BreadcrumbSeparator className="text-white/60" />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="text-white">
                        {label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link
                          href={href}
                          className="text-white hover:text-white/80"
                        >
                          {label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      );
    } // If we have more than 3 parts, show: Home / First / ... / Last
    const firstPart = breadcrumbParts[0];
    const lastPart = breadcrumbParts[breadcrumbParts.length - 1];

    const firstHref = "/" + firstPart;
    const firstLabel = formatLabel(firstPart, 0);
    const lastLabel = formatLabel(lastPart, breadcrumbParts.length - 1);

    // Get the middle parts for the dropdown
    const middleParts = breadcrumbParts.slice(1, -1);
    return (
      <Breadcrumb>
        <BreadcrumbList className="text-white justify-center gap-1 sm:gap-1.5">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="text-white hover:text-white/80">
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator className="text-white/60" />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={firstHref} className="text-white hover:text-white/80">
                {firstLabel}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator className="text-white/60" />
          <BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-white/60 hover:text-white/80">
                <BreadcrumbEllipsis className="h-4 w-4" />
                <span className="sr-only">Show more breadcrumbs</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-white border">
                {middleParts.map((part, index) => {
                  const actualIndex = index + 1; // +1 because we're skipping the first part
                  const href =
                    "/" + breadcrumbParts.slice(0, actualIndex + 1).join("/");
                  const label = formatLabel(part, actualIndex);

                  return (
                    <DropdownMenuItem key={index} asChild>
                      <Link
                        href={href}
                        className="text-gray-900 hover:text-gray-700 cursor-pointer w-full"
                      >
                        {label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>

          <BreadcrumbSeparator className="text-white/60" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-white">{lastLabel}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  };
  return (
    <div
      className="h-64 sm:h-80 lg:h-[25rem] bg-cover bg-center"
      style={{
        backgroundImage: `url(${image})`,
      }}
    >
      <div className="flex items-center justify-center h-full text-white bg-black bg-opacity-20 rounded-lg px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 sm:space-y-3 lg:space-y-4 max-w-[70.5rem] w-full">
          <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold font-sans leading-tight">
            {title}
          </div>
          <div className="text-xs sm:text-sm lg:text-base">
            {renderBreadcrumbs()}
          </div>
        </div>
      </div>
    </div>
  );
}
