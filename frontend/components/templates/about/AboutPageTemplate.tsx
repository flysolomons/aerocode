"use client";

import React, { useState, useEffect } from "react";
import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import PrimaryHero from "@/components/layout/hero/PrimaryHero";
import Container from "@/components/layout/Container";
import Image from "next/image";
import Link from "next/link";
import { AboutIndexPage } from "@/graphql/AboutPageQuery";

interface AboutPageTemplateProps {
  initialPage: AboutIndexPage;
}

export default function AboutPageTemplate({
  initialPage,
}: AboutPageTemplateProps) {
  // State for animated stats counter
  const [stats, setStats] = useState({
    destinations: 0,
    aircraft: 0,
    experience: 0,
    passengers: 0,
  });

  // State for animation triggers
  const [inView, setInView] = useState({
    missionSection: false,
    statsSection: false,
    teamSection: false,
    timelineSection: false,
  });

  // Handle intersection observer for animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView((prev) => ({
            ...prev,
            [entry.target.id]: true,
          }));

          // Start counting animation for stats when in view
          if (entry.target.id === "statsSection" && !inView.statsSection) {
            animateStats();
          }
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Observe all sections
    const sections = [
      "missionSection",
      "statsSection",
      "teamSection",
      "timelineSection",
    ];
    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section);
        if (element) observer.unobserve(element);
      });
    };
  }, [inView.statsSection]); // Animate the stats counters
  const animateStats = () => {
    const finalStats = {
      destinations:
        initialPage.stats.find((stat) =>
          stat.title.toLowerCase().includes("destination")
        )?.value || "35+",
      aircraft:
        initialPage.stats.find((stat) =>
          stat.title.toLowerCase().includes("aircraft")
        )?.value || "15",
      experience:
        initialPage.stats.find(
          (stat) =>
            stat.title.toLowerCase().includes("year") ||
            stat.title.toLowerCase().includes("experience")
        )?.value || "40+",
      passengers:
        initialPage.stats.find((stat) =>
          stat.title.toLowerCase().includes("passenger")
        )?.value || "2M+",
    };

    // Parse numbers from stats for animation
    const parseStatValue = (value: string) => {
      const num = parseFloat(value.replace(/[^0-9.]/g, ""));
      return isNaN(num) ? 0 : num;
    };

    const finalNumbers = {
      destinations: parseStatValue(finalStats.destinations),
      aircraft: parseStatValue(finalStats.aircraft),
      experience: parseStatValue(finalStats.experience),
      passengers: parseStatValue(finalStats.passengers),
    };

    const duration = 1500; // 1.5 seconds
    const frameRate = 30;
    const totalFrames = duration / (1000 / frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = Math.min(frame / totalFrames, 1);

      if (frame >= totalFrames) {
        clearInterval(timer);
        setStats({
          destinations: finalNumbers.destinations,
          aircraft: finalNumbers.aircraft,
          experience: finalNumbers.experience,
          passengers: finalNumbers.passengers,
        });
        return;
      }

      setStats({
        destinations: Math.floor(progress * finalNumbers.destinations),
        aircraft: Math.floor(progress * finalNumbers.aircraft),
        experience: Math.floor(progress * finalNumbers.experience),
        passengers: parseFloat((progress * finalNumbers.passengers).toFixed(1)),
      });
    }, 1000 / frameRate);
  };

  return (
    <div className="min-h-screen">
      {/* <SecondaryHero
        title={initialPage.heroTitle || "Our Journey Above the Clouds"}
        image={initialPage.heroImage?.url || "/hero.jpg"}
        breadcrumbs="/about"
      /> */}
      <PrimaryHero
        title={initialPage.heroTitle || "Our Journey Above the Clouds"}
        image={initialPage.heroImage?.url || "/hero.jpg"}
        breadcrumbs="/about"
        showBookingWidget={false}
      />
      {/* Mission & Vision Section */}
      <Container>
        <div
          id="missionSection"
          className={`py-12 sm:py-16 lg:py-20 space-y-12 sm:space-y-16 lg:space-y-16 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
            inView.missionSection
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-12 sm:mb-16 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-4xl font-bold mb-3 sm:mb-4 lg:mb-4">
              Our Mission & Vision
            </h2>
            <p className="text-lg sm:text-xl lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Guiding principles that drive everything we do as we connect the
              Pacific.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-16">
            {/* Mission */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-8">
              <h3 className="text-2xl sm:text-3xl lg:text-3xl font-bold mb-4 text-blue-700">
                Our Mission
              </h3>
              <p className="text-gray-600 text-base sm:text-lg lg:text-lg leading-relaxed">
                {initialPage.missionStatement ||
                  "Connecting the Solomon Islands through safe, reliable, and exceptional air transport services."}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-8">
              <h3 className="text-2xl sm:text-3xl lg:text-3xl font-bold mb-4 text-blue-700">
                Our Vision
              </h3>
              <p className="text-gray-600 text-base sm:text-lg lg:text-lg leading-relaxed">
                {initialPage.visionStatement ||
                  "To be the Pacific region's premier airline, setting the standard for safety, service, and sustainability."}
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl lg:text-3xl font-bold mb-4">
              What We Value
            </h3>
            <p className="text-lg sm:text-xl lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              The core principles that guide our commitment to excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-8">
            {initialPage.values && initialPage.values.length > 0 ? (
              initialPage.values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="h-36 sm:h-44 lg:h-48 relative overflow-hidden">
                    <Image
                      src={value.image?.url || "/images/default-value.jpg"}
                      alt={value.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-4 sm:p-6 lg:p-6">
                    <h4 className="text-xl sm:text-2xl lg:text-2xl font-bold mb-2">
                      {value.title}
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base lg:text-base leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              // Fallback values if none provided
              <>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                  <div className="h-36 sm:h-44 lg:h-48 bg-blue-500 relative overflow-hidden">
                    <Image
                      src="/images/safety-icon.jpg"
                      alt="Safety First"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-4 sm:p-6 lg:p-6">
                    <h4 className="text-xl sm:text-2xl lg:text-2xl font-bold mb-2">
                      Safety First
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base lg:text-base leading-relaxed">
                      The safety of our passengers and crew is our highest
                      priority, without compromise.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                  <div className="h-36 sm:h-44 lg:h-48 bg-green-500 relative overflow-hidden">
                    <Image
                      src="/images/sustainability-icon.jpg"
                      alt="Environmental Responsibility"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-4 sm:p-6 lg:p-6">
                    <h4 className="text-xl sm:text-2xl lg:text-2xl font-bold mb-2">
                      Sustainability
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base lg:text-base leading-relaxed">
                      We're committed to reducing our environmental footprint
                      and protecting the beautiful destinations we serve.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
                  <div className="h-36 sm:h-44 lg:h-48 bg-purple-500 relative overflow-hidden">
                    <Image
                      src="/images/service-icon.jpg"
                      alt="Exceptional Service"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-4 sm:p-6 lg:p-6">
                    <h4 className="text-xl sm:text-2xl lg:text-2xl font-bold mb-2">
                      Exceptional Service
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base lg:text-base leading-relaxed">
                      Our unique blend of hospitality reflects the warmth and
                      spirit of the islands we connect.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Container>{" "}
      {/* Key Stats - SpaceX inspired with counters */}
      <div className="bg-gray-100 py-12 sm:py-16 lg:py-20">
        <Container>
          <div
            id="statsSection"
            className={`px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
              inView.statsSection
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {" "}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-8 text-center">
              {initialPage.stats && initialPage.stats.length > 0 ? (
                initialPage.stats.map((stat, index) => (
                  <div key={index} className="p-4 sm:p-6 lg:p-6">
                    <div className="text-4xl sm:text-5xl lg:text-5xl font-bold text-blue-700 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-lg sm:text-xl lg:text-xl text-gray-600">
                      {stat.title}
                    </div>
                  </div>
                ))
              ) : (
                // Fallback static stats if none provided from API
                <>
                  <div className="p-4 sm:p-6 lg:p-6">
                    <div className="text-4xl sm:text-5xl lg:text-5xl font-bold text-blue-700 mb-2">
                      {stats.destinations}+
                    </div>
                    <div className="text-lg sm:text-xl lg:text-xl text-gray-600">
                      Destinations
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 lg:p-6">
                    <div className="text-4xl sm:text-5xl lg:text-5xl font-bold text-blue-700 mb-2">
                      {stats.aircraft}
                    </div>
                    <div className="text-lg sm:text-xl lg:text-xl text-gray-600">
                      Modern Aircraft
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 lg:p-6">
                    <div className="text-4xl sm:text-5xl lg:text-5xl font-bold text-blue-700 mb-2">
                      {stats.experience}+
                    </div>
                    <div className="text-lg sm:text-xl lg:text-xl text-gray-600">
                      Years Experience
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 lg:p-6">
                    <div className="text-4xl sm:text-5xl lg:text-5xl font-bold text-blue-700 mb-2">
                      {stats.passengers}M+
                    </div>
                    <div className="text-lg sm:text-xl lg:text-xl text-gray-600">
                      Annual Passengers
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </Container>
      </div>
      {/* Timeline - History - SpaceX/Tesla inspired */}
      <div className="bg-gray-900 text-white py-12 sm:py-16 lg:py-20">
        <Container>
          <div
            id="timelineSection"
            className={`px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
              inView.timelineSection
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="text-center mb-12 sm:mb-16 lg:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-4xl font-bold mb-3 sm:mb-4 lg:mb-4">
                Our Journey
              </h2>
              <p className="text-lg sm:text-xl lg:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                From humble beginnings to becoming the Pacific's premier
                airline.
              </p>
            </div>{" "}
            <div className="space-y-12 sm:space-y-16 lg:space-y-16">
              {initialPage.journey && initialPage.journey.length > 0 ? (
                initialPage.journey.map((journeyItem, index) => (
                  <div
                    key={index}
                    className="flex flex-col lg:flex-row items-center"
                  >
                    <div className="lg:w-1/3 text-center lg:text-right mb-4 sm:mb-6 lg:mb-0 lg:pr-10">
                      <div className="text-2xl sm:text-3xl lg:text-3xl font-bold text-blue-400">
                        {journeyItem.year}
                      </div>
                    </div>
                    <div className="lg:w-2/3 lg:border-l-4 border-blue-500 pl-0 lg:pl-10 pt-2 pb-6 sm:pb-8 lg:pb-10 relative text-center lg:text-left">
                      <div className="hidden lg:block absolute left-0 top-0 w-5 h-5 rounded-full bg-blue-500 -ml-2.5 mt-2"></div>
                      <h3 className="text-xl sm:text-2xl lg:text-2xl font-bold mb-2">
                        {journeyItem.title}
                      </h3>
                      <p className="text-gray-300 text-sm sm:text-base lg:text-base leading-relaxed">
                        {journeyItem.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                // Fallback timeline if none provided from API
                <>
                  {/* Timeline Item 1 */}
                  <div className="flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/3 text-center lg:text-right mb-4 sm:mb-6 lg:mb-0 lg:pr-10">
                      <div className="text-2xl sm:text-3xl lg:text-3xl font-bold text-blue-400">
                        1985
                      </div>
                    </div>
                    <div className="lg:w-2/3 lg:border-l-4 border-blue-500 pl-0 lg:pl-10 pt-2 pb-6 sm:pb-8 lg:pb-10 relative text-center lg:text-left">
                      <div className="hidden lg:block absolute left-0 top-0 w-5 h-5 rounded-full bg-blue-500 -ml-2.5 mt-2"></div>
                      <h3 className="text-xl sm:text-2xl lg:text-2xl font-bold mb-2">
                        Foundation
                      </h3>
                      <p className="text-gray-300 text-sm sm:text-base lg:text-base leading-relaxed">
                        We began with just two aircraft, serving three
                        destinations. Our founder's vision was to connect the
                        isolated communities of the Solomon Islands.
                      </p>
                    </div>
                  </div>

                  {/* Timeline Item 2 */}
                  <div className="flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/3 text-center lg:text-right mb-4 sm:mb-6 lg:mb-0 lg:pr-10">
                      <div className="text-2xl sm:text-3xl lg:text-3xl font-bold text-blue-400">
                        1998
                      </div>
                    </div>
                    <div className="lg:w-2/3 lg:border-l-4 border-blue-500 pl-0 lg:pl-10 pt-2 pb-6 sm:pb-8 lg:pb-10 relative text-center lg:text-left">
                      <div className="hidden lg:block absolute left-0 top-0 w-5 h-5 rounded-full bg-blue-500 -ml-2.5 mt-2"></div>
                      <h3 className="text-xl sm:text-2xl lg:text-2xl font-bold mb-2">
                        Regional Expansion
                      </h3>
                      <p className="text-gray-300 text-sm sm:text-base lg:text-base leading-relaxed">
                        We expanded services to neighboring countries, becoming
                        the first choice for travel throughout the Pacific
                        islands.
                      </p>
                    </div>
                  </div>

                  {/* Timeline Item 3 */}
                  <div className="flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/3 text-center lg:text-right mb-4 sm:mb-6 lg:mb-0 lg:pr-10">
                      <div className="text-2xl sm:text-3xl lg:text-3xl font-bold text-blue-400">
                        2010
                      </div>
                    </div>
                    <div className="lg:w-2/3 lg:border-l-4 border-blue-500 pl-0 lg:pl-10 pt-2 pb-6 sm:pb-8 lg:pb-10 relative text-center lg:text-left">
                      <div className="hidden lg:block absolute left-0 top-0 w-5 h-5 rounded-full bg-blue-500 -ml-2.5 mt-2"></div>
                      <h3 className="text-xl sm:text-2xl lg:text-2xl font-bold mb-2">
                        Fleet Modernization
                      </h3>
                      <p className="text-gray-300 text-sm sm:text-base lg:text-base leading-relaxed">
                        We began a comprehensive fleet renewal program,
                        introducing more fuel-efficient aircraft and reducing
                        our environmental impact.
                      </p>
                    </div>
                  </div>

                  {/* Timeline Item 4 */}
                  <div className="flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/3 text-center lg:text-right mb-4 sm:mb-6 lg:mb-0 lg:pr-10">
                      <div className="text-2xl sm:text-3xl lg:text-3xl font-bold text-blue-400">
                        2023
                      </div>
                    </div>
                    <div className="lg:w-2/3 lg:border-l-4 border-blue-500 pl-0 lg:pl-10 pt-2 relative text-center lg:text-left">
                      <div className="hidden lg:block absolute left-0 top-0 w-5 h-5 rounded-full bg-blue-500 -ml-2.5 mt-2"></div>
                      <h3 className="text-xl sm:text-2xl lg:text-2xl font-bold mb-2">
                        Today & Tomorrow
                      </h3>
                      <p className="text-gray-300 text-sm sm:text-base lg:text-base leading-relaxed">
                        Today, we operate the most extensive network in the
                        Pacific region, while continuing to innovate with
                        sustainable practices and enhanced passenger
                        experiences.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </Container>
      </div>{" "}
      {/* Call to Action - Tesla/SpaceX inspired with dramatic imagery */}
      <div
        className="relative h-[300px] sm:h-[400px] lg:h-[500px] bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            initialPage.callToActionImage?.url ||
            initialPage.heroImage?.url ||
            "/hero.jpg"
          })`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="text-center text-white px-4 sm:px-6 lg:px-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 lg:mb-6">
              Fly with Solomon Airlines
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl max-w-2xl mx-auto mb-6 sm:mb-8 lg:mb-8 leading-relaxed">
              Join us as we connect the Pacific and create unforgettable
              journeys.
            </p>
            <div className="space-x-2 sm:space-x-4 lg:space-x-4">
              <Link
                href="/explore/destinations"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 sm:py-3 lg:py-3 px-6 sm:px-8 lg:px-8 rounded-full transition-colors duration-300 text-sm sm:text-base lg:text-base"
              >
                Explore Destinations
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
