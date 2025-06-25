"use client";
import { useState } from "react";
import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import SpecialCard from "@/components/ui/cards/SpecialCard";
import { SpecialsIndexPage } from "@/graphql/SpecialsIndexPageQuery";
import { stripHtmlTags } from "@/lib/utils";

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

  return (
    <>
      <SecondaryHero
        title={heroTitle}
        image={heroImage}
        breadcrumbs={breadcrumbs}
        onColorCalculated={setGradientStartColor}
      />
      <Container>
        <div className="py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-12 lg:space-y-16 px-4 sm:px-6">
          <div className="space-y-6 sm:space-y-8">
            {/* <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-500">
                Latest Specials
              </h2>
              <p className="text-sm sm:text-base lg:text-base text-gray-700 leading-relaxed">
                {stripHtmlTags("We offer convenient flights between Australia, Fiji, Vanuatu, and Honiara, the vibrant capital of the Solomon Islands.")}
              </p>
            </div> */}
            {pageDescription && (
              <div className="mx-auto w-full">
                <p className="text-sm sm:text-base lg:text-base text-center text-gray-700 leading-relaxed">
                  {pageDescription}
                </p>
              </div>
            )}
            {specials && specials.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {specials.map((special, index) => (
                  <SpecialCard
                    key={index}
                    specialName={special.name}
                    image={special.heroImage?.url || "/image.jpg"}
                    url={special.url}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12 lg:py-16">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-600">
                  No special offers available at this time.
                </h3>
                <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-500 max-w-md mx-auto">
                  Please check back later for new deals and promotions.
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
