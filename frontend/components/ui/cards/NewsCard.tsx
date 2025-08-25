import Image from "next/image";
import parse from "html-react-parser";
import { useRouter } from "next/navigation";

interface NewsCardProps {
  headline: string;
  image: string;
  date: string;
  description: string;
  category?: {
    name: string;
    slug: string;
  } | null;
  url: string;
}

function NewsCard({
  headline,
  image,
  date,
  description,
  category,
  url,
}: NewsCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <div className="p-2 sm:p-3 lg:p-2 rounded-xl sm:rounded-2xl lg:rounded-2xl shadow-md bg-white h-[21rem] sm:h-[23rem] lg:h-[25rem] w-full flex flex-col">
        <div className="relative mb-3 space-y-2">
          <a
            href={url}
            className="block relative h-[10rem] sm:h-[11rem] lg:h-[12rem] rounded-xl sm:rounded-2xl lg:rounded-2xl overflow-hidden group"
          >
            <Image
              src={image}
              alt={headline}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              placeholder="blur"
            />
          </a>

          <div className="text-xs sm:text-sm lg:text-sm text-gray-500 flex items-center gap-2">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 6v6l4 2" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span>{formattedDate}</span>
            {category && (
              <>
                <span>•</span>
                <a
                  href={`/news/${category.slug}`}
                  className="text-blue-500 hover:underline"
                >
                  {category.name}
                </a>
              </>
            )}
          </div>
        </div>
        <a href={url}>
          <h2 className="text-base sm:text-lg lg:text-lg font-bold text-blue-500 uppercase mb-3 hover:underline break-words leading-tight line-clamp-2">
            {headline}
          </h2>
        </a>
        <div className="text-gray-700 text-xs sm:text-sm lg:text-sm leading-relaxed flex-1">
          <div className="line-clamp-4">{parse(description)}</div>
        </div>
      </div>
    </>
  );
}

export default NewsCard;
