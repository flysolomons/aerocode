"use client";

import React, { useState } from "react";
import SecondaryHero from "@/components/layout/SecondaryHero";
import Container from "@/components/common/Container";
import PrimaryButton from "@/components/common/PrimaryButton";

const membershipOptions = [
  { value: "business", label: "Belama Business" },
  { value: "family", label: "Belama Family" },
  { value: "max", label: "Belama Max" },
  { value: "me", label: "Belama Me" },
  { value: "plus", label: "Belama Plus" },
];

const BelamaSignUp = () => {
  const [membershipType, setMembershipType] = useState("");
  const [formData, setFormData] = useState({});

  const handleMembershipChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setMembershipType(e.target.value);
    setFormData({}); // Reset form data when membership type changes
  };

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const renderMemberPreferences = (memberCount: number) => {
    return (
      <div className="border p-4 rounded shadow mb-4 bg-white">
        <h3 className="font-medium text-lg">Special Requests</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <select
            name={`member${memberCount}SeatPreference`}
            onChange={handleInputChange}
            className="border rounded p-2 mb-2 w-full"
          >
            <option value="">Select Seat Preference</option>
            <option value="window">Window</option>
            <option value="aisle">Aisle</option>
          </select>
          <input
            type="text"
            name={`member${memberCount}MealPreference`}
            placeholder="Meal Preference"
            onChange={handleInputChange}
            className="border rounded p-2 mb-2 w-full"
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <SecondaryHero
        title="Belama Sign Up"
        image="/hero.jpg"
        breadcrumbs="Home > Belama > Sign Up"
      />
      <Container>
        <div className="py-12 space-y-8">
          <select
            className="border rounded p-2 w-full"
            onChange={handleMembershipChange}
            value={membershipType}
          >
            <option value="">Select Membership Type</option>
            {membershipOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {membershipType && membershipType !== "" && (
            <>
              {membershipType === "business" && (
                <div className="border p-4 rounded shadow mb-4 bg-white">
                  <h3 className="text-lg font-semibold">
                    Personal Details (Up to 3 Persons)
                  </h3>
                  {[1, 2, 3].map((member) => (
                    <div key={member} className="mb-4">
                      <h4 className="font-medium">Member {member}</h4>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <input
                            type="text"
                            name={`member${member}FirstName`}
                            placeholder="First Name"
                            className="border rounded p-2 mb-2 w-full"
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            name={`member${member}Surname`}
                            placeholder="Surname"
                            className="border rounded p-2 mb-2 w-full"
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {membershipType === "family" && (
                <div className="border p-4 rounded shadow mb-4 bg-white">
                  <h3 className="text-lg font-semibold">
                    Personal Details (2 Adults and 2-3 Children)
                  </h3>
                  {[1, 2].map((adult) => (
                    <div key={`adult${adult}`} className="mb-4">
                      <h4 className="font-medium">Adult {adult}</h4>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <input
                            type="text"
                            name={`adult${adult}FirstName`}
                            placeholder="First Name"
                            className="border rounded p-2 mb-2 w-full"
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            name={`adult${adult}Surname`}
                            placeholder="Surname"
                            className="border rounded p-2 mb-2 w-full"
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {[1, 2, 3].map((child) => (
                    <div key={`child${child}`} className="mb-4">
                      <h4 className="font-medium">Child {child}</h4>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <input
                            type="text"
                            name={`child${child}FirstName`}
                            placeholder="First Name"
                            className="border rounded p-2 mb-2 w-full"
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            name={`child${child}Surname`}
                            placeholder="Surname"
                            className="border rounded p-2 mb-2 w-full"
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {membershipType === "max" && (
                <div className="border p-4 rounded shadow mb-4 bg-white">
                  <h3 className="text-lg font-semibold">
                    Personal Details (One Person)
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        className="border rounded p-2 mb-2 w-full"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="surname"
                        placeholder="Surname"
                        className="border rounded p-2 mb-2 w-full"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}
              {membershipType === "me" && (
                <div className="border p-4 rounded shadow mb-4 bg-white">
                  <h3 className="text-lg font-semibold">
                    Personal Details (One Person + One Guest)
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        className="border rounded p-2 mb-2 w-full"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="surname"
                        placeholder="Surname"
                        className="border rounded p-2 mb-2 w-full"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}
              {membershipType === "plus" && (
                <div className="border p-4 rounded shadow mb-4 bg-white">
                  <h3 className="text-lg font-semibold">
                    Personal Details (One Person + One Guest)
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        className="border rounded p-2 mb-2 w-full"
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="surname"
                        placeholder="Surname"
                        className="border rounded p-2 mb-2 w-full"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* Special Requests Section */}
              {membershipType === "business" && renderMemberPreferences(3)}{" "}
              {/* For Business */}
              {membershipType === "family" && renderMemberPreferences(5)}{" "}
              {/* 2 Adults + 3 Children */}
              {membershipType === "max" && renderMemberPreferences(1)}{" "}
              {/* 1 Member */}
              {membershipType === "me" && renderMemberPreferences(2)}{" "}
              {/* 1 Member + 1 Guest */}
              {membershipType === "plus" && renderMemberPreferences(2)}{" "}
              {/* 1 Member + 1 Guest */}
            </>
          )}

          {/* Always show Contact Details and Payment sections */}
          <div className="border p-4 rounded shadow mb-4 bg-white">
            <h3 className="text-lg font-semibold">Contact Details</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                name="address"
                placeholder="Residential/Company Address"
                className="border rounded p-2 mb-2 w-full col-span-2"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="telephone"
                placeholder="Telephone"
                className="border rounded p-2 mb-2 w-full"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="mobile"
                placeholder="Mobile"
                className="border rounded p-2 mb-2 w-full"
                onChange={handleInputChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="border rounded p-2 mb-2 w-full"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="border p-4 rounded shadow mb-4 bg-white">
            <h3 className="text-lg font-semibold">Payment</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                name="membershipNumber"
                placeholder="Membership Number"
                className="border rounded p-2 mb-2 w-full"
                onChange={handleInputChange}
              />
              <select
                name="paymentMethod"
                className="border rounded p-2 mb-2 w-full"
                onChange={handleInputChange}
              >
                <option value="">Select Payment Method</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="directDeposit">Direct Deposit</option>
              </select>
            </div>
          </div>

          <PrimaryButton text="Sign Up" />
        </div>
      </Container>
    </>
  );
};

export default BelamaSignUp;
