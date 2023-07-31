'use client'
import React, { useState, useEffect } from 'react';



function ElapsedTimeLabel({ elapsedTime, setElapsedTime,selectedName, isRunning, startTime }) {

    useEffect(() => {
        let interval;
        if (isRunning) {
          interval = setInterval(() => {
            setElapsedTime(Date.now() - startTime);
          }, 1000);
        }
    
        return () => clearInterval(interval);
      }, [isRunning, startTime]);

    const formatTime = (time) => {
      const seconds = Math.floor((time / 1000) % 60);
      const minutes = Math.floor((time / 1000 / 60) % 60);
      const hours = Math.floor((time / 1000 / 60 / 60) % 24);
  
      return `${selectedName} | ${hours.toString().padStart(2, '0')}:
              ${minutes.toString().padStart(2, '0')}:
              ${seconds.toString().padStart(2, '0')}`;
    };
  
    return <div className="my-4">Elapsed Time: {formatTime(elapsedTime)}</div>;
  }

export default ElapsedTimeLabel;