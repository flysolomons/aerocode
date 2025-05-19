import Image from "next/image";
import Link from "next/link";

interface GenericCardProps {
  title: string;
  image: string;
  url: string; // Changed from optional to required
}

function GenericCard({ title, image, url }: GenericCardProps) {
  return (
    <Link href={url} className="block hover:opacity-90 transition-opacity">
      <div className="relative rounded-3xl overflow-hidden w-full h-full shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
        <Image
          src={image}
          alt={title}
          width={500}
          height={500}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center text-white z-20">
          <span className="text-2xl font-semibold text-center">{title}</span>
        </div>
      </div>
    </Link>
  );
}

export default GenericCard;
