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
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

// Local fonts with Next.js optimization
const veneer = localFont({
  src: "@/public/fonts/VENEER.OTF",
  variable: "--font-veneer",
  display: "swap",
  preload: true, // Preload this font since it's used in hero sections
});

const edmondsans = localFont({
  src: [
    {
      path: "@/public/fonts/Edmondsans-Medium.otf",
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
  // Fetch header data server-side (including menus and currencies)
  let headerData = fallbackHeaderData;

  try {
    headerData = await fetchHeaderDataServer();
  } catch (error) {
    console.error(
      "Failed to fetch header data in layout, using fallback:",
      error
    );
  }

  // Fetch footer menu data server-side
  let footerMenus = fallbackFooterMenu;

  try {
    footerMenus = await fetchFooterMenuServer();
  } catch (error) {
    console.error(
      "Failed to fetch footer menu in layout, using fallback:",
      error
    );
  }

  // Fetch active travel alert data server-side
  let activeTravelAlert = null;

  try {
    const alertData = await fetchActiveTravelAlertServer();
    if (alertData?.activeAlert) {
      activeTravelAlert = alertData;
    }
  } catch (error) {
    console.error("Failed to fetch travel alert data in layout:", error);
  }

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
