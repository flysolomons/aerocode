import Image from "next/image";

interface NewsCardProps {
  headline: string;
  image: string;
  date: string;
  description: string;
}

function NewsCard({ headline, image, date, description }: NewsCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <>
      <div className="p-2 sm:p-3 lg:p-2 rounded-xl sm:rounded-2xl lg:rounded-2xl shadow-md bg-white h-[24rem] sm:h-[28rem] lg:h-[30rem] w-full">
        <div className="relative mb-2 space-y-2">
          <div className="relative h-[12rem] sm:h-[14rem] lg:h-[15rem] rounded-xl sm:rounded-2xl lg:rounded-2xl overflow-hidden">
            <Image src={image} alt={headline} fill className="object-cover" />
          </div>

          <div className="text-xs sm:text-sm lg:text-sm text-gray-500">{formattedDate}</div>
        </div>
        <h2 className="text-base sm:text-lg lg:text-lg font-bold text-blue-500 uppercase mb-2 hover:underline break-words leading-tight">
          {headline}
        </h2>
        <p className="text-gray-700 text-xs sm:text-sm lg:text-sm leading-relaxed break-words overflow-hidden">{description}</p>
      </div>
    </>
  );
}

export default NewsCard;
