import Image from "next/image";

interface NewsCardProps {
  headline: string;
  image: string;
  date: string;
  description: string;
}

function NewsCard({ headline, image, date, description }: NewsCardProps) {
  return (
    <>
      <div className="p-2 rounded-2xl shadow-md bg-white h-[30rem]">
        <div className="relative mb-2 space-y-2">
          <div className="relative h-[15rem] rounded-2xl overflow-hidden">
            <Image src={image} alt={headline} fill className="object-cover" />
          </div>

          <div className="text-sm text-gray-500">{date}</div>
        </div>

        <h2 className="text-lg font-bold text-blue-500 uppercase mb-2">
          {headline}
        </h2>
        <p className="text-gray-700 text-sm">{description}</p>
      </div>
    </>
  );
}

export default NewsCard;
