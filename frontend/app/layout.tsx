// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Rubik } from "next/font/google";
import localFont from "next/font/local";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import TravelAlertsBanner from "@/components/layout/banner/TravelAlertsBanner";
import ClientProviders from "@/components/providers/ClientProviders";
import {
  fetchHeaderDataServer,
  fallbackHeaderData,
} from "@/graphql/HeaderQuery";
import {
  fetchFooterMenuServer,
  fallbackFooterMenu,
} from "@/graphql/FooterQuery";
import {
  fetchActiveTravelAlertServer,
  type ActiveTravelAlertPage,
} from "@/graphql/TravelAlertPageQuery";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
});

// Local fonts with Next.js optimization
const veneer = localFont({
  src: [
    {
      path: "../public/fonts/veneer.otf",
      style: "normal",
    },
  ],
  variable: "--font-veneer",
  display: "swap",
  preload: true, // Preload this font since it's used in hero sectionss
});

const edmondsans = localFont({
  src: [
    {
      path: "../public/fonts/Edmondsans-Medium.otf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-edmondsans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Book Flights | Solomon Airlines",
    template: "%s | Solomon Airlines",
  },
  description: "Solomon Airlines",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch all layout data in parallel for better performance
  const [headerResult, footerResult, alertResult] = await Promise.allSettled([
    fetchHeaderDataServer(),
    fetchFooterMenuServer(),
    fetchActiveTravelAlertServer(),
  ]);

  // Extract results with fallbacks
  const headerData = headerResult.status === 'fulfilled' 
    ? headerResult.value 
    : (() => {
        console.error("Failed to fetch header data in layout, using fallback:", 
          headerResult.status === 'rejected' ? headerResult.reason : 'Unknown error');
        return fallbackHeaderData;
      })();

  const footerMenus = footerResult.status === 'fulfilled' 
    ? footerResult.value 
    : (() => {
        console.error("Failed to fetch footer menu in layout, using fallback:", 
          footerResult.status === 'rejected' ? footerResult.reason : 'Unknown error');
        return fallbackFooterMenu;
      })();

  const activeTravelAlert = alertResult.status === 'fulfilled' && alertResult.value?.activeAlert
    ? alertResult.value
    : (() => {
        if (alertResult.status === 'rejected') {
          console.error("Failed to fetch travel alert data in layout:", alertResult.reason);
        }
        return null;
      })();

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${rubik.variable} ${veneer.variable} ${edmondsans.variable} antialiased`}
      >
        <ClientProviders initialCurrencies={headerData.currencies}>
          <TravelAlertsBanner activeAlert={activeTravelAlert} />
          <Header
            headerMenus={headerData.headerMenus}
            currencies={headerData.currencies}
          />
          {children}
          <Footer footerMenus={footerMenus} />
        </ClientProviders>
      </body>
    </html>
  );
}
