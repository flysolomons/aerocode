"use client";
import React, { useEffect, useState } from "react";
import BreadcrumbNav from "../BreadcrumbNav";

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
    <div
      className="h-64 sm:h-80 lg:h-[25rem] bg-cover bg-center"
      style={{
        backgroundImage: `url(${image})`,
      }}
    >
      <div className="flex items-center justify-center h-full text-white bg-black bg-opacity-20 rounded-lg px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 sm:space-y-3 lg:space-y-4 max-w-[70.5rem] w-full">
          <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-veneer transition-all duration-1000 ease-out transform">
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
