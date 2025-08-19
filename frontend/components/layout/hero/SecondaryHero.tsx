"use client";
import React, { useEffect, useState } from "react";
import BreadcrumbNav from "../BreadcrumbNav";
import HeroBottomFade from "./HeroBottomFade";
import Image from "next/image";

// props: card title, image

interface SecondaryHeroProps {
  title: string;
  image: string;
  breadcrumbs?: string;
}

export default function SecondaryHero({
  title,
  image,
  breadcrumbs,
}: SecondaryHeroProps) {
  const renderBreadcrumbs = () => {
    return <BreadcrumbNav breadcrumbs={breadcrumbs} />;
  };
  return (
    <div className="relative h-64 sm:h-80 lg:h-[25rem] overflow-hidden">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        priority
        quality={85}
        sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, (max-width: 1440px) 1440px, 1920px"
      />
      <HeroBottomFade />

      <div className="flex items-center justify-center h-full text-white bg-black bg-opacity-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-2 sm:space-y-3 lg:space-y-4 max-w-[70.5rem] w-full">
          <h1 className="text-5xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-veneer transition-all duration-1000 ease-out transform">
            {title}
          </h1>
          <div className="text-xs sm:text-sm lg:text-base">
            {renderBreadcrumbs()}
          </div>
        </div>
      </div>
    </div>
  );
}
