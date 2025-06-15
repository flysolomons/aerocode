"use client";

import { HomePage } from "@/graphql/HomePageQuery";
import Container from "@/components/common/Container";
import PrimaryHero from "@/components/layout/PrimaryHero";
import InfoCard from "@/components/common/InfoCard";
import Image from "next/image";
import PrimaryButton from "@/components/common/PrimaryButton";
import Slider from "@/components/common/Slider";
import RouteSpecialSection from "@/components/layout/RouteSpecialSection";
// import InViewWrapper
//  from "@/components/common/InViewWrapper";
import MainCarousel from "@/components/layout/MainCarousel";

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
          <div className="h-auto">
            <Slider />
          </div>
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
      <div className="bg-[url('/traditional_ring.png')] bg-no-repeat bg-opacity-50 bg-cover">
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
                  svg={
                    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#212061" viewBox="0 0 256 256"><path d="M224,71.1a8,8,0,0,1-10.78-3.42,94.13,94.13,0,0,0-33.46-36.91,8,8,0,1,1,8.54-13.54,111.46,111.46,0,0,1,39.12,43.09A8,8,0,0,1,224,71.1ZM35.71,72a8,8,0,0,0,7.1-4.32A94.13,94.13,0,0,1,76.27,30.77a8,8,0,1,0-8.54-13.54A111.46,111.46,0,0,0,28.61,60.32,8,8,0,0,0,35.71,72Zm186.1,103.94A16,16,0,0,1,208,200H167.2a40,40,0,0,1-78.4,0H48a16,16,0,0,1-13.79-24.06C43.22,160.39,48,138.28,48,112a80,80,0,0,1,160,0C208,138.27,212.78,160.38,221.81,175.94ZM150.62,200H105.38a24,24,0,0,0,45.24,0ZM208,184c-10.64-18.27-16-42.49-16-72a64,64,0,0,0-128,0c0,29.52-5.38,53.74-16,72Z"></path></svg>'
                  }
                  url="#"
                />
                <InfoCard
                  title="Check-In Information"
                  description="Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles, pero la mayoría sufrió alteraciones en alguna manera, ya sea porque se le agregó humor,"
                  svg={
                    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#212061" viewBox="0 0 256 256"><path d="M176,216a8,8,0,0,1-8,8H24a8,8,0,0,1,0-16H168A8,8,0,0,1,176,216ZM247.86,93.15a8,8,0,0,1-3.76,5.39l-147.41,88a40.18,40.18,0,0,1-20.26,5.52,39.78,39.78,0,0,1-27.28-10.87l-.12-.12L13,145.8a16,16,0,0,1,4.49-26.21l3-1.47a8,8,0,0,1,6.08-.4l28.26,9.54L75,115.06,53.17,93.87A16,16,0,0,1,57.7,67.4l.32-.13,7.15-2.71a8,8,0,0,1,5.59,0L124.7,84.38,176.27,53.6a39.82,39.82,0,0,1,51.28,9.12l.12.15,18.64,23.89A8,8,0,0,1,247.86,93.15Zm-19.74-3.7-13-16.67a23.88,23.88,0,0,0-30.68-5.42l-54.8,32.72a8.06,8.06,0,0,1-6.87.64L68,80.58l-4,1.53.21.2L93.57,110.8a8,8,0,0,1-1.43,12.58L59.93,142.87a8,8,0,0,1-6.7.73l-28.67-9.67-.19.1-.37.17a.71.71,0,0,1,.13.12l36,35.26a23.85,23.85,0,0,0,28.42,3.18Z"></path></svg>'
                  }
                  url="#"
                />
                <InfoCard
                  title="Travel Advice"
                  description="Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles, pero la mayoría sufrió alteraciones en alguna manera, ya sea porque se le agregó humor,"
                  svg={
                    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#212061" viewBox="0 0 256 256"><path d="M229.11,70.82A16,16,0,0,0,216,64H136V32h16a8,8,0,0,0,0-16H104a8,8,0,0,0,0,16h16V64H40A16,16,0,0,0,25,85.47l26.19,72a16,16,0,0,0,15,10.53H96v64a8,8,0,0,0,16,0V168h32v64a8,8,0,0,0,16,0V168h29.82a16,16,0,0,0,15-10.53l26.19-72A16,16,0,0,0,229.11,70.82ZM110.68,152,97.58,80h60.84l-13.1,72ZM40,80H81.32l13.09,72H66.18Zm149.82,72H161.59l13.09-72H216Z"></path></svg>'
                  }
                  url="#"
                />
                <InfoCard
                  title="Baggage Information"
                  description="Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles, pero la mayoría sufrió alteraciones en alguna manera, ya sea porque se le agregó humor,"
                  svg={
                    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#212061" viewBox="0 0 256 256"><path d="M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm64,24V200H96V72ZM40,72H80V200H40ZM216,200H176V72h40V200Z"></path></svg>'
                  }
                  url="#"
                />
                <InfoCard
                  title="Conditions of Carriage"
                  description="Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles, pero la mayoría sufrió alteraciones en alguna manera, ya sea porque se le agregó humor,"
                  svg={
                    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#212061" viewBox="0 0 256 256"><path d="M88,224a16,16,0,1,1-16-16A16,16,0,0,1,88,224Zm128-16a16,16,0,1,0,16,16A16,16,0,0,0,216,208Zm24-32H56V75.31A15.86,15.86,0,0,0,51.31,64L29.66,42.34A8,8,0,0,0,18.34,53.66L40,75.31V176H32a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM72,144V72A16,16,0,0,1,88,56h32V40a16,16,0,0,1,16-16h32a16,16,0,0,1,16,16V56h32a16,16,0,0,1,16,16v72a16,16,0,0,1-16,16H88A16,16,0,0,1,72,144Zm64-88h32V40H136ZM88,144H216V72H88Z"></path></svg>'
                  }
                  url="#"
                />
                <InfoCard
                  title="Travel Alerts"
                  description="Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles, pero la mayoría sufrió alteraciones en alguna manera, ya sea porque se le agregó humor,"
                  svg={
                    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#212061" viewBox="0 0 256 256"><path d="M185.33,114.21l29.14-27.42.17-.17a32,32,0,0,0-45.26-45.26c0,.06-.11.11-.17.17L141.79,70.67l-83-30.2a8,8,0,0,0-8.39,1.86l-24,24a8,8,0,0,0,1.22,12.31l63.89,42.59L76.69,136H56a8,8,0,0,0-5.65,2.34l-24,24A8,8,0,0,0,29,175.42l36.82,14.73,14.7,36.75.06.16a8,8,0,0,0,13.18,2.47l23.87-23.88A8,8,0,0,0,120,200V179.31l14.76-14.76,42.59,63.89a8,8,0,0,0,12.31,1.22l24-24a8,8,0,0,0,1.86-8.39Zm-.07,97.23-42.59-63.88A8,8,0,0,0,136.8,144c-.27,0-.53,0-.79,0a8,8,0,0,0-5.66,2.35l-24,24A8,8,0,0,0,104,176v20.69L90.93,209.76,79.43,181A8,8,0,0,0,75,176.57l-28.74-11.5L59.32,152H80a8,8,0,0,0,5.66-2.34l24-24a8,8,0,0,0-1.22-12.32L44.56,70.74l13.5-13.49,83.22,30.26a8,8,0,0,0,8.56-2L180.78,52.6A16,16,0,0,1,203.4,75.23l-32.87,30.93a8,8,0,0,0-2,8.56l30.26,83.22Z"></path></svg>'
                  }
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
