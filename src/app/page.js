import Image from "next/image";
import ClockInOutComponent from "./ClockInOut";

const getToken = async () => {
  console.log("going in here", process.env.NEXT_PUBLIC_CLIENT_SECRET);
  const options = {
    mode: "no-cors",
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
    }),
  };

  const result = await fetch("https://api.personio.de/v1/auth", options);

  return result.json();
};

export default async function Home() {
  const data = await getToken();

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
        <ClockInOutComponent bearerToken={data.data.token} />
      </div>
    </main>
  ) : null;
}
