import { beautifyHtml } from "@/lib/beautifyHtml";
import parse from "html-react-parser";
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
      className={`flex flex-col lg:flex-row w-full lg:rounded-xl rounded-xl sm:rounded-3xl overflow-hidden bg-white shadow-lg p-3 sm:p-4 lg:p-6 min-h-[20rem] sm:min-h-[22rem] lg:h-auto ${
        imageOnLeft ? "lg:flex-row" : "lg:flex-row-reverse"
      }`}
    >
      {block.image && (
        <div className="w-full lg:w-1/3 mb-4 lg:mb-0">
          <Image
            src={block.image.url}
            alt={block.heading || "Section Image"}
            width={400}
            height={360}
            className="w-full h-48 sm:h-56 lg:h-full object-cover rounded-xl sm:rounded-2xl lg:rounded-xl"
          />
        </div>
      )}

      <div
        className={`${
          block.image ? "w-full lg:w-2/3" : "w-full"
        } p-2 sm:p-4 lg:p-6 ${
          block.image
            ? imageOnLeft
              ? "lg:ml-6 xl:ml-8"
              : "lg:mr-6 xl:mr-8"
            : ""
        }`}
      >
        {block.heading && (
          <h2 className="text-xl md:text-2xl lg:text-3xl mb-3 sm:mb-4 lg:mb-6 text-blue-500 font-semibold leading-tight break-words">
            {block.heading}
          </h2>
        )}
        {block.text && (
          <div className="text-sm sm:text-base lg:text-md leading-relaxed text-gray-500 break-words whitespace-pre-wrap">
            {beautifyHtml(block.text)}
          </div>
        )}
      </div>
    </div>
  );
}
