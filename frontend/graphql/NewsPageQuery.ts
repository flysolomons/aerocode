import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";

export interface NewsIndexPage {
  heroTitle: string;
  heroImage: { url: string };
  url: string;
  seoTitle: string;
  description: string;
}

const GET_NEWS_INDEX_PAGE_QUERY = gql`
  query GetNewsIndexPage {
    pages(contentType: "news.NewsIndexPage") {
      ... on NewsIndexPage {
        heroTitle
        heroImage {
          url
        }
        url
        seoTitle
        description
      }
    }
  }
`;

// Define a type for the articles
export interface Article {
  id: string;
  articleTitle: string;
  body: string;
  firstPublishedAt: string;
  slug: string;
  heroImage: {
    url: string;
  };
}

// Modify the GET_NEWS_ARTICLES query
export const GET_NEWS_ARTICLES = gql`
  query GetNewsArticles($limit: PositiveInt, $offset: PositiveInt) {
    newsArticles(limit: $limit, offset: $offset, order: "-first_published_at") {
      id
      articleTitle
      body
      firstPublishedAt
      slug
      url
      heroImage {
        url
      }
    }
  }
`;

export async function fetchNewsIndexPage() {
  try {
    const { data } = await client.query({ query: GET_NEWS_INDEX_PAGE_QUERY });
    const pageData = data.pages.find(
      (page: any) => page.__typename === "NewsIndexPage"
    ) || {
      heroTitle: "",
      heroImage: { url: "/default-hero.jpg" },
      url: "",
      seoTitle: "News",
      description: "",
    };
    return pageData;
  } catch (error) {
    console.error("Error fetching news index page data:", error);
    return {
      heroTitle: "",
      heroImage: { url: "/default-hero.jpg" },
      url: "",
      seoTitle: "News",
      description: "",
    };
  }
}
export interface NewsArticle {
  id: string;
  url: string;
  firstPublishedAt: string;
  articleTitle: string;
  body: string;
  heroTitle: string;
  heroImage: {
    id: string;
    title: string;
    description: string;
    width: number;
    height: number;
    src: string;
    url: string;
  };
}

export const GET_ARTICLE = gql`
  query GetArticle($slug: String!) {
    newsArticle(slug: $slug) {
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
`;

export async function fetchNewsArticlePage(
  slug: string
): Promise<NewsArticle | null> {
  try {
    const { data } = await client.query<{ newsArticle: NewsArticle | null }>({
      query: GET_ARTICLE,
      variables: { slug },
    });
    return (
      data.newsArticle || {
        id: "",
        url: "",
        firstPublishedAt: "",
        articleTitle: "",
        body: "",
        heroTitle: "",
        heroImage: {
          id: "",
          title: "",
          description: "",
          width: 0,
          height: 0,
          src: "",
          url: "/default-hero.jpg",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching NewsArticle data:", error);
    return {
      id: "",
      url: "",
      firstPublishedAt: "",
      articleTitle: "",
      body: "",
      heroTitle: "",
      heroImage: {
        id: "",
        title: "",
        description: "",
        width: 0,
        height: 0,
        src: "",
        url: "/default-hero.jpg",
      },
    };
  }
}
