"use client";
import SecondaryHero from "@/components/layout/SecondaryHero";
import Container from "@/components/common/Container";
import NewsCard from "@/components/common/NewsCard";
import PrimaryButton from "@/components/common/PrimaryButton";
import { useQuery, gql } from "@apollo/client";
import client from "../../lib/apolloClient";

const GET_NEWS_ARTICLES = gql`
  query GetArticles {
    pages {
      ... on NewsArticle {
        id
        articleTitle
        body
        date
        slug
      }
    }
  }
`;

const GET_HERO_DETAILS = gql`
  query GetHero {
    pages {
      ... on NewsIndexPage {
        heroTitle
        heroImage {
          id
          title
          description
          width
          height
          src
          url
        }
      }
    }
  }
`;

export default function News() {
  const {
    loading: articlesLoading,
    error: articlesError,
    data: articlesData,
  } = useQuery(GET_NEWS_ARTICLES, { client });
  const {
    loading: heroLoading,
    error: heroError,
    data: heroData,
  } = useQuery(GET_HERO_DETAILS, { client });

  if (articlesError)
    return <p>Error loading articles: {articlesError.message}</p>;
  if (heroError) return <p>Error loading hero: {heroError.message}</p>;

  // Improved Skeleton NewsCard with better proportions and shimmer
  const SkeletonNewsCard = () => (
    <div className="bg-white rounded shadow-md p-4 border border-gray-100">
      <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded mb-4"></div>
      <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full"></div>
    </div>
  );

  // Improved Skeleton Hero
  const SkeletonHero = () => (
    <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 h-[25rem] rounded animate-pulse"></div>
  );

  // Create a copy of the array before sorting to avoid modifying the immutable data
  const newsArticles = articlesLoading
    ? Array.from({ length: 6 }) // Assuming 6 cards as placeholder
    : [
        ...articlesData.pages.filter(
          (page: any) => page.__typename === "NewsArticle"
        ),
      ].sort((a: any, b: any) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

  // Get hero data from heroData or show skeleton
  const hero = heroLoading
    ? { heroTitle: "", heroImage: { src: "" } }
    : heroData.pages.find(
        (page: any) => page.__typename === "NewsIndexPage"
      ) || { heroTitle: "", heroImage: { src: "/default-hero.jpg" } };

  const stripHtmlTags = (html: string | undefined) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };

  return (
    <>
      {heroLoading ? (
        <SkeletonHero />
      ) : (
        hero && (
          <SecondaryHero
            title={hero.heroTitle}
            image={hero.heroImage?.src || "/default-hero.jpg"} // Fallback image if no hero image
            breadcrumbs="Home > News"
          />
        )
      )}
      <Container>
        <div className="py-12 space-y-16">
          <div className="grid grid-cols-3 gap-x-4 gap-y-8">
            {newsArticles.map((article: any, index: number) =>
              article ? (
                <a href={`/news/${article.slug}`} key={article.id}>
                  <NewsCard
                    headline={article.articleTitle}
                    image="/image.jpg"
                    date={new Date(article.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    description={
                      stripHtmlTags(article.body)?.substring(0, 200) + "..."
                    }
                  />
                </a>
              ) : (
                <div key={index} className="p-4">
                  <SkeletonNewsCard />
                </div>
              )
            )}
          </div>
          {articlesLoading ? (
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded h-10 w-40 animate-pulse"></div>
            </div>
          ) : (
            <PrimaryButton text="View More Articles" />
          )}
        </div>
      </Container>
    </>
  );
}
