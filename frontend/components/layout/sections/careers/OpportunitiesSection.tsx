"use client";
import React from "react";

interface DocumentBlock {
  url: string;
}

interface JobVacancy {
  positionTitle: string;
  departmentName: string;
  location: string;
  closingDate: string;
  document?: DocumentBlock;
}

interface OpportunitiesSectionProps {
  jobVacancies?: JobVacancy[];
}

const OpportunitiesSection = ({ jobVacancies = [] }: OpportunitiesSectionProps) => {
  // Fallback data if no job vacancies are provided
  const defaultVacancies = [
    {
      positionTitle: "Commercial Pilot",
      departmentName: "Flight Operations",
      location: "Honiara",
      closingDate: "2024-12-31",
      document: { url: "/pilot-vacancy.pdf" }
    },
    {
      positionTitle: "Aircraft Maintenance Engineer",
      departmentName: "Engineering & Maintenance",
      location: "Honiara",
      closingDate: "2024-12-15",
      document: { url: "/engineer-vacancy.pdf" }
    },
    {
      positionTitle: "Customer Service Representative",
      departmentName: "Customer Service",
      location: "Honiara",
      closingDate: "2025-01-15",
      document: { url: "/customer-service-vacancy.pdf" }
    }
  ];

  const vacancies = jobVacancies.length > 0 ? jobVacancies : defaultVacancies;

  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  if (vacancies.length === 0) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-500 mb-4">
              Opportunities
            </h2>
            <p className="text-lg text-gray-600">
              Current openings across our operations
            </p>
          </div>

          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              No Current Openings
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              We don't have any open positions at the moment, but we're always looking for talented individuals to join our team.
            </p>
            <p className="text-gray-600">
              Please check back regularly for new opportunities or connect with us on LinkedIn to stay updated.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-500 mb-4">
            Opportunities
          </h2>
          <p className="text-lg text-gray-600">
            Current openings across our operations
          </p>
        </div>

        <div>
          <ul className="space-y-4">
            {vacancies.map((vacancy, index) => (
              <li key={index} className={index < vacancies.length - 1 ? "border-b pb-4" : ""}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {vacancy.positionTitle}
                    </h3>
                    <p className="text-gray-600">
                      {vacancy.departmentName} • {vacancy.location} • Closes: {formatDate(vacancy.closingDate)}
                    </p>
                  </div>
                  {vacancy.document?.url ? (
                    <a
                      href={vacancy.document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Details
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  ) : (
                    <div className="text-gray-400 text-sm">
                      Details coming soon
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default OpportunitiesSection;