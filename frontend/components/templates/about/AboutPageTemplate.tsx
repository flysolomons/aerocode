"use client";

import React from "react";
import PrimaryHero from "@/components/layout/hero/PrimaryHero";
import Container from "@/components/layout/Container";
import Image from "next/image";
import { AboutIndexPage } from "@/graphql/AboutPageQuery";
import parse from "html-react-parser";
import VideoHero from "@/components/layout/hero/VideoHero";
import MagazineCarousel from "@/components/layout/carousel/MagazineCarousel";
import StoryCarousel from "@/components/layout/carousel/StoryCarousel";
import { beautifyHtml } from "@/lib/beautifyHtml";

import {
  ImageBlock,
  MagazineBlock,
  StoryBlock,
} from "@/graphql/AboutPageQuery";

interface Magazine {
  title?: string;
  image?: ImageBlock;
  document?: { url: string };
}

interface Story {
  title: string;
  subTitle?: string;
  image?: string;
  link: string;
}

// Transform MagazineBlock[] to Magazine[] to pass into MagazineCarousel
const transformMagazines = (magazines: MagazineBlock[]): Magazine[] => {
  if (!magazines || !Array.isArray(magazines)) return [];

  return magazines
    .map((magazine) => {
      if (!magazine.blocks || !Array.isArray(magazine.blocks)) return null;

      let result: Magazine = {
        title: undefined,
        image: undefined,
        document: undefined,
      };

      magazine.blocks.forEach((block) => {
        if (block.title) result.title = block.title;
        if (block.image) result.image = block.image;
        if (block.document) result.document = block.document;
      });

      // Ensure the magazine has at least a title or document
      if (!result.title && !result.document) return null;

      return result;
    })
    .filter((magazine): magazine is Magazine => magazine !== null);
};

// Transform StoryBlock[] to Story[]
const transformStories = (stories: StoryBlock[]): Story[] => {
  if (!stories || !Array.isArray(stories)) return [];

  return stories
    .map((story) => {
      return {
        title: story.title || "Untitled Story",
        subTitle: story.subtitle,
        image: story.coverImage?.url,
        link: story.url || "#",
      };
    })
    .filter((story): story is Story => !!story.title && !!story.link);
};

interface AboutPageTemplateProps {
  initialPage: AboutIndexPage;
}

