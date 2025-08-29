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
      includeFlightUpgradeWidget
      includeManageBookingWidget
      content {
        blockType
        ... on GenericSectionBlock {
          heading
          text
          imagePosition
          image {
            url
          }
        }
        ... on GenericSectionBlock {
          heading
          text
        
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
                  url
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
        ... on DataTableBlock {
          tableData
        }
        ... on AccordionBlock {
          title
          blocks {
            ... on ListBlock {
              items {
                ... on AccordionItemBlock {
                  heading
                  content
                }
              }
            }
          }
        }
        ... on SimpleDropdownBlock {
          heading
          content
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
  includeManageBookingWidget: boolean;
  includeFlightUpgradeWidget: boolean;
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
  url?: string;
}

interface ListBlock {
  blockType: string;
  field?: string;
  items?: GridCardBlock[];
}

interface SectionBlock {
  blockType: "GenericSectionBlock";
  heading?: string;
  text?: string;
  imagePosition?: string;
  image?: ImageType;
}
interface GenericSectionBlock {
  blockType: "GenericSectionBlock";
  heading?: string;
  text?: string;
  imagePosition?: string;
  image?: ImageType;
}

interface ImageBlock {
  blockType: "ImageBlock";
  caption?: string;
  image?: ImageType;
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

interface TableData {
  cell: any[];
  data: string[][];
  mergeCells: any[];
  table_caption?: string;
  first_col_is_header: boolean;
  table_header_choice: string;
  first_row_is_table_header: boolean;
}

interface DataTableBlock {
  blockType: "DataTableBlock";
  tableData: TableData;
}

export interface AccordionItemBlock {
  blockType?: "AccordionItemBlock";
  heading?: string;
  content?: string;
}

export interface AccordionListBlock {
  blockType: string;
  items?: AccordionItemBlock[];
}

export interface AccordionBlock {
  blockType: "AccordionBlock";
  title?: string;
  blocks?: AccordionListBlock[];
}

export interface SimpleDropdownBlock {
  blockType: "SimpleDropdownBlock";
  heading?: string;
  content?: string;
}

type ContentBlock =
  | SectionBlock
  | GenericSectionBlock
  | ImageBlock
  | HeadingTextBlock
  | FullWidthImageBlock
  | TextBlock
  | GridCardSectionBlock
  | DataTableBlock
  | AccordionBlock
  | SimpleDropdownBlock;

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
      fetchPolicy: "network-only", // Always fetch fresh data from the server
    });

    return data.genericPage || null;
  } catch (error) {
    console.error("Error fetching GenericPage data:", error);
    return null;
  }
}
