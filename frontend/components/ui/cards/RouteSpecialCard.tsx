import Image from "next/image";

// props: card title, image

interface RouteSpecialCardProps {
  route: string;
  price: string;
  image: string;
  specialName?: string;
}

function RouteSpecialCard({
  route,
  price,
  image,
  specialName,
}: RouteSpecialCardProps) {
  return (
    <>
      <div className="relative rounded-3xl overflow-hidden w-full h-full shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
        <Image
          src={image}
          alt={route}
          width={500}
          height={500}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-yellow-400 px-2 py-2 rounded-full text-xs text-blue-500 font-semibold z-20">
          {specialName}
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-white z-20">
          <h3 className="text-xl font-bold text-center">{route}</h3>
        </div>
        <div className="absolute bottom-4 left-4 text-white z-20">
          <p className="text-sm">From</p>
          <p className="text-2xl font-bold">{price}</p>
        </div>
      </div>
    </>
  );
}

export default RouteSpecialCard;
