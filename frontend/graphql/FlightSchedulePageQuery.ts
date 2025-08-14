import { gql } from "@apollo/client";
import client from "@/lib/apolloClient";

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

export interface ScheduleMetadata {
  id: string;
  startDate: string;
  endDate: string;
  snippetType: string;
  contentType: string;
}

export interface Schedule extends ScheduleMetadata {
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

// Get schedule metadata only (no flights)
export const GET_SCHEDULES_METADATA_QUERY = gql`
  query GetSchedulesMetadata {
    schedules {
      id
      startDate
      endDate
      snippetType
      contentType
    }
  }
`;

// Get flights for a specific schedule
export const GET_SCHEDULE_FLIGHTS_QUERY = gql`
  query GetScheduleFlights(
    $scheduleId: ID!
    $limit: PositiveInt
    $offset: PositiveInt
  ) {
    schedules(id: $scheduleId) {
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

// Legacy query for backward compatibility
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

// Fetch schedule metadata only
export async function fetchSchedulesMetadata(): Promise<ScheduleMetadata[]> {
  try {
    const result = await client.query({
      query: GET_SCHEDULES_METADATA_QUERY,
      fetchPolicy: "cache-first",
    });

    return result.data.schedules || [];
  } catch (error) {
    console.error("Error fetching schedules metadata:", error);
    return [];
  }
}

// Fetch flights for a specific schedule with batching
export async function fetchScheduleFlights(
  scheduleId: string,
  silent = false // For background prefetching
): Promise<Schedule | null> {
  try {
    const allFlights: Flight[] = [];
    const batchSize = 100;
    let offset = 0;
    let hasMoreData = true;
    let scheduleData = null;

    while (hasMoreData) {
      const result = await client.query({
        query: GET_SCHEDULE_FLIGHTS_QUERY,
        variables: {
          scheduleId,
          limit: batchSize,
          offset: offset,
        },
        fetchPolicy: "cache-first",
        errorPolicy: silent ? "ignore" : "none", // Ignore errors for background prefetch
      });

      const schedules = result.data.schedules;
      const schedule = schedules && schedules.length > 0 ? schedules[0] : null;

      if (!schedule) {
        hasMoreData = false;
        break;
      }

      // Store schedule metadata on first iteration
      if (!scheduleData) {
        scheduleData = {
          id: schedule.id,
          startDate: schedule.startDate,
          endDate: schedule.endDate,
          snippetType: schedule.snippetType,
          contentType: schedule.contentType,
          flights: [],
        };
      }

      const flights = schedule.flights || [];
      allFlights.push(...flights);

      // Check if we got fewer results than requested
      if (flights.length < batchSize) {
        hasMoreData = false;
      } else {
        offset += batchSize;
      }
    }

    return scheduleData ? { ...scheduleData, flights: allFlights } : null;
  } catch (error) {
    if (!silent) {
      console.error(
        `Error fetching flights for schedule ${scheduleId}:`,
        error
      );
    }
    return null;
  }
}

// Background prefetching function
export async function prefetchAdjacentSchedules(
  schedules: ScheduleMetadata[],
  currentScheduleId: string,
  loadedScheduleIds: Set<string>
): Promise<void> {
  const currentIndex = schedules.findIndex((s) => s.id === currentScheduleId);
  if (currentIndex === -1) return;

  const adjacentSchedules = [
    schedules[currentIndex - 1], // Previous
    schedules[currentIndex + 1], // Next
  ].filter(Boolean);

  // Prefetch adjacent schedules that haven't been loaded yet
  const prefetchPromises = adjacentSchedules
    .filter((schedule) => !loadedScheduleIds.has(schedule.id))
    .map(
      (schedule) =>
        fetchScheduleFlights(schedule.id, true) // Silent background fetch
          .then((result) => {
            if (result) {
              loadedScheduleIds.add(schedule.id);
              return { scheduleId: schedule.id, data: result };
            }
            return null;
          })
          .catch(() => null) // Silently ignore prefetch errors
    );

  // Don't await - let them run in background
  Promise.allSettled(prefetchPromises);
}

// Optimized function - fetches only page data + schedule metadata (no flights)
export async function fetchFlightSchedulePage(): Promise<ScheduleWithFlightData> {
  try {
    const [pageResult, schedulesMetadata] = await Promise.all([
      client.query({
        query: GET_FLIGHT_SCHEDULE_PAGE_QUERY,
        fetchPolicy: "cache-first",
      }),
      fetchSchedulesMetadata(),
    ]);

    const pageData = pageResult.data.pages?.find(
      (page: any) => page.__typename === "FlightSchedule"
    ) || {
      heroTitle: "",
      heroImage: { url: "/default-hero.jpg" },
      url: "",
      seoTitle: "Flight Schedule",
      subTitle: "",
      description: "",
    };

    // Convert all schedule metadata to Schedule objects with empty flights
    const schedulesWithFlights: Schedule[] = schedulesMetadata.map(
      (schedule: ScheduleMetadata): Schedule => ({
        ...schedule,
        flights: [], // Empty flights array - will be loaded on demand
      })
    );

    return {
      ...pageData,
      schedules: schedulesWithFlights,
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

// Legacy function for backward compatibility
// export async function fetchFlightSchedulePageLegacy(): Promise<ScheduleWithFlightData> {
//   try {
//     const [pageResult, allSchedules] = await Promise.all([
//       client.query({
//         query: GET_FLIGHT_SCHEDULE_PAGE_QUERY,
//       }),
//       fetchAllSchedules(),
//     ]);

//     const pageData = pageResult.data.pages?.find(
//       (page: any) => page.__typename === "FlightSchedule"
//     ) || {
//       heroTitle: "",
//       heroImage: { url: "/default-hero.jpg" },
//       url: "",
//       seoTitle: "Flight Schedule",
//       subTitle: "",
//       description: "",
//     };

//     return {
//       ...pageData,
//       schedules: allSchedules,
//       __typename: "FlightSchedule",
//     };
//   } catch (error) {
//     console.error("Error fetching Flight Schedule page data:", error);
//     return {
//       heroTitle: "",
//       heroImage: { url: "/default-hero.jpg" },
//       url: "",
//       seoTitle: "Flight Schedule",
//       subTitle: "",
//       description: "",
//       schedules: [],
//       __typename: "FlightSchedule",
//     };
//   }
// }
