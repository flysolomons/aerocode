import Image from "next/image";

// props: card title, image

interface OtherNewsCardProps {
  headline: string;
  image: string;
  date: string;
}

function OtherNewsCard({ headline, image, date }: OtherNewsCardProps) {
  return (
    <>
      <div className="flex items-start space-x-3 p-2 bg-gray-100 rounded-lg">
        <div className="flex items-start relative h-20">
          <div className="size-20 absolute overflow-hidden rounded-lg">
            <Image
              src={image}
              alt="Holiday Travel"
              layout="fill"
              objectFit="fill"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="pl-24 h-20">
            <a href="#" className="text-blue-500 hover:underline font-medium">
              {headline}
            </a>
            <div className="text-sm text-gray-500 mt-1">{date}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OtherNewsCard;
