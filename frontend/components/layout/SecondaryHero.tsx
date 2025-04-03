"use client";
import { useEffect, useState } from "react";

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

  return (
    <div
      className="h-[25rem] bg-cover bg-center"
      style={{
        backgroundImage: `url(${image})`,
      }}
    >
      <div className="flex items-center justify-center h-full text-white bg-black bg-opacity-20 rounded-lg">
        <div className="text-center space-y-2 max-w-[70.5rem]">
          <div className="text-5xl font-bold font-sans">{title}</div>
          <div className="text-sm">{breadcrumbs}</div>
        </div>
      </div>
    </div>
  );
}
