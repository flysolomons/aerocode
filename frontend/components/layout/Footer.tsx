import Link from "next/link";
import { TransformedFooterMenu } from "@/graphql/FooterQuery";

interface FooterProps {
  footerMenus?: TransformedFooterMenu[];
}

function Footer({ footerMenus }: FooterProps) {
  // Get the first footer menu (assuming there's typically one main footer menu)
  const footerMenu =
    footerMenus && footerMenus.length > 0 ? footerMenus[0] : null;

  // Fallback data if no footer menu is provided
  const fallbackColumns = [
    {
      columnTitle: "Services",
      items: [
        { title: "Book a Trip", url: "/book" },
        { title: "Manage Booking", url: "/manage" },
        { title: "Cargo Information", url: "/cargo" },
      ],
    },
    {
      columnTitle: "Destinations",
      items: [
        { title: "Flights to Brisbane", url: "/flights/brisbane" },
        { title: "Flights to Auckland", url: "/flights/auckland" },
        { title: "Flights to Port Vila", url: "/flights/port-vila" },
        { title: "Flights to Santo", url: "/flights/santo" },
        { title: "Flights to Munda", url: "/flights/munda" },
        { title: "Flights to Gizo", url: "/flights/gizo" },
      ],
    },
    {
      columnTitle: "Policies",
      items: [
        { title: "Baggage Information", url: "/baggage" },
        { title: "Conditions of Carriage", url: "/conditions" },
        { title: "Fare Conditions", url: "/fare-conditions" },
        { title: "Terms of Service", url: "/terms" },
        { title: "Privacy Policy", url: "/privacy" },
      ],
    },
    {
      columnTitle: "Company",
      items: [
        { title: "About", url: "/about" },
        { title: "Careers", url: "/careers" },
        { title: "News", url: "/news" },
      ],
    },
    {
      columnTitle: "Help",
      items: [
        { title: "Contact us", url: "/contact" },
        { title: "Travel Alerts", url: "/alerts" },
      ],
    },
  ];

  // Use footer menu data if available, otherwise use fallback
  const columnsToRender = footerMenu?.columns || fallbackColumns;

  return (
    <footer className="bg-blue-600 text-white pt-8">
      <div className="container mx-auto px-4 max-w-[70.5rem]">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
          {/* Dynamic Columns from FooterQuery */}
          {columnsToRender.map((column, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold mb-2">
                {column.columnTitle}
              </h3>
              <ul className="space-y-2 text-xs font-normal">
                {column.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link href={item.url || "#"} className="hover:underline">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Follow Us Column - Static (last column) */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Follow Us</h3>
            <div className="space-x-4">
              <a href="https://facebook.com" aria-label="Facebook">
                <span className="sr-only">Facebook</span>
                {/* Add Facebook icon */}
              </a>
              <a href="https://youtube.com" aria-label="YouTube">
                <span className="sr-only">YouTube</span>
                {/* Add YouTube icon */}
              </a>
              <a href="https://instagram.com" aria-label="Instagram">
                <span className="sr-only">Instagram</span>
                {/* Add Instagram icon */}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center text-xs">
          <p>Solomon Airlines. All Rights Reserved</p>
        </div>
      </div>
      <div
        className="h-[86px] w-full bg-[url('/design.svg')] bg-repeat-x mt-8 [background-size:422px_86px]"
        aria-hidden="true"
      ></div>
    </footer>
  );
}

export default Footer;
