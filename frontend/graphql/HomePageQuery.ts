import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";

// Interface for the HomePage itself
export interface HomePage {
  heroTitle: string;
  heroImage: {
    url: string;
  };
  __typename?: string;
}

// Interface for the HomePage query response
export interface HomePageData {
  pages: HomePage[]; // Even though we only expect one, the API returns an array
}

export const GET_HOMEPAGE = gql`
  query Pages {
    pages(contentType: "home.HomePage") {
      ... on HomePage {
        heroTitle
        heroImage {
          url
        }
      }
    }
  }
`;

export async function fetchHomePage(): Promise<HomePage> {
  try {
    const { data } = await client.query<HomePageData>({
      query: GET_HOMEPAGE,
    });
    // Since we know there is only one homepage, we can assume the first item
    // exists and is the homepage we want
    if (!data.pages[0]) {
      throw new Error("No homepage data found");
    }

    return data.pages[0];
  } catch (error) {
    console.error("Error fetching HomePage data:", error);
    throw error;
  }
}
