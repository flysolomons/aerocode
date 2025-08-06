"use client";
import React from "react";

interface HeroBottomFadeProps {
  color?: string;
  baseHeight?: string;
  mobileHeight?: string;
  desktopHeight?: string;
}

export default function HeroBottomFade({
  color = "#F2F2FF",
  baseHeight = "25%",
  mobileHeight = "35%",
  desktopHeight = "35%",
}: HeroBottomFadeProps) {
  // Convert hex color to RGB for rgba usage
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 242, g: 242, b: 255 }; // Default to #F2F2FF
  };

  const rgb = hexToRgb(color);
  const rgbaColor = (opacity: number) =>
    `rgba(${rgb.r},${rgb.g},${rgb.b},${opacity})`;

  return (
    <>
      {/* Base transition overlay */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: baseHeight,
          background: `
            linear-gradient(to top, 
              ${color} 0%, 
              ${rgbaColor(0.98)} 3%, 
              ${rgbaColor(0.95)} 6%, 
              ${rgbaColor(0.9)} 10%, 
              ${rgbaColor(0.85)} 14%, 
              ${rgbaColor(0.78)} 18%, 
              ${rgbaColor(0.72)} 22%, 
              ${rgbaColor(0.65)} 26%, 
              ${rgbaColor(0.58)} 30%, 
              ${rgbaColor(0.52)} 34%, 
              ${rgbaColor(0.45)} 38%, 
              ${rgbaColor(0.38)} 42%, 
              ${rgbaColor(0.32)} 46%, 
              ${rgbaColor(0.26)} 50%, 
              ${rgbaColor(0.21)} 54%, 
              ${rgbaColor(0.17)} 58%, 
              ${rgbaColor(0.13)} 62%, 
              ${rgbaColor(0.1)} 66%, 
              ${rgbaColor(0.075)} 70%, 
              ${rgbaColor(0.055)} 74%, 
              ${rgbaColor(0.04)} 78%, 
              ${rgbaColor(0.028)} 82%, 
              ${rgbaColor(0.019)} 86%, 
              ${rgbaColor(0.012)} 90%, 
              ${rgbaColor(0.007)} 94%, 
              ${rgbaColor(0.004)} 97%, 
              ${rgbaColor(0.002)} 99%, 
              transparent 100%
            )
          `,
        }}
      />

      {/* Mobile responsive adjustment */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none sm:hidden"
        style={{
          height: mobileHeight,
          background: `
            linear-gradient(to top, 
              ${color} 0%, 
              ${rgbaColor(0.96)} 4%, 
              ${rgbaColor(0.9)} 8%, 
              ${rgbaColor(0.82)} 12%, 
              ${rgbaColor(0.74)} 16%, 
              ${rgbaColor(0.66)} 20%, 
              ${rgbaColor(0.58)} 24%, 
              ${rgbaColor(0.5)} 28%, 
              ${rgbaColor(0.42)} 32%, 
              ${rgbaColor(0.35)} 36%, 
              ${rgbaColor(0.28)} 40%, 
              ${rgbaColor(0.22)} 44%, 
              ${rgbaColor(0.17)} 48%, 
              ${rgbaColor(0.13)} 52%, 
              ${rgbaColor(0.095)} 56%, 
              ${rgbaColor(0.07)} 60%, 
              ${rgbaColor(0.05)} 64%, 
              ${rgbaColor(0.035)} 68%, 
              ${rgbaColor(0.024)} 72%, 
              ${rgbaColor(0.016)} 76%, 
              ${rgbaColor(0.01)} 80%, 
              ${rgbaColor(0.006)} 85%, 
              ${rgbaColor(0.003)} 90%, 
              ${rgbaColor(0.001)} 95%, 
              transparent 100%
            )
          `,
        }}
      />

      {/* Desktop responsive adjustment */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none hidden lg:block"
        style={{
          height: desktopHeight,
          background: `
            linear-gradient(to top, 
              ${color} 0%, 
              ${rgbaColor(0.98)} 2%, 
              ${rgbaColor(0.95)} 4%, 
              ${rgbaColor(0.91)} 6%, 
              ${rgbaColor(0.86)} 8%, 
              ${rgbaColor(0.8)} 10%, 
              ${rgbaColor(0.74)} 12%, 
              ${rgbaColor(0.68)} 14%, 
              ${rgbaColor(0.62)} 16%, 
              ${rgbaColor(0.56)} 18%, 
              ${rgbaColor(0.5)} 20%, 
              ${rgbaColor(0.44)} 22%, 
              ${rgbaColor(0.38)} 24%, 
              ${rgbaColor(0.33)} 26%, 
              ${rgbaColor(0.28)} 28%, 
              ${rgbaColor(0.23)} 30%, 
              ${rgbaColor(0.19)} 32%, 
              ${rgbaColor(0.15)} 34%, 
              ${rgbaColor(0.12)} 36%, 
              ${rgbaColor(0.095)} 38%, 
              ${rgbaColor(0.074)} 40%, 
              ${rgbaColor(0.056)} 42%, 
              ${rgbaColor(0.042)} 44%, 
              ${rgbaColor(0.03)} 46%, 
              ${rgbaColor(0.021)} 48%, 
              ${rgbaColor(0.014)} 50%, 
              ${rgbaColor(0.009)} 52%, 
              ${rgbaColor(0.006)} 54%, 
              ${rgbaColor(0.004)} 56%, 
              ${rgbaColor(0.002)} 58%, 
              ${rgbaColor(0.001)} 60%, 
              transparent 100%
            )
          `,
        }}
      />
    </>
  );
}