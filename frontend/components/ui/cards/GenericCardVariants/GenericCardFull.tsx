import Image from "next/image";
import Link from "next/link";

interface GenericCardFullProps {
  title: string;
  image: string;
  url: string; // Changed from optional to required
  subTitle?: string;//option from backend
}

function GenericCardFull({ title,subTitle, image, url }: GenericCardFullProps) {
  return (
    <Link href={url} className="block hover:opacity-90 transition-opacity">
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden w-full h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 shadow-lg sm:shadow-xl bg-white">
        <div className="absolute inset-0  "></div>
        <Image
          src={image}
          alt={title}
          width={500}
          height={500}
          className="w-full h-full object-cover p-2 rounded-3xl"
        />
        <div className="absolute  text-white z-20  bottom-1 left-1 w-full ">
            <div className="flex flex-col p-4 rounded-3xl">
                <span className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-semibold  ">
                    {title}
                </span>
                <span>
                  {subTitle || ''}
                </span>

            </div>
          
           
        </div>
      </div>
    </Link>
  );
}

export default GenericCardFull;
