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
  aircraft: string;
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
  query GetSchedules($limit: PositiveInt, $offset: PositiveInt) {
    schedules {
      id
      startDate
      endDate
      snippetType
      contentType
      flights(limit: $limit, offset: $offset) {
        id
        day
        aircraft
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

async function fetchAllSchedules() {
  try {
    const allSchedules: Schedule[] = [];
    const batchSize = 100;
    let offset = 0;
    let hasMoreData = true;

    while (hasMoreData) {
      const result = await client.query({
        query: GET_SCHEDULES_QUERY,
        variables: {
          limit: batchSize,
          offset: offset,
        },
      });

      const schedules = result.data.schedules || [];
      
      if (schedules.length === 0) {
        hasMoreData = false;
      } else {
        // Merge flights from this batch into existing schedules or add new schedules
        for (const schedule of schedules) {
          const existingScheduleIndex = allSchedules.findIndex(s => s.id === schedule.id);
          if (existingScheduleIndex >= 0) {
            // Merge flights into existing schedule by creating a new array
            allSchedules[existingScheduleIndex] = {
              ...allSchedules[existingScheduleIndex],
              flights: [...allSchedules[existingScheduleIndex].flights, ...schedule.flights]
            };
          } else {
            // Add new schedule
            allSchedules.push({ ...schedule });
          }
        }
        
        // Check if we got fewer results than requested (indicates end of data)
        const totalFlightsInBatch = schedules.reduce((sum: number, s: Schedule) => sum + s.flights.length, 0);
        if (totalFlightsInBatch < batchSize) {
          hasMoreData = false;
        } else {
          offset += batchSize;
        }
      }
    }

    return allSchedules;
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return [];
  }
}

export async function fetchFlightSchedulePage(): Promise<ScheduleWithFlightData> {
  try {
    const [pageResult, allSchedules] = await Promise.all([
      client.query({
        query: GET_FLIGHT_SCHEDULE_PAGE_QUERY,
      }),
      fetchAllSchedules(),
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
      schedules: allSchedules,
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
