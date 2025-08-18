import React from "react";
import parse from "html-react-parser";

interface TeamCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

const TeamCard: React.FC<TeamCardProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
}) => {
  return (
    <div className="embla__slide flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_30%] mr-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {parse(description)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
