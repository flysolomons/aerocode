// import templates
import { notFound } from "next/navigation";
import GenericPageTemplate from "@/components/templates/generic/GenericPageTemplate";
import NewsIndexTemplate from "@/components/templates/news/NewsIndexTemplate";
import NewsCategoryTemplate from "@/components/templates/news/NewsCategoryTemplate";
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
import AboutPageTemplate from "@/components/templates/about/AboutPageTemplate";
import BelamaIndexPageTemplate from "@/components/templates/belama/BelamaIndexPageTemplate";
import BelamaSignUpPageTemplate from "@/components/templates/belama/BelamaSignUpPageTemplate";
import TravelAlertsPageTemplate from "@/components/templates/travel-alerts/TravelAlertsPageTemplate";
import ContactPageTemplate from "@/components/templates/contact/ContactPageTemplate";
import CareersPageTemplate from "@/components/templates/careers/CareersPageTemplate";

// import functions to fetch data
import { fetchPageType } from "@/graphql/pageTypeQuery";
import { fetchGenericPage } from "@/graphql/genericPageQuery";
import {
  fetchNewsIndexPage,
  fetchNewsCategoryPage,
} from "@/graphql/NewsPageQuery";
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
import { fetchAboutPage } from "@/graphql/AboutPageQuery";
import {
  fetchBelamaPage,
  fetchBelamaSignUpPage,
} from "@/graphql/BelamaPageQuery";
import { fetchTravelAlertPage } from "@/graphql/TravelAlertPageQuery";
import { fetchContactPage } from "@/graphql/ContactPageQuery";
import { fetchCareersPage } from "@/graphql/CareersPageQuery";

// Helper function to detect if this is a news category page URL
function isNewsCategoryUrl(fullPath: string): boolean {
  // Pattern: news/category-slug/ (but not news/category-slug/article-slug/)
  const newsPattern = /^news\/[^\/]+\/?$/;
  return newsPattern.test(fullPath);
}

// Helper function to detect if this is a news article under category URL
function isNewsArticleUnderCategoryUrl(fullPath: string): boolean {
  // Pattern: news/category-slug/article-slug/
  const newsArticlePattern = /^news\/[^\/]+\/[^\/]+\/?$/;
  return newsArticlePattern.test(fullPath);
}

// Fetch page data based on __typename
async function fetchPageData(slug: string, fullPath: string) {
  // Check for new category page structure first
  if (isNewsCategoryUrl(fullPath)) {
    try {
      const categoryData = await fetchNewsCategoryPage(slug);
      if (categoryData && categoryData.id) {
        return { ...categoryData, __typename: "NewsCategoryPage" };
      }
    } catch (error) {
      console.log(`⚠️ Category page not found, falling back to legacy routing`);
    }
  }

  // Check for article under category structure
  if (isNewsArticleUnderCategoryUrl(fullPath)) {
    // Try to fetch as article first, the backend will handle URL resolution
    try {
      const articleData = await fetchNewsArticlePage(slug);
      if (articleData && articleData.id) {
        return articleData;
      }
    } catch (error) {
      console.log(`⚠️ Article under category not found, trying legacy routing`);
    }
  }

  // Legacy system: Use page type detection
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
    case "AboutIndexPage":
      return fetchAboutPage();
    case "BelamaIndexPage":
      return fetchBelamaPage();
    case "BelamaSignUpPage":
      return fetchBelamaSignUpPage();
    case "TravelAlertPage":
      return fetchTravelAlertPage();
    case "ContactPage":
      return fetchContactPage();
    case "CareersPage":
      const careersData = await fetchCareersPage();
      return { ...careersData.careersPage, jobVacancies: careersData.jobVacancies };
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
  // console.log("Full Path:", fullPath);

  // workaround just to ignore these unexpected routes
  if (
    fullPath.startsWith(".well-known") ||
    fullPath.includes("com.chrome.devtools.json")
  ) {
    return;
  }

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
      case "NewsCategoryPage":
        return <NewsCategoryTemplate initialPage={page} />;
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
      case "AboutIndexPage":
        return <AboutPageTemplate initialPage={page} />;
      case "BelamaIndexPage":
        return <BelamaIndexPageTemplate initialPage={page} />;
      case "BelamaSignUpPage":
        return <BelamaSignUpPageTemplate initialPage={page} />;
      case "TravelAlertPage":
        return <TravelAlertsPageTemplate initialPage={page} />;
      case "ContactPage":
        return <ContactPageTemplate initialPage={page} />;
      case "CareersPage":
        return <CareersPageTemplate initialPage={page} />;
      default:
        notFound();
    }
  } catch (error) {
    console.error("Error fetching page data:", error);

    // If we're dealing with a news article, we can show a loading state
    // We need to check the URL pattern or structure to determine page type
    if (fullPath.startsWith("news/") && fullPath !== "news/") {
      return <NewsArticleTemplate />;
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
