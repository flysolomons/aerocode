"use client";
import SecondaryHero from "@/components/layout/SecondaryHero";
import SkeletonSecondaryHero from "@/components/layout/skeleton/SkeletonSecondaryHero";
import Container from "@/components/common/Container";
import NewsCard from "@/components/common/NewsCard";
import SkeletonNewsCard from "@/components/layout/skeleton/SkeletonNewsCard";
import PrimaryButton from "@/components/common/PrimaryButton";
import { useQuery, gql } from "@apollo/client";
import client from "../../lib/apolloClient";
import { stripHtmlTags } from "../../lib/utils";

// Define a query for fetching hero data
const GET_HERO_DATA = gql`
  query GetHeroData {
    pages {
      ... on NewsIndexPage {
        heroTitle
        heroImage {
          src
        }
        url
      }
    }
  }
`;

// Define a query for fetching news articles
const GET_NEWS_ARTICLES = gql`
  query GetNewsArticles {
    pages(limit: 12, order: "-first_published_at") {
      ... on NewsArticle {
        id
        articleTitle
        body
        firstPublishedAt
        slug
        heroImage {
          src
        }
      }
    }
  }
`;

export default function News() {
  // Fetching both the hero data and articles data in one query
  const {
    loading: articlesLoading,
    error: articlesError,
    data: articlesData,
  } = useQuery(GET_NEWS_ARTICLES, { client });

  const {
    loading: heroLoading,
    error: heroError,
    data: heroData,
  } = useQuery(GET_HERO_DATA, { client });

  // Handle loading and error states (this needs to be more friendly)
  if (articlesError)
    return <p>Error loading articles: {articlesError.message}</p>;

  if (heroError) return <p>Error loading hero: {heroError.message}</p>;

  // Create a copy of the array before sorting to avoid modifying the immutable data
  const newsArticles = articlesLoading
    ? Array.from({ length: 6 }) // setting 6 cards for skeleton loading
    : [
        ...articlesData.pages.filter(
          (page: any) => page.__typename === "NewsArticle"
        ),
      ];

  const hero = heroLoading
    ? { heroTitle: "", heroImage: { src: "" }, url: "" }
    : heroData.pages.find(
        (page: any) => page.__typename === "NewsIndexPage"
      ) || {
        heroTitle: "",
        heroImage: { src: "/default-hero.jpg" },
        url: "",
      };

  console.log(articlesData);

  return (
    <>
      {heroLoading ? (
        <SkeletonSecondaryHero />
      ) : (
        hero && (
          <SecondaryHero
            title={hero.heroTitle}
            image={hero.heroImage?.src || "/default-hero.jpg"}
            breadcrumbs={hero.url}
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
                    image={article.heroImage.src}
                    date={article.firstPublishedAt}
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
