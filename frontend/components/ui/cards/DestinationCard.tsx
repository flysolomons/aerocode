import Image from "next/image";
import Link from "next/link";

// props: card title, image

interface DestinationCardProps {
  title: string;
  image: string;
  url: string;
  label: string; // descriptive name for heroTitle
}

function DestinationCard({ title, image, url }: DestinationCardProps) {
  return (
    <Link href={url} legacyBehavior>
      <a className="relative rounded-3xl overflow-hidden w-full h-full shadow-md cursor-pointer group block aspect-[4/3]">
        <div className="w-full h-full relative">
          <Image
            src={image}
            alt={title}
            width={500}
            height={500}
            className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent z-10 transition-all duration-500"></div>
          {/* Title aligned to the left */}
          <div className="absolute bottom-0 left-0 w-full flex flex-col items-start justify-end z-20 pb-8 pl-8">
            <span className="text-xl sm:text-xl font-bold text-white drop-shadow-lg truncate max-w-full">
              {title}
            </span>
          </div>
        </div>
      </a>
    </Link>
  );
}

export default DestinationCard;
