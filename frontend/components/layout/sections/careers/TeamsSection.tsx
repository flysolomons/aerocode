"use client";
import React from "react";
import TeamsCarousel from "./TeamsCarousel";

interface ImageBlock {
  url: string;
}

interface DepartmentBlock {
  departmentName: string;
  description: string;
  image: ImageBlock;
}

interface TeamsSectionProps {
  departments?: DepartmentBlock[];
}

const TeamsSection = ({ departments = [] }: TeamsSectionProps) => {
  // Fallback data if no departments are provided
  const defaultTeams = [
    {
      title: "Flight Operations",
      description: "Pilots, cabin crew, and flight planning professionals",
      imageSrc: "/hero.jpg",
      imageAlt: "Flight Operations team",
    },
  ];

  // Convert departments to teams format for the carousel
  const teams =
    departments.length > 0
      ? departments.map((dept) => ({
          title: dept.departmentName,
          description: dept.description,
          imageSrc: dept.image.url || "/hero.jpg",
          imageAlt: `${dept.departmentName} team`,
        }))
      : defaultTeams;

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-500 mb-4">
            Find Your Team
          </h2>
          <p className="text-lg text-gray-600">
            Discover where your skills can take flight
          </p>
        </div>

        <TeamsCarousel
          teams={teams}
          options={{ align: "center", loop: true }}
        />
      </div>
    </section>
  );
};

export default TeamsSection;
