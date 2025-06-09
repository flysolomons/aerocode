import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";

// Interface for menu items
export interface MenuItem {
  title: string;
  url: string;
  children?: MenuItem[];
}

// Interface for the header query response
export interface HeaderData {
  pages: MenuItem[];
}

export const GET_HEADER_MENU = gql`
  query HeaderMenu {
    pages(order: "path", inMenu: true) {
      title
      url
      children {
        title
        url
        children {
          title
          url
        }
      }
    }
  }
`;

/**
 * Fetch menu data for the site header
 * @returns Promise with an array of MenuItem objects
 */
export async function fetchHeaderMenu(): Promise<MenuItem[]> {
  try {
    const { data } = await client.query<HeaderData>({
      query: GET_HEADER_MENU,
      // Fetch fresh data each time to ensure menu is up-to-date
      fetchPolicy: "network-only",
    });

    if (!data.pages || data.pages.length === 0) {
      console.warn("No menu items found");
      return [];
    }

    return data.pages;
  } catch (error) {
    console.error("Error fetching header menu data:", error);
    return [];
  }
}
