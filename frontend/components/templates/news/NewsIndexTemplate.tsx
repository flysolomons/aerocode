// app/news/NewsIndexTemplate.tsx
"use client";

import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import NewsCard from "@/components/ui/cards/NewsCard";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import { useQuery } from "@apollo/client";
import client from "@/lib/apolloClient";
import { useState } from "react";
import {
  Article,
  NewsIndexPage,
  NewsCategory,
  GET_NEWS_ARTICLES,
  GET_NEWS_CATEGORIES,
} from "@/graphql/NewsPageQuery";

interface NewsProps {
  initialPage: NewsIndexPage;
}

import parse from "html-react-parser";

export default function NewsIndexTemplate({ initialPage }: NewsProps) {
  const [offset, setOffset] = useState(0);
  const [articles, setArticles] = useState<Article[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const limit = 6;

  // Fetch categories
  const { data: categoriesData } = useQuery(GET_NEWS_CATEGORIES, {
    client,
  });

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

  // Filter articles by selected category
  const filteredArticles = selectedCategory
    ? articles.filter((article) => article.category?.slug === selectedCategory)
    : articles;

  const categories = categoriesData?.pages || [];

  const handleCategoryFilter = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug);
  };

  return (
    <>
      <SecondaryHero
        title={initialPage.heroTitle}
        image={initialPage.heroImage?.url || "/default-hero.jpg"}
        breadcrumbs={initialPage.url}
      />
      <Container>
        <div className="py-6 sm:py-8 lg:py-12 px-4 sm:px-0 space-y-8 sm:space-y-12 lg:space-y-16">
          {initialPage.description && (
            <div className="mx-auto w-full">
              <div className="text-sm sm:text-base lg:text-base text-left text-gray-700 leading-relaxed">
                {parse(initialPage.description)}
              </div>
            </div>
          )}

          {/* Category Filter Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs sm:text-sm font-medium text-gray-600">
                Filter by Topic
              </div>
              <div className="text-xs text-gray-400 sm:hidden">Swipe →</div>
            </div>
            <div
              className="flex gap-2 sm:gap-3 overflow-x-auto sm:flex-wrap scrollbar-hide pt-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <button
                onClick={() => handleCategoryFilter(null)}
                className={`relative flex-shrink-0 px-3 py-2 sm:px-4 sm:py-3 rounded-lg border transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === null
                    ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-yellow-400"
                }`}
              >
                <div className="text-xs sm:text-sm font-medium">All Topics</div>
                {selectedCategory === null && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>
              {categories.map((category: NewsCategory) => (
                <button
                  key={category.slug}
                  onClick={() => handleCategoryFilter(category.slug)}
                  className={`relative flex-shrink-0 px-3 py-2 sm:px-4 sm:py-3 rounded-lg border transition-all duration-200 whitespace-nowrap ${
                    selectedCategory === category.slug
                      ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-yellow-400"
                  }`}
                >
                  <div className="text-xs sm:text-sm font-medium">
                    {category.categoryName || category.title}
                  </div>
                  {selectedCategory === category.slug && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredArticles.map((article: any) => (
              <NewsCard
                key={article.id}
                headline={article.articleTitle}
                image={article.heroImage.url}
                date={article.firstPublishedAt}
                description={article.body}
                category={article.category}
                url={article.url}
              />
            ))}
          </div>
          {!articlesLoading && hasMore && filteredArticles.length > 0 && (
            <div className="flex justify-center pt-4 sm:pt-6">
              <PrimaryButton
                text="View More Articles"
                onClick={loadMoreArticles}
              />
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
