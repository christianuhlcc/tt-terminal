import ClockInOutComponent from "./ClockInOut";
import { format } from "date-fns";
import Header from "./Header";
import Content from "./Content";

const getToken = async () => {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      client_secret: process.env.CLIENT_SECRET,
      client_id: process.env.CLIENT_ID,
    }),
  };

  const result = await fetch("https://api.personio.de/v1/auth", options);

  return result.json();
};

const getEmployees = async (token) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      authorization: `Bearer ${token}`,
    },
  };

  const result = await fetch(
    `https://api.personio.de/v1/company/employees`,
    options
  );

  return result.json();
};

export default async function Home() {
  const data = await getToken();
  const employees = await getEmployees(data.data.token);

  const clockIn = async (event) => {
    "use server";
    try {
      const response = await fetch(
        "https://api.personio.de/v1/company/attendances",
        {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            authorization: `Bearer ${data.data.token}`,
          },
          body: JSON.stringify(event),
        }
      );

      if (response.ok) {
      } else {
        console.error("Failed to open attendance event");
      }
    } catch (error) {
      console.error("Error occurred while opening attendance event:", error);
    }
  };

  const clockOut = async (event) => {
    "use server";
    console.log("clockout event", event);
    try {
      const response = await fetch(
        `https://api.personio.de/v1/company/attendances/${event.id}`,
        {
          method: "PATCH",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            authorization: `Bearer ${data.data.token}`,
          },
          body: JSON.stringify({
            end_time: event.end_time,
          }),
        }
      );

      console.log(event);
      if (response.ok) {
      } else {
        console.error("Failed to close attendance event");
      }
    } catch (error) {
      console.error("Error occurred while closing attendance event:", error);
    }
  };

  const fetchCurrentOpenEndedAttendance = async (employeeId) => {
    "use server";

    const options = {
      method: "GET",
      next: { revalidate: 0 }, // don't cache brah
      headers: {
        accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        authorization: `Bearer ${data.data.token}`,
      },
    };

    const currentDay = format(new Date(), "yyyy-MM-dd");

    const attendances = await fetch(
      `https://api.personio.de/v1/company/attendances?start_date=${currentDay}&end_date=${currentDay}&includePending=true&employees[]=${employeeId}`,
      options
    ).then((response) => response.json());
    if(attendances) {
      const onlyOpenEndedAttendances = attendances.data.filter(
          (attendancePeriod) => !attendancePeriod.attributes.end_time
      );
      return onlyOpenEndedAttendances;
    }
    return [];

  };

  return data ? (
    <main style={{ padding: "12px 24px", height: "100vh" }}>
      <Header />
      <Content>
        <ClockInOutComponent
          clockIn={clockIn}
          clockOut={clockOut}
          employees={employees.data}
          fetchCurrentOpenEndedAttendance={fetchCurrentOpenEndedAttendance}
        />
      </Content>
    </main>
  ) : null;
}
