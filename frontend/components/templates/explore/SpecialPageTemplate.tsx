"use client";
import { useState, useEffect } from "react";
import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import RouteSpecialCard from "@/components/ui/cards/RouteSpecialCard";
import RouteSpecialSection from "@/components/layout/sections/RouteSpecialSection";
import Slider from "@/components/layout/Slider";
import { SpecialPage } from "@/graphql/SpecialPageQuery";
import { stripHtmlTags } from "@/lib/utils";

// Helper function to format dates in a readable format
function formatDate(dateString: string): string {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

interface SpecialPageTemplateProps {
  initialPage: SpecialPage | null;
  loading?: boolean;
}

export default function SpecialPageTemplate({
  initialPage,
  loading = false,
}: SpecialPageTemplateProps) {
  const [gradientStartColor, setGradientStartColor] = useState("transparent");
  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-6 sm:h-8 w-48 sm:w-64 bg-gray-200 rounded mb-3 sm:mb-4"></div>
          <div className="h-3 sm:h-4 w-32 sm:w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Handle null page data
  if (!initialPage) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-red-500 mb-2">
            Special not found
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            The special offer you're looking for is not available.
          </p>
        </div>
      </div>
    );
  }
  const {
    heroTitle,
    heroImage,
    name,
    url,
    startDate,
    endDate,
    termsAndConditions,
    specialRoutes = [],
  } = initialPage;

  // Format the validity period if both dates are available
  const validityPeriod =
    startDate && endDate
      ? `Valid from ${formatDate(startDate)} to ${formatDate(endDate)}`
      : "";

  return (
    <>
      <SecondaryHero
        title={heroTitle || name || "Special Offer"}
        image={heroImage?.url || "/hero.jpg"}
        breadcrumbs={url}
        onColorCalculated={setGradientStartColor}
      />{" "}
      <Container>
        <div className="py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-12 lg:space-y-16 px-4 sm:px-6 lg:px-8">
          {/* Description with validity period */}
          {/* <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
            <p className="text-sm sm:text-base lg:text-lg text-center text-gray-700 leading-relaxed">
              We offer convenient flights between Australia, Fiji, Vanuatu, and
              Honiara, the vibrant capital of the Solomon Islands. Discover the
              beauty and diversity of the Solomons with our extensive network of
              destinations.
            </p>
            {validityPeriod && (
              <p className="text-center font-medium text-blue-500 text-sm sm:text-base lg:text-lg">
                {validityPeriod}
              </p>
            )}
          </div> */}

          {initialPage.description && (
            <div className="max-w-4xl mx-auto">
              <p className="text-sm sm:text-base lg:text-lg text-center text-gray-700 leading-relaxed">
                {initialPage.description}
              </p>
            </div>
          )}

          {/* Route specials section */}
          {specialRoutes && specialRoutes.length > 0 && (
            <RouteSpecialSection
              heading={`${name || "Special"} Routes`}
              description="Take advantage of our special fares on these popular routes."
              specials={specialRoutes}
            />
          )}

          {/* Terms and conditions section
          {termsAndConditions && (
            <div className="space-y-6 sm:space-y-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center font-bold text-blue-500">
                Terms & Conditions
              </h2>
              <div
                className="prose prose-sm sm:prose lg:prose-lg max-w-none mx-auto px-4"
                dangerouslySetInnerHTML={{ __html: termsAndConditions }}
              />
            </div>
          )} */}
        </div>
      </Container>{" "}
      {/* Other specials section
      <div className="py-8 sm:py-12 lg:py-16 bg-gray-50">
        <Container>
          <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center font-bold text-blue-500">
              Other Specials
            </h2>
            <p className="text-center text-sm sm:text-base lg:text-lg text-gray-700 max-w-2xl mx-auto">
              Check out our other special offers available on various routes.
            </p>
            <div className="mt-6 sm:mt-8">
              <Slider />
            </div>
          </div>
        </Container>
      </div> */}
    </>
  );
}
