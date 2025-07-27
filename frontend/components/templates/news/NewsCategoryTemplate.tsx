"use client";

import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import NewsCard from "@/components/ui/cards/NewsCard";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import { useQuery } from "@apollo/client";
import client from "@/lib/apolloClient";
import { useState, useEffect } from "react";
import {
  Article,
  NewsCategoryPage,
  fetchCategoryArticles,
} from "@/graphql/NewsPageQuery";
import parse from "html-react-parser";

interface NewsCategoryProps {
  initialPage: NewsCategoryPage;
}

export default function NewsCategoryTemplate({
  initialPage,
}: NewsCategoryProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 6;

  // Fetch articles for this category
  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const categoryArticles = await fetchCategoryArticles(
          initialPage.slug,
          limit,
          0
        );
        setArticles(categoryArticles);
        setHasMore(categoryArticles.length === limit);
        setOffset(categoryArticles.length);
      } catch (error) {
        console.error("Error loading category articles:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    if (initialPage.slug) {
      loadArticles();
    }
  }, [initialPage.slug, limit]);

  const loadMoreArticles = async () => {
    try {
      const moreArticles = await fetchCategoryArticles(
        initialPage.slug,
        limit,
        offset
      );

      if (moreArticles.length > 0) {
        setArticles((prev) => [...prev, ...moreArticles]);
        setOffset((prev) => prev + moreArticles.length);
        setHasMore(moreArticles.length === limit);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more articles:", error);
      setHasMore(false);
    }
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

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {Array.from({ length: limit }).map((_, index) => (
                <div key={index} className="w-full">
                  <div className="p-2 sm:p-3 lg:p-2 rounded-xl sm:rounded-2xl lg:rounded-2xl shadow-md bg-gray-200 h-[24rem] sm:h-[28rem] lg:h-[30rem] w-full animate-pulse"></div>
                </div>
              ))}
            </div>
          )}

          {/* Articles Grid */}
          {!loading && articles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {articles.map((article: Article) => (
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
          )}

          {/* No Articles State */}
          {!loading && articles.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto max-w-md">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No articles yet
                </h3>
                <p className="text-gray-500">
                  There are no articles in this category at the moment. Check
                  back later for new content.
                </p>
              </div>
            </div>
          )}

          {/* Load More Button */}
          {!loading && articles.length > 0 && hasMore && (
            <div className="flex justify-center pt-4 sm:pt-6">
              <PrimaryButton
                text="View More Articles"
                onClick={loadMoreArticles}
              />
            </div>
          )}

          {/* Back to All News Link */}
          <div className="flex justify-center pt-4 sm:pt-6">
            <a
              href="/news/"
              className="text-blue-500 hover:underline text-sm sm:text-base font-medium"
            >
              ← Back to All News
            </a>
          </div>
        </div>
      </Container>
    </>
  );
}
