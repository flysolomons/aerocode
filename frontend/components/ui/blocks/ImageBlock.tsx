import React from "react";
import Image from "next/image";

interface ImageBlockProps {
  block: {
    blockType: string;
    image?: {
      url: string;
    };
    caption?: string;
  };
}

export default function ImageBlock({ block }: ImageBlockProps) {
  return (
    <>
      {block.blockType === "ImageBlock" && (
        <div className="text-center w-full">
          {block.image && (
            <Image
              src={block.image.url}
              alt={block.caption || "Image"}
              width={500}
              height={600}
              className="mx-auto rounded-lg sm:rounded-2xl lg:rounded-3xl object-cover w-full max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl h-auto"
              style={{ width: "auto", height: "auto" }}
            />
          )}
          {block.caption && (
            <p className="text-xs sm:text-sm lg:text-xs mt-2 sm:mt-3 lg:mt-2 text-gray-600 px-4 sm:px-6 lg:px-0">
              {block.caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}
