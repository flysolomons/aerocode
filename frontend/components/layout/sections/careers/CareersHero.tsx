"use client";
import React from "react";
import Image from "next/image";

interface ImageBlock {
  url: string;
}

interface CareersHeroProps {
  heroTitle?: string;
  heroImage?: ImageBlock;
  heroVideo?: string;
  subTitle?: string;
}

const CareersHero = ({
  heroTitle = "Discover your altitude!",
  heroImage,
  heroVideo,
  subTitle,
}: CareersHeroProps) => {
  const getVideoUrl = (videoPath: string) => {
    // If it's already an absolute URL, return it as is
    if (videoPath.startsWith("http")) {
      return videoPath;
    }
    // If it's a relative path, construct the absolute URL
    const baseUrl = process.env.NEXT_PUBLIC_STORAGE_URL;
    return `${baseUrl}media/${videoPath}`;
  };

  return (
    <section className="relative overflow-hidden text-white h-[75vh] flex items-center">
      {/* Background Video or Image */}
      {heroVideo ? (
        <video
          className="absolute inset-0 w-full h-full object-cover z-10"
          autoPlay
          muted
          loop
          playsInline
          onLoadStart={() => console.log("Video loading started")}
          onCanPlay={() => console.log("Video can play")}
          onLoadedData={() => console.log("Video data loaded")}
        >
          <source src={getVideoUrl(heroVideo)} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : heroImage ? (
        <Image
          src={heroImage.url}
          alt={heroTitle}
          fill
          className="absolute inset-0 w-full h-full object-cover z-10"
          priority
          quality={85}
          sizes="100vw"
        />
      ) : (
        <video
          className="absolute inset-0 w-full h-full object-cover z-10"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/air.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Fallback background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 z-0"></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-40 z-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-30 text-center">
          <h1 className="text-6xl sm:text-6xl md:text-6xl lg:text-6xl lg:text-8xl font-veneer mb-4 sm:mb-6 leading-tight">
            {heroTitle}
          </h1>
          {subTitle && (
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto px-4">
              {subTitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CareersHero;
