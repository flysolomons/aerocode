import RouteSpecial from "@/components/ui/cards/RouteSpecialCard";
import { SpecialRoute } from "@/graphql/RoutePageQuery";
import { DestinationSpecialRoute } from "@/graphql/DestinationPageQuery";

interface RouteSpecialSectionProps {
  heading: string;
  description: string;
  specials?: (
    | SpecialRoute
    | (DestinationSpecialRoute & { currency?: string })
  )[];
}
export default function RouteSpecialSection({
  heading,
  description,
  specials = [],
}: RouteSpecialSectionProps) {
  return (
    <>
      {specials && specials.length > 0 && (
        <div className="space-y-6 md:space-y-8 lg:space-y-10">
          <div className="space-y-3 md:space-y-4">
            <>
              <h2 className="text-2xl md:text-3xl lg:text-3xl text-center font-bold text-blue-500">
                {heading}
              </h2>
              <p className="block text-center text-sm md:text-base lg:text-base text-gray-700 leading-relaxed max-w-2xl md:max-w-4xl mx-auto">
                {description}
              </p>
            </>
          </div>
          <div className="space-y-6">
            {Array.from({ length: Math.ceil((specials?.length ?? 0) / 3) }).map(
              (_, rowIdx) => (
                <div
                  key={rowIdx}
                  className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8 justify-center"
                >
                  {(specials ?? [])
                    .slice(rowIdx * 3, rowIdx * 3 + 3)
                    .map((special, idx) => {
                      let currency = undefined;
                      if (special.currency) {
                        const { currencyCode } = special.currency;
                        currency = currencyCode;
                      }
                      // Format price with commas for thousands, preserve decimals
                      let formattedPrice =
                        special.startingPrice || "Contact for price";
                      if (
                        special.startingPrice &&
                        !isNaN(Number(special.startingPrice))
                      ) {
                        formattedPrice = Number(
                          special.startingPrice
                        ).toLocaleString();
                      }
                      return (
                        <div key={idx} className="flex-1">
                          <RouteSpecial
                            route={special.route?.nameFull || "Special Route"}
                            price={formattedPrice}
                            image={
                              special.route?.heroImage?.url || "/image.jpg"
                            }
                            specialName={special.special?.name || "Special"}
                            currency={currency}
                          />
                        </div>
                      );
                    })}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}
