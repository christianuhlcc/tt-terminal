'use client'
import { useEffect, useState } from "react";

function ClockInOutComponent({ sumbitAttendance, employees }) {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedName, setSelectedName] = useState("");

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const handleStart = () => {
    if (!isRunning && selectedName) {
      setStartTime(Date.now());
      setIsRunning(true);
    }
  };

  const handleStop = async () => {
    if (isRunning) {
      setEndTime(Date.now());
      setIsRunning(false);
      setElapsedTime(endTime - startTime);

      // Create attendance event
      const AttendanceEvent = {
        attendances: [
          {
            start_time: "08:00",
            //end_time: endTime,
            employee: 7044877,
            date: '2023-07-31',
            break: 0
          }
        ]
      };

      sumbitAttendance(AttendanceEvent);

      // Clear elapsed time
      setElapsedTime(0);
    }
  };

  const formatTime = (time) => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 1000 / 60) % 60);
    const hours = Math.floor((time / 1000 / 60 / 60) % 24);

    return `${selectedName} | ${hours.toString().padStart(2, "0")}:
            ${minutes.toString().padStart(2, "0")}:
            ${seconds.toString().padStart(2, "0")}`;
  };

  const handleNameChange = (event) => {
    setSelectedName(event.target.value);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="my-4">Elapsed Time: {formatTime(elapsedTime)}</div>
      <form action={handleStop} className="relative inline-flex">
        <select
          value={selectedName}
          onChange={handleNameChange}
          className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:border-blue-500"
        >
          <option value="">Select Name</option>
          {employees.map((employee) => (
            <option key={employee.attributes.id.value} value={employee.attributes.id.value}>
              {employee.attributes.first_name.value} {employee.attributes.last_name.value}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M10 12l-4-4h8l-4 4z" />
          </svg>
        </div>
        <button
          onClick={handleStart}
          disabled={isRunning || !selectedName}
          className="mt-4 bg-blue-500 hover:bg-blue-700 disabled:bg-grey-100 text-white font-bold py-2 px-4 rounded"
        >
          Clock In
        </button>
        <button
          type="submit"
          disabled={!isRunning}
          className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Clock Out
        </button>
      </form>
    </div>
  );
}

export default ClockInOutComponent;
