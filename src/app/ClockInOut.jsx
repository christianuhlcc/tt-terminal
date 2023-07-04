'use client'
import React, { useState, useEffect } from 'react';

function ClockInOutComponent() {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedName, setSelectedName] = useState('');
  const [names] = useState(['John', 'Jane', 'Alice']);

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
      const event = {
        start_time: startTime,
        end_time: endTime,
        name: selectedName,
      };


      sumbitAttendance(event);
    
    // Clear elapsed time
    setElapsedTime(0);
  };
  };
  
  const sumbitAttendance = async (event) => {
      // Make API call to submit attendance event to Personio
      try {
        const response = await fetch('https://api.personio.com/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add any necessary headers for authentication or authorization
          },
          body: JSON.stringify(event),
        });

        if (response.ok) {
          console.log('Attendance event submitted successfully');
          // Do something with the successful response, e.g., show a success message
        } else {
          console.error('Failed to submit attendance event');
          // Handle the error case, e.g., show an error message
        }
      } catch (error) {
        console.error('Error occurred while submitting attendance event:', error);
        // Handle any network or request errors
      }
    }
  

  const formatTime = (time) => {

  
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 1000 / 60) % 60);
    const hours = Math.floor((time / 1000 / 60 / 60) % 24);

    return `${selectedName} | ${hours.toString().padStart(2, '0')}:
            ${minutes.toString().padStart(2, '0')}:
            ${seconds.toString().padStart(2, '0')}`;
  };

  const handleNameChange = (event) => {
    setSelectedName(event.target.value);
  };

  return (
    <div className="flex flex-col items-center">
    <div className="my-4">Elapsed Time: {formatTime(elapsedTime)}</div>
    <div className="relative inline-flex">
      <select
        value={selectedName}
        onChange={handleNameChange}
        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:border-blue-500"
      >
        <option value="">Select Name</option>
        {names.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 12l-4-4h8l-4 4z"
          />
        </svg>
      </div>
    </div>
    <button
      onClick={handleStart}
      disabled={isRunning || !selectedName}
      className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Start
    </button>
    <button
      onClick={handleStop}
      disabled={!isRunning}
      className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      Stop
    </button>
  </div>
  );
}

export default ClockInOutComponent;