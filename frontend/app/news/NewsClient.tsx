// app/news/NewsClient.tsx
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
import { useState } from "react";

// Define a type for the articles
interface Article {
  id: string;
  articleTitle: string;
  body: string;
  firstPublishedAt: string;
  slug: string;
  heroImage: {
    url: string;
  };
}

// Define a type for the hero prop
interface Hero {
  heroTitle: string;
  heroImage: { url: string };
  url: string;
}

// Modify the GET_NEWS_ARTICLES query
const GET_NEWS_ARTICLES = gql`
  query GetNewsArticles($limit: Int, $offset: Int) {
    newsArticles(limit: $limit, offset: $offset, order: "-first_published_at") {
      id
      articleTitle
      body
      firstPublishedAt
      slug
      heroImage {
        url
      }
    }
  }
`;

interface NewsProps {
  initialHero: Hero;
}

export default function NewsClient({ initialHero }: NewsProps) {
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
      {initialHero ? (
        <SecondaryHero
          title={initialHero.heroTitle}
          image={initialHero.heroImage?.url || "/default-hero.jpg"}
          breadcrumbs={initialHero.url}
        />
      ) : (
        <SkeletonSecondaryHero />
      )}
      <Container>
        <div className="py-12 space-y-16">
          <div className="grid grid-cols-3 gap-x-4 gap-y-8">
            {newsArticles.map((article: any, index: number) =>
              article ? (
                <a href={`/news/${article.slug}`} key={article.id}>
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
