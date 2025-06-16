import Image from "next/image";

// props: card title, image

interface DestinationCardProps {
  title: string;
  image: string;
}

function DestinationCard({ title, image }: DestinationCardProps) {
  return (
    <>
      <div className="relative rounded-3xl overflow-hidden w-full h-full shadow-md">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
        <Image
          src={image}
          alt={title}
          width={500}
          height={500}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-6 left-6 text-white z-20">
          <span className="text-xl font-semibold">{title}</span>
        </div>
      </div>
    </>
  );
}

export default DestinationCard;
