import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";

const GET_PAGE_TYPE_QUERY = gql`
  query GetPageType($slug: String!) {
    page(slug: $slug) {
      __typename
      id
      seoTitle
      urlPath
    }
  }
`;

interface PageType {
  __typename: string;
  id: string;
  seoTitle?: string;
  urlPath: string;
}

// Fetch page type by slug (last segment of the path)
export async function fetchPageType(slug: string): Promise<PageType | null> {
  try {
    const { data } = await client.query<{ page: PageType | null }>({
      query: GET_PAGE_TYPE_QUERY,
      variables: { slug },
    });
    return data.page || null;
  } catch (error) {
    console.error("Error fetching page type:", error);
    return null;
  }
}
