import HomePageTemplate from "@/components/templates/home/HomePageTemplate";
import { fetchHomePage } from "@/graphql/HomePageQuery";
import { notFound } from "next/navigation";

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
