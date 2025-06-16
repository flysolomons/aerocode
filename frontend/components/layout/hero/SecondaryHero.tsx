"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

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
    const breadcrumbLinks = breadcrumbParts.map((part, index) => {
      const isAfterNews =
        breadcrumbParts.includes("news") &&
        index > breadcrumbParts.indexOf("news");
      const href = "/" + breadcrumbParts.slice(0, index + 1).join("/");
      const label = isAfterNews
        ? "Article"
        : part
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());

      if (index === breadcrumbParts.length - 1) {
        // Last part of the breadcrumb, not clickable
        return <span key={index}> / {label}</span>;
      }

      return (
        <span key={index}>
          {index > 0 && " / "}
          <Link href={href} className="hover:underline">
            {label}
          </Link>
        </span>
      );
    });

    return (
      <div className="text-sm">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        {breadcrumbParts.length > 1 && " / "}
        {breadcrumbLinks}
      </div>
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
