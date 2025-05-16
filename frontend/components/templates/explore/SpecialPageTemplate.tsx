"use client";
import { useState, useEffect } from "react";
import SecondaryHero from "@/components/layout/SecondaryHero";
import Container from "@/components/common/Container";
import RouteSpecialCard from "@/components/common/RouteSpecialCard";
import RouteSpecialSection from "@/components/layout/RouteSpecialSection";
import Slider from "@/components/common/Slider";
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Handle null page data
  if (!initialPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">
            Special not found
          </h2>
          <p>The special offer you're looking for is not available.</p>
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
      />
      <Container>
        <div className="my-12 space-y-16">
          {/* Description with validity period */}
          {/* <div className="space-y-4">
            <span className="block text-center">
              We offer convenient flights between Australia, Fiji, Vanuatu, and
              Honiara, the vibrant capital of the Solomon Islands. Discover the
              beauty and diversity of the Solomons with our extensive network of
              destinations.
            </span>
            {validityPeriod && (
              <p className="text-center font-medium text-blue-500">
                {validityPeriod}
              </p>
            )}
          </div> */}

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
            <div className="space-y-8">
              <h2 className="text-3xl text-center font-bold text-blue-500">
                Terms & Conditions
              </h2>
              <div
                className="prose max-w-none mx-auto"
                dangerouslySetInnerHTML={{ __html: termsAndConditions }}
              />
            </div>
          )} */}
        </div>
      </Container>

      {/* Other specials section
      <div className="my-16 bg-gray-50 py-12">
        <Container>
          <div className="space-y-8">
            <h2 className="text-3xl text-center font-bold text-blue-500">
              Other Specials
            </h2>
            <p className="text-center">
              Check out our other special offers available on various routes.
            </p>
            <div className="mt-8">
              <Slider />
            </div>
          </div>
        </Container>
      </div> */}
    </>
  );
}
