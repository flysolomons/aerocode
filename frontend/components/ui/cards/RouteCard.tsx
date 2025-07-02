import Link from "next/link";

interface RouteCardProps {
  origin: string;
  destination: string;
  url?: string;
}

function RouteCard({ origin, destination, url }: RouteCardProps) {
  const content = (
    <div className="px-4 py-4 bg-white rounded-2xl shadow hover:shadow-md transition-shadow cursor-pointer">
      <span className="text-sm sm:text-base lg:text-base">
        {origin} to {destination}
      </span>
    </div>
  );

  if (url) {
    return <Link href={url}>{content}</Link>;
  }

  return content;
}

export default RouteCard;
