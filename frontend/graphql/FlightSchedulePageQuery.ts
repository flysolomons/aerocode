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

export const GET_FLIGHT_SCHEDULE_PAGE_QUERY = gql`
  query GetFlightSchedules {
    pages(contentType: "explore.FlightSchedule") {
      ... on FlightSchedule {
        heroTitle
        heroImage {
          url
        }
        description
        seoTitle
        url
      }
    }
    schedules {
      id
      startDate
      endDate
      snippetType
      contentType
      flights {
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

export interface ScheduleWithFlightData extends FlightSchedulePage {
  schedules: Schedule[];
}

export async function fetchFlightSchedulePage(): Promise<ScheduleWithFlightData> {
  try {
    const { data } = await client.query({
      query: GET_FLIGHT_SCHEDULE_PAGE_QUERY,
    });

    // Extract the schedule data from the query response
    const schedules = data.schedules || [];

    // Extract page data if available (from the first matching page)
    const pageData = data.pages && data.pages.length > 0 ? data.pages[0] : null;

    // Combine page data with schedules
    const result: ScheduleWithFlightData = {
      heroTitle: pageData?.heroTitle || "Flight Schedules",
      heroImage: pageData?.heroImage || { url: "/hero.jpg" },
      url: pageData?.url || "/explore/flight-schedules/",
      seoTitle: pageData?.seoTitle || "Flight Schedules",
      description: pageData?.description,
      schedules: schedules,
      __typename: pageData?.__typename || "FlightSchedule",
    };
    return result;
  } catch (error) {
    console.error("Error fetching Flight Schedule page data:", error);
    return {
      heroTitle: "Flight Schedules",
      heroImage: { url: "/hero.jpg" },
      url: "/explore/flight-schedules/",
      seoTitle: "Flight Schedules",
      description:
        "Explore our weekly flight schedules for both international and domestic routes.",
      schedules: [],
      __typename: "FlightSchedule",
    };
  }
}
