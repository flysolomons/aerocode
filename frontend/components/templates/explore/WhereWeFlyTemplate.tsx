"use client";
import { useState } from "react";
import Image from "next/image";
import SecondaryHero from "@/components/layout/SecondaryHero";
import Container from "@/components/common/Container";
import Recommendations from "@/components/layout/Recommendations";
import RadioButton from "@/components/common/RadioButton";
import { WhereWeFlyPage } from "@/graphql/WhereWeFlyPageQuery";

interface WhereWeFlyProps {
  initialPage: WhereWeFlyPage;
}

export default function WhereWeFlyTemplate({ initialPage }: WhereWeFlyProps) {
  const [showInternational, setShowInternational] = useState(true);

  return (
    <>
      <SecondaryHero
        title={initialPage.heroTitle}
        image={initialPage.heroImage?.url || "/hero.jpg"}
        breadcrumbs={initialPage.url}
      />
      <Container>
        <div className="py-12 space-y-16">
          {/* Description */}
          <span className="block text-center">
            {initialPage.description}
          </span>{" "}
          {/* Toggle between International and Domestic routes */}
          <div className="flex justify-center">
            <RadioButton
              optionOne="International"
              optionTwo="Domestic"
              initialSelected="one"
              onOptionChange={(option) =>
                setShowInternational(option === "one")
              }
            />
          </div>
          {/* Map image showing routes */}
          <div className="w-full relative">
            <Image
              src={
                showInternational
                  ? initialPage.internationalRoutes.url
                  : initialPage.domesticRoutes.url
              }
              alt={`Where We Fly: ${
                showInternational ? "International" : "Domestic"
              }`}
              width={1128}
              height={770}
              className="rounded-3xl"
            />
          </div>
          {/* Additional content could go here */}
        </div>
      </Container>
    </>
  );
}
