"use client";
import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import OtherNewsSection from "@/components/layout/sections/OtherNewsSection";
import { NewsArticle } from "@/graphql/NewsPageQuery";
import parse, { HTMLReactParserOptions, Element } from "html-react-parser";

interface NewsArticleProps {
  data?: NewsArticle;
}

export default function NewsArticleTemplate({ data }: NewsArticleProps) {
  // Make sure data is available
  if (!data) {
    return <div>Article not found</div>;
  }

  // Parser options to handle image URLs
  const parseOptions: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name === "img") {
        const src = domNode.attribs?.src;
        if (src && src.startsWith("/media/")) {
          // Convert relative media URLs to absolute URLs
          const absoluteSrc = `${process.env.NEXT_PUBLIC_STORAGE_URL}${src}`;
          
          // Extract attributes and convert class to className
          const { class: classAttr, ...otherAttribs } = domNode.attribs;
          
          return (
            <img
              {...otherAttribs}
              src={absoluteSrc}
              className={`${classAttr || ""} rounded-lg shadow-md w-full h-auto max-w-full mx-auto my-6`}
              loading="lazy"
              suppressHydrationWarning={true}
            />
          );
        }
      }
    },
  };

  return (
    <>
      <SecondaryHero
        title={data.heroTitle}
        image={data.heroImage.url}
        breadcrumbs={data.url}
      />
      <Container>
        <div className="py-6 sm:py-8 lg:py-12">
          <article className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            <header className="space-y-4 sm:space-y-6 px-4 sm:px-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-500 leading-tight">
                {data.articleTitle}
              </h1>
              <div className="text-sm sm:text-base text-gray-500 font-medium flex items-center gap-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
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
                <span>
                  {new Date(data.firstPublishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                {data.category && (
                  <>
                    <span>•</span>
                    <a
                      href={`/news/${data.category.slug}`}
                      className="text-blue-500 hover:underline"
                    >
                      {data.category.name}
                    </a>
                  </>
                )}
              </div>
            </header>
            <div
              className="prose prose-sm sm:prose lg:prose-lg max-w-none px-4 sm:px-6
                         prose-headings:text-blue-500 prose-headings:font-semibold
                         prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 prose-p:mt-0
                         prose-a:text-blue-500 prose-a:hover:underline
                         prose-ul:text-gray-700 prose-ol:text-gray-700
                         prose-blockquote:text-gray-600 prose-blockquote:border-blue-200
                         prose-img:rounded-lg prose-img:shadow-md prose-img:w-full prose-img:h-auto
                         prose-img:max-w-full prose-img:mx-auto prose-img:my-6
                         [&_img]:rounded-lg [&_img]:shadow-md [&_img]:w-full [&_img]:h-auto
                         [&_img]:max-w-full [&_img]:mx-auto [&_img]:my-6
                         [&_p]:mb-4 [&_p]:mt-0"
            >
              {parse(data.body, parseOptions)}
            </div>
          </article>
        </div>
      </Container>
    </>
  );
}
