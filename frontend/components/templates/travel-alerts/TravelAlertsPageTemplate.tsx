"use client";
import { useState, useEffect } from "react";
import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import parse from "html-react-parser";
import { TravelAlertPage, TravelAlert } from "@/graphql/TravelAlertPageQuery";

interface TravelAlertsPageTemplateProps {
  initialPage: TravelAlertPage;
}

export default function TravelAlertsPageTemplate({
  initialPage,
}: TravelAlertsPageTemplateProps) {
  // Now initialPage is directly the page data
  const pageData = initialPage;

  return (
    <>
      <SecondaryHero
        title={pageData.heroTitle}
        image={pageData.heroImage?.url || "/hero3.jpg"}
        breadcrumbs={pageData.url}
      />
      <Container>
        <div className="py-12 sm:py-12 lg:py-16 space-y-12 sm:space-y-16 lg:space-y-20 px-4 sm:px-6">
          {pageData.subTitle && (
            <div className="mx-auto w-full">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                {pageData.subTitle}
              </h2>
            </div>
          )}

          {pageData.description && (
            <div className="mx-auto w-full">
              <div className="text-sm sm:text-base lg:text-base text-gray-700 leading-relaxed">
                {parse(pageData.description)}
              </div>
            </div>
          )}

          {/* Display all alerts */}
          {pageData.allAlerts && pageData.allAlerts.length > 0 && (
            <div className="mx-auto w-full">
              <div className="space-y-6">
                {pageData.allAlerts.map((alert: TravelAlert, index: number) => (
                  <div
                    key={index}
                    className={`p-6 rounded-lg border ${
                      alert.isActive
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {alert.title}
                        </h4>
                        <div className="text-gray-700 mb-3">
                          {parse(alert.content)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(alert.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {alert.isActive && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Latest
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
