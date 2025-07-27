import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";

export interface NewsIndexPage {
  heroTitle: string;
  heroImage: { url: string };
  url: string;
  seoTitle: string;
  subTitle: string;
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
        subTitle
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
  url: string;
  heroImage: {
    url: string;
  };
  category?: {
    name: string;
    slug: string;
  } | null;
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
      category {
        name
        slug
      }
    }
  }
`;

export interface NewsCategory {
  id: string;
  title: string;
  slug: string;
  categoryName: string;
}

export const GET_NEWS_CATEGORIES = gql`
  query GetNewsCategories {
    pages(contentType: "news.NewsCategoryPage") {
      ... on NewsCategoryPage {
        id
        title
        slug
        categoryName
      }
    }
  }
`;

// New interface for category pages
export interface NewsCategoryPage {
  id: string;
  title: string;
  slug: string;
  url: string;
  heroTitle: string;
  heroImage: {
    url: string;
  };
  categoryName: string;
  categoryDescription: string;
  subTitle: string;
  description: string;
}

// Query for fetching a specific category page
export const GET_CATEGORY_PAGE = gql`
  query GetCategoryPage($slug: String!) {
    newsCategoryPage(slug: $slug) {
      id
      title
      slug
      url
      heroTitle
      heroImage {
        url
      }
      categoryName
      categoryDescription
      subTitle
      description
    }
  }
`;

// Query for fetching articles within a category page
export const GET_CATEGORY_ARTICLES = gql`
  query GetCategoryArticles($categorySlug: String!) {
    newsCategoryPage(slug: $categorySlug) {
      id
      slug
      title
      children {
        ... on NewsArticle {
          id
          articleTitle
          body
          firstPublishedAt
          slug
          url
          heroImage {
            url
          }
          category {
            name
            slug
          }
        }
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
      subTitle: "",
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
      subTitle: "",
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
  category?: {
    name: string;
    slug: string;
  } | null;
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
      category {
        name
        slug
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
        category: null,
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
      category: null,
    };
  }
}

// Fetch function for category pages
export async function fetchNewsCategoryPage(slug: string): Promise<NewsCategoryPage | null> {
  try {
    const { data } = await client.query<{ newsCategoryPage: NewsCategoryPage | null }>({
      query: GET_CATEGORY_PAGE,
      variables: { slug },
    });
    
    return data.newsCategoryPage || {
      id: "",
      title: "",
      slug: "",
      url: "",
      heroTitle: "Category Not Found",
      heroImage: {
        url: "/default-hero.jpg",
      },
      categoryName: "",
      categoryDescription: "",
      subTitle: "",
      description: "",
    };
  } catch (error) {
    console.error("Error fetching NewsCategoryPage data:", error);
    return {
      id: "",
      title: "",
      slug: "",
      url: "",
      heroTitle: "Category Not Found",
      heroImage: {
        url: "/default-hero.jpg",
      },
      categoryName: "",
      categoryDescription: "",
      subTitle: "",
      description: "",
    };
  }
}

// Fetch function for articles within a category
export async function fetchCategoryArticles(
  categorySlug: string,
  limit: number = 6,
  offset: number = 0
): Promise<Article[]> {
  try {
    const { data } = await client.query<{ newsCategoryPage: { children: Article[] } }>({
      query: GET_CATEGORY_ARTICLES,
      variables: { categorySlug },
    });
    
    // Apply pagination manually since GraphQL children field doesn't support limit/offset
    const allChildren = data.newsCategoryPage?.children || [];
    return allChildren.slice(offset, offset + limit);
  } catch (error) {
    console.error("Error fetching category articles:", error);
    return [];
  }
}
