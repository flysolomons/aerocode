import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";

// Interface for page chooser block
export interface PageChooserBlock {
  __typename?: string;
  page: {
    url: string;
  };
}

// Interface for mega menu item blocks
export interface MegaMenuItemBlock {
  __typename?: string;
  title: string;
  blocks?: (PageChooserBlock | { __typename?: string })[];
}

// Interface for mega menu column blocks
export interface MegaMenuColumnBlock {
  __typename?: string;
  columnTitle: string;
  blocks: {
    __typename?: string;
    items?: MegaMenuItemBlock[];
  }[];
}

// Interface for mega menu blocks
export interface MegaMenuBlock {
  __typename?: string;
  title: string;
  blocks: (
    | PageChooserBlock
    | { __typename?: string; items?: MegaMenuColumnBlock[] }
  )[];
}

// Interface for header menu
export interface HeaderMenu {
  name: string;
  menuItems: MegaMenuBlock[];
}

// Interface for the header query response
export interface HeaderData {
  headerMenus: HeaderMenu[];
}

export const GET_HEADER_MENU = gql`
  query HeaderMenus {
    headerMenus {
      name
      menuItems {
        ... on MegaMenuBlock {
          title
          blocks {
            ... on PageChooserBlock {
              page {
                url
              }
            }
            ... on ListBlock {
              items {
                ... on MegaMenuColumnBlock {
                  columnTitle
                  blocks {
                    ... on ListBlock {
                      items {
                        ... on MegaMenuItemBlock {
                          title
                          blocks {
                            ... on PageChooserBlock {
                              page {
                                url
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Helper interfaces for transformed data
export interface TransformedMegaMenuItemBlock {
  title: string;
  url?: string;
}

export interface TransformedMegaMenuColumnBlock {
  columnTitle: string;
  items: TransformedMegaMenuItemBlock[];
}

export interface TransformedMegaMenuBlock {
  title: string;
  url?: string;
  columns: TransformedMegaMenuColumnBlock[];
}

export interface TransformedHeaderMenu {
  name: string;
  menuItems: TransformedMegaMenuBlock[];
}

/**
 * Transform raw GraphQL data to a more usable structure
 */
function transformMegaMenuBlock(
  block: MegaMenuBlock
): TransformedMegaMenuBlock {
  const transformed: TransformedMegaMenuBlock = {
    title: block.title,
    columns: [],
  };

  // Safely handle blocks array
  if (!block.blocks || !Array.isArray(block.blocks)) {
    console.warn("Invalid blocks structure for menu item:", block.title);
    return transformed;
  }
  // Extract URL from PageChooserBlock if it exists
  const pageChooserBlock = block.blocks.find(
    (b) => b.__typename === "PageChooserBlock" && "page" in b
  ) as PageChooserBlock | undefined;
  if (pageChooserBlock) {
    transformed.url = pageChooserBlock.page.url;
  } // Extract columns from ListBlock
  const listBlock = block.blocks.find(
    (b) => b.__typename === "ListBlock" && "items" in b
  ) as { items: MegaMenuColumnBlock[] } | undefined;
  if (listBlock && listBlock.items) {
    transformed.columns = listBlock.items.map((column) => {
      // Find the ListBlock within the column's blocks (skip CharBlocks)
      const columnListBlock = column.blocks.find(
        (b) => b.__typename === "ListBlock" && "items" in b
      ) as { items: MegaMenuItemBlock[] } | undefined;

      return {
        columnTitle: column.columnTitle,
        items:
          columnListBlock?.items.map((item) => {
            const transformedItem: TransformedMegaMenuItemBlock = {
              title: item.title,
            };

            // Extract URL from PageChooserBlock if it exists (skip CharBlocks)
            const itemPageChooserBlock = item.blocks?.find(
              (b) => b.__typename === "PageChooserBlock" && "page" in b
            ) as PageChooserBlock | undefined;
            if (itemPageChooserBlock) {
              transformedItem.url = itemPageChooserBlock.page.url;
            }

            return transformedItem;
          }) || [],
      };
    });
  }

  return transformed;
}

/**
 * Transform raw header menu data to a more usable structure
 */
function transformHeaderMenuData(
  headerMenus: HeaderMenu[]
): TransformedHeaderMenu[] {
  if (!headerMenus || !Array.isArray(headerMenus)) {
    console.warn("Invalid headerMenus structure:", headerMenus);
    return [];
  }

  return headerMenus.map((menu) => ({
    name: menu.name,
    menuItems: Array.isArray(menu.menuItems)
      ? menu.menuItems.map(transformMegaMenuBlock)
      : [],
  }));
}
/**
 * Fetch menu data for the site header
 * @returns Promise with an array of TransformedHeaderMenu objects
 */
export async function fetchHeaderMenu(): Promise<TransformedHeaderMenu[]> {
  try {
    const { data } = await client.query<HeaderData>({
      query: GET_HEADER_MENU,
      // Cache for better performance since header menus are relatively static
      fetchPolicy: "cache-first",
      errorPolicy: "all",
    });

    // console.log("Raw GraphQL data:", JSON.stringify(data, null, 2));

    if (!data.headerMenus || data.headerMenus.length === 0) {
      console.warn("No menu items found");
      return [];
    }

    const transformed = transformHeaderMenuData(data.headerMenus);
    // console.log("Transformed data:", JSON.stringify(transformed, null, 2));

    return transformed;
  } catch (error) {
    console.error("Error fetching header menu data:", error);
    // Return empty array instead of throwing to prevent header from breaking
    return [];
  }
}

/**
 * Server-side function to fetch header menu data
 * Use this in getStaticProps, getServerSideProps, or server components
 * @returns Promise with an array of TransformedHeaderMenu objects
 */
export async function fetchHeaderMenuServer(): Promise<
  TransformedHeaderMenu[]
> {
  try {
    const { data } = await client.query<HeaderData>({
      query: GET_HEADER_MENU,
      fetchPolicy: "network-only", // Always fetch fresh data on server
      errorPolicy: "all",
    });

    // console.log("Server - Raw GraphQL data:", JSON.stringify(data, null, 2));

    if (!data.headerMenus || data.headerMenus.length === 0) {
      console.warn("No menu items found on server");
      return [];
    }

    const transformed = transformHeaderMenuData(data.headerMenus);
    // console.log("Server - Transformed data:", JSON.stringify(transformed, null, 2));

    return transformed;
  } catch (error) {
    console.error("Error fetching header menu data on server:", error);
    return [];
  }
}

// Static fallback data in case of network failures
export const fallbackHeaderMenu: TransformedHeaderMenu[] = [
  {
    name: "Main Navigation",
    menuItems: [
      {
        title: "Explore",
        url: "/explore",
        columns: [
          {
            columnTitle: "Destinations",
            items: [
              { title: "All Destinations", url: "/explore/destinations" },
              { title: "Flight Schedules", url: "/explore/flight-schedules" },
            ],
          },
        ],
      },
      {
        title: "Experience",
        url: "/experience",
        columns: [],
      },
      {
        title: "Belama",
        url: "/belama",
        columns: [],
      },
    ],
  },
];
