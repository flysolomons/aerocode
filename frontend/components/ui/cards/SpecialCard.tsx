import Image from "next/image";
import Link from "next/link";

// props: card title, image, url

interface SpecialCardProps {
  image: string;
  specialName?: string;
  description?: string;
  url: string; // URL is required now
  expires?: string; // New prop for expiry date
}

function SpecialCard({
  image,
  specialName,
  description,
  url,
  expires = "31/12/2025", // Example default
}: SpecialCardProps) {
  return (
    <Link href={url} className="block hover:opacity-90 transition-opacity">
      <div className="flex flex-col w-full min-h-80 h-auto sm:h-80 lg:h-96 rounded-2xl sm:rounded-3xl lg:rounded-3xl overflow-hidden shadow-xl bg-white">
        {/* Image section (top half) */}
        <div
          className="relative w-full h-40 sm:h-1/2 flex-shrink-0"
          style={{ flexBasis: "auto" }}
        >
          <Image
            src={image}
            alt={specialName ? specialName : ""}
            fill
            className="object-cover w-full h-full"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          />
        </div>
        {/* Info section (bottom half) */}
        <div className="relative flex flex-col items-center justify-between w-full flex-1 px-6 py-4 gap-2 text-center">
          <div className="flex-1 flex flex-col justify-center items-center w-full">
            <h3 className="text-lg sm:text-lg lg:text-xl font-bold text-blue-500 mb-1">
              {specialName}
            </h3>
            <p className="text-sm sm:text-sm text-gray-600 line-clamp-3">
              {description || "insert subtitle or description here"}
            </p>
            <span className="mt-4 bg-orange-300 text-orange-900 font-medium text-xs px-3 py-1 rounded-full shadow-sm">
              Expires {expires}
            </span>
          </div>
          <span className="text-gray-800 hover:underline text-xs mt-2">
            Learn more about this special
          </span>
        </div>
      </div>
    </Link>
  );
}

export default SpecialCard;
