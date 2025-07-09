import { gql } from "@apollo/client";
import client from "../lib/apolloClient";

// Interface for the FlightSchedule query response
export interface FlightSchedulePage {
  heroTitle: string;
  heroImage: {
    url: string;
  };
  url: string;
  seoTitle: string;
  subTitle: string;
  description: string;
  __typename?: string;
}

export interface Schedule {
  id: string;
  startDate: string;
  endDate: string;
  snippetType: string;
  contentType: string;
  flights: Flight[];
}

export interface Flight {
  id: string;
  day: string;
  flightNumber: string;
  departurePort: string;
  arrivalPort: string;
  departureTime: string;
  arrivalTime: string;
  flightScope: string;
}

export interface ScheduleWithFlightData extends FlightSchedulePage {
  schedules: Schedule[];
}

export const GET_FLIGHT_SCHEDULE_PAGE_QUERY = gql`
  query GetFlightSchedulePage {
    pages(contentType: "explore.FlightSchedule") {
      ... on FlightSchedule {
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

export const GET_SCHEDULES_QUERY = gql`
  query GetSchedules {
    schedules {
      id
      startDate
      endDate
      snippetType
      contentType
      flights(limit: 100) {
        id
        day
        flightNumber
        departurePort
        arrivalPort
        departureTime
        arrivalTime
        flightScope
      }
    }
  }
`;

export async function fetchFlightSchedulePage(): Promise<ScheduleWithFlightData> {
  try {
    const [pageResult, schedulesResult] = await Promise.all([
      client.query({
        query: GET_FLIGHT_SCHEDULE_PAGE_QUERY,
      }),
      client.query({
        query: GET_SCHEDULES_QUERY,
      }),
    ]);

    const pageData = pageResult.data.pages.find(
      (page: any) => page.__typename === "FlightSchedule"
    ) || {
      heroTitle: "",
      heroImage: { url: "/default-hero.jpg" },
      url: "",
      seoTitle: "Flight Schedule",
      subTitle: "",
      description: "",
    };

    return {
      ...pageData,
      schedules: schedulesResult.data.schedules || [],
      __typename: "FlightSchedule",
    };
  } catch (error) {
    console.error("Error fetching Flight Schedule page data:", error);
    return {
      heroTitle: "",
      heroImage: { url: "/default-hero.jpg" },
      url: "",
      seoTitle: "Flight Schedule",
      subTitle: "",
      description: "",
      schedules: [],
      __typename: "FlightSchedule",
    };
  }
}
