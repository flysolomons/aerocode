import { gql } from "@apollo/client";
import client from "../lib/apolloClient";

// Interface for contact method
export interface ContactMethod {
  methodType: string;
  contactValue: string;
}

// Interface for contact method list block
export interface ContactMethodListBlock {
  items: ContactMethod[];
}

// Interface for contact subcategory
export interface ContactSubcategory {
  subcategoryName: string;
  blocks: (object | ContactMethodListBlock)[];
}

// Interface for contact subcategory list block
export interface ContactSubcategoryListBlock {
  items: ContactSubcategory[];
}

// Interface for contact category block
export interface ContactCategoryBlock {
  blockType: "ContactCategoryBlock";
  categoryName: string;
  categoryDescription: string;
  blocks: (object | ContactSubcategoryListBlock)[];
}

// Interface for contact sections
export interface ContactSection {
  blockType: string;
  categoryName?: string;
  categoryDescription?: string;
  blocks?: (object | ContactSubcategoryListBlock)[];
}

// Interface for the ContactPage query response
export interface ContactPage {
  seoTitle: string;
  subTitle: string;
  description: string;
  heroTitle: string;
  heroImage: {
    url: string;
  };
  url: string;
  contactSections: ContactSection[];
  __typename?: string;
}

// GraphQL query for ContactPage
export const GET_CONTACT_PAGE_QUERY = gql`
  query GetContactPage {
    pages(contentType: "contact.ContactPage") {
      ... on ContactPage {
        seoTitle
        subTitle
        description
        heroTitle
        heroImage {
          url
        }
        url
        contactSections {
          blockType
          ... on ContactCategoryBlock {
            categoryName
            categoryDescription
            blocks {
              ... on ListBlock {
                items {
                  ... on ContactSubcategoryBlock {
                    subcategoryName
                    blocks {
                      ... on ListBlock {
                        items {
                          ... on ContactMethodBlock {
                            methodType
                            contactValue
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

// Helper function to parse contact methods from blocks
export function parseContactMethods(blocks: (object | ContactMethodListBlock)[]): ContactMethod[] {
  const contactMethods: ContactMethod[] = [];
  
  blocks.forEach(block => {
    if (typeof block === 'object' && block !== null && 'items' in block) {
      const listBlock = block as ContactMethodListBlock;
      contactMethods.push(...listBlock.items);
    }
  });
  
  return contactMethods;
}

// Helper function to parse subcategories from blocks
export function parseSubcategories(blocks: (object | ContactSubcategoryListBlock)[]): ContactSubcategory[] {
  const subcategories: ContactSubcategory[] = [];
  
  blocks.forEach(block => {
    if (typeof block === 'object' && block !== null && 'items' in block) {
      const listBlock = block as ContactSubcategoryListBlock;
      subcategories.push(...listBlock.items);
    }
  });
  
  return subcategories;
}

// Helper function to organize contact data
export function organizeContactData(contactSections: ContactSection[]) {
  return contactSections.map(section => {
    if (section.blockType === "ContactCategoryBlock" && section.blocks) {
      const subcategories = parseSubcategories(section.blocks);
      
      return {
        categoryName: section.categoryName,
        categoryDescription: section.categoryDescription,
        subcategories: subcategories.map(subcategory => ({
          name: subcategory.subcategoryName,
          contactMethods: parseContactMethods(subcategory.blocks)
        }))
      };
    }
    
    return {
      categoryName: section.categoryName,
      categoryDescription: section.categoryDescription,
      subcategories: []
    };
  });
}

// Fetch ContactPage data
export async function fetchContactPage(): Promise<ContactPage | null> {
  try {
    const { data } = await client.query<{
      pages: ContactPage[];
    }>({
      query: GET_CONTACT_PAGE_QUERY,
    });

    const pageData = data.pages.find(
      (page: any) => page.__typename === "ContactPage"
    ) as ContactPage;

    if (!pageData) {
      return {
        seoTitle: "Contact Us",
        subTitle: "",
        description: "",
        heroTitle: "Contact Us",
        heroImage: { url: "/default-hero.jpg" },
        url: "/contact/",
        contactSections: [],
      };
    }

    return pageData;
  } catch (error) {
    console.error("Error fetching ContactPage data:", error);
    return null;
  }
}