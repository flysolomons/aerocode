"use client";
import React from "react";
import BenefitsAccordion from "./BenefitsAccordion";

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
      title: "Health Insurance",
      description: "Comprehensive health coverage for you and your family, including medical, dental, and vision care."
    },
    {
      title: "Travel Benefits",
      description: "Staff travel discounts and free flights for employees and their families on Solomon Airlines routes."
    },
    {
      title: "Professional Development",
      description: "Training programs, workshops, and opportunities for career advancement within the aviation industry."
    },
    {
      title: "Flexible Work Arrangements",
      description: "Work-life balance with flexible scheduling options where possible, respecting operational requirements."
    },
    {
      title: "Retirement Planning",
      description: "Comprehensive pension and retirement savings plans to secure your financial future."
    },
    {
      title: "Performance Bonuses",
      description: "Merit-based bonuses and incentives recognizing outstanding performance and contributions."
    },
    {
      title: "Employee Assistance Program",
      description: "Confidential counseling and support services for personal and work-related challenges."
    },
    {
      title: "Island Living Benefits",
      description: "Special allowances and benefits for living and working in the beautiful Solomon Islands."
    }
  ];

  const benefitsList = benefits.length > 0 ? benefits : defaultBenefits;

  // Convert benefits to accordion format
  const accordionItems = benefitsList.map(benefit => ({
    title: benefit.title,
    content: (
      <div 
        className="text-gray-600 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: benefit.description }}
      />
    ),
  }));

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-500 mb-4">Benefits</h2>
          <p className="text-lg text-gray-600">
            Comprehensive packages designed for you
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Paragraph */}
          <div className="space-y-6">
            <div>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                At Solomon Airlines, we believe our employees are our most valuable asset. 
                That's why we offer a comprehensive benefits package designed to support 
                your health, career, and personal well-being.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                From competitive health coverage to unique travel benefits, we ensure 
                our team members have access to the resources they need to thrive both 
                personally and professionally in the aviation industry.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Join our family and enjoy the benefits of working for the Solomon Islands' 
                premier airline, where your contribution is valued and your future is secured.
              </p>
            </div>
          </div>

          {/* Right Side - Accordion */}
          <div>
            <BenefitsAccordion items={accordionItems} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;