"use client";

import { HomePage } from "@/graphql/HomePageQuery";
import Container from "@/components/layout/Container";
import PrimaryHero from "@/components/layout/hero/PrimaryHero";
import InfoCard from "@/components/ui/cards/InfoCard";
import Image from "next/image";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import Slider from "@/components/layout/Slider";
import EmblaCarousel from "@/components/layout/carousel/Carousel";
import RouteSpecialSection from "@/components/layout/sections/RouteSpecialSection";
// import InViewWrapper
//  from "@/components/common/InViewWrapper";
import MainCarousel from "@/components/layout/hero/MainCarousel";

interface HomePageTemplateProps {
  initialPage: HomePage;
}

export default function HomePageTemplate({
  initialPage,
}: HomePageTemplateProps) {
  const homePage = initialPage;
  // console.log(data);
  return (
    <>
      {/* <MainCarousel /> */}
      <PrimaryHero title={homePage.heroTitle} image={homePage.heroImage.url} />
      <Container>
        <div className="pt-8 md:pt-12 space-y-8 md:space-y-16">
          <RouteSpecialSection
            heading="Our Specials"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
            specials={[
              {
                special: {
                  name: "Island Explorer",
                },
                route: {
                  nameFull: "Honiara to Brisbane",
                  heroImage: {
                    url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop",
                  },
                },
                startingPrice: "$899",
              },
              {
                special: {
                  name: "Pacific Paradise",
                },
                route: {
                  nameFull: "Honiara to Nadi",
                  heroImage: {
                    url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
                  },
                },
                startingPrice: "$749",
              },
              {
                special: {
                  name: "Vanuatu Adventure",
                },
                route: {
                  nameFull: "Honiara to Port Vila",
                  heroImage: {
                    url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=300&fit=crop",
                  },
                },
                startingPrice: "$649",
              },
            ]}
          />
        </div>
      </Container>
      <div className="min-h-[100vh] md:h-[calc(100vh)] flex items-center justify-center px-4 md:px-0 py-8 md:py-0">
        <div className="space-y-6 md:space-y-8 w-full max-w-none md:max-w-[85%]">
          <div className="space-y-2">
            {/* <InViewWrapper
              className="animate__animated animate__fadeInUp"> */}
            <h2 className="discover-title text-2xl md:text-3xl text-center font-bold text-blue-500">
              Discover New Horizons
            </h2>

            <span className="block text-center text-sm md:text-base px-4 md:px-0">
              Lorem ipsum dolor sit amet, consectetusr adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua
            </span>

            {/* </InViewWrapper> */}
          </div>
          {/* <InViewWrapper className="animate__animated animate__fadeInUp "> */}
          <div className="h-auto">
            {/* <Slider /> */}
            <EmblaCarousel
              slides={[
                {
                  imageUrl:
                    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
                  country: "Papua New Guinea",
                  subtitle: "Insert Subtitle here",
                },
                {
                  imageUrl:
                    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
                  country: "Fiji",
                  subtitle: "Insert Subtitle here",
                },
                {
                  imageUrl:
                    "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop",
                  country: "Solomon Islands",
                  subtitle: "Insert Subtitle here",
                },
                {
                  imageUrl:
                    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
                  country: "New Zealand",
                  subtitle: "Insert Subtitle here",
                },
                {
                  imageUrl:
                    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
                  country: "Australia",
                  subtitle: "Insert Subtitle here",
                },
              ]}
            />
          </div>
          {/* </InViewWrapper> */}
          {/* <InViewWrapper
              className="animate__animated animate__fadeInUp"> */}
          {/* <div className="flex justify-center">
            <PrimaryButton text="Explore" />
          </div> */}
          {/* </InViewWrapper> */}
        </div>
      </div>
      {/* <InViewWrapper  className="animate__animated animate__fadeInUp"> */}
      <div
        className="min-h-screen md:h-screen space-y-8 md:space-y-16 bg-cover bg-center bg-no-repeat pt-8 md:pt-1 pb-8 md:pb-2 bg-blue-700 bg-opacity-80 bg-blend-overlay sm:bg-blend-overlay md:bg-blend-soft-light flex items-center justify-center px-4 md:px-0"
        style={{
          backgroundImage: `url(/belama-lounge.png)`,
        }}
      >
        <div className="space-y-6 md:space-y-8 w-full max-w-4xl">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl text-center font-bold text-white pt-2">
              Belama
            </h2>
            <span className="block text-center text-white text-sm md:text-base px-4 md:px-0">
              Lorem ipsum dolor sit amet, consectetusr adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua
            </span>
          </div>
          <div className="flex justify-center">
            <PrimaryButton href="/belama" text="Join Now" />
          </div>
          {/*<div className="relative w-full h-[30rem] mb-6">
            <Image
              src="/image.jpg"
              alt="Belama welcome area with tropical scene and refreshments"
              width={1000}
              height={300}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>*/}
        </div>
      </div>
      {/* </InViewWrapper> */}
      {/* <InViewWrapper  className="animate__animated animate__fadeInUp bg-[url('/traditional_ring.png')] bg-no-repeat bg-opacity-50 bg-cover"> */}
      <div className="bg-[url('/traditional_ring.png')] bg-no-repeat bg-opacity-50 bg-cover">
        <Container>
          <div className="min-h-screen md:h-screen flex items-center justify-center py-8 md:py-0">
            <div className="space-y-8 md:space-y-12 w-full">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl text-center font-bold text-blue-500">
                  All You Need
                </h2>
                <span className="block text-center text-sm md:text-base px-4 md:px-0">
                  Lorem ipsum dolor sit amet, consectetusr adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 text-slate-500 px-4 md:px-0">
                <InfoCard
                  title="Travel Alerts"
                  description="Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles, pero la mayoría sufrió alteraciones en alguna manera, ya sea porque se le agregó humor,"
                  svg={"./svg/travel-alert.svg"}
                  url="#"
                />
                <InfoCard
                  title="Check-In Information"
                  description="Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles, pero la mayoría sufrió alteraciones en alguna manera, ya sea porque se le agregó humor,"
                  svg={"./svg/check-in.svg"}
                  url="#"
                />
                <InfoCard
                  title="Travel Advice"
                  description="Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles, pero la mayoría sufrió alteraciones en alguna manera, ya sea porque se le agregó humor,"
                  svg={"./svg/travel-advice.svg"}
                  url="#"
                />
                <InfoCard
                  title="Baggage Information"
                  description="Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles, pero la mayoría sufrió alteraciones en alguna manera, ya sea porque se le agregó humor,"
                  svg={"./svg/baggage.svg"}
                  url="#"
                />
                <InfoCard
                  title="Conditions of Carriage"
                  description="Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles, pero la mayoría sufrió alteraciones en alguna manera, ya sea porque se le agregó humor,"
                  svg={"./svg/conditions.svg"}
                  url="#"
                />
                <InfoCard
                  title="Travel Alerts"
                  description="Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles, pero la mayoría sufrió alteraciones en alguna manera, ya sea porque se le agregó humor,"
                  svg={"./svg/travel-alert.svg"}
                  url="#"
                />
              </div>
            </div>
          </div>
        </Container>
      </div>
      {/* </InViewWrapper> */}
    </>
  );
}
