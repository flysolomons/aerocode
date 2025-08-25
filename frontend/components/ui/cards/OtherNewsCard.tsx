import Image from "next/image";

// props: card title, image

interface OtherNewsCardProps {
  headline: string;
  image: string;
  date: string;
}

function OtherNewsCard({ headline, image, date }: OtherNewsCardProps) {
  return (
    <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white hover:bg-gray-50 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
      <div className="flex-shrink-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 relative overflow-hidden rounded-xl sm:rounded-2xl">
          <Image
            src={image}
            alt={headline}
            fill
            className="object-cover"
            placeholder="blur"
          />
        </div>
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <a
          href="#"
          className="block text-blue-500 hover:underline font-semibold text-sm sm:text-base lg:text-lg leading-tight mb-2 line-clamp-2 transition-colors duration-200"
        >
          {headline}
        </a>
        <div className="text-xs sm:text-sm text-gray-500 font-medium">
          {date}
        </div>
      </div>
    </div>
  );
}

export default OtherNewsCard;
