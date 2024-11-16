/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useContext } from "react";

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [time, setTime] = useState(() => {
    const savedTime = parseInt(localStorage.getItem("time"), 10) || 0;
    const lastUpdateTime = parseInt(localStorage.getItem("lastUpdateTime"), 10);
    const savedIsActive = JSON.parse(localStorage.getItem("isActive")) || false;

    if (savedIsActive && lastUpdateTime) {
      const currentTime = Date.now();
      const elapsedTime = Math.floor((currentTime - lastUpdateTime) / 1000);
      return savedTime + elapsedTime;
    }
    return savedTime;
  });

  const [isActive, setIsActive] = useState(() => {
    return JSON.parse(localStorage.getItem("isActive")) || false;
  });

  const [isPaused, setIsPaused] = useState(() => {
    return JSON.parse(localStorage.getItem("isPaused")) || false;
  });

  useEffect(() => {
    localStorage.setItem("time", time);
    localStorage.setItem("isActive", isActive);
    localStorage.setItem("isPaused", isPaused);
  }, [time, isActive, isPaused]);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
        localStorage.setItem("lastUpdateTime", Date.now().toString());
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
    localStorage.setItem("lastUpdateTime", Date.now().toString());
  };

  const pauseTimer = () => {
    setIsActive(false);
    setIsPaused(true);
    localStorage.removeItem("lastUpdateTime");
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTime(0);
    localStorage.removeItem("time");
    localStorage.removeItem("isActive");
    localStorage.removeItem("isPaused");
    localStorage.removeItem("lastUpdateTime");
  };

  return (
    <TimerContext.Provider value={{ time, setTime, isPaused, startTimer, pauseTimer, resetTimer }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  return useContext(TimerContext);
};
