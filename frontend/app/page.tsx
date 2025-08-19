import HomePageTemplate from "@/components/templates/home/HomePageTemplate";
import { fetchHomePage } from "@/graphql/HomePageQuery";
import { notFound } from "next/navigation";

// Generate static params for home page
export async function generateStaticParams() {
  // Pre-render the home page at build time for optimal performance
  console.log("🏠 Generating static home page");
  return [{}]; // Empty object generates the root route
}

export default async function Home() {
  try {
    // Fetch homepage data using the server-side fetch function
    const homePage = await fetchHomePage();

    // Return the client component with the data
    return <HomePageTemplate initialPage={homePage} />;
  } catch (error) {
    console.error("Error fetching homepage data:", error);
    notFound();
  }
}
