import { gql } from "@apollo/client";
import client from "../lib/apolloClient";

// Interface for the ExperienceIndexPage query response
export interface ExperienceIndexPage {
  heroTitle: string;
  heroImage: {
    url: string;
  };
  url: string;
  seoTitle: string;
  description: string;
  __typename?: string;
  children?: ChildPage[];
}

export interface ChildPage {
  url: string;
  title: string;
  heroImage?: {
    url: string;
  };
  __typename?: string;
}

export const GET_EXPERIENCE_INDEX_PAGE_QUERY = gql`
  query GetExperienceIndexPage {
    pages(contentType: "experience.ExperienceIndexPage") {
      ... on ExperienceIndexPage {
        heroTitle
        heroImage {
          url
        }
        url
        seoTitle
        description
      }
      children {
        url
        title
        ... on GenericPage {
          heroImage {
            url
          }
        }
      }
    }
  }
`;

export async function fetchExperienceIndexPage(): Promise<ExperienceIndexPage> {
  try {
    const { data } = await client.query({
      query: GET_EXPERIENCE_INDEX_PAGE_QUERY,
    });

    const pageData = data.pages.find(
      (page: any) => page.__typename === "ExperienceIndexPage"
    ) || {
      heroTitle: "",
      heroImage: { url: "/default-hero.jpg" },
      url: "",
      seoTitle: "Experience",
      description: "",
      children: [],
    };

    return pageData;
  } catch (error) {
    console.error("Error fetching experience page data:", error);
    return {
      heroTitle: "",
      heroImage: { url: "/default-hero.jpg" },
      url: "",
      seoTitle: "Experience",
      description: "",
      children: [],
    };
  }
}
