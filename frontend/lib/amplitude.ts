// lib/amplitude.ts
import * as amplitude from "@amplitude/analytics-browser";
import type { BrowserOptions } from "@amplitude/analytics-types";

// Define the shape of event properties with stricter typing
interface EventProperties {
  [key: string]: string | number | boolean | null | undefined;
}

export class AmplitudeAnalytics {
  private isInitialized: boolean = false;

  public initialize(): void {
    if (this.isInitialized) return; // Prevent re-initialization

    if (process.env.NODE_ENV !== "production") {
      console.log("Amplitude not initialized in non-production environment");
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
    if (!apiKey) {
      console.error(
        "Amplitude API key is not defined in environment variables"
      );
      return;
    }

    amplitude.init(apiKey, {
      autocapture: {
        pageViews: false, // Disabled to use PageVisitTracker for explicit control
        formInteractions: true,
        elementInteractions: true,
      },
      serverZone: "EU", // GDPR compliance for EU users
      defaultTracking: {
        sessions: true, // Track session start/end
        attribution: true, // Track UTM parameters, referrers
      },
    } as BrowserOptions);

    this.isInitialized = true;
  }

  public trackEvent(name: string, properties: EventProperties = {}): void {
    this.initialize();
    if (process.env.NODE_ENV !== "production") {
      console.log("Tracking event (dev):", name, properties);
      return;
    }
    amplitude.track(name, properties);
  }
}

export const analytics = new AmplitudeAnalytics();
