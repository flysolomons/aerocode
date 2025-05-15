import RouteSpecial from "../common/RouteSpecialCard";
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
        <div className="space-y-8">
          <div className="space-y-2">
            <>
              <h2 className="text-3xl text-center font-bold text-blue-500">
                {heading}
              </h2>
              <span className="block text-center">{description}</span>
            </>
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-64">
            {" "}
            {specials &&
              specials.length > 0 &&
              specials.map((special, index) => (
                <RouteSpecial
                  key={index}
                  route={special.route?.nameFull || "Special Route"}
                  price={special.startingPrice || "Contact for price"}
                  image={special.special?.heroImage?.url || "/image.jpg"}
                  specialName={special.special?.name || "Special"}
                />
              ))}
          </div>
        </div>
      )}
    </>
  );
}
