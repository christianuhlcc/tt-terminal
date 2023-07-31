import Image from "next/image";
import ClockInOutComponent from "./ClockInOut";
import { format } from "date-fns";

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
      authorization: `Bearer ${token}`
    }
  };

  const result = await fetch(`https://api.personio.de/v1/company/employees`, options);

  return result.json();
};

export default async function Home() {
  const data = await getToken();
  const employees = await getEmployees(data.data.token);

  const clockIn = async (event) => {
    "use server";
    // Make API call to submit attendance event to Personio
    try {
      const response = await fetch(
        "https://api.personio.de/v1/company/attendances",
        {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            authorization: `Bearer ${data.data.token}`,
            // Add any necessary headers for authentication or authorization
          },
          body: JSON.stringify(event),
        }
      );

      console.log(event);
      console.log("-------");
      console.log(response);
      if (response.ok) {
        console.log("Attendance event opened successfully");
        // console.log(response);
        // Do something with the successful response, e.g., show a success message
      } else {
        console.error("Failed to open attendance event");
        console.log("Token", process.env.CLIENT_ID);
        // Handle the error case, e.g., show an error message
      }
    } catch (error) {
      console.error("Error occurred while opening attendance event:", error);
      // Handle any network or request errors
    }
  };


  const clockOut = async (event) => {
    "use server";
    // Make API call to submit attendance event to Personio
    console.log("clockout event", event)
    try {
      const response = await fetch(
        `https://api.personio.de/v1/company/attendances/${event.id}`,
        {
          method: "PATCH",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
            authorization: `Bearer ${data.data.token}`,
            // Add any necessary headers for authentication or authorization
          },
          body: JSON.stringify({
            "end_time": event.end_time
          }),
        }
      );

      console.log(event);
      if (response.ok) {
        console.log("Attendance event closed successfully");
        // console.log(response);
        // Do something with the successful response, e.g., show a success message
      } else {
        console.error("Failed to close attendance event");
        console.log("Token", process.env.CLIENT_ID);
        // Handle the error case, e.g., show an error message
      }
    } catch (error) {
      console.error("Error occurred while closing attendance event:", error);
      // Handle any network or request errors
    }
  };

  const fetchCurrentOpenEndedAttendance = async (employeeId) => {
    "use server";

    const options = {
      method: 'GET',
      next: { revalidate: 0 }, // don't cache brah
      headers: {
        accept: 'application/json',
        "Access-Control-Allow-Origin": "*",
        authorization: `Bearer ${data.data.token}`
      }
    };

    const currentDay = format(new Date(), 'yyyy-MM-dd')

    const attendances = await fetch(`https://api.personio.de/v1/company/attendances?start_date=${currentDay}&end_date=${currentDay}&includePending=true&employees[]=${employeeId}`, options)
      .then(response => response.json())

    console.log("returend filtered ", attendances.data)
    const onlyOpenEndedAttendances = attendances.data.filter(attendancePeriod => !attendancePeriod.attributes.end_time)
    console.log("filtered", onlyOpenEndedAttendances)

    return onlyOpenEndedAttendances
  }

  return data ? (
    <main className="flex min-h-screen flex-col items-center justify-between p-48">
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/logo-personio.png"
          alt="Personio Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[30px] before:w-[480px] ">
        <ClockInOutComponent clockIn={clockIn} clockOut={clockOut} employees={employees.data} fetchCurrentOpenEndedAttendance={fetchCurrentOpenEndedAttendance} />
      </div>
    </main>
  ) : null;
}
