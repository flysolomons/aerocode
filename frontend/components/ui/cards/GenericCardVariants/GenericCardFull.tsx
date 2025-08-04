import Image from "next/image";
import Link from "next/link";

interface GenericCardFullProps {
  title: string;
  image: string;
  url: string; // Changed from optional to required
  subTitle?: any;//option from backend
}

function GenericCardFull({ title,subTitle, image, url }: GenericCardFullProps) {
  return (
    <Link href={url} className="block hover:opacity-90 transition-opacity">
      <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden w-full h-48  md:h-64 lg:h-72 xl:h-80 shadow-lg lg:shadow-xl bg-white border-4 border-white">
        <div className="absolute inset-0 "></div>
       
        <Image
          src={image}
          alt={title}
          width={500}
          height={500}
          className="w-full h-full object-cover rounded-3xl "
        />
       
        <div className="absolute  text-white z-20 bottom-0 w-full  rounded-b-2xl p-4 bg-gradient-to-t from-black to-transparent">
            <div className="flex flex-col rounded-3xl">
                <span className="text-xl md:text-2xl lg:text-2xl font-semibold  ">
                    {title}
                </span>
                <span className="text-blue-50">
                  {subTitle || ''}
                </span>

            </div>
          
           
        </div>
      </div>
    </Link>
  );
}

export default GenericCardFull;
