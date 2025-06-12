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
  linkPage?: string;
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

// Interface for footer menu items (ListBlock containing columns)
export interface FooterMenuItem {
  __typename?: string;
  items?: MegaMenuColumnBlock[];
}

// Interface for footer menu
export interface FooterMenu {
  name: string;
  menuItems: FooterMenuItem[];
}

// Interface for the footer query response
export interface FooterData {
  footerMenus: FooterMenu[];
}

export const GET_FOOTER_MENU = gql`
  query FooterMenus {
    footerMenus {
      name
      menuItems {
        ... on ListBlock {
          items {
            ... on MegaMenuColumnBlock {
              columnTitle
              blocks {
                ... on ListBlock {
                  items {
                    ... on MegaMenuItemBlock {
                      title
                      linkPage
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
`;

// Helper interfaces for transformed data
export interface TransformedFooterMenuItem {
  title: string;
  url?: string;
}

export interface TransformedFooterColumn {
  columnTitle: string;
  items: TransformedFooterMenuItem[];
}

export interface TransformedFooterMenu {
  name: string;
  columns: TransformedFooterColumn[];
}

/**
 * Transform raw GraphQL data to a more usable structure
 */
function transformFooterMenuData(
  footerMenus: FooterMenu[]
): TransformedFooterMenu[] {
  if (!footerMenus || !Array.isArray(footerMenus)) {
    console.warn("Invalid footerMenus structure:", footerMenus);
    return [];
  }

  return footerMenus.map((menu) => {
    const transformedMenu: TransformedFooterMenu = {
      name: menu.name,
      columns: [],
    };

    // Process menu items (which are ListBlocks containing columns)
    if (Array.isArray(menu.menuItems)) {
      menu.menuItems.forEach((menuItem) => {
        // Each menuItem is a ListBlock containing MegaMenuColumnBlocks
        if (menuItem.items && Array.isArray(menuItem.items)) {
          menuItem.items.forEach((column) => {
            const transformedColumn: TransformedFooterColumn = {
              columnTitle: column.columnTitle,
              items: [],
            };

            // Find the ListBlock within the column's blocks
            const columnListBlock = column.blocks.find(
              (b) => b.__typename === "ListBlock" && "items" in b
            ) as { items: MegaMenuItemBlock[] } | undefined;

            if (columnListBlock && columnListBlock.items) {
              transformedColumn.items = columnListBlock.items.map((item) => {
                const transformedItem: TransformedFooterMenuItem = {
                  title: item.title,
                };

                // Extract URL from PageChooserBlock if it exists
                const itemPageChooserBlock = item.blocks?.find(
                  (b) => b.__typename === "PageChooserBlock" && "page" in b
                ) as PageChooserBlock | undefined;

                if (itemPageChooserBlock) {
                  transformedItem.url = itemPageChooserBlock.page.url;
                }

                return transformedItem;
              });
            }

            transformedMenu.columns.push(transformedColumn);
          });
        }
      });
    }

    return transformedMenu;
  });
}

/**
 * Fetch footer menu data
 * @returns Promise with an array of TransformedFooterMenu objects
 */
export async function fetchFooterMenu(): Promise<TransformedFooterMenu[]> {
  try {
    const { data } = await client.query<FooterData>({
      query: GET_FOOTER_MENU,
      // Cache for better performance since footer menus are relatively static
      fetchPolicy: "cache-first",
      errorPolicy: "all",
    });

    // console.log("Footer - Raw GraphQL data:", JSON.stringify(data, null, 2));

    if (!data.footerMenus || data.footerMenus.length === 0) {
      console.warn("No footer menu items found");
      return [];
    }

    const transformed = transformFooterMenuData(data.footerMenus);
    // console.log("Footer - Transformed data:", JSON.stringify(transformed, null, 2));

    return transformed;
  } catch (error) {
    console.error("Error fetching footer menu data:", error);
    // Return empty array instead of throwing to prevent footer from breaking
    return [];
  }
}

/**
 * Server-side function to fetch footer menu data
 * Use this in getStaticProps, getServerSideProps, or server components
 * @returns Promise with an array of TransformedFooterMenu objects
 */
export async function fetchFooterMenuServer(): Promise<
  TransformedFooterMenu[]
> {
  try {
    const { data } = await client.query<FooterData>({
      query: GET_FOOTER_MENU,
      fetchPolicy: "network-only", // Always fetch fresh data on server
      errorPolicy: "all",
    });

    // console.log("Footer Server - Raw GraphQL data:", JSON.stringify(data, null, 2));

    if (!data.footerMenus || data.footerMenus.length === 0) {
      console.warn("No footer menu items found on server");
      return [];
    }

    const transformed = transformFooterMenuData(data.footerMenus);
    // console.log("Footer Server - Transformed data:", JSON.stringify(transformed, null, 2));

    return transformed;
  } catch (error) {
    console.error("Error fetching footer menu data on server:", error);
    return [];
  }
}

// Static fallback data in case of network failures
export const fallbackFooterMenu: TransformedFooterMenu[] = [
  {
    name: "Footer Navigation",
    columns: [
      {
        columnTitle: "Destinations",
        items: [
          { title: "All Destinations", url: "/explore/destinations" },
          { title: "Honiara", url: "/explore/destinations/honiara" },
          { title: "Gizo", url: "/explore/destinations/gizo" },
          { title: "Munda", url: "/explore/destinations/munda" },
        ],
      },
      {
        columnTitle: "Services",
        items: [
          { title: "Flight Schedules", url: "/explore/flight-schedules" },
          { title: "Belama Express", url: "/belama" },
          { title: "Charter Services", url: "/services/charter" },
          { title: "Cargo Services", url: "/services/cargo" },
        ],
      },
      {
        columnTitle: "Information",
        items: [
          { title: "About Us", url: "/about" },
          { title: "News", url: "/news" },
          { title: "Contact", url: "/contact" },
          { title: "Terms & Conditions", url: "/terms" },
        ],
      },
      {
        columnTitle: "Support",
        items: [
          { title: "Customer Service", url: "/support" },
          { title: "Travel Requirements", url: "/travel-requirements" },
          { title: "Baggage Policy", url: "/baggage" },
          { title: "FAQ", url: "/faq" },
        ],
      },
    ],
  },
];
