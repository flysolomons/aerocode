interface SectionBlockProps {
  block: {
    blockType: string;
    heading?: string;
    text?: string;
    image?: {
      url: string;
    };
    imagePosition?: "left" | "right";
  };
}

import Image from "next/image";

export default function SectionBlock({ block }: SectionBlockProps) {
  const imageOnLeft = block.imagePosition !== "right";

  return (
    <div
      className={`flex w-full rounded-3xl overflow-hidden bg-white shadow-lg p-4 h-[24.5rem] ${
        imageOnLeft ? "flex-row" : "flex-row-reverse"
      } ${imageOnLeft ? "space-x-8" : "space-x-8 space-x-reverse"}`}
    >
      {block.image && (
        <div className="w-1/3">
          <Image
            src={block.image.url}
            alt="Section Image"
            width={400}
            height={360}
            className="w-full h-full object-cover rounded-3xl"
          />
        </div>
      )}

      <div className={`${block.image ? "w-2/3" : "w-full"} p-4`}>
        {block.heading && (
          <h2 className="text-2xl mb-2 text-gray-800 font-semibold">
            {block.heading}
          </h2>
        )}
        {block.text && <p className="leading-relaxed">{block.text}</p>}
      </div>
    </div>
  );
}
