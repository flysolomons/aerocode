import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";

// Interface for image objects
export interface ImageBlock {
  url: string;
}

// Interface for document objects
export interface DocumentBlock {
  url: string;
}

// Interface for CompanyCultureHighlightBlock
export interface CompanyCultureHighlightBlock {
  title: string;
  description: string;
  image: ImageBlock;
}

// Interface for DepartmentBlock
export interface DepartmentBlock {
  departmentName: string;
  description: string;
  image: ImageBlock;
}

// Interface for BenefitBlock
export interface BenefitBlock {
  title: string;
  description: string;
}

// Interface for JobVacancy
export interface JobVacancy {
  positionTitle: string;
  departmentName: string;
  location: string;
  closingDate: string;
  document?: DocumentBlock;
}

// Interface for the CareersPage
export interface CareersPage {
  heroTitle: string;
  heroImage: ImageBlock;
  heroVideo: string;
  seoTitle: string;
  subTitle: string;
  url: string;
  cultureHighlights: CompanyCultureHighlightBlock[];
  departments: DepartmentBlock[];
  benefits: BenefitBlock[];
  __typename?: string;
}

// Interface for the Careers page query response
export interface CareersPageData {
  pages: CareersPage[];
  jobVacancies: JobVacancy[];
}

export const GET_CAREERS_PAGE_QUERY = gql`
  query Pages {
    pages(contentType: "about.CareersPage") {
      ... on CareersPage {
        heroTitle
        heroImage {
          url
        }
        heroVideo
        seoTitle
        subTitle
        url
        cultureHighlights {
          ... on CompanyCultureHighlightBlock {
            title
            description
            image {
              url
            }
          }
        }
        departments {
          ... on DepartmentBlock {
            departmentName
            description
            image {
              url
            }
          }
        }
        benefits {
          ... on BenefitBlock {
            title
            description
          }
        }
      }
    }
    jobVacancies {
      positionTitle
      departmentName
      location
      closingDate
      document {
        url
      }
    }
  }
`;

/**
 * Fetch Careers page data
 * @returns Promise with CareersPage data and JobVacancy data
 */
export async function fetchCareersPage(): Promise<{
  careersPage: CareersPage;
  jobVacancies: JobVacancy[];
}> {
  try {
    const { data } = await client.query<CareersPageData>({
      query: GET_CAREERS_PAGE_QUERY,
      errorPolicy: "all",
      fetchPolicy: "no-cache",
    });

    // Find the CareersPage from the pages array
    const careersPage = data?.pages?.find(
      (page: any) => page.__typename === "CareersPage"
    );

    if (!careersPage) {
      console.warn("No Careers page found in CMS, using fallback data");
      return {
        careersPage: {
          heroTitle: "Careers",
          heroImage: { url: "/default-hero.jpg" },
          heroVideo: "",
          seoTitle: "Careers",
          subTitle: "",
          url: "/careers",
          cultureHighlights: [],
          departments: [],
          benefits: [],
          __typename: "CareersPage",
        },
        jobVacancies: data?.jobVacancies || [],
      };
    }

    return {
      careersPage: {
        heroTitle: careersPage.heroTitle || "Careers",
        heroImage: careersPage.heroImage || { url: "/default-hero.jpg" },
        heroVideo: careersPage.heroVideo || "",
        seoTitle: careersPage.seoTitle || "Careers",
        subTitle: careersPage.subTitle || "",
        url: careersPage.url || "/careers",
        cultureHighlights: careersPage.cultureHighlights || [],
        departments: careersPage.departments || [],
        benefits: careersPage.benefits || [],
        __typename: "CareersPage",
      },
      jobVacancies: data?.jobVacancies || [],
    };
  } catch (error) {
    console.error("Error fetching Careers page data:", error);
    // Return fallback data instead of throwing
    return {
      careersPage: {
        heroTitle: "Careers",
        heroImage: { url: "/default-hero.jpg" },
        heroVideo: "",
        seoTitle: "Careers",
        subTitle: "",
        url: "/careers",
        cultureHighlights: [],
        departments: [],
        benefits: [],
        __typename: "CareersPage",
      },
      jobVacancies: [],
    };
  }
}

