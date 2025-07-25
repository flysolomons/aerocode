"use client";
import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import SkeletonSecondaryHero from "@/components/layout/skeleton/SkeletonSecondaryHero";
import Container from "@/components/layout/Container";
import OtherNewsSection from "@/components/layout/sections/OtherNewsSection";
import { NewsArticle } from "@/graphql/NewsPageQuery";

interface NewsArticleProps {
  data?: NewsArticle;
  loading?: boolean;
}

export default function NewsArticleTemplate({
  data,
  loading = false,
}: NewsArticleProps) {
  const SkeletonArticleContent = () => (
    <div className="space-y-4 sm:space-y-6 bg-white p-4 sm:p-6 lg:p-8 shadow-md rounded-2xl sm:rounded-3xl animate-pulse min-h-[40rem] sm:min-h-[50rem] lg:min-h-[60rem]">
      <div className="h-8 sm:h-10 lg:h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4"></div>
      <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2 mb-4"></div>
      <div className="space-y-3 sm:space-y-4">
        {Array.from({ length: 15 }).map((_, index) => (
          <div
            key={index}
            className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full"
          ></div>
        ))}
      </div>
    </div>
  );

  const SkeletonOtherNews = () => (
    <div className="h-[20rem] sm:h-[25rem] lg:h-[30rem] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-2xl sm:rounded-3xl shadow-md animate-pulse"></div>
  );

  if (loading) {
    return (
      <>
        <SkeletonSecondaryHero />
        <Container>
          <div className="py-6 sm:py-8 lg:py-12 px-4 sm:px-0">
            <div className="flex flex-col lg:grid lg:grid-cols-[1fr_350px] gap-6 sm:gap-8 lg:gap-12">
              <div>
                <SkeletonArticleContent />
              </div>
              <div className="lg:order-last">
                <SkeletonOtherNews />
              </div>
            </div>
          </div>
        </Container>
      </>
    );
  }

  // Make sure data is available
  if (!data) {
    return <div>Article not found</div>;
  }

  return (
    <>
      <SecondaryHero
        title={data.heroTitle}
        image={data.heroImage.url}
        breadcrumbs={data.url}
      />
      <Container>
        <div className="py-6 sm:py-8 lg:py-12 px-4 sm:px-0">
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_350px] gap-6 sm:gap-8 lg:gap-12">
            <article className="space-y-4 sm:space-y-6 bg-white p-4 sm:p-6 lg:p-8 shadow-md rounded-2xl sm:rounded-3xl">
              <header className="space-y-3 sm:space-y-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-500 leading-tight">
                  {data.articleTitle}
                </h1>
                <div className="text-sm sm:text-base text-gray-500 font-medium">
                  {new Date(data.firstPublishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </header>
              <div
                className="prose prose-sm sm:prose lg:prose-lg max-w-none 
                           prose-headings:text-blue-500 prose-headings:font-semibold
                           prose-p:text-gray-700 prose-p:leading-relaxed
                           prose-a:text-blue-500 prose-a:hover:underline
                           prose-ul:text-gray-700 prose-ol:text-gray-700
                           prose-blockquote:text-gray-600 prose-blockquote:border-blue-200
                           prose-img:rounded-lg prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: data.body }}
              />
            </article>

            <aside className="lg:order-last">
              <OtherNewsSection />
            </aside>
          </div>
        </div>
      </Container>
    </>
  );
}
