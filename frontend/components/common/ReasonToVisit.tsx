import Image from "next/image";

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
        className={`flex w-full rounded-3xl overflow-hidden bg-white shadow-lg p-4 h-[24.5rem] ${
          imageOnLeft ? "flex-row" : "flex-row-reverse"
        } ${imageOnLeft ? "space-x-8" : "space-x-8 space-x-reverse"}`}
      >
        <div className="w-1/3">
          <Image
            src={image}
            alt="reason"
            width={400}
            height={360}
            className="w-full h-full object-cover rounded-3xl"
          />
        </div>
        <div className="w-2/3 p-4">
          <h2 className="text-2xl mb-2 text-gray-800 font-semibold">{title}</h2>
          <p className="leading-relaxed">{description}</p>
        </div>
      </div>
    </>
  );
}

export default ReasonToVisitCard;
