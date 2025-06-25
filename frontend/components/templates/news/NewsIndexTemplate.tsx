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
import { stripHtmlTags } from "@/lib/utils";
import { useState } from "react";
import {
  Article,
  NewsIndexPage,
  GET_NEWS_ARTICLES,
} from "@/graphql/NewsPageQuery";

interface NewsProps {
  initialPage: NewsIndexPage;
}

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
        <div className="py-12 space-y-16">
          {initialPage.description && (
            <div className="mx-auto w-full">
              <p className="text-sm sm:text-base lg:text-base text-center text-gray-700 leading-relaxed">
                {initialPage.description}
              </p>
            </div>
          )}
          <div className="grid grid-cols-3 gap-x-4 gap-y-8">
            {newsArticles.map((article: any, index: number) =>
              article ? (
                <a href={article.url} key={article.id}>
                  <NewsCard
                    headline={article.articleTitle}
                    image={article.heroImage.url}
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
          {articlesLoading && articles.length === 0 ? (
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded h-10 w-40 animate-pulse"></div>
            </div>
          ) : (
            hasMore && (
              <div className="flex justify-center">
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
