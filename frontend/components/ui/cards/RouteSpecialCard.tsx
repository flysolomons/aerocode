import Image from "next/image";

// props: card title, image

interface RouteSpecialCardProps {
  route: string;
  price: string;
  image: string;
  specialName?: string;
  currency?: string;
}

function RouteSpecialCard({
  route,
  price,
  image,
  specialName,
  currency,
}: RouteSpecialCardProps) {
  return (
    <>
      {" "}
      <div className="relative  border-white border-4  rounded-2xl sm:rounded-3xl lg:rounded-3xl overflow-hidden w-full shadow-xl h-36 sm:h-56 lg:h-64">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
        <Image
          src={image}
          alt={route}
          fill
          placeholder="blur"
          className="object-cover"
        />

        {specialName && (
          <div className="absolute top-2 sm:top-4 lg:top-4 right-2 sm:right-4 lg:right-4 bg-yellow-400 px-2 sm:px-3 lg:px-2 py-1 sm:py-2 lg:py-2 rounded-full text-xs sm:text-sm lg:text-xs text-yellow-900 font-semibold z-20">
            {specialName}
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center text-white z-20 px-4">
          <h3 className="text-lg sm:text-xl lg:text-xl font-bold text-center break-words">
            {route}
          </h3>
        </div>
        <div className="absolute bottom-2 sm:bottom-4 lg:bottom-4 left-2 sm:left-4 lg:left-4 text-white z-20 flex flex-col items-start">
          <p className="text-xs pl-4 sm:text-sm lg:text-sm text-left">From</p>
          <p className="text-xl pl-4 sm:text-2xl lg:text-2xl text-left">
            {currency ? (
              <>
                <span className="font-bold">{currency}</span>
                <span className="font-medium"> {price}</span>
              </>
            ) : (
              <span className="font-medium">{price}</span>
            )}
          </p>
        </div>
      </div>
    </>
  );
}

export default RouteSpecialCard;
