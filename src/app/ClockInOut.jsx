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
  };

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
    <div>
      
      <select value={selectedName} onChange={handleNameChange}>
        <option value="">Select Name</option>
        {names.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <button type="button"  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={handleStart} disabled={isRunning || !selectedName}>
        Start
      </button>
      <button type="button"  class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={handleStop} disabled={!isRunning}>
        Stop
      </button>

      <div className="text-lg text-gray-500" >Elapsed Time: {formatTime(elapsedTime)}</div>
    </div>
  );
}

export default ClockInOutComponent;
