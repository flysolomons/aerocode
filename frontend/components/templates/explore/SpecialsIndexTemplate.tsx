"use client";
import { useState } from "react";
import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import SpecialCard from "@/components/ui/cards/SpecialCard";
import { SpecialsIndexPage } from "@/graphql/SpecialsIndexPageQuery";

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

  return (
    <>
      <SecondaryHero
        title={heroTitle}
        image={heroImage}
        breadcrumbs={breadcrumbs}
        onColorCalculated={setGradientStartColor}
      />
      <Container>
        <div className="my-12 space-y-16">
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl text-center font-bold text-blue-500">
                Latest Specials
              </h2>
              <span className="block text-center">
                We offer convenient flights between Australia, Fiji, Vanuatu,
                and Honiara, the vibrant capital of the Solomon Islands.
              </span>
            </div>{" "}
            {specials && specials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-64">
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
              <div className="text-center py-8">
                <h3 className="text-xl font-medium text-gray-600">
                  No special offers available at this time.
                </h3>
                <p className="mt-2 text-gray-500">
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
