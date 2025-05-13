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

    // Default page data
    const pageData: ScheduleWithFlightData = {
      heroTitle: "Flight Schedules",
      heroImage: { url: "/hero.jpg" },
      url: "/explore/flight-schedules/",
      seoTitle: "Flight Schedules",
      description:
        "Explore our weekly flight schedules for both international and domestic routes.",
      schedules: schedules,
    };

    return pageData;
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
    };
  }
}
