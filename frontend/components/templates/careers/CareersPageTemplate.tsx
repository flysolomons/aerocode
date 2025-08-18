"use client";
import React from "react";
import CareersHero from "@/components/layout/sections/careers/CareersHero";
import LifeAtSolomonAirlinesSection from "@/components/layout/sections/careers/LifeAtSolomonAirlinesSection";
import TeamsSection from "@/components/layout/sections/careers/TeamsSection";
import BenefitsSection from "@/components/layout/sections/careers/BenefitsSection";
import OpportunitiesSection from "@/components/layout/sections/careers/OpportunitiesSection";
import CallToActionSection from "@/components/layout/sections/careers/CallToActionSection";
import { CareersPage, JobVacancy } from "@/graphql/CareersPageQuery";

interface CareersPageTemplateProps {
  initialPage: CareersPage & { jobVacancies?: JobVacancy[] };
}

const CareersPageTemplate = ({ initialPage }: CareersPageTemplateProps) => {
  return (
    <div className="min-h-screen">
      <CareersHero 
        heroTitle={initialPage.heroTitle}
        heroImage={initialPage.heroImage}
        heroVideo={initialPage.heroVideo}
        subTitle={initialPage.subTitle}
      />
      <LifeAtSolomonAirlinesSection 
        cultureHighlights={initialPage.cultureHighlights}
      />
      <TeamsSection 
        departments={initialPage.departments}
      />
      <BenefitsSection 
        benefits={initialPage.benefits}
      />
      <OpportunitiesSection 
        jobVacancies={initialPage.jobVacancies}
      />
      <CallToActionSection />
    </div>
  );
};

export default CareersPageTemplate;