// lib/emailTemplates/belamaOfficeTemplate.ts
interface OfficeTemplateProps {
  title: string | undefined;
  membershipType: string | undefined;
  price: string | undefined;
  key: string | undefined;
  seatSelection: string | undefined;
  paymentMethod: string | undefined;
  firstname: string | undefined;
  surname: string | undefined;
  address: string | undefined;
  telephone: string | undefined;
  mobile: string | undefined;
  email: string | undefined;
  membershipnumber: string | undefined;
  otherData: Record<string, string>;
}

export function belamaOfficeTemplate({
  title,
  membershipType,
  price,
  key,
  seatSelection,
  paymentMethod,
  firstname,
  surname,
  address,
  telephone,
  mobile,
  email,
  membershipnumber,
  otherData,
}: OfficeTemplateProps) {
  // Format member details based on membership type
  let memberDetailsText = "";
  let memberDetailsHtml = "";
  if (membershipType === "business") {
    memberDetailsText = [1, 2, 3]
      .map((member) => {
        const firstName = otherData[`member${member}FirstName`] || "Not provided";
        const surname = otherData[`member${member}Surname`] || "Not provided";
        const mealPreference = otherData[`member${member}MealPreference`] || "Not provided";
        return `
        Member ${member}:
        - First Name: ${firstName}
        - Surname: ${surname}
        - Meal Preference: ${mealPreference}
      `;
      })
      .join("\n");
    memberDetailsHtml = [1, 2, 3]
      .map((member) => {
        const firstName = otherData[`member${member}FirstName`] || "Not provided";
        const surname = otherData[`member${member}Surname`] || "Not provided";
        const mealPreference = otherData[`member${member}MealPreference`] || "Not provided";
        return `
        <h4>Member ${member}</h4>
        <ul>
          <li><strong>First Name:</strong> ${firstName}</li>
          <li><strong>Surname:</strong> ${surname}</li>
          <li><strong>Meal Preference:</strong> ${mealPreference}</li>
        </ul>
      `;
      })
      .join("");
  } else if (membershipType === "family") {
    memberDetailsText = `
      Adults:
      ${[1, 2]
        .map((adult) => {
          const firstName = otherData[`adult${adult}FirstName`] || "Not provided";
          const surname = otherData[`adult${adult}Surname`] || "Not provided";
          return `
        Adult ${adult}:
        - First Name: ${firstName}
        - Surname: ${surname}
      `;
        })
        .join("\n")}
      Children:
      ${[1, 2, 3]
        .map((child) => {
          const firstName = otherData[`child${child}FirstName`] || "Not provided";
          const surname = otherData[`child${child}Surname`] || "Not provided";
          return `
        Child ${child}:
        - First Name: ${firstName}
        - Surname: ${surname}
      `;
        })
        .join("\n")}
      Meal Preference: ${otherData.member5MealPreference || "Not provided"}
    `;
    memberDetailsHtml = `
      <h3>Adults</h3>
      ${[1, 2]
        .map((adult) => {
          const firstName = otherData[`adult${adult}FirstName`] || "Not provided";
          const surname = otherData[`adult${adult}Surname`] || "Not provided";
          return `
        <h4>Adult ${adult}</h4>
        <ul>
          <li><strong>First Name:</strong> ${firstName}</li>
          <li><strong>Surname:</strong> ${surname}</li>
        </ul>
      `;
        })
        .join("")}
      <h3>Children</h3>
      ${[1, 2, 3]
        .map((child) => {
          const firstName = otherData[`child${child}FirstName`] || "Not provided";
          const surname = otherData[`child${child}Surname`] || "Not provided";
          return `
        <h4>Child ${child}</h4>
        <ul>
          <li><strong>First Name:</strong> ${firstName}</li>
          <li><strong>Surname:</strong> ${surname}</li>
        </ul>
      `;
        })
        .join("")}
      <h4>Meal Preference</h4>
      <p>${otherData.member5MealPreference || "Not provided"}</p>
    `;
  } else {
    const mealPreference = otherData.member1MealPreference || otherData.member2MealPreference || "Not provided";
    memberDetailsText = `
      First Name: ${firstname || "Not provided"}
      Surname: ${surname || "Not provided"}
      Meal Preference: ${mealPreference}
    `;
    memberDetailsHtml = `
      <ul>
        <li><strong>First Name:</strong> ${firstname || "Not provided"}</li>
        <li><strong>Surname:</strong> ${surname || "Not provided"}</li>
        <li><strong>Meal Preference:</strong> ${mealPreference}</li>
      </ul>
    `;
  }

  return {
    text: `
New Membership Signup:

Membership Details:
- Title: ${title || "Not provided"}
- Type: ${membershipType || "Not provided"}
- Price: SBD ${price || "Not provided"}
- Key: ${key || "Not provided"}
- Seat Selection: ${seatSelection || "Not specified"}
- Payment Method: ${paymentMethod || "Not specified"}

Personal Details:
${memberDetailsText}

Contact Details:
- Address: ${address || "Not provided"}
- Telephone: ${telephone || "Not provided"}
- Mobile: ${mobile || "Not provided"}
- Email: ${email || "Not provided"}

Payment Details:
- Membership Number: ${membershipnumber || "Not provided"}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a73e8;">New Membership Signup</h2>
        <h3>Membership Details</h3>
        <ul>
          <li><strong>Title:</strong> ${title || "Not provided"}</li>
          <li><strong>Type:</strong> ${membershipType || "Not provided"}</li>
          <li><strong>Price:</strong> SBD ${price || "Not provided"}</li>
          <li><strong>Key:</strong> ${key || "Not provided"}</li>
          <li><strong>Seat Selection:</strong> ${seatSelection || "Not specified"}</li>
          <li><strong>Payment Method:</strong> ${paymentMethod || "Not specified"}</li>
        </ul>
        <h3>Personal Details</h3>
        ${memberDetailsHtml}
        <h3>Contact Details</h3>
        <ul>
          <li><strong>Address:</strong> ${address || "Not provided"}</li>
          <li><strong>Telephone:</strong> ${telephone || "Not provided"}</li>
          <li><strong>Mobile:</strong> ${mobile || "Not provided"}</li>
          <li><strong>Email:</strong> ${email || "Not provided"}</li>
        </ul>
        <h3>Payment Details</h3>
        <ul>
          <li><strong>Membership Number:</strong> ${membershipnumber || "Not provided"}</li>
        </ul>
        <footer style="margin-top: 20px; font-size: 12px; color: #888;">
          <p>Belama Membership Services &copy; ${new Date().getFullYear()}</p>
        </footer>
      </div>
    `,
  };
}