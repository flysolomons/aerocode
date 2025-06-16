// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Rubik } from "next/font/google";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import {
  fetchHeaderMenuServer,
  fallbackHeaderMenu,
} from "@/graphql/HeaderQuery";
import {
  fetchFooterMenuServer,
  fallbackFooterMenu,
} from "@/graphql/FooterQuery";
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
  // Fetch header menu data server-side
  let headerMenus = fallbackHeaderMenu;

  try {
    headerMenus = await fetchHeaderMenuServer();
  } catch (error) {
    console.error(
      "Failed to fetch header menu in layout, using fallback:",
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

  return (
    <html lang="en">
      <body className={`${inter.variable} ${rubik.variable} antialiased`}>
        <Header headerMenus={headerMenus} />
        {children}
        <Footer footerMenus={footerMenus} />
      </body>
    </html>
  );
}
