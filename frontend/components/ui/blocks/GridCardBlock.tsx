import Image from "next/image";
import { stripHtmlTags } from "@/lib/utils";

interface GridCardBlockProps {
  item: {
    blockType: string;
    heading?: string;
    text?: string;
    image?: {
      url: string;
    };
  };
}

export default function GridCardBlock({ item }: GridCardBlockProps) {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
      {item.image && (
        <div className="relative h-40 sm:h-48 lg:h-56 w-full">
          <Image
            src={item.image.url}
            alt={item.heading || "Grid Card Image"}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-3 sm:p-4 lg:p-6">
        {item.heading && (
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 leading-tight break-words">
            {item.heading}
          </h3>
        )}
        {item.text && (
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed break-words">
            {stripHtmlTags(item.text)}
          </p>
        )}
      </div>
    </div>
  );
}
