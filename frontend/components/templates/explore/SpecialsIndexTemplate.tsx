"use client";
import { useState } from "react";
import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import SpecialCard from "@/components/ui/cards/SpecialCard";
import { SpecialsIndexPage } from "@/graphql/SpecialsIndexPageQuery";
import { stripHtmlTags } from "@/lib/utils";
import StrippedBookingWidget from "@/components/layout/booking-widget/StrippedBookingWidget";
import ThumbnailCarousel from "@/components/layout/carousel/ThumbnailCarousel";

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
        <div className="py-8 sm:py-12 lg:py-16 space-y-10 sm:space-y-12 lg:space-y-16 px-4 sm:px-6">
          <StrippedBookingWidget />
          <div className="space-y-8">
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

          {/* Find great deals section, now spaced by parent space-y-6/sm:space-y-8 */}
          <div className="w-full mx-auto text-center space-y-8">
            <h2 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-blue-500">
              Browse Special Fares
            </h2>
            <ThumbnailCarousel
              slides={[
                {
                  specialName: "Island Explorer",
                  image:
                    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop",
                  price: "$899",
                  url: "/specials/island-explorer",
                  route: "Honiara to Brisbane",
                },
                {
                  specialName: "Pacific Paradise",
                  image:
                    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
                  price: "$749",
                  url: "/specials/pacific-paradise",
                  route: "Honiara to Nadi",
                },
                {
                  specialName: "Vanuatu Adventure",
                  image:
                    "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=300&fit=crop",
                  price: "$649",
                  url: "/specials/vanuatu-adventure",
                  route: "Honiara to Port Vila",
                },
                {
                  specialName: "Sydney Saver",
                  image:
                    "https://images.unsplash.com/photo-1465156799763-2c087c332922?w=400&h=300&fit=crop",
                  price: "$999",
                  url: "/specials/sydney-saver",
                  route: "Honiara to Sydney",
                },
                {
                  specialName: "Melbourne Magic",
                  image:
                    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=300&fit=crop",
                  price: "$1050",
                  url: "/specials/melbourne-magic",
                  route: "Honiara to Melbourne",
                },
                {
                  specialName: "Guadalcanal Getaway",
                  image:
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
                  price: "$799",
                  url: "/specials/guadalcanal-getaway",
                  route: "Honiara to Guadalcanal",
                },
                {
                  specialName: "Fiji Flyer",
                  image:
                    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=300&fit=crop",
                  price: "$720",
                  url: "/specials/fiji-flyer",
                  route: "Honiara to Suva",
                },
                {
                  specialName: "Solomon Escape",
                  image:
                    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=300&fit=crop",
                  price: "$880",
                  url: "/specials/solomon-escape",
                  route: "Brisbane to Honiara",
                },
                {
                  specialName: "Coral Coast Special",
                  image:
                    "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=400&h=300&fit=crop",
                  price: "$970",
                  url: "/specials/coral-coast-special",
                  route: "Nadi to Honiara",
                },
              ]}
            />
          </div>
        </div>
      </Container>
    </>
  );
}
