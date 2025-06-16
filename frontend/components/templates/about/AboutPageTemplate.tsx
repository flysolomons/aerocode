"use client";

import React, { useState, useEffect } from "react";
import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import Image from "next/image";
import Link from "next/link";

export default function AboutPageTemplate() {
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
  }, [inView.statsSection]);
  // Animate the stats counters
  const animateStats = () => {
    const finalStats = {
      destinations: 35,
      aircraft: 15,
      experience: 40,
      passengers: 2,
    };

    const duration = 1500; // 1.5 seconds - slightly shorter
    const frameRate = 30; // Lower frame rate for smoother animation
    const totalFrames = duration / (1000 / frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = Math.min(frame / totalFrames, 1); // Cap at 1 to prevent exceeding final values

      if (frame >= totalFrames) {
        clearInterval(timer);
        setStats(finalStats); // Set exact final values
        return;
      }

      setStats({
        destinations: Math.min(
          Math.floor(progress * finalStats.destinations),
          finalStats.destinations
        ),
        aircraft: Math.min(
          Math.floor(progress * finalStats.aircraft),
          finalStats.aircraft
        ),
        experience: Math.min(
          Math.floor(progress * finalStats.experience),
          finalStats.experience
        ),
        passengers: Math.min(
          parseFloat((progress * finalStats.passengers).toFixed(1)),
          finalStats.passengers
        ),
      });
    }, 1000 / frameRate);
  };

  return (
    <div className="min-h-screen">
      <SecondaryHero
        title="Our Journey Above the Clouds"
        image="/hero.jpg"
        breadcrumbs="/about"
      />
      {/* Vision Statement - Modern, bold, Tesla-like */}
      {/* <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white py-24">
        <Container>
          <div className="text-center space-y-8">
            <h2 className="text-5xl font-bold tracking-tight">
              Connecting Islands, Connecting Lives
            </h2>
            <p className="text-xl max-w-3xl mx-auto font-light">
              We're not just flying planes. We're connecting families, enabling
              business, and uniting the beautiful islands of the Pacific.
            </p>
          </div>
        </Container>
      </div> */}      {/* Mission & Values Section - Airbnb style with cards */}
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
            <h2 className="text-3xl sm:text-4xl lg:text-4xl font-bold mb-3 sm:mb-4 lg:mb-4">Our Mission & Values</h2>
            <p className="text-lg sm:text-xl lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Every day, we strive to make the skies more accessible while
              respecting the beautiful environments we fly over.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-8">
            {/* Card 1 */}
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
                <h3 className="text-xl sm:text-2xl lg:text-2xl font-bold mb-2">Safety First</h3>
                <p className="text-gray-600 text-sm sm:text-base lg:text-base leading-relaxed">
                  The safety of our passengers and crew is our highest priority,
                  without compromise.
                </p>
              </div>
            </div>

            {/* Card 2 */}
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
                <h3 className="text-xl sm:text-2xl lg:text-2xl font-bold mb-2">Sustainability</h3>
                <p className="text-gray-600 text-sm sm:text-base lg:text-base leading-relaxed">
                  We're committed to reducing our environmental footprint and
                  protecting the beautiful destinations we serve.
                </p>
              </div>
            </div>

            {/* Card 3 */}
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
                <h3 className="text-xl sm:text-2xl lg:text-2xl font-bold mb-2">Exceptional Service</h3>
                <p className="text-gray-600 text-sm sm:text-base lg:text-base leading-relaxed">
                  Our unique blend of hospitality reflects the warmth and spirit
                  of the islands we connect.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>      {/* Key Stats - SpaceX inspired with counters */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-8 text-center">
              <div className="p-4 sm:p-6 lg:p-6">
                <div className="text-4xl sm:text-5xl lg:text-5xl font-bold text-blue-700 mb-2">
                  {stats.destinations}+
                </div>
                <div className="text-lg sm:text-xl lg:text-xl text-gray-600">Destinations</div>
              </div>

              <div className="p-4 sm:p-6 lg:p-6">
                <div className="text-4xl sm:text-5xl lg:text-5xl font-bold text-blue-700 mb-2">
                  {stats.aircraft}
                </div>
                <div className="text-lg sm:text-xl lg:text-xl text-gray-600">Modern Aircraft</div>
              </div>

              <div className="p-4 sm:p-6 lg:p-6">
                <div className="text-4xl sm:text-5xl lg:text-5xl font-bold text-blue-700 mb-2">
                  {stats.experience}+
                </div>
                <div className="text-lg sm:text-xl lg:text-xl text-gray-600">Years Experience</div>
              </div>

              <div className="p-4 sm:p-6 lg:p-6">
                <div className="text-4xl sm:text-5xl lg:text-5xl font-bold text-blue-700 mb-2">
                  {stats.passengers}M+
                </div>
                <div className="text-lg sm:text-xl lg:text-xl text-gray-600">Annual Passengers</div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      {/* <Container>
        <div
          id="teamSection"
          className={`py-20 space-y-16 transition-all duration-1000 ${
            inView.teamSection
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Leadership</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the team guiding our journey through the Pacific skies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
                <Image
                  src="/images/ceo-profile.jpg"
                  alt="CEO"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <h3 className="text-2xl font-bold">Sarah Johnson</h3>
              <p className="text-blue-700 font-medium">
                Chief Executive Officer
              </p>
              <p className="mt-3 text-gray-600">
                With over 20 years in aviation, Sarah leads our airline with
                vision and passion.
              </p>
            </div>

            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
                <Image
                  src="/images/coo-profile.jpg"
                  alt="COO"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <h3 className="text-2xl font-bold">Michael Tenaru</h3>
              <p className="text-blue-700 font-medium">
                Chief Operations Officer
              </p>
              <p className="mt-3 text-gray-600">
                A native islander with deep expertise in logistics and regional
                operations.
              </p>
            </div>

            <div className="text-center">
              <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
                <Image
                  src="/images/cto-profile.jpg"
                  alt="CTO"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <h3 className="text-2xl font-bold">Elena Matsumoto</h3>
              <p className="text-blue-700 font-medium">
                Chief Technology Officer
              </p>
              <p className="mt-3 text-gray-600">
                Driving our digital transformation and enhancing the customer
                experience.
              </p>
            </div>
          </div>
        </div>
      </Container> */}      {/* Timeline - History - SpaceX/Tesla inspired */}
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
              <h2 className="text-3xl sm:text-4xl lg:text-4xl font-bold mb-3 sm:mb-4 lg:mb-4">Our Journey</h2>
              <p className="text-lg sm:text-xl lg:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                From humble beginnings to becoming the Pacific's premier
                airline.
              </p>
            </div>

            <div className="space-y-12 sm:space-y-16 lg:space-y-16">
              {/* Timeline Item 1 */}
              <div className="flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/3 text-center lg:text-right mb-4 sm:mb-6 lg:mb-0 lg:pr-10">
                  <div className="text-2xl sm:text-3xl lg:text-3xl font-bold text-blue-400">1985</div>
                </div>
                <div className="lg:w-2/3 lg:border-l-4 border-blue-500 pl-0 lg:pl-10 pt-2 pb-6 sm:pb-8 lg:pb-10 relative text-center lg:text-left">
                  <div className="hidden lg:block absolute left-0 top-0 w-5 h-5 rounded-full bg-blue-500 -ml-2.5 mt-2"></div>
                  <h3 className="text-xl sm:text-2xl lg:text-2xl font-bold mb-2">Foundation</h3>
                  <p className="text-gray-300 text-sm sm:text-base lg:text-base leading-relaxed">
                    We began with just two aircraft, serving three destinations.
                    Our founder's vision was to connect the isolated communities
                    of the Solomon Islands.
                  </p>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/3 text-center lg:text-right mb-4 sm:mb-6 lg:mb-0 lg:pr-10">
                  <div className="text-2xl sm:text-3xl lg:text-3xl font-bold text-blue-400">1998</div>
                </div>
                <div className="lg:w-2/3 lg:border-l-4 border-blue-500 pl-0 lg:pl-10 pt-2 pb-6 sm:pb-8 lg:pb-10 relative text-center lg:text-left">
                  <div className="hidden lg:block absolute left-0 top-0 w-5 h-5 rounded-full bg-blue-500 -ml-2.5 mt-2"></div>
                  <h3 className="text-xl sm:text-2xl lg:text-2xl font-bold mb-2">
                    Regional Expansion
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base lg:text-base leading-relaxed">
                    We expanded services to neighboring countries, becoming the
                    first choice for travel throughout the Pacific islands.
                  </p>
                </div>
              </div>

              {/* Timeline Item 3 */}
              <div className="flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/3 text-center lg:text-right mb-4 sm:mb-6 lg:mb-0 lg:pr-10">
                  <div className="text-2xl sm:text-3xl lg:text-3xl font-bold text-blue-400">2010</div>
                </div>
                <div className="lg:w-2/3 lg:border-l-4 border-blue-500 pl-0 lg:pl-10 pt-2 pb-6 sm:pb-8 lg:pb-10 relative text-center lg:text-left">
                  <div className="hidden lg:block absolute left-0 top-0 w-5 h-5 rounded-full bg-blue-500 -ml-2.5 mt-2"></div>
                  <h3 className="text-xl sm:text-2xl lg:text-2xl font-bold mb-2">
                    Fleet Modernization
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base lg:text-base leading-relaxed">
                    We began a comprehensive fleet renewal program, introducing
                    more fuel-efficient aircraft and reducing our environmental
                    impact.
                  </p>
                </div>
              </div>

              {/* Timeline Item 4 */}
              <div className="flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/3 text-center lg:text-right mb-4 sm:mb-6 lg:mb-0 lg:pr-10">
                  <div className="text-2xl sm:text-3xl lg:text-3xl font-bold text-blue-400">2023</div>
                </div>
                <div className="lg:w-2/3 lg:border-l-4 border-blue-500 pl-0 lg:pl-10 pt-2 relative text-center lg:text-left">
                  <div className="hidden lg:block absolute left-0 top-0 w-5 h-5 rounded-full bg-blue-500 -ml-2.5 mt-2"></div>
                  <h3 className="text-xl sm:text-2xl lg:text-2xl font-bold mb-2">Today & Tomorrow</h3>
                  <p className="text-gray-300 text-sm sm:text-base lg:text-base leading-relaxed">
                    Today, we operate the most extensive network in the Pacific
                    region, while continuing to innovate with sustainable
                    practices and enhanced passenger experiences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>      {/* Call to Action - Tesla/SpaceX inspired with dramatic imagery */}
      <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] bg-cover bg-center bg-fixed">
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
      {/* Sustainable Aviation Section - Airbnb style */}
      {/* <Container>
        <div className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Committed to Sustainable Aviation
              </h2>
              <p className="text-gray-600 mb-6">
                We recognize our responsibility to protect the Pacific's
                pristine environments. That's why we're leading the way with our
                sustainability initiatives:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Carbon offset program for all flights</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Fuel-efficient flight planning and operations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Investment in sustainable aviation fuel research</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Zero-waste initiative on all our flights</span>
                </li>
              </ul>
              <Link
                href="/about/sustainability"
                className="inline-block mt-6 text-blue-700 hover:text-blue-900 font-medium"
              >
                Learn more about our commitment →
              </Link>
            </div>
            <div className="relative h-80 md:h-96 overflow-hidden rounded-xl">
              <Image
                src="/images/sustainability.jpg"
                alt="Sustainable Aviation"
                layout="fill"
                objectFit="cover"
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </Container> */}
      {/* Newsletter Signup */}
      {/* <div className="bg-blue-900 text-white py-16">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Stay Connected</h2>
            <p className="text-xl mb-8">
              Subscribe to our newsletter for the latest updates, special
              offers, and travel inspiration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 rounded-full text-gray-800 w-full sm:w-auto sm:min-w-[300px]"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full font-bold transition-colors duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </Container>
      </div> */}
    </div>
  );
}
