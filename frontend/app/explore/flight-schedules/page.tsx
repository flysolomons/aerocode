import Recommendations from "@/components/layout/Recommendations";
import Container from "../../../components/common/Container";
import SecondaryHero from "../../../components/layout/SecondaryHero";
import DestinationRecommendations from "@/components/layout/Recommendations";
import Tab from "@/components/common/Tab";
import Accordion from "@/components/common/Accordion";
import RadioButton from "@/components/common/RadioButton";

export default function FlightSchedules() {
  const scheduleItems = [
    {
      title: "Monday",
      content: (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-50 rounded-[10px] overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                  Flight
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                  Departing from
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                  Arriving to
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                  Departure Time
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                  Arrival Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-gray-50">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-600 text-center">
                  IE722
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 text-center">
                  Honiara
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 text-center">
                  Santo
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 text-center">
                  11:55
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 text-center">
                  13:35
                </td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      title: "Tuesday",
      content: (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-50 rounded-[10px] overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Flight
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Departing from
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Arriving to
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Departure Time
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Arrival Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-gray-50">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-600">IE722</td>
                <td className="px-4 py-3 text-sm text-gray-600">Honiara</td>
                <td className="px-4 py-3 text-sm text-gray-600">Santo</td>
                <td className="px-4 py-3 text-sm text-gray-600">11:55</td>
                <td className="px-4 py-3 text-sm text-gray-600">13:35</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      title: "Wednesday",
      content: (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-50 rounded-[10px] overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Flight
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Departing from
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Arriving to
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Departure Time
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Arrival Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-gray-50">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-600">IE722</td>
                <td className="px-4 py-3 text-sm text-gray-600">Honiara</td>
                <td className="px-4 py-3 text-sm text-gray-600">Santo</td>
                <td className="px-4 py-3 text-sm text-gray-600">11:55</td>
                <td className="px-4 py-3 text-sm text-gray-600">13:35</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      ),
    },
    // Add other days...
  ];

  const tabs = [
    {
      label: "International",
      content: (
        <div className="space-y-4">
          <Accordion items={scheduleItems} defaultOpen={0} />
        </div>
      ),
    },
    {
      label: "Domestic",
      content: (
        <div className="space-y-4">
          <Accordion items={scheduleItems} defaultOpen={0} />
        </div>
      ),
    },
  ];

  return (
    // <>
    //   <SecondaryHero
    //     title="Flight Schedules"
    //     image="/hero.jpg"
    //     breadcrumbs="Home > Explore > Flight Schedules"
    //   />

    //   <Container>
    //     <div className="py-12 space-y-16">
    //       {/* Description */}
    //       <span className="block text-center">
    //         Explore our weekly flight schedules for both international and
    //         domestic routes. Whether you're jetting off to a global destination
    //         or traveling closer to home, we've got you covered. Valid from Jan
    //         2025 to Dec 2025. Please note that schedules are subject to
    //         change—check back regularly or contact us for the latest updates.
    //         Your journey starts here!
    //       </span>

    //       {/* Tabs */}
    //       <Tab tabs={tabs} />

    //       <DestinationRecommendations />
    //     </div>
    //   </Container>
    // </>

    <>
      <SecondaryHero
        title="Flight Schedules"
        image="/hero.jpg"
        breadcrumbs="Home > Explore > Flight Schedules"
      />

      <Container>
        <div className="py-12 space-y-16">
          {/* Description */}
          <span className="block text-center">
            Explore our weekly flight schedules for both international and
            domestic routes. Whether you're jetting off to a global destination
            or traveling closer to home, we've got you covered. Valid from Jan
            2025 to Dec 2025. Please note that schedules are subject to
            change—check back regularly or contact us for the latest updates.
            Your journey starts here!
          </span>

          <div className="flex justify-center">
            <RadioButton optionOne="International" optionTwo="Domestic" />
          </div>

          <div>
            <Accordion items={scheduleItems} defaultOpen={0} />
          </div>

          <Recommendations />
        </div>
      </Container>
    </>
  );
}
