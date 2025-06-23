import RouteSpecial from "@/components/ui/cards/RouteSpecialCard";
import { SpecialRoute } from "@/graphql/RoutePageQuery";
import { DestinationSpecialRoute } from "@/graphql/DestinationPageQuery";

interface RouteSpecialSectionProps {
  heading: string;
  description: string;
  specials?: (SpecialRoute | DestinationSpecialRoute)[];
}
export default function RouteSpecialSection({
  heading,
  description,
  specials = [],
}: RouteSpecialSectionProps) {
  console.log(specials);
  return (
    <>
      {specials && specials.length > 0 && (
        <div className="space-y-6 md:space-y-8 lg:space-y-10">
          <div className="space-y-3 md:space-y-4 px-4 md:px-6 lg:px-0">
            <>
              <h2 className="text-2xl md:text-3xl lg:text-3xl text-center font-bold text-blue-500">
                {heading}
              </h2>
              <p className="block text-center text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed max-w-2xl md:max-w-4xl mx-auto px-2 md:px-0">
                {description}
              </p>
            </>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 px-4 md:px-0">
            {specials &&
              specials.length > 0 &&
              specials.map((special, index) => (
                <RouteSpecial
                  key={index}
                  route={special.route?.nameFull || "Special Route"}
                  price={special.startingPrice || "Contact for price"}
                  image={special.route?.heroImage?.url || "/image.jpg"}
                  specialName={special.special?.name || "Special"}
                />
              ))}
          </div>
        </div>
      )}
    </>
  );
}
