// app/news/NewsIndexTemplate.tsx
"use client";

import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import SkeletonSecondaryHero from "@/components/layout/skeleton/SkeletonSecondaryHero";
import Container from "@/components/layout/Container";
import NewsCard from "@/components/ui/cards/NewsCard";
import SkeletonNewsCard from "@/components/layout/skeleton/SkeletonNewsCard";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import { useQuery } from "@apollo/client";
import client from "@/lib/apolloClient";
import { useState } from "react";
import {
  Article,
  NewsIndexPage,
  GET_NEWS_ARTICLES,
} from "@/graphql/NewsPageQuery";

interface NewsProps {
  initialPage: NewsIndexPage;
}

import parse from "html-react-parser";

export default function NewsIndexTemplate({ initialPage }: NewsProps) {
  const [offset, setOffset] = useState(0);
  const [articles, setArticles] = useState<Article[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const limit = 6;

  const {
    loading: articlesLoading,
    error: articlesError,
    fetchMore,
  } = useQuery(GET_NEWS_ARTICLES, {
    client,
    variables: { limit, offset: 0 },
    onCompleted: (data) => {
      setArticles(data.newsArticles);
      if (data.newsArticles.length < limit) {
        setHasMore(false);
      }
    },
  });

  // Handle loading and error states
  if (articlesError)
    return <p>Error loading articles: {articlesError.message}</p>;

  const loadMoreArticles = () => {
    fetchMore({
      variables: { limit, offset: offset + limit },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult || fetchMoreResult.newsArticles.length === 0) {
          setHasMore(false);
          return prev;
        }
        setOffset(offset + limit);
        setArticles([...articles, ...fetchMoreResult.newsArticles]);
        if (fetchMoreResult.newsArticles.length < limit) {
          setHasMore(false);
        }
        return {
          ...prev,
          newsArticles: [...prev.newsArticles, ...fetchMoreResult.newsArticles],
        };
      },
    });
  };

  const newsArticles =
    articlesLoading && articles.length === 0
      ? Array.from({ length: limit })
      : articles;

  return (
    <>
      {initialPage ? (
        <SecondaryHero
          title={initialPage.heroTitle}
          image={initialPage.heroImage?.url || "/default-hero.jpg"}
          breadcrumbs={initialPage.url}
        />
      ) : (
        <SkeletonSecondaryHero />
      )}
      <Container>
        <div className="py-6 sm:py-8 lg:py-12 px-4 sm:px-0 space-y-8 sm:space-y-12 lg:space-y-16">
          {initialPage.description && (
            <div className="mx-auto max-w-4xl">
              <div className="text-sm sm:text-base lg:text-lg text-center text-gray-700 leading-relaxed">
                {parse(initialPage.description)}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {newsArticles.map((article: any, index: number) =>
              article ? (
                <a 
                  href={article.url} 
                  key={article.id}
                  className="block transition-transform duration-200 hover:scale-105"
                >
                  <NewsCard
                    headline={article.articleTitle}
                    image={article.heroImage.url}
                    date={article.firstPublishedAt}
                    description={article.body}
                  />
                </a>
              ) : (
                <div key={index} className="w-full">
                  <SkeletonNewsCard />
                </div>
              )
            )}
          </div>
          {articlesLoading && articles.length === 0 ? (
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg h-10 sm:h-12 w-32 sm:w-40 animate-pulse"></div>
            </div>
          ) : (
            hasMore && (
              <div className="flex justify-center pt-4 sm:pt-6">
                <PrimaryButton
                  text="View More Articles"
                  onClick={loadMoreArticles}
                />
              </div>
            )
          )}
        </div>
      </Container>
    </>
  );
}
