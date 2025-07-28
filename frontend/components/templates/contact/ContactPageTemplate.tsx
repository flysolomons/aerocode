"use client";
import { ContactPage, organizeContactData } from "@/graphql/ContactPageQuery";
import SecondaryHero from "@/components/layout/hero/SecondaryHero";
import Container from "@/components/layout/Container";
import ContactForm from "@/components/layout/ContactForm";
import { useState } from "react";

interface ContactPageTemplateProps {
  initialPage: ContactPage | null;
}

export default function ContactPageTemplate({
  initialPage,
}: ContactPageTemplateProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Handle loading or null data
  if (!initialPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Contact page not found</div>
      </div>
    );
  }

  // Organize contact data
  const organizedContactData = organizeContactData(initialPage.contactSections);

  // Helper function to get icon for contact method type
  const getContactIcon = (methodType: string) => {
    const iconClass = "inline-block mr-2 w-5 h-5";
    const iconColor = "#212061";

    switch (methodType) {
      case "phone":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={iconClass}
            fill={iconColor}
            viewBox="0 0 256 256"
          >
            <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80A40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"></path>
          </svg>
        );
      case "email":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={iconClass}
            fill={iconColor}
            viewBox="0 0 256 256"
          >
            <path d="M128,24a104,104,0,0,0,0,208c21.51,0,44.1-6.48,60.43-17.33a8,8,0,0,0-8.86-13.33C166,210.38,146.21,216,128,216a88,88,0,1,1,88-88c0,26.45-10.88,32-20,32s-20-5.55-20-32V88a8,8,0,0,0-16,0v4.26a48,48,0,1,0,5.93,65.1c6,12,16.35,18.64,30.07,18.64,22.54,0,36-17.94,36-48A104.11,104.11,0,0,0,128,24Zm0,136a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>
          </svg>
        );
      case "address":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={iconClass}
            fill={iconColor}
            viewBox="0 0 256 256"
          >
            <path d="M248,208H232V96a8,8,0,0,0,0-16H184V48a8,8,0,0,0,0-16H40a8,8,0,0,0,0-16V208H24a8,8,0,0,0,0,16H248a8,8,0,0,0,0-16ZM216,96V208H184V96ZM56,48H168V208H144V160a8,8,0,0,0-8-8H88a8,8,0,0,0-8,8v48H56Zm72,160H96V168h32ZM72,80a8,8,0,0,1,8-8H96a8,8,0,0,1,0,16H80A8,8,0,0,1,72,80Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H128A8,8,0,0,1,120,80ZM72,120a8,8,0,0,1,8-8H96a8,8,0,0,1,0,16H80A8,8,0,0,1,72,120Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H128A8,8,0,0,1,120,120Z"></path>
          </svg>
        );
      case "fax":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={iconClass}
            fill={iconColor}
            viewBox="0 0 256 256"
          >
            <path d="M248,208H232V96a8,8,0,0,0,0-16H184V48a8,8,0,0,0,0-16H40a8,8,0,0,0,0-16V208H24a8,8,0,0,0,0,16H248a8,8,0,0,0,0-16Z"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Header Section */}
      <SecondaryHero
        title={initialPage.heroTitle || "Contact Us"}
        image={initialPage.heroImage?.url || "/hero.jpg"}
        breadcrumbs={initialPage.url || "/contact/"}
      />
      {/* Header Section End */}

      {/* Page Content */}
      <div className="bg-refx">
        <Container>
          <div className="py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-12 lg:space-y-16 px-4 sm:px-6">
            {/* Dynamic Contact Sections */}
            {organizedContactData.map((category, categoryIndex) => {
              return (
                <div
                  key={categoryIndex}
                  id={`category-${categoryIndex}`}
                  className="space-y-6"
                >
                  <div className="mb-8">
                    <h2 className="text-blue-500 font-bold text-2xl md:text-3xl lg:text-4xl md:font-semibold lg:font-semibold">
                      {category.categoryName}
                    </h2>
                    {category.categoryDescription && (
                      <p className="text-gray-800 mt-3">
                        {category.categoryDescription}
                      </p>
                    )}
                  </div>

                  {/* Render subcategories with appropriate styling */}
                  <div
                    className={
                      category.subcategories.some(
                        (sub) => sub.contactMethods.length > 1
                      )
                        ? "grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 mb-5" // First cards style for subcategories with multiple contact methods
                        : `grid gap-4 grid-cols-1 ${
                            category.subcategories.length === 1
                              ? "sm:grid-cols-1"
                              : category.subcategories.length === 2
                              ? "sm:grid-cols-2"
                              : "sm:grid-cols-3"
                          }` // Mobile-first: 1 column, then responsive based on number of subcategories for single contact methods
                    }
                  >
                    {category.subcategories.map((subcategory, subIndex) => {
                      const hasMultipleContactMethods =
                        subcategory.contactMethods.length > 1;

                      return (
                        <div
                          key={subIndex}
                          className={
                            hasMultipleContactMethods
                              ? "space-y-2 bg-white rounded-2xl p-4 shadow-md" // Style for multiple contact methods
                              : "text-gray-800 bg-white rounded-2xl p-4 shadow-md" // Style for single contact method with shadow
                          }
                        >
                          <h2
                            className={
                              hasMultipleContactMethods
                                ? "text-xl text-blue-500 font-semibold" // Full heading for multiple contact methods
                                : "" // Simple heading for single contact method
                            }
                          >
                            {subcategory.name}
                          </h2>

                          {hasMultipleContactMethods ? (
                            <div className="text-gray-700 space-y-1">
                              {/* Regular contact methods first (phone, email, address, fax) */}
                              {subcategory.contactMethods
                                .filter(
                                  (method) =>
                                    !["hours", "closing", "note"].includes(
                                      method.methodType
                                    )
                                )
                                .map((method, methodIndex) => (
                                  <p key={methodIndex} className="text-sm mb-4">
                                    {getContactIcon(method.methodType)}
                                    {method.contactValue}
                                  </p>
                                ))}

                              {/* Add separator if there are hours/closing info */}
                              {subcategory.contactMethods.some((m) =>
                                ["hours", "closing"].includes(m.methodType)
                              ) && <hr />}

                              {/* Business hours section */}
                              {subcategory.contactMethods.some((m) =>
                                ["hours", "closing"].includes(m.methodType)
                              ) && (
                                <div id="businessHours" className="text-sm">
                                  {/* Open hours - merged under one badge */}
                                  {subcategory.contactMethods.filter(
                                    (method) => method.methodType === "hours"
                                  ).length > 0 && (
                                    <div>
                                      <p className="font-semibold text-xs bg-blue-50 text-blue-500 p-1 rounded-md text-center w-1/4 my-4">
                                        Open
                                      </p>
                                      {subcategory.contactMethods
                                        .filter(
                                          (method) =>
                                            method.methodType === "hours"
                                        )
                                        .map((method, methodIndex) => (
                                          <p key={methodIndex} className="my-1">
                                            {method.contactValue}
                                          </p>
                                        ))}
                                    </div>
                                  )}

                                  {/* Closing hours - merged under one badge */}
                                  {subcategory.contactMethods.filter(
                                    (method) => method.methodType === "closing"
                                  ).length > 0 && (
                                    <div>
                                      <p className="font-semibold text-xs bg-blue-50 text-blue-500 p-1 w-1/4 rounded-md text-center my-4">
                                        Close
                                      </p>
                                      {subcategory.contactMethods
                                        .filter(
                                          (method) =>
                                            method.methodType === "closing"
                                        )
                                        .map((method, methodIndex) => (
                                          <p key={methodIndex}>
                                            {method.contactValue}
                                          </p>
                                        ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Notes at the end */}
                              {subcategory.contactMethods
                                .filter(
                                  (method) => method.methodType === "note"
                                )
                                .map((method, methodIndex) => (
                                  <p key={methodIndex} className="mt-4 text-xs">
                                    {method.contactValue}
                                  </p>
                                ))}
                            </div>
                          ) : (
                            /* Single contact method - simple format */
                            subcategory.contactMethods
                              .filter(
                                (method) =>
                                  !["hours", "closing", "note"].includes(
                                    method.methodType
                                  )
                              )
                              .map((method, methodIndex) => (
                                <p key={methodIndex} className="text-sm">
                                  {getContactIcon(method.methodType)}
                                  {method.contactValue}
                                </p>
                              ))
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Container>

        {/* Contact form  Section */}

        <div
          className="relative h-[300px] sm:h-[400px] lg:h-[500px] bg-cover bg-center"
          style={{
            backgroundImage: `url(${"/hero.jpg"})`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="text-center text-white px-4 sm:px-6 lg:px-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 lg:mb-6">
                Need to reach us?
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl max-w-2xl mx-auto mb-6 sm:mb-8 lg:mb-8 leading-relaxed">
                contact us now with the awesome button below
              </p>
              <div className="space-x-2 sm:space-x-4 lg:space-x-4">
                <button
                  onClick={openModal}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 sm:py-3 lg:py-3 px-6 sm:px-8 lg:px-8 rounded-full transition-colors duration-300 text-sm sm:text-base lg:text-base"
                >
                  Contact Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full md:w-full lg:w-[800px] mx-4 relative">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-blue-500 mb-4">
                Your Enquiry
              </h2>
              <ContactForm />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
