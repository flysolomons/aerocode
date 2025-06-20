"use client";

import { HomePage } from "@/graphql/HomePageQuery";
import Container from "@/components/layout/Container";
import PrimaryHero from "@/components/layout/hero/PrimaryHero";
import InfoCard from "@/components/ui/cards/InfoCard";
import Image from "next/image";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import Slider from "@/components/layout/Slider";
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
      <MainCarousel />

      {/*<PrimaryHero
        title={data.pages[0].heroTitle}
        image={data.pages[0].heroImage.src}
      />*/}

      <Container>
        <div className="pt-12 space-y-16">
          <RouteSpecialSection
            heading="Our Specials"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
          />
        </div>
      </Container>

      <div className="h-[calc(90vh)] flex items-center justify-center">
        <div className="space-y-8">
          <div className="space-y-2">
            {/* <InViewWrapper
              className="animate__animated animate__fadeInUp"> */}
            <h2 className="discover-title text-3xl text-center font-bold text-blue-500">
              Discover New Horizons
            </h2>

            <span className="block text-center">
              Lorem ipsum dolor sit amet, consectetusr adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua
            </span>

            {/* </InViewWrapper> */}
          </div>

          {/* <InViewWrapper className="animate__animated animate__fadeInUp "> */}
          <div className="h-auto">{/* <Slider /> */}</div>
          {/* </InViewWrapper> */}

          {/* <InViewWrapper
              className="animate__animated animate__fadeInUp"> */}
          <PrimaryButton text="Explore" />
          {/* </InViewWrapper> */}
        </div>
      </div>

      {/* <InViewWrapper  className="animate__animated animate__fadeInUp"> */}
      <div
        className="h-screen space-y-16 bg-cover bg-center pt-1 pb-2 bg-blue-700 bg-blend-lighten md:bg-blend-soft-light flex items-center justify-center"
        style={{
          backgroundImage: `url(/belama-lounge.png)`,
        }}
      >
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl text-center font-bold text-white pt-2">
              Join Belama
            </h2>
            <span className="block text-center text-white">
              Lorem ipsum dolor sit amet, consectetusr adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua
            </span>
          </div>
          <PrimaryButton href="/belama" text="Join Now" />
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
      {/* <div className="bg-[url('/traditional_ring.png')] bg-no-repeat bg-opacity-50 bg-cover">
        <Container>
          <div className="h-screen flex items-center justify-center ">
            <div className="space-y-12">
              <div className="space-y-2">
                <h2 className="text-3xl text-center font-bold text-blue-500">
                  All You Need
                </h2>
                <span className="block text-center">
                  Lorem ipsum dolor sit amet, consectetusr adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-slate-500">
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
      </div> */}

      {/* </InViewWrapper> */}
    </>
  );
}
