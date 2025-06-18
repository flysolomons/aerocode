import React from "react";
import Image from "next/image";

interface FullWidthImageBlockProps {
  block: {
    blockType: string;
    image?: {
      url: string;
    };
    caption?: string;
  };
}

export default function FullWidthImageBlock({
  block,
}: FullWidthImageBlockProps) {
  return (
    <>
      {block.blockType === "FullWidthImageBlock" && (
        <div className="w-full">
          {block.image && (
            <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[32rem] xl:h-[40rem]">
              <Image
                src={block.image.url}
                alt={block.caption || "Full width image"}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          )}
          {block.caption && (
            <div className="py-4 px-4 sm:px-6 lg:px-8">
              <p className="text-sm sm:text-base text-center text-gray-600 max-w-4xl mx-auto">
                {block.caption}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
