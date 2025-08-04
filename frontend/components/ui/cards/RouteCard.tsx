import Link from "next/link";

interface RouteCardProps {
  origin: string;
  destination: string;
  url?: string;
}

function RouteCard({ origin, destination, url }: RouteCardProps) {
  const content = (
    <div className="px-4 py-4 bg-white rounded-2xl shadow hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4B5563"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-map-pin-icon lucide-map-pin flex-shrink-0"
        >
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <span className="font-medium text-sm sm:text-base lg:text-base pl-2 text-gray-600">
          {origin} to {destination}
        </span>
      </div>
    </div>
  );

  if (url) {
    return <Link href={url}>{content}</Link>;
  }

  return content;
}

export default RouteCard;
