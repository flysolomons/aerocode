// import templates
import { notFound } from "next/navigation";
import GenericPageTemplate from "@/components/templates/generic/GenericPageTemplate";
import NewsIndexTemplate from "@/components/templates/news/NewsIndexTemplate";
import NewsArticleTemplate from "@/components/templates/news/NewsArticleTemplate";
import ExperienceIndexTemplate from "@/components/templates/experience/ExperienceIndexTemplate";
import ExploreIndexTemplate from "@/components/templates/explore/ExploreIndexTemplate";
import DestinationIndexTemplate from "@/components/templates/explore/DestinationIndexTemplate";
import DestinationPageTemplate from "@/components/templates/explore/DestinationPageTemplate";
import WhereWeFlyTemplate from "@/components/templates/explore/WhereWeFlyTemplate";
import FlightScheduleTemplate from "@/components/templates/explore/FlightScheduleTemplate";
import RoutePageTemplate from "@/components/templates/explore/RoutePageTemplate";
import SpecialsIndexTemplate from "@/components/templates/explore/SpecialsIndexTemplate";
import SpecialPageTemplate from "@/components/templates/explore/SpecialPageTemplate";

// import functions to fetch data
import { fetchPageType } from "@/graphql/pageTypeQuery";
import { fetchGenericPage } from "@/graphql/genericPageQuery";
import { fetchNewsIndexPage } from "@/graphql/NewsPageQuery";
import { fetchNewsArticlePage } from "@/graphql/NewsPageQuery";
import { fetchExperienceIndexPage } from "@/graphql/ExperiencePageQuery";
import { fetchExploreIndexPage } from "@/graphql/ExplorePageQuery";
import { fetchDestinationIndexPage } from "@/graphql/DestinationIndexPageQuery";
import { fetchDestinationPage } from "@/graphql/DestinationPageQuery";
import { fetchRoutePage } from "@/graphql/RoutePageQuery";
import { fetchWhereWeFlyPage } from "@/graphql/WhereWeFlyPageQuery";
import { fetchFlightSchedulePage } from "@/graphql/FlightSchedulePageQuery";
import { fetchSpecialsIndexPage } from "@/graphql/SpecialsIndexPageQuery";
import { fetchSpecialPage } from "@/graphql/SpecialPageQuery";

// Fetch page data based on __typename
async function fetchPageData(slug: string, fullPath: string) {
  const pageType = await fetchPageType(slug);

  if (!pageType) {
    return null;
  }

  // Verify the page's normalized urlPath matches the full path
  if (pageType.url !== `/${fullPath}/`) {
    return null;
  }
  switch (pageType.__typename) {
    case "GenericPage":
      return fetchGenericPage(slug);
    case "NewsIndexPage":
      return fetchNewsIndexPage();
    case "NewsArticle":
      return fetchNewsArticlePage(slug);
    case "ExperienceIndexPage":
      return fetchExperienceIndexPage();
    case "ExploreIndexPage":
      return fetchExploreIndexPage();
    case "DestinationIndexPage":
      return fetchDestinationIndexPage();
    case "Destination":
      return fetchDestinationPage(slug);
    case "WhereWeFly":
      return fetchWhereWeFlyPage();
    case "FlightSchedule":
      return fetchFlightSchedulePage();
    case "Route":
      return fetchRoutePage(slug);
    case "SpecialsIndexPage":
      return fetchSpecialsIndexPage();
    case "Special":
      return fetchSpecialPage(slug);
    default:
      return null;
  }
}

// Generate metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const resolvedParams = await params;
  const fullPath = resolvedParams.slug.join("/"); // Full path for urlPath comparison
  const slug = resolvedParams.slug[resolvedParams.slug.length - 1] || ""; // Last segment as slug

  const pageType = await fetchPageType(slug);

  // Return default title if pageType is null
  if (!pageType) {
    return {
      title: "Page Not Found",
    };
  }

  // Check if paths match
  if (pageType.url !== `/${fullPath}/`) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: pageType.seoTitle || "Generic Page",
    // Add more to metadata as needed
  };
}

// Server component that renders the client component
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const resolvedParams = await params;
  const fullPath = resolvedParams.slug.join("/"); // Full path for urlPath comparison
  const slug = resolvedParams.slug[resolvedParams.slug.length - 1] || "";

  try {
    const page = await fetchPageData(slug, fullPath);

    // Trigger 404 if page is not found
    if (!page) {
      notFound();
    }

    // Determine the page type by checking multiple properties
    const pageType =
      page.__typename || (page.schedules ? "FlightSchedule" : null); // Render based on determined page type
    switch (pageType) {
      case "GenericPage":
        return <GenericPageTemplate initialPage={page} />;
      case "NewsIndexPage":
        return <NewsIndexTemplate initialPage={page} />;
      case "NewsArticle":
        return <NewsArticleTemplate data={page} />;
      case "ExperienceIndexPage":
        return <ExperienceIndexTemplate initialPage={page} />;
      case "ExploreIndexPage":
        return <ExploreIndexTemplate initialPage={page} />;
      case "DestinationIndexPage":
        return <DestinationIndexTemplate initialPage={page} />;
      case "Destination":
        return <DestinationPageTemplate initialPage={page} />;
      case "WhereWeFly":
        return <WhereWeFlyTemplate initialPage={page} />;
      case "FlightSchedule":
        return <FlightScheduleTemplate initialPage={page} />;
      case "Route":
        return <RoutePageTemplate initialPage={page} />;
      case "SpecialsIndexPage":
        return <SpecialsIndexTemplate initialPage={page} />;
      case "Special":
        return <SpecialPageTemplate initialPage={page} />;
      default:
        notFound();
    }
  } catch (error) {
    console.error("Error fetching page data:", error);

    // If we're dealing with a news article, we can show a loading state
    // We need to check the URL pattern or structure to determine page type
    if (fullPath.startsWith("news/") && fullPath !== "news/") {
      return <NewsArticleTemplate loading={true} />;
    }

    // For other page types, we'll trigger a 404
    notFound();
  }
}

// Optional: Generate static params for SSG
// export async function generateStaticParams() {
//   const GET_ALL_SLUGS_QUERY = gql`
//     query GetAllSlugs {
//       pages {
//         slug
//         urlPath
//       }
//     }
//   `;

//   try {
//     const { data } = await client.query<{ pages: { slug: string; urlPath: string }[] }>({
//       query: GET_ALL_SLUGS_QUERY,
//     });
//     return data.pages.map((page) => ({
//       slug: page.url.split('/').filter(Boolean), // Use urlPath to generate full path segments
//     }));
//   } catch (error) {
//     console.error('Error fetching slugs:', error);
//     return [];
//   }
// }