export default function AboutPageTemplate({
  initialPage,
}: AboutPageTemplateProps) {
  const getVideoUrl = (videoPath: string) => {
    // If it's already an absolute URL, return it as is
    if (videoPath.startsWith("http")) {
      return videoPath;
    }
    // If it's a relative path, construct the absolute URL
    const baseUrl = process.env.NEXT_PUBLIC_STORAGE_URL;
    return `${baseUrl}/media/${videoPath}`;
  };

  // Transform magazines
  const magazines = transformMagazines(
    initialPage.magazines as MagazineBlock[]
  );
  // Transform Stories
  const stories = transformStories(initialPage.stories as StoryBlock[]);

  return (
    <div className="min-h-screen">
      {initialPage.heroImage?.url === null ? (
        <PrimaryHero
          title={initialPage.heroTitle || "Our Journey Above the Clouds"}
          subtitle={initialPage.subTitle || "We are awsome"}
          image={initialPage.heroImage?.url || "/hero.jpg"}
          breadcrumbs={initialPage.url}
          showBookingWidget={false}
        />
      ) : (
        <VideoHero
          videoSource={getVideoUrl(initialPage.heroVideo) || "/about.mp4"}
          title={initialPage.heroTitle || "About Us"}
          subtitle={
            initialPage.subTitle ||
            "Proudly Connecting the Solomon Islands Since 1962"
          }
          breadcrumbs={initialPage.url}
          showBookingWidget={false}
        />
      )}

      {/* Introduction Section */}
      <div
        id="introductionSection"
        className="py-12 md:py-16 lg:py-24 space-y-12 md:space-y-6 lg:space-y-4 px-4 md:px-6 justify-center bg-[#ffffff] h-auto lg:h-screen"
      >
        <Container>
          {/* Solomon Airlines since 1962 */}
          <div className="text-center p-6 md:p-2 lg:p-0 justify-items-center lg:mb-14 lg:space-y-4">
            {/* <Image
              alt="Award Icon"
              src="/ic_award.png"
              width="64"
              height="64"
              className="mb-3"
            /> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              fill="#101f5c"
              viewBox="0 0 256 256"
            >
              <path
                d="M224,56V90.06h0a44,44,0,1,0-56,67.88h0V192H40a8,8,0,0,1-8-8V56a8,8,0,0,1,8-8H216A8,8,0,0,1,224,56Z"
                opacity="0.2"
              ></path>
              <path d="M128,136a8,8,0,0,1-8,8H72a8,8,0,0,1,0-16h48A8,8,0,0,1,128,136Zm-8-40H72a8,8,0,0,0,0,16h48a8,8,0,0,0,0-16Zm112,65.47V224A8,8,0,0,1,220,231l-24-13.74L172,231A8,8,0,0,1,160,224V200H40a16,16,0,0,1-16-16V56A16,16,0,0,1,40,40H216a16,16,0,0,1,16,16V86.53a51.88,51.88,0,0,1,0,74.94ZM160,184V161.47A52,52,0,0,1,216,76V56H40V184Zm56-12a51.88,51.88,0,0,1-40,0v38.22l16-9.16a8,8,0,0,1,7.94,0l16,9.16Zm16-48a36,36,0,1,0-36,36A36,36,0,0,0,232,124Z"></path>
            </svg>
            <h2 className="font-semibold text-4xl lg:text-3xl text-center text-blue-500">
              60+ Years of Innovation and Excellence in Global Aviation
            </h2>
            <div className="text-gray-500 text-center py-4">
              {parse(initialPage.description) ||
                "Solomon Airlines has a proud legacy that began in 1962, when Mr. Laurie Crowly founded Megapode Airways, a small charter company. In 1968, the airline became Solomon Island Airways (SOLAIR) under Macair PNG, marking its place as the world’s smallest international airline at the time. The Solomon Islands Government acquired a 49% stake in 1979, and by 1984, took full ownership—rebranding the airline as Solomon Airlines Limited and laying the foundation for a new era of national pride, connectivity, and growth."}
            </div>

            {/* Strategic Plan */}
            {/* <div className="border-t-2 border-gray-200 py-4 justify-items-center space-y-4">
              <h2 className="text-lg font-bold text-gray-700">Strategic Plan 2024-2028</h2>
              <p>On 19 January 2024, we released details our new four-year Strategic Plan setting a clear path for the National Carrier based on seven strategic goals.</p>
              <div className="bg-blue-100 w-[200px] p-3 rounded-md text-white hover:bg-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#fafafa" className="inline" viewBox="0 0 256 256"><path d="M224,152a8,8,0,0,1-8,8H192v16h16a8,8,0,0,1,0,16H192v16a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8h32A8,8,0,0,1,224,152ZM92,172a28,28,0,0,1-28,28H56v8a8,8,0,0,1-16,0V152a8,8,0,0,1,8-8H64A28,28,0,0,1,92,172Zm-16,0a12,12,0,0,0-12-12H56v24h8A12,12,0,0,0,76,172Zm88,8a36,36,0,0,1-36,36H112a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8h16A36,36,0,0,1,164,180Zm-16,0a20,20,0,0,0-20-20h-8v40h8A20,20,0,0,0,148,180ZM40,112V40A16,16,0,0,1,56,24h96a8,8,0,0,1,5.66,2.34l56,56A8,8,0,0,1,216,88v24a8,8,0,0,1-16,0V96H152a8,8,0,0,1-8-8V40H56v72a8,8,0,0,1-16,0ZM160,80h28.69L160,51.31Z"></path></svg>
                <span className="font-semibold px-1">Strategic Plan</span>
                
              </div>
            </div> */}
          </div>

          <hr className="w-[60%] h-1 mx-auto my-4 bg-gray-100 border-0 rounded-sm md:my-10 dark:bg-gray-700" />

          {/* Solomon Airlines Today */}
          <div className="text-center p-6 md:p-2 lg:p-0 justify-items-center lg:mt-14 lg:space-y-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              fill="#101f5c"
              viewBox="0 0 256 256"
            >
              <path
                d="M160,80a32,32,0,1,1-32-32A32,32,0,0,1,160,80Z"
                opacity="0.2"
              ></path>
              <path d="M215.12,123.64a8,8,0,1,0-14.24-7.28,79.58,79.58,0,0,1-33.08,33.5l-16.58-37.32A40,40,0,0,0,136,40.8V24a8,8,0,0,0-16,0V40.8a40,40,0,0,0-15.22,71.74L56.69,220.75a8,8,0,1,0,14.62,6.5l25.14-56.56A95.48,95.48,0,0,0,128,176a99.13,99.13,0,0,0,31.6-5.21l25.09,56.46a8,8,0,0,0,14.62-6.5l-25-56.25A95.81,95.81,0,0,0,215.12,123.64ZM128,56a24,24,0,1,1-24,24A24,24,0,0,1,128,56Zm0,104a79.52,79.52,0,0,1-25-4l16.42-36.94a39.81,39.81,0,0,0,17.2,0l16.48,37.06A83.21,83.21,0,0,1,128,160Z"></path>
            </svg>
            <h2 className="font-semibold text-3xl text-center text-blue-500">
              Where we are today
            </h2>
            <p className="text-gray-500 text-center">
              {beautifyHtml(
                "Today, Solomon Airlines is the national carrier and market leader in air transport across the Solomon Islands. We are based in Honiara but also have offices in several of our regional destinations including Brisbane, Australia and Fiji , Nadi. We operate:<li>The Airbus A320-200 “Spirit of Solomons” for international routes</li>	<li>A Dash 8 and three Twin Otters for extensive domestic coverage</li>	With a workforce of 250+ employees, 95% of whom are locally based, we provide scheduled passenger services, cargo transport, and charter flights strengthening connections across the Pacific and supporting tourism, trade, and community development."
              )}
            </p>

            <p className="py-4">
              {beautifyHtml(
                'Discover our roadmap for the future in our  <a href="#">Strategic Plan Document</a>'
              )}
            </p>
          </div>
        </Container>
      </div>

      {/* Mission & Vision Section */}
      <div className="bg-rfex h-auto lg:h-screen">
        <Container>
          <div
            id="missionSection"
            className="py-12 md:py-16 lg:py-24 space-y-12 md:space-y-16 lg:space-y-16 px-4 md:px-6"
          >
            <div className="text-center mb-12 md:mb-16 lg:mb-16">
              {/* <h2 className="text-blue-500 text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 lg:mb-4">
                Our Mission & Vision
              </h2> */}
              <p className="text-lg sm:text-xl lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                We do more than move people—we connect lives, cultures, and
                opportunities with true Solomon Islands hospitality.
              </p>
            </div>

            <div className="grid mb-16 grid-cols-1 gap-8 md:gap-12 md:grid-cols-2 lg:grid-cols-1 lg:gap-16 b">
              <Image
                src={"/ic_qoutes.png"}
                alt="quote"
                width={100}
                height={100}
                className="absolute -mt-6 -ml-2 lg:-ml-4  w-10 h-10 lg:w-28 lg:h-28"
              ></Image>
              {/* Mission */}
              <div className="bg-white rounded-xl border-2 border-blue-50 shadow-lg p-6 sm:p-8 lg:p-8">
                <h3 className="text-lg  font-bold mb-4 text-black text-center">
                  WE ARE ON A MISSION
                </h3>
                <div className="text-black text-2xl lg:text-3xl  leading-relaxed text-center">
                  {parse(initialPage.missionStatement) ||
                    "Connecting the Solomon Islands through safe, reliable, and exceptional air transport services."}
                </div>
              </div>

              {/* Vision */}
              <div className="bg-white rounded-xl  border-2 border-blue-50 shadow-lg p-6 sm:p-8 lg:p-8">
                <Image
                  src={"/ic_qoutes.png"}
                  alt="quote"
                  width={100}
                  height={100}
                  className="float-right w-10 h-10 lg:w-28 lg:h-28 transform -scale-x-100 -mt-12 -mr-10 lg:-mr-12"
                ></Image>
                <h3 className="text-lg  font-bold mb-4 text-black text-center">
                  WITH THE VISION
                </h3>
                <div className="text-black text-2xl lg:text-3xl  leading-relaxed text-center">
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
      <div className="bg-blue-800 h-auto lg:h-screen flex items-center">
        <Container>
          <div className="text-center mb-12 space-y-3 pt-10">
            <h3 className="text-3xl lg:text-4xl font-bold mb-4 text-blue-100">
              What We Value
            </h3>
            <p className="text-md  lg:text-lg text-blue-100   leading-relaxed">
              Our guiding stars that illuminate our path towards excellence.
              They shape every decision, inspire every action, and define the
              essence of Solomon Airlines.
            </p>
          </div>

          <div className="grid  grid-cols-1 lg:grid-cols-3 gap-4  lg:gap-6  px-4 lg:px-0 pb-20 lg:pb-16">
            {initialPage.values && initialPage.values.length > 0 ? (
              initialPage.values.map((value, index) => (
                <div
                  key={index}
                  className=" rounded-xl overflow-hidden hover:shadow hover:shadow-blue-400 transition-shadow  duration-300 border-2 border-blue-600 bg-blue-700 "
                >
                  <div className="h-auto relative  overflow-hidden rounded-lg">
                    <Image
                      src={value.image?.url || "/images/default-value.jpg"}
                      alt={value.title}
                      width={100}
                      height={100}
                      loading="lazy"
                      className="w-[60px] h-[60px] rounded-lg pt-4 pl-4"
                    />
                  </div>
                  <div className="p-4 sm:p-6 lg:p-6">
                    <h4 className="text-2xl md:text-xl lg:text-xl font-bold mb-2 text-left text-blue-50">
                      {value.title}
                    </h4>
                    <div className="text-slate-500 text-left text-sm lg:text-base leading-relaxed">
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
                      className="w-[100px] h-[100px]"
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
      <div className="bg-blue-600 py-12 sm:py-16 lg:py-20">
        <Container>
          <div id="statsSection" className="px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-8 text-center">
              {initialPage.stats && initialPage.stats.length > 0 ? (
                initialPage.stats.map((stat, index) => (
                  <div key={index} className="p-4 sm:p-6 lg:p-6">
                    <div className="text-4xl sm:text-5xl lg:text-5xl font-bold text-blue-50 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-lg sm:text-xl lg:text-xl text-blue-50">
                      {stat.title}
                    </div>
                  </div>
                ))
              ) : (
                // Fallback static stats if none provided from API
                <>
                  <div className="p-4 sm:p-6 lg:p-6">
                    <div className="text-4xl sm:text-5xl lg:text-5xl font-bold text-blue-50 mb-2">
                      35+
                    </div>
                    <div className="text-lg sm:text-xl lg:text-xl text-blue-100">
                      Destinations
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 lg:p-6">
                    <div className="text-4xl sm:text-5xl lg:text-5xl font-bold text-blue-50 mb-2">
                      15
                    </div>
                    <div className="text-lg sm:text-xl lg:text-xl text-gray-100">
                      Modern Aircraft
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 lg:p-6">
                    <div className="text-4xl sm:text-5xl lg:text-5xl font-bold text-blue-50 mb-2">
                      40+
                    </div>
                    <div className="text-lg sm:text-xl lg:text-xl text-gray-100">
                      Years Experience
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 lg:p-6">
                    <div className="text-4xl sm:text-5xl lg:text-5xl font-bold text-blue-50 mb-2">
                      2M+
                    </div>
                    <div className="text-lg sm:text-xl lg:text-xl text-gray-100">
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
      <div className="bg-refx text-white py-12 sm:py-16 lg:py-20 bg-[url(/traditional_ring_blue.png)] bg-left-bottom bg-no-repeat md:bg-fill lg:bg-cover  h-auto lg:h-screen flex items-center">
        <Container className="flex flex-col justify-center h-full">
          <div id="timelineSection" className="px-4 sm:px-6">
            <div className="text-center mb-12 sm:mb-16 lg:mb-16">
              <h2 className="text-blue-500 text-3xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 lg:mb-4">
                Our Journey
              </h2>
              <p className="text-lg sm:text-xl lg:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                From humble beginnings to becoming the Pacific's premier
                airline.
              </p>
            </div>
            <div className="space-y-12 sm:space-y-16 lg:space-y-0">
              {initialPage.journey && initialPage.journey.length > 0 ? (
                initialPage.journey.map((journeyItem, index) => (
                  <div
                    key={index}
                    className="flex flex-col lg:flex-row items-start"
                  >
                    {/* Year (Left on large screens, aligned with title) */}
                    <div className="w-full lg:w-1/3 text-center lg:text-right mb-4 justify-items-center  lg:mb-0 lg:pr-10 pt-2 ">
                      <div className="text-2xl  lg:float-right text-center  sm:text-3xl lg:text-xl  text-white bg-gradient-to-l from-blue-500  to-[#4c447f] w-48 rounded-full p-2 lg:mx-0 shadow-lg">
                        {journeyItem.year}
                      </div>
                    </div>
                    {/* Content (Right on large screens) */}
                    <div className="lg:w-2/3 lg:border-l-2 border-blue-50 pl-0 lg:pl-10 pt-2 pb-6 sm:pb-8 lg:pb-10 relative text-center lg:text-left">
                      <div className="hidden lg:block absolute left-0 top-2 w-5 h-5 rounded-full bg-blue-500 -ml-2.5 mt-2 border-2 border-gray-400"></div>
                      <h3 className="text-blue-500 text-xl sm:text-2xl lg:text-xl font-bold mb-2">
                        {journeyItem.title}
                      </h3>
                      <div className="rounded-lg p-4 bg-white shadow-lg">
                        <div className="text-gray-600 text-sm sm:text-base lg:text-base leading-relaxed">
                          {parse(journeyItem.description)}
                        </div>
                      </div>
                      {index < initialPage.journey.length - 1 && (
                        <div className="absolute lg:hidden left-1/3 ml-8 mt-2 md:ml-24 ">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="64"
                            height="64"
                            fill="#c7c7c7"
                            viewBox="0 0 256 256"
                          >
                            <path d="M231.39,132.94A8,8,0,0,0,224,128H184V104a8,8,0,0,0-8-8H80a8,8,0,0,0-8,8v24H32a8,8,0,0,0-5.66,13.66l96,96a8,8,0,0,0,11.32,0l96-96A8,8,0,0,0,231.39,132.94ZM128,220.69,51.31,144H80a8,8,0,0,0,8-8V112h80v24a8,8,0,0,0,8,8h28.69ZM72,40a8,8,0,0,1,8-8h96a8,8,0,0,1,0,16H80A8,8,0,0,1,72,40Zm0,32a8,8,0,0,1,8-8h96a8,8,0,0,1,0,16H80A8,8,0,0,1,72,72Z"></path>
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
                  <div className="flex flex-col lg:flex-row items-start">
                    <div className="lg:w-1/3 text-center lg:text-right mb-4 sm:mb-6 lg:mb-0 lg:pr-10 pt-2">
                      <div className="text-2xl sm:text-3xl lg:text-xl font-bold text-white bg-gradient-to-l from-blue-700 via-blue-950 to-gray-950 w-48 rounded-full p-2 border-2 border-blue-400 mx-auto lg:mx-0">
                        1985
                      </div>
                    </div>
                    <div className="lg:w-2/3 lg:border-l-4 border-blue-50 pl-0 lg:pl-10 pt-2 pb-6 sm:pb-8 lg:pb-10 relative text-center lg:text-left">
                      <div className="hidden lg:block absolute left-0 top-0 w-5 h-5 rounded-full bg-blue-50 -ml-2.5 mt-2"></div>
                      <h3 className="text-blue-500 text-xl sm:text-2xl lg:text-xl font-bold mb-2">
                        Foundation
                      </h3>
                      <div className="rounded-lg p-4 bg-white shadow-lg">
                        <p className="text-gray-600 text-sm sm:text-base lg:text-base leading-relaxed">
                          We began with just two aircraft, serving three
                          destinations. Our founder's vision was to connect the
                          isolated communities of the Solomon Islands.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Item 2 */}
                  <div className="flex flex-col lg:flex-row items-start">
                    <div className="lg:w-1/3 text-center lg:text-right mb-4 sm:mb-6 lg:mb-0 lg:pr-10 pt-2">
                      <div className="text-2xl sm:text-3xl lg:text-xl font-bold text-white bg-gradient-to-l from-blue-700 via-blue-950 to-gray-950 w-48 rounded-full p-2 border-2 border-blue-400 mx-auto lg:mx-0">
                        1998
                      </div>
                    </div>
                    <div className="lg:w-2/3 lg:border-l-4 border-blue-50 pl-0 lg:pl-10 pt-2 pb-6 sm:pb-8 lg:pb-10 relative text-center lg:text-left">
                      <div className="hidden lg:block absolute left-0 top-0 w-5 h-5 rounded-full bg-blue-50 -ml-2.5 mt-2"></div>
                      <h3 className="text-blue-500 text-xl sm:text-2xl lg:text-xl font-bold mb-2">
                        Regional Expansion
                      </h3>
                      <div className="rounded-lg p-4 bg-white shadow-lg">
                        <p className="text-gray-600 text-sm sm:text-base lg:text-base leading-relaxed">
                          We expanded services to neighboring countries,
                          becoming the first choice for travel throughout the
                          Pacific islands.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Item 3 */}
                  <div className="flex flex-col lg:flex-row items-start">
                    <div className="lg:w-1/3 text-center lg:text-right mb-4 sm:mb-6 lg:mb-0 lg:pr-10 pt-2">
                      <div className="text-2xl sm:text-3xl lg:text-xl font-bold text-white bg-gradient-to-l from-blue-700 via-blue-950 to-gray-950 w-48 rounded-full p-2 border-2 border-blue-400 mx-auto lg:mx-0">
                        2010
                      </div>
                    </div>
                    <div className="lg:w-2/3 lg:border-l-4 border-blue-50 pl-0 lg:pl-10 pt-2 pb-6 sm:pb-8 lg:pb-10 relative text-center lg:text-left">
                      <div className="hidden lg:block absolute left-0 top-0 w-5 h-5 rounded-full bg-blue-50 -ml-2.5 mt-2"></div>
                      <h3 className="text-blue-500 text-xl sm:text-2xl lg:text-xl font-bold mb-2">
                        Fleet Modernization
                      </h3>
                      <div className="rounded-lg p-4 bg-white shadow-lg">
                        <p className="text-gray-600 text-sm sm:text-base lg:text-base leading-relaxed">
                          We began a comprehensive fleet renewal program,
                          introducing more fuel-efficient aircraft and reducing
                          our environmental impact.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Item 4 */}
                  <div className="flex flex-col lg:flex-row items-start">
                    <div className="lg:w-1/3 text-center lg:text-right mb-4 sm:mb-6 lg:mb-0 lg:pr-10 pt-2">
                      <div className="text-2xl sm:text-3xl lg:text-xl font-bold text-white bg-gradient-to-l from-blue-700 via-blue-950 to-gray-950 w-48 rounded-full p-2 border-2 border-blue-400 mx-auto lg:mx-0">
                        2023
                      </div>
                    </div>
                    <div className="lg:w-2/3 lg:border-l-4 border-blue-50 pl-0 lg:pl-10 pt-2 relative text-center lg:text-left">
                      <div className="hidden lg:block absolute left-0 top-0 w-5 h-5 rounded-full bg-blue-50 -ml-2.5 mt-2"></div>
                      <h3 className="text-blue-500 text-xl sm:text-2xl lg:text-xl font-bold mb-2">
                        Today & Tomorrow
                      </h3>
                      <div className="rounded-lg p-4 bg-white shadow-lg">
                        <p className="text-gray-600 text-sm sm:text-base lg:text-base leading-relaxed">
                          Today, we operate the most extensive network in the
                          Pacific region, while continuing to innovate with
                          sustainable practices and enhanced passenger
                          experiences.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Magazine Carousel */}
      <div className="bg-white">
        <MagazineCarousel magazines={magazines} />
      </div>

      {/* Story Courosel */}
      <div>
        <StoryCarousel stories={stories} />
      </div>

      {/* Call to Action - Tesla/SpaceX inspired with dramatic imagery */}
      {/* <div
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
              Latest Inflight Magazines
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
      </div> */}
    </div>
  );
}
