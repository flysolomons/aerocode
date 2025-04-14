"use client";
import Container from "@/components/common/Container";
import PrimaryHero from "@/components/layout/PrimaryHero";
import InfoCard from "@/components/common/InfoCard";
import Image from "next/image";
import PrimaryButton from "@/components/common/PrimaryButton";
import Slider from "@/components/common/Slider";
import RouteSpecialSection from "@/components/layout/RouteSpecialSection";

import { useQuery, gql } from "@apollo/client";
import client from "../lib/apolloClient";

const GET_HOMEPAGE = gql`
  query Pages {
    pages {
      ... on HomePage {
        id
        heroTitle
        heroImage {
          id
          title
          description
          width
          height
          src
          url
        }
      }
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(GET_HOMEPAGE, { client });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const homePage = data.pages.find(
    (page: any) => page.__typename === "HomePage"
  );
  console.log(data);
  return (
    <>
      <PrimaryHero
        title={data.pages[0].heroTitle}
        image={data.pages[0].heroImage.src}
      />
      <Container>
        <div className="pt-12 space-y-16">
          <RouteSpecialSection
            heading="Our Specials"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
          />
        </div>
      </Container>
      <div className="my-16 space-y-16">
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl text-center font-bold text-blue-500">
              Discover New Horizons
            </h2>
            <span className="block text-center">
              Lorem ipsum dolor sit amet, consectetusr adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua
            </span>
          </div>
          <div className="h-auto">
            <Slider />
          </div>
          <PrimaryButton text="Explore" />
        </div>
      </div>

      <div className="my-16 space-y-16">
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl text-center font-bold text-blue-500">
              Join Belama
            </h2>
            <span className="block text-center">
              Lorem ipsum dolor sit amet, consectetusr adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua
            </span>
          </div>

          <div className="relative w-full h-[30rem] mb-6">
            <Image
              src="/image.jpg"
              alt="Belama welcome area with tropical scene and refreshments"
              width={1000}
              height={300}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <PrimaryButton text="Join Now" />
        </div>
      </div>

      <Container>
        <div className="my-16 space-y-16">
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl text-center font-bold text-blue-500">
                All You Need
              </h2>
              <span className="block text-center">
                Lorem ipsum dolor sit amet, consectetusr adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <InfoCard
                title="Travel Alerts"
                description="Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles, pero la mayoría sufrió alteraciones en alguna manera, ya sea porque se le agregó humor,"
              />
              <InfoCard
                title="Check-In Information"
                description="Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles, pero la mayoría sufrió alteraciones en alguna manera, ya sea porque se le agregó humor,"
              />
              <InfoCard
                title="Travel Advice"
                description="Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles, pero la mayoría sufrió alteraciones en alguna manera, ya sea porque se le agregó humor,"
              />
              <InfoCard
                title="Baggage Information"
                description="Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles, pero la mayoría sufrió alteraciones en alguna manera, ya sea porque se le agregó humor,"
              />
              <InfoCard
                title="Conditions of Carriage"
                description="Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles, pero la mayoría sufrió alteraciones en alguna manera, ya sea porque se le agregó humor,"
              />
              <InfoCard
                title="Travel Alerts"
                description="Hay muchas variaciones de los pasajes de Lorem Ipsum disponibles, pero la mayoría sufrió alteraciones en alguna manera, ya sea porque se le agregó humor,"
              />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
