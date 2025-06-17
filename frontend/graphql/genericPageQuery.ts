import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";

// GraphQL query for GenericPage data
export const GET_GENERIC_PAGE_QUERY = gql`
  query GetGenericPage($slug: String!) {
    genericPage(slug: $slug) {
      __typename
      seoTitle
      description
      heroTitle
      heroImage {
        url
      }
      url
      content {
        blockType
        ... on SectionBlock {
          heading
          text
          imagePosition
          image {
            url
          }
        }
        ... on ImageBlock {
          blockType
          caption
          image {
            url
          }
        }
        ... on HeadingTextBlock {
          heading
          text
        }
        ... on GridCardSectionBlock {
          heading
          blocks {
            ... on ListBlock {
              items {
                blockType
                ... on GridCardBlock {
                  heading
                  text
                  image {
                    url
                  }
                }
              }
            }
            blockType
            field
          }
        }
        ... on TextBlock {
          value
        }
      }
    }
  }
`;

export interface GenericPage {
  __typename: string;
  seoTitle?: string;
  description?: string;
  heroTitle?: string;
  heroImage?: {
    url: string;
  };
  url: string;
  content: ContentBlock[];
}

interface ContentBlock {
  blockType: string;
  heading?: string;
  text?: string;
  imagePosition?: string;
  image?: {
    url: string;
  };
  caption?: string;
  value?: string;
  blocks?: {
    blockType: string;
    field?: string;
    items?: {
      blockType: string;
      heading?: string;
      text?: string;
      image?: {
        url: string;
      };
    }[];
  }[];
}

// Fetch GenericPage data
export async function fetchGenericPage(
  slug: string
): Promise<GenericPage | null> {
  try {
    const { data } = await client.query<{
      genericPage: GenericPage | null;
    }>({
      query: GET_GENERIC_PAGE_QUERY,
      variables: { slug },
    });
    return (
      data.genericPage || {
        __typename: "GenericPage",
        seoTitle: "Generic Page",
        description: "",
        heroTitle: "",
        heroImage: { url: "/default-hero.jpg" },
        url: "",
        content: [],
      }
    );
  } catch (error) {
    console.error("Error fetching GenericPage data:", error);
    return {
      __typename: "GenericPage",
      seoTitle: "Generic Page",
      description: "",
      heroTitle: "",
      heroImage: { url: "/default-hero.jpg" },
      url: "",
      content: [],
    };
  }
}
