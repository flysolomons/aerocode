"use client";
import SecondaryHero from "@/components/layout/SecondaryHero";
import SkeletonSecondaryHero from "@/components/layout/skeleton/SkeletonSecondaryHero";
import Container from "@/components/common/Container";
import OtherNewsSection from "@/components/layout/OtherNewsSection";
import { useQuery, gql } from "@apollo/client";
import client from "../../../lib/apolloClient";
import { useParams } from "next/navigation";

const GET_ARTICLE = gql`
  query GetArticle($slug: String!) {
    page(slug: $slug) {
      ... on NewsArticle {
        id
        url
        firstPublishedAt
        articleTitle
        body
        heroTitle
        heroImage {
          id
          title
          description
          width
          height
          src
          url
        }
      }
    }
  }
`;

export default function NewsArticle() {
  const params = useParams();
  const slug = params.slug as string;

  const { loading, error, data } = useQuery(GET_ARTICLE, {
    variables: { slug },
    client,
  });

  if (error) return <p>Error: {error.message}</p>;
  if (!data?.page && !loading) return <p>Article not found</p>;

  const SkeletonArticleContent = () => (
    <div className="space-y-6 bg-white p-4 shadow-md rounded-3xl animate-pulse h-[60rem]">
      <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2 mb-4"></div>
      <div className="space-y-4">
        {Array.from({ length: 20 }).map((_, index) => (
          <div
            key={index}
            className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-full"
          ></div>
        ))}
      </div>
    </div>
  );

  const SkeletonOtherNews = () => (
    <div className="h-[25rem] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded shadow-md animate-pulse"></div>
  );

  if (loading) {
    return (
      <>
        <SkeletonSecondaryHero />
        <Container>
          <div className="py-12">
            <div className="grid grid-cols-[65%_35%] space-x-16">
              <div>
                <SkeletonArticleContent />
              </div>
              <div>
                <SkeletonOtherNews />
              </div>
            </div>
          </div>
        </Container>
      </>
    );
  }

  const article = data.page;

  return (
    <>
      <SecondaryHero
        title={article.heroTitle}
        image={article.heroImage.src}
        breadcrumbs={article.url}
      />
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-[65%_35%] space-x-16">
            <div className="space-y-6 bg-white p-4 shadow-md rounded-3xl">
              <h1 className="text-4xl font-bold text-blue-500 mb-2">
                {article.articleTitle}
              </h1>
              <div className="text-sm text-gray-500">
                {new Date(article.firstPublishedAt).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )}
              </div>
              <div
                className="space-y-4"
                dangerouslySetInnerHTML={{ __html: article.body }}
              />
            </div>

            <div className="h-[25rem]">
              <OtherNewsSection />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
