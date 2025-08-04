import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser";
import GenericCardFull from "../cards/GenericCardVariants/GenericCardFull";

interface GridCardBlockProps {
  item: {
    blockType: string;
    heading?: string;
    text?: string;
    image?: {
      url: string;
    };
    url?: string;
  };
}

export default function GridCardBlock({ item }: GridCardBlockProps) {
  // Extract URL from rich text HTML
  const extractUrlFromRichText = (richText: string): string | null => {
    if (!richText) return null;

    try {
      // Use regex to extract href attribute from anchor tag
      const hrefMatch = richText.match(/href="([^"]+)"/);
      return hrefMatch ? hrefMatch[1] : null;
    } catch (error) {
      console.error("Error extracting URL from rich text:", error);
      return null;
    }
  };

  const extractedUrl = item.url ? extractUrlFromRichText(item.url) : null;
  const description = item.text ? parse(item.text) : null;
  const cardContent = (
    <>

      {item && (
   
        <GenericCardFull
        title={item.heading || ""} 
        image={item.image?.url || ""}
        url={extractedUrl || ""}
        subTitle={description}
      />
      )}
      
      {/* {item.image && (
        
        
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
          <div className="text-sm sm:text-base text-gray-600 leading-relaxed break-words">
            {parse(item.text)}
          </div>
        )}
      </div> */}
    </>
  );

  // const cardClasses =
  //   "bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105";

  if (extractedUrl) {
    return (
      <Link
        href={extractedUrl}
        className={` block cursor-pointer`}
      >
        {cardContent}
      </Link>
    );
  }

  return <div>{cardContent}</div>;
}
