import Image from "next/image";
import parse from "html-react-parser";

interface ReasonToVisitCardProps {
  title: string;
  image: string;
  description: string;
  imageOnLeft: boolean;
}

function ReasonToVisitCard({
  title,
  image,
  description,
  imageOnLeft,
}: ReasonToVisitCardProps) {
  return (
    <>
       <div 
        className={`flex flex-col lg:flex-row w-full rounded-3xl lg:rounded-2xl  overflow-hidden  bg-slate-50 h-auto py-10  ${
          imageOnLeft ? "lg:flex-row" : "lg:flex-row-reverse"
        }`}
      >
       <div className="w-full lg:w-1/4 items-center p-4 lg:p-0">

       
        <Image
            src={image}
            alt={title}
            width={400}
            height={360}
            className="lg:absolute w-full  lg:w-52 h-full lg:h-52 rounded-2xl border-4 border-white object-cover shadow-md"
          />
        
        
        <Image
            src={image}
            alt={title}
            width={400}
            height={360}
            className="absolute invisible lg:visible rotate-12 w-52 h-full lg:h-52 rounded-2xl border-4 border-white object-cover shadow-md"
          />
        

       </div>
        
        <div className="w-full lg:w-2/3 p-4 sm:p-6 lg:p-8  rounded-2xl">
          <h2 className="text-xl sm:text-2xl lg:text-2xl mb-3 sm:mb-4 lg:mb-6 text-blue-600 font-semibold leading-tight break-words ">
            {title}
          </h2>
          <div className="text-sm sm:text-base lg:text-lg leading-relaxed text-gray-600 break-words whitespace-pre-wrap ">
            {parse(description)}
          </div>
        </div>
      </div>

    </>
  );
}

export default ReasonToVisitCard;