/**
 * Server-side function to fetch Careers page data
 * Use this in getStaticProps, getServerSideProps, or server components
 * @returns Promise with CareersPage data and JobVacancy data
 */
export async function fetchCareersPageServer(): Promise<{
  careersPage: CareersPage;
  jobVacancies: JobVacancy[];
}> {
  try {
    const { data } = await client.query<CareersPageData>({
      query: GET_CAREERS_PAGE_QUERY,
      fetchPolicy: "network-only", // Always fetch fresh data on server
      errorPolicy: "all",
    });

    // Find the CareersPage from the pages array
    const careersPage = data.pages.find(
      (page: any) => page.__typename === "CareersPage"
    );

    if (!careersPage) {
      console.warn("No Careers page found on server");
      return {
        careersPage: {
          heroTitle: "Careers",
          heroImage: { url: "/default-hero.jpg" },
          heroVideo: "",
          seoTitle: "Careers",
          subTitle: "",
          url: "/careers",
          cultureHighlights: [],
          departments: [],
          benefits: [],
          __typename: "CareersPage",
        },
        jobVacancies: data.jobVacancies || [],
      };
    }

    return {
      careersPage: {
        heroTitle: careersPage.heroTitle || "Careers",
        heroImage: careersPage.heroImage || { url: "/default-hero.jpg" },
        heroVideo: careersPage.heroVideo || "",
        seoTitle: careersPage.seoTitle || "Careers",
        subTitle: careersPage.subTitle || "",
        url: careersPage.url || "/careers",
        cultureHighlights: careersPage.cultureHighlights || [],
        departments: careersPage.departments || [],
        benefits: careersPage.benefits || [],
        __typename: "CareersPage",
      },
      jobVacancies: data.jobVacancies || [],
    };
  } catch (error) {
    console.error("Error fetching Careers page data on server:", error);
    return {
      careersPage: {
        heroTitle: "Careers",
        heroImage: { url: "/default-hero.jpg" },
        heroVideo: "",
        seoTitle: "Careers",
        subTitle: "",
        url: "/careers",
        cultureHighlights: [],
        departments: [],
        benefits: [],
        __typename: "CareersPage",
      },
      jobVacancies: [],
    };
  }
}

// Static fallback data in case of network failures
export const fallbackCareersPage: {
  careersPage: CareersPage;
  jobVacancies: JobVacancy[];
} = {
  careersPage: {
    heroTitle: "Careers",
    heroImage: { url: "/default-hero.jpg" },
    heroVideo: "",
    seoTitle: "Careers",
    subTitle: "Join Our Team",
    url: "/careers",
    cultureHighlights: [
      {
        title: "Island Paradise Workplace",
        description:
          "Work in one of the most beautiful destinations in the world",
        image: { url: "/default-culture.jpg" },
      },
      {
        title: "Family-First Culture",
        description: "We prioritize work-life balance and family values",
        image: { url: "/default-culture.jpg" },
      },
      {
        title: "Professional Growth",
        description: "Opportunities for development and career advancement",
        image: { url: "/default-culture.jpg" },
      },
    ],
    departments: [
      {
        departmentName: "Flight Operations",
        description: "Pilots, cabin crew, and flight planning professionals",
        image: { url: "/default-department.jpg" },
      },
      {
        departmentName: "Engineering & Maintenance",
        description: "Aircraft technicians, mechanics, and quality assurance",
        image: { url: "/default-department.jpg" },
      },
    ],
    benefits: [
      {
        title: "Health Insurance",
        description: "Comprehensive health coverage for you and your family",
      },
      {
        title: "Travel Benefits",
        description: "Staff travel discounts and free flights for employees",
      },
    ],
    __typename: "CareersPage",
  },
  jobVacancies: [
    {
      positionTitle: "Pilot",
      departmentName: "Flight Operations",
      location: "Honiara",
      closingDate: "2024-12-31",
      document: { url: "/pilot-vacancy.pdf" },
    },
  ],
};
