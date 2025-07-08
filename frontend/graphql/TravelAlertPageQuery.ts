import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";

// Interface for individual travel alert
export interface TravelAlert {
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  contentType: string;
}

// Interface for TravelAlertPage
export interface TravelAlertPage {
  heroTitle: string;
  heroImage: {
    url: string;
  };
  url: string;
  subTitle: string;
  description: string;
  seoTitle: string;
  allAlerts: TravelAlert[];
}

// Interface for the complete query response
export interface TravelAlertPageQueryResponse {
  pages: TravelAlertPage[];
}

// GraphQL query
const GET_TRAVEL_ALERT_PAGE_QUERY = gql`
  query GetTravelAlertPage {
    pages(contentType: "alerts.TravelAlertPage") {
      ... on TravelAlertPage {
        heroTitle
        heroImage {
          url
        }
        url
        subTitle
        description
        seoTitle
        allAlerts {
          title
          content
          isActive
          createdAt
          contentType
        }
      }
    }
  }
`;

// Interface for active travel alert page
export interface ActiveTravelAlertPage {
  activeAlert: {
    title: string;
    content: string;
    isActive: boolean;
    createdAt: string;
  };
}

// Interface for active travel alert query response
export interface ActiveTravelAlertQueryResponse {
  pages: ActiveTravelAlertPage[];
}

// GraphQL query for active travel alert
const GET_ACTIVE_TRAVEL_ALERT_QUERY = gql`
  query GetActiveTravelAlert {
    pages(contentType: "alerts.TravelAlertPage") {
      ... on TravelAlertPage {
        activeAlert {
          title
          content
          isActive
          createdAt
        }
      }
    }
  }
`;

// Fetch function
export async function fetchTravelAlertPage(): Promise<TravelAlertPageQueryResponse> {
  const { data } = await client.query({
    query: GET_TRAVEL_ALERT_PAGE_QUERY,
  });
  return data;
}

// Fetch function for active travel alert
export async function fetchActiveTravelAlert(): Promise<ActiveTravelAlertQueryResponse> {
  const { data } = await client.query({
    query: GET_ACTIVE_TRAVEL_ALERT_QUERY,
  });
  return data;
}
