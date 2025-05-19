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
        <div className="text-center">
          {block.image && (
            <Image
              src={block.image.url}
              alt={block.caption || "Image"}
              width={500}
              height={600}
              className="mx-auto rounded-3xl object-cover"
              style={{ width: "auto", height: "auto" }}
            />
          )}
          {block.caption && <p className="text-xs">{block.caption}</p>}
        </div>
      )}
    </>
  );
}
