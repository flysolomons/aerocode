"use client";
import React from "react";
import BenefitsAccordion from "./BenefitsAccordion";
import parse from "html-react-parser";

interface BenefitBlock {
  title: string;
  description: string;
}

interface BenefitsSectionProps {
  benefits?: BenefitBlock[];
}

const BenefitsSection = ({ benefits = [] }: BenefitsSectionProps) => {
  // Fallback data if no benefits are provided
  const defaultBenefits = [
    {
      title: "Travel Benefits",
      description:
        "Staff travel discounts and free flights for employees and their families on Solomon Airlines routes.",
    },
  ];

  const benefitsList = benefits.length > 0 ? benefits : defaultBenefits;

  // Convert benefits to accordion format
  const accordionItems = benefitsList.map((benefit) => ({
    title: benefit.title,
    content: (
      <div className="text-gray-600 leading-relaxed">
        {parse(benefit.description)}
      </div>
    ),
  }));

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-edmondsans text-blue-500 mb-4">
            Benefits
          </h2>
          <p className="text-base sm:text-lg text-gray-600 px-4">
            Comprehensive packages designed for you
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
          {/* Left Side - Paragraph */}
          <div className="space-y-4 sm:space-y-6 order-1 lg:order-1">
            <div>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-6">
                We aim to empower employees and their families to live
                healthily, travel, pursue learning, and access essential
                resources.
              </p>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-6">
                We provide comprehensive health coverage and exclusive travel
                perks to support our team members' personal and professional
                growth in the aviation industry.
              </p>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                We aim to offer competitive benefits across the country. While
                specific benefits may vary by work location, here's a look at
                some of our offerings.
              </p>
            </div>
          </div>

          {/* Right Side - Accordion */}
          <div className="order-2 lg:order-2">
            <BenefitsAccordion items={accordionItems} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
