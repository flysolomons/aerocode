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
  return (
    <>
      {specials && specials.length > 0 && (
        <div className="space-y-6 sm:space-y-8 lg:space-y-8">
          <div className="space-y-2 sm:space-y-3 lg:space-y-2 px-4 sm:px-6 lg:px-0">
            <>
              <h2 className="text-2xl sm:text-3xl lg:text-3xl text-center font-bold text-blue-500">
                {heading}
              </h2>
              <p className="block text-center text-sm sm:text-base lg:text-base text-gray-700 leading-relaxed max-w-4xl mx-auto">
                {description}
              </p>
            </>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-4">
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
