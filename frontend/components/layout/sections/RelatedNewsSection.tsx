"use client";

import { useEffect, useState } from "react";
import { Article, fetchRelatedArticles } from "@/graphql/NewsPageQuery";
import Image from "next/image";

interface RelatedNewsSectionProps {
  categorySlug: string;
  currentArticleSlug: string;
  categoryName: string;
}

interface RelatedNewsCardProps {
  article: Article;
}

function RelatedNewsCard({ article }: RelatedNewsCardProps) {
  const formattedDate = new Date(article.firstPublishedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  return (
    <a href={article.url} className="group block">
      <div className="flex items-start space-x-4 p-4 bg-white hover:bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 relative overflow-hidden rounded-lg group-hover:scale-105 transition-transform duration-200">
            <Image
              src={article.heroImage.url}
              alt={article.articleTitle}
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-blue-500 hover:text-blue-600 font-semibold text-sm sm:text-base leading-tight mb-2 line-clamp-2 transition-colors duration-200">
            {article.articleTitle}
          </h3>
          <div className="flex items-center text-xs sm:text-sm text-gray-500 gap-2">
            <svg
              className="w-3 h-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 6v6l4 2" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </a>
  );
}

function RelatedNewsSection({
  categorySlug,
  currentArticleSlug,
  categoryName,
}: RelatedNewsSectionProps) {
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRelatedArticles = async () => {
      try {
        setLoading(true);
        const articles = await fetchRelatedArticles(
          categorySlug,
          currentArticleSlug,
          3
        );
        setRelatedArticles(articles);
      } catch (error) {
        console.error("Error loading related articles:", error);
        setRelatedArticles([]);
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug && currentArticleSlug) {
      loadRelatedArticles();
    }
  }, [categorySlug, currentArticleSlug]);

  // Don't render if no related articles or still loading
  if (loading || relatedArticles.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 py-8 sm:py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-500 mb-2">
            In Other News
          </h2>
          <p className="text-gray-600">
            Discover other articles in this category
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6">
          {relatedArticles.map((article) => (
            <RelatedNewsCard key={article.id} article={article} />
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href={`/news/${categorySlug}`}
            className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 sm:py-3 bg-blue-500 text-white font-medium text-base sm:text-sm rounded-full sm:rounded-full hover:bg-blue-600 transition-colors duration-200 touch-manipulation"
          >
            View More
            <svg
              className="ml-2 w-5 h-5 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default RelatedNewsSection;
