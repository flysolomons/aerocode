// import templates
import { notFound } from "next/navigation";
import GenericPageTemplate from "@/components/templates/generic/GenericPageTemplate";
import NewsIndexTemplate from "@/components/templates/news/NewsIndexTemplate";
import NewsArticleTemplate from "@/components/templates/news/NewsArticleTemplate";

// import functions to fetch data
import { fetchPageType } from "@/graphql/pageTypeQuery";
import { fetchGenericPage } from "@/graphql/genericPageQuery";
import { fetchNewsIndexPage } from "@/graphql/NewsPageQuery";
import { fetchNewsArticlePage } from "@/graphql/NewsPageQuery";

// Fetch page data based on __typename
async function fetchPageData(slug: string, fullPath: string) {
  const pageType = await fetchPageType(slug);

  if (!pageType) {
    return null;
  }

  const pathSegments = pageType.urlPath.split("/").filter(Boolean);
  const normalizedUrlPath =
    pathSegments.length > 1
      ? `/${pathSegments.slice(1).join("/")}/`
      : pageType.urlPath;

  // Verify the page's normalized urlPath matches the full path
  if (normalizedUrlPath !== `/${fullPath}/`) {
    return null;
  }

  switch (pageType.__typename) {
    case "GenericPage":
      return fetchGenericPage(slug);
    // Add other page types here (e.g., NewsIndexPage)
    case "NewsIndexPage":
      return fetchNewsIndexPage();
    case "NewsArticle":
      return fetchNewsArticlePage(slug);
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

  const pathSegments = pageType.urlPath.split("/").filter(Boolean);
  const normalizedUrlPath =
    pathSegments.length > 1
      ? `/${pathSegments.slice(1).join("/")}/`
      : pageType.urlPath;

  // Check if paths match
  if (normalizedUrlPath !== `/${fullPath}/`) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: pageType.seoTitle || "Generic Page",
    // Add description if seoDescription is added to schema
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
  const slug = resolvedParams.slug[resolvedParams.slug.length - 1] || ""; // Last segment as slug

  // For server components in Next.js, we can use React Suspense boundaries
  // to handle loading states, but we'll keep our approach simple

  try {
    const page = await fetchPageData(slug, fullPath);

    // Trigger 404 if page is not found
    if (!page) {
      notFound();
    }

    // Render based on __typename
    switch (page.__typename) {
      case "GenericPage":
        return <GenericPageTemplate initialPage={page} />;
      case "NewsIndexPage":
        return <NewsIndexTemplate initialPage={page} />;
      case "NewsArticle":
        return <NewsArticleTemplate data={page} />;
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
//       slug: page.urlPath.split('/').filter(Boolean), // Use urlPath to generate full path segments
//     }));
//   } catch (error) {
//     console.error('Error fetching slugs:', error);
//     return [];
//   }
// }
