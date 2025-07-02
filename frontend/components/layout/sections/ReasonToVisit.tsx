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
        className={`flex flex-col lg:flex-row w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-lg min-h-[20rem] sm:min-h-[22rem] lg:h-[24.5rem] ${
          imageOnLeft ? "lg:flex-row" : "lg:flex-row-reverse"
        }`}
      >
        <div className="w-full lg:w-1/3">
          <Image
            src={image}
            alt={title}
            width={400}
            height={360}
            className="w-full h-48 sm:h-56 lg:h-full object-cover"
          />
        </div>
        <div className="w-full lg:w-2/3 p-4 sm:p-6 lg:p-8">
          <h2 className="text-xl sm:text-2xl lg:text-2xl mb-3 sm:mb-4 lg:mb-6 text-gray-800 font-semibold leading-tight break-words">
            {title}
          </h2>
          <div className="text-sm sm:text-base lg:text-lg leading-relaxed text-gray-700 break-words whitespace-pre-wrap">
            {parse(description)}
          </div>
        </div>
      </div>
    </>
  );
}

export default ReasonToVisitCard;
