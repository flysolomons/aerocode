"use client";

import React from "react";
import PrimaryHero from "@/components/layout/hero/PrimaryHero";
import Container from "@/components/layout/Container";
import Image from "next/image";
import Link from "next/link";
import { AboutIndexPage } from "@/graphql/AboutPageQuery";
import parse from "html-react-parser";
import GenericCardFull from "@/components/ui/cards/GenericCardVariants/GenericCardFull";

interface AboutPageTemplateProps {
  initialPage: AboutIndexPage;
}

export default function AboutPageTemplate({
  initialPage,
}: AboutPageTemplateProps) {
  return (
    <div className="min-h-screen">
      <PrimaryHero
        title={initialPage.heroTitle || "Our Journey Above the Clouds"}
        subtitle={initialPage.subTitle || "We are awsome"}
        image={initialPage.heroImage?.url || "/hero.jpg"}
        breadcrumbs={initialPage.url}
        showBookingWidget={false}
      />
      {/* Introduction Section */}

      <div
        id="introductionSection"
        className="py-12 md:py-16 lg:py-24 space-y-6 md:space-y-6 lg:space-y-4 px-4 md:px-6 justify-center"
      >
        <Container>
          <div className="text-center p-6 md:p-2 lg:p-0 justify-items-center">
            <Image
              alt="Award Icon"
              src="/ic_award.png"
              width="64"
              height="64"
              className="mb-3"
            />
            <h2 className="font-semibold text-3xl text-center text-gray-700">
              60+ Years of Innovation and Excellence in Global Aviation
            </h2>
            <div className="text-gray-800 text-center py-4">
              {parse(initialPage.description) ||
                "Founded in 1962, Solomon Airlines has consistently contributed to the global aviation landscape. With 28 routes covering 6 countries, we have demonstrated resilience and innovation in a dynamic industry. Our fleet, comprising 6 modern aircraft, is equipped to meet evolving passenger expectations. Our team of dedicated professionals, currently numbering 250 strong, forms the backbone of our operational excellence."}
            </div>
            {/* Strategic Plan */}
            <div className="border-t-2 border-gray-200 py-4 justify-items-center space-y-4">
              <h2 className="text-lg font-bold text-gray-700">Strategic Plan 2024-2028</h2>
              <p>On 19 January 2024, we released details our new four-year Strategic Plan setting a clear path for the National Carrier based on seven strategic goals.</p>
              <div className="bg-blue-100 w-[200px] p-3 rounded-md text-white hover:bg-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#fafafa" className="inline" viewBox="0 0 256 256"><path d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h32A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z"></path></svg>
                <span className="font-semibold px-1">Strategic Plan</span>
                
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Mission & Vision Section */}
      <div className="bg-blue-700">
        <Container>
          <div
            id="missionSection"
            className="py-12 md:py-16 lg:py-24 space-y-12 md:space-y-16 lg:space-y-16 px-4 md:px-6"
          >
            <div className="text-center mb-12 md:mb-16 lg:mb-16">
              <h2 className="text-blue-50 text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 lg:mb-4">
                Our Mission & Vision
              </h2>
              <p className="text-lg sm:text-xl lg:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                Guiding principles that drive everything we do as we connect the
                Pacific.
              </p>
            </div>

            <div className="grid mb-16 grid-cols-1 gap-8 md:gap-12 md:grid-cols-2 lg:grid-cols-2 lg:gap-16">
              {/* Mission */}
              <div className=" rounded-xl border-2 border-blue-100 shadow-lg p-6 sm:p-8 lg:p-8">
                <h3 className="text-2xl sm:text-3xl lg:text-3xl font-bold mb-4 text-blue-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="#E4E4F6"
                    className="inline-block mr-2"
                    viewBox="0 0 256 256"
                  >
                    <path d="M176,216a8,8,0,0,1-8,8H24a8,8,0,0,1,0-16H168A8,8,0,0,1,176,216ZM247.86,93.15a8,8,0,0,1-3.76,5.39l-147.41,88a40.18,40.18,0,0,1-20.26,5.52,39.78,39.78,0,0,1-27.28-10.87l-.12-.12L13,145.8a16,16,0,0,1,4.49-26.21l3-1.47a8,8,0,0,1,6.08-.4l28.26,9.54L75,115.06,53.17,93.87A16,16,0,0,1,57.7,67.4l.32-.13,7.15-2.71a8,8,0,0,1,5.59,0L124.7,84.38,176.27,53.6a39.82,39.82,0,0,1,51.28,9.12l.12.15,18.64,23.89A8,8,0,0,1,247.86,93.15Zm-19.74-3.7-13-16.67a23.88,23.88,0,0,0-30.68-5.42l-54.8,32.72a8.06,8.06,0,0,1-6.87.64L68,80.58l-4,1.53.21.2L93.57,110.8a8,8,0,0,1-1.43,12.58L59.93,142.87a8,8,0,0,1-6.7.73l-28.67-9.67-.19.1-.37.17a.71.71,0,0,1,.13.12l36,35.26a23.85,23.85,0,0,0,28.42,3.18Z"></path>
                  </svg>
                  Our Mission
                </h3>
                <div className="text-gray-100 text-base sm:text-lg lg:text-base leading-relaxed">
                  {parse(initialPage.missionStatement) ||
                    "Connecting the Solomon Islands through safe, reliable, and exceptional air transport services."}
                </div>
              </div>

              {/* Vision */}
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-8">
                <h3 className="text-2xl md:text-3xl lg:text-3xl font-bold mb-4 text-blue-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="#070601"
                    className="inline-block mr-2"
                    viewBox="0 0 256 256"
                  >
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM172.42,72.84l-64,32a8.05,8.05,0,0,0-3.58,3.58l-32,64A8,8,0,0,0,80,184a8.1,8.1,0,0,0,3.58-.84l64-32a8.05,8.05,0,0,0,3.58-3.58l32-64a8,8,0,0,0-10.74-10.74ZM138,138,97.89,158.11,118,118l40.15-20.07Z"></path>
                  </svg>
                  Our Vision
                </h3>
                <div className="text-blue-600 text-base sm:text-lg lg:text-base leading-relaxed">
                  {parse(initialPage.visionStatement) ||
                    "To be the Pacific region's premier airline, setting the standard for safety, service, and sustainability."}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      {/* End of Mission & Vision Section */}

      {/* Values Section */}
      <div className=" py-12 bg-white">
        <Container>
          <div className="text-center mb-12 space-y-3">
            <h3 className="text-3xl lg:text-4xl font-bold mb-4 text-blue-500">
              What We Value
            </h3>
            <p className="text-lg sm:text-xl lg:text-xl text-blue-500 max-w-2xl mx-auto leading-relaxed">
            Our guiding stars that illuminate our path towards excellence. They shape every decision, inspire every
            action, and define the essence of Solomon Airlines.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-8">
            {initialPage.values && initialPage.values.length > 0 ? (
              initialPage.values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl  overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="h-36 sm:h-44 lg:h-48 relative overflow-hidden">
                    <Image
                      src={value.image?.url || "/images/default-value.jpg"}
                      alt={value.title}
                      layout="fill"
                      objectFit="contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 sm:p-6 lg:p-6">
                    <h4 className="text-2xl md:text-xl lg:text-2xl font-bold mb-2 text-center text-blue-500">
                      {value.title}
                    </h4>
                    <div className="text-blue-500 text-center text-sm sm:text-base lg:text-base leading-relaxed">
                      {parse(value.description)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback values if none provided
              <>
              
                <div className="bg-gray-50 rounded-xl shadow-lg hover:shadow-2xl overflow-hidden">
                  <div className="h-36 sm:h-44 lg:h-48 bg-gray-50 relative overflow-hidden ">
                    <Image
                      src="/images/safety-icon.jpg"
                      alt="Safety First"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-4 sm:p-6 lg:p-6">
                    <h4 className="text-xl sm:text-2xl lg:text-2xl font-bold mb-2 text-gray-800">
                      Safety First
                    </h4>
                    <p className="text-gray-500 text-sm sm:text-base lg:text-base leading-relaxed">
                      The safety of our passengers and crew is our highest
                      priority, without compromise.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl shadow-lg hover:shadow-2xl overflow-hidden ">
                  <div className="h-36 sm:h-44 lg:h-48 bg-gray-50 relative overflow-hidden">
                    <Image
                      src="/images/sustainability-icon.jpg"
                      alt="Environmental Responsibility"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-4 sm:p-6 lg:p-6">
                    <h4 className="text-xl sm:text-2xl lg:text-2xl font-bold mb-2 text-gray-800">
                      Sustainability
                    </h4>
                    <p className="text-gray-500 text-sm sm:text-base lg:text-base leading-relaxed">
                      We're committed to reducing our environmental footprint
                      and protecting the beautiful destinations we serve.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
                  <div className="h-36 sm:h-44 lg:h-48 relative overflow-hidden">
                    <Image
                      src="/images/service-icon.jpg"
                      alt="Exceptional Service"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-4 sm:p-6 lg:p-6">
                    <h4 className="text-xl sm:text-2xl lg:text-2xl font-bold mb-2 text-gray-800">
                      Exceptional Service
                    </h4>
                    <p className="text-gray-500 text-sm sm:text-base lg:text-base leading-relaxed">
                      Our unique blend of hospitality reflects the warmth and
                      spirit of the islands we connect.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </Container>
      </div>
      {/* End of Values Section */}

      {/* Key Stats - SpaceX inspired with counters */}
      <div className="bg-blue-50 py-12 sm:py-16 lg:py-20">
        <Container>
          <div id="statsSection" className="px-4 sm:px-6">
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
                      35+
                    </div>
                    <div className="text-lg sm:text-xl lg:text-xl text-gray-600">
                      Destinations
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 lg:p-6">
                    <div className="text-4xl sm:text-5xl lg:text-5xl font-bold text-blue-700 mb-2">
                      15
                    </div>
                    <div className="text-lg sm:text-xl lg:text-xl text-gray-600">
                      Modern Aircraft
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 lg:p-6">
                    <div className="text-4xl sm:text-5xl lg:text-5xl font-bold text-blue-700 mb-2">
                      40+
                    </div>
                    <div className="text-lg sm:text-xl lg:text-xl text-gray-600">
                      Years Experience
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 lg:p-6">
                    <div className="text-4xl sm:text-5xl lg:text-5xl font-bold text-blue-700 mb-2">
                      2M+
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
      <div className="bg-blue-900 text-white py-12 sm:py-16 lg:py-20 bg-[url(/traditional_ring_blue.png)]  bg-left-bottom bg-no-repeat md:bg-fill lg:bg-cover">
        <Container>
          <div id="timelineSection" className="px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16 lg:mb-16">
              <h2 className="text-white text-3xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 lg:mb-4">
                Our Journey
              </h2>
              <p className="text-lg sm:text-xl lg:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
                From humble beginnings to becoming the Pacific's premier
                airline.
              </p>
            </div>
            <div className="space-y-12 sm:space-y-16 lg:space-y-0">
              {initialPage.journey && initialPage.journey.length > 0 ? (
                initialPage.journey.map((journeyItem, index) => (
                  <div key={index} className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/3 text-center lg:text-right mt-1 mb-6 lg:mb-0 lg:pr-10">
                      <div className="text-2xl p-0 md:text-3xl lg:text-3xl font-bold text-blue-200">
                        {journeyItem.year}
                      </div>
                    </div>
                    <div className="lg:w-2/3 lg:border-l-4 border-blue-200 pl-0 lg:pl-10 pt-2 pb-6 sm:pb-8 lg:pb-10 relative text-center lg:text-left">
                      <div className="hidden md:hidden md:absolute md:-ml-3 md:mt-3 lg:block lg:-ml-3 lg:mt-3 lg:absolute lg:left-0 lg:top-0 w-5 h-5 rounded-full bg-blue-200 "></div>
                      <h3 className="text-blue-100 text-xl md:text-2xl lg:text-2xl font-bold mb-2">
                        {journeyItem.title}
                      </h3>
                      <div className="text-blue-100 text-sm sm:text-base lg:text-base leading-relaxed">
                        {parse(journeyItem.description)}
                      </div>
                      {index < initialPage.journey.length - 1 && (
                        <div className="absolute left-1/2 -ml-0.5 lg:hidden">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="62"
                            height="62"
                            className="-ml-8 mt-4"
                            fill="#8D8CD9"
                            viewBox="0 0 256 256"
                          >
                            <path d="M205.66,149.66l-72,72a8,8,0,0,1-11.32,0l-72-72a8,8,0,0,1,11.32-11.32L120,196.69V40a8,8,0,0,1,16,0V196.69l58.34-58.35a8,8,0,0,1,11.32,11.32Z"></path>
                          </svg>
                        </div>
                      )}
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
      </div>
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
