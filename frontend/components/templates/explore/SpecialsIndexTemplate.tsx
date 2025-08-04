"use client";
import { useState } from "react";
import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import SpecialCard from "@/components/ui/cards/SpecialCard";
import { SpecialsIndexPage } from "@/graphql/SpecialsIndexPageQuery";
import parse from "html-react-parser";
import StrippedBookingWidget from "@/components/layout/booking-widget/StrippedBookingWidget";
import ThumbnailCarousel from "@/components/layout/carousel/ThumbnailCarouselRouteSpecialCard";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import ReadyToFly from "@/components/layout/sections/ReadyToFly";

interface SpecialsIndexTemplateProps {
  initialPage: SpecialsIndexPage;
  loading?: boolean;
}

export default function SpecialsIndexTemplate({
  initialPage,
  loading = false,
}: SpecialsIndexTemplateProps) {
  const [gradientStartColor, setGradientStartColor] = useState("transparent");

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  const { specials, pageMetadata } = initialPage;

  // Use the page metadata for the hero section if available
  const heroTitle = pageMetadata?.heroTitle || "Specials";
  const heroImage = pageMetadata?.heroImage?.url || "/hero.jpg";
  const breadcrumbs = pageMetadata?.url || "Home > Explore > Specials";
  const pageDescription = pageMetadata?.description || "";

  console.log("Initial Page Data:", initialPage);

  return (
    <>
      <SecondaryHero
        title={heroTitle}
        image={heroImage}
        breadcrumbs={breadcrumbs}
        onColorCalculated={setGradientStartColor}
      />
      <Container>
        <div className="py-8 sm:py-12 lg:py-16 space-y-10 sm:space-y-12 lg:space-y-16 px-4 sm:px-6">
          <div className="space-y-8">
            <StrippedBookingWidget id="booking-widget" />
            {pageDescription && (
              <div className="mx-auto w-full">
                <div className="text-sm sm:text-base lg:text-base text-gray-600 leading-relaxed">
                  {parse(pageDescription)}
                </div>
              </div>
            )}
          </div>
          <div className="space-y-8">
            {specials && specials.length > 0 ? (
              <div className="space-y-8">
                {Array.from({
                  length: Math.ceil((specials?.length ?? 0) / 3),
                }).map((_, rowIdx) => (
                  <div
                    key={rowIdx}
                    className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center"
                  >
                    {(specials ?? [])
                      .slice(rowIdx * 3, rowIdx * 3 + 3)
                      .map((special, idx) => (
                        <div key={idx} className="flex-1">
                          <SpecialCard
                            specialName={special.name}
                            image={special.heroImage?.url}
                            url={special.url}
                            description={special.subTitle}
                            expires={special.endDate}
                          />
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12 lg:py-16">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-600">
                  No special offers available at this time.
                </h3>
                <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 max-w-md mx-auto">
                  Please check back later for new deals and promotions.
                </p>
              </div>
            )}
          </div>

          {/* Find great deals section, now spaced by parent space-y-6/sm:space-y-8 */}
          <div className="w-full mx-auto text-center space-y-8">
            <h2 className="text-xl sm:text-xl lg:text-2xl font-semibold text-blue-500">
              Browse Special Fares
            </h2>
            <ThumbnailCarousel
              slides={specials
                .flatMap((special) =>
                  (special.specialRoutes || []).map((route) => ({
                    specialName: route.special?.name || special.name,
                    image: route.route?.heroImage?.url || "",
                    price: route.startingPrice || "",
                    url: special.url,
                    route: route.route?.nameFull || "",
                    currency: route.currency,
                  }))
                )
                .filter((slide) => slide.route && slide.image && slide.url)}
            />
          </div>

        {/* Ready to fly section */}
        <ReadyToFly
          buttonText="Book Now"
          description="Dont miss out on the specials, fares dropped so much that you pants cannot catch up"
        />

          
        </div>
      </Container>

      
    </>
  );
}
