// app/news/page.tsx
import { gql } from "@apollo/client";
import client from "../../lib/apolloClient";
import News from "./NewsClient"; // Import the client component

// Query for fetching hero data (same as before)
const GET_PAGE_DATA = gql`
  query GetHeroData {
    pages {
      ... on NewsIndexPage {
        heroTitle
        heroImage {
          url
        }
        url
        seoTitle
      }
    }
  }
`;

// Fetch hero data server-side
async function fetchHeroData() {
  try {
    const { data } = await client.query({ query: GET_PAGE_DATA });
    const hero = data.pages.find(
      (page: any) => page.__typename === "NewsIndexPage"
    ) || {
      heroTitle: "",
      heroImage: { url: "/default-hero.jpg" },
      url: "",
      seoTitle: "News",
    };
    return hero;
  } catch (error) {
    console.error("Error fetching hero data:", error);
    return {
      heroTitle: "",
      heroImage: { url: "/default-hero.jpg" },
      url: "",
      seoTitle: "News",
    };
  }
}

// Generate metadata
export async function generateMetadata() {
  const hero = await fetchHeroData();
  return {
    title: hero.seoTitle || "News",
    // Add other metadata like description if available
  };
}

// Server component that renders the client component
export default async function NewsPage() {
  const hero = await fetchHeroData();

  return <News initialHero={hero} />;
}
