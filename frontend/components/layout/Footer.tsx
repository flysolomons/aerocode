import Link from "next/link";
import Image from "next/image";
import { TransformedFooterMenu } from "@/graphql/FooterQuery";
import SignUP from "../common/SignUp";

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
    <footer className="h-screen bg-blue-600 text-white pt-8 flex flex-col">
      <div className="container mx-auto px-4 max-w-[70.5rem] mt-20 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b-2 border-indigo-900 pb-6">
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
        </div>
        {/*End of grid */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-10 border-b-2 border-indigo-900 pb-6">
          {/* Help Column */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Help</h3>
            <ul className="space-y-2 text-xs font-normal">
              <li>
                <a href="/contact">Contact us</a>
              </li>
              <li>
                <a href="/alerts">Travel Alerts</a>
              </li>
            </ul>
          </div>

          {/* Follow Us Column */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Follow Us</h3>
            <div className="grid grid-cols-5">
              <a
                href="https://facebook.com/solomonairlines"
                aria-label="Facebook"
                className="w-auto"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="#fafafa"
                  viewBox="0 0 256 256"
                >
                  <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z"></path>
                </svg>
              </a>
              <a
                href="https://instagram.com/solomonairlines"
                aria-label="Instagram"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="#fafafa"
                  viewBox="0 0 256 256"
                >
                  <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/solomonairlines"
                aria-label="LinkedIn"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="#fafafa"
                  viewBox="0 0 256 256"
                >
                  <path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z"></path>
                </svg>
              </a>
              <a
                href="https://youtube.com/@SolomonAirlinesOfficial"
                aria-label="YouTube"
              >
                <span className="sr-only">YouTube</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="#fafafa"
                  viewBox="0 0 256 256"
                >
                  <path d="M164.44,121.34l-48-32A8,8,0,0,0,104,96v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,145.05V111l25.58,17ZM234.33,69.52a24,24,0,0,0-14.49-16.4C185.56,39.88,131,40,128,40s-57.56-.12-91.84,13.12a24,24,0,0,0-14.49,16.4C19.08,79.5,16,97.74,16,128s3.08,48.5,5.67,58.48a24,24,0,0,0,14.49,16.41C69,215.56,120.4,216,127.34,216h1.32c6.94,0,58.37-.44,91.18-13.11a24,24,0,0,0,14.49-16.41c2.59-10,5.67-28.22,5.67-58.48S236.92,79.5,234.33,69.52Zm-15.49,113a8,8,0,0,1-4.77,5.49c-31.65,12.22-85.48,12-86,12H128c-.54,0-54.33.2-86-12a8,8,0,0,1-4.77-5.49C34.8,173.39,32,156.57,32,128s2.8-45.39,5.16-54.47A8,8,0,0,1,41.93,68c30.52-11.79,81.66-12,85.85-12h.27c.54,0,54.38-.18,86,12a8,8,0,0,1,4.77,5.49C221.2,82.61,224,99.43,224,128S221.2,173.39,218.84,182.47Z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/**Sign up for newsletter section */}
        <div className="w-full items-center justify-center">
          <SignUP></SignUP>
        </div>

        {/* Insert Logo here-- */}
        <div className="w-[500px] mt-12 m-auto flex flex-auto  items-center justify-items-end">
          <Image
            src={"/logo-white.svg"}
            alt="Company Logo"
            width={0}
            height={40}
            className="h-8 w-full"
          />

          <Image
            src={"/tourism_logo.svg"}
            alt="Company Logo"
            width={0}
            height={40}
            className="h-12 w-full"
          />
        </div>        <div className="mt-12 text-center text-xs border-t-2 border-indigo-900 pt-6">
          <p>All Rights Reserved. 2025</p>
        </div>
      </div>
      <div
        className="h-[86px] w-full bg-[url('/design.svg')] bg-repeat-x [background-size:422px_86px]"
        aria-hidden="true"
      ></div>
    </footer>
  );
}

export default Footer;
