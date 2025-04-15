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

// Combined GraphQL query
const GET_NEWS_PAGE_DATA = gql`
  query GetNewsPageData {
    pages {
      ... on NewsIndexPage {
        heroTitle
        heroImage {
          src
        }
      }
      ... on NewsArticle {
        id
        articleTitle
        body
        date
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
  } = useQuery(GET_NEWS_PAGE_DATA, { client });

  // Handle loading and error states (this needs to be more friendly)
  if (articlesError)
    return <p>Error loading articles: {articlesError.message}</p>;

  // Create a copy of the array before sorting to avoid modifying the immutable data
  const newsArticles = articlesLoading
    ? Array.from({ length: 6 }) // setting 6 cards for skeleton loading
    : [
        ...articlesData.pages.filter(
          (page: any) => page.__typename === "NewsArticle"
        ),
      ].sort((a: any, b: any) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

  const hero = articlesLoading
    ? { heroTitle: "", heroImage: { src: "" } }
    : articlesData.pages.find(
        (page: any) => page.__typename === "NewsIndexPage"
      ) || { heroTitle: "", heroImage: { src: "/default-hero.jpg" } };

  return (
    <>
      {articlesLoading ? (
        <SkeletonSecondaryHero />
      ) : (
        hero && (
          <SecondaryHero
            title={hero.heroTitle}
            image={hero.heroImage?.src || "/default-hero.jpg"}
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
                    image={article.heroImage.src}
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
