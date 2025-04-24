import Image from "next/image";

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      {item.image && (
        <div className="relative h-48 w-full">
          <Image
            src={item.image.url}
            alt={item.heading || "Grid Card Image"}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4">
        {item.heading && (
          <h3 className="text-xl font-bold mb-2">{item.heading}</h3>
        )}
        {item.text && <p className="text-gray-600">{item.text}</p>}
      </div>
    </div>
  );
}
