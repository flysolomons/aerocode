import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";

// GraphQL query for GenericPage data
export const GET_GENERIC_PAGE_QUERY = gql`
  query GetGenericPage($slug: String!) {
    genericPage(slug: $slug) {
      __typename
      seoTitle
      subTitle
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
          backgroundColor
        }
        ... on ImageBlock {
          blockType
          caption
          image {
            url
          }
          backgroundColor
        }
        ... on HeadingTextBlock {
          heading
          text
        }
        ... on GridCardSectionBlock {
          heading
          backgroundColor
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
          }
        }
        ... on FullWidthImageBlock {
          blockType
          caption
          image {
            url
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
  subTitle?: string;
  description?: string;
  heroTitle?: string;
  heroImage?: {
    url: string;
  };
  url: string;
  content: ContentBlock[];
}

interface ImageType {
  url: string;
}

interface GridCardBlock {
  blockType: string;
  heading?: string;
  text?: string;
  image?: ImageType;
}

interface ListBlock {
  blockType: string;
  field?: string;
  items?: GridCardBlock[];
}

interface SectionBlock {
  blockType: "SectionBlock";
  heading?: string;
  text?: string;
  imagePosition?: string;
  image?: ImageType;
  backgroundColor?: string;
}

interface ImageBlock {
  blockType: "ImageBlock";
  caption?: string;
  image?: ImageType;
  backgroundColor?: string;
}

interface HeadingTextBlock {
  blockType: "HeadingTextBlock";
  heading?: string;
  text?: string;
}

interface FullWidthImageBlock {
  blockType: "FullWidthImageBlock";
  caption?: string;
  image?: ImageType;
}

interface TextBlock {
  blockType: "TextBlock";
  value?: string;
}

interface GridCardSectionBlock {
  blockType: "GridCardSectionBlock";
  heading?: string;
  backgroundColor?: string;
  blocks?: ListBlock[];
}

type ContentBlock =
  | SectionBlock
  | ImageBlock
  | HeadingTextBlock
  | FullWidthImageBlock
  | TextBlock
  | GridCardSectionBlock;

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

    return data.genericPage || null;
  } catch (error) {
    console.error("Error fetching GenericPage data:", error);
    return null;
  }
}
