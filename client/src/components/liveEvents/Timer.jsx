/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

const Timer = ({
  time,
  setTime,
  isPaused,
  startTimer,
  pauseTimer,
  resetTimer,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [minutes, setMinutes] = useState(
    Math.floor(time / 60)
      .toString()
      .padStart(2, "0")
  );
  const [seconds, setSeconds] = useState(
    (time % 60).toString().padStart(2, "0")
  );

  useEffect(() => {
    if (!isEditing) {
      setMinutes(
        Math.floor(time / 60)
          .toString()
          .padStart(2, "0")
      );
      setSeconds((time % 60).toString().padStart(2, "0"));
    }
  }, [time, isEditing]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleEditClick = () => {
    setIsEditing(true);
    pauseTimer();
  };

  const handleSaveClick = () => {
    const totalSeconds = parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
    setTime(totalSeconds);
    setIsEditing(false);
    //startTimer();
  };

  const handleReset = () => {
    resetTimer();
    setMinutes("00");
    setSeconds("00");
  };

  return (
    <div className="flex justify-between items-center gap-2">
      <h1
        className={`text-6xl font-bold ${
          isPaused ? "flash-red" : "text-[#3051A8]"
        }`}
      >
        {isEditing ? (
          <div className="flex items-center justify-center text-5xl">
            <input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value.padStart(2, "0"))}
              className="w-20 text-center flex items-center justify-center h-12"
              min="0"
            />
            <span className="text-black m-auto justify-center text-4xl px-2 flex items-center">
              :
            </span>
            <input
              type="number"
              value={seconds}
              onChange={(e) => setSeconds(e.target.value.padStart(2, "0"))}
              className="w-20 text-center flex items-center justify-center h-12"
              min="0"
              max="59"
            />
          </div>
        ) : (
          formatTime(time)
        )}
      </h1>
      <div className="flex flex-col items-center gap-2 font-semibold">
        <div className="flex gap-2 items-center">
          {!isEditing && (
            <>
              <button
                onClick={startTimer}
                className="bg-[#3051A8] text-white w-16 rounded"
              >
                START
              </button>
              <button
                onClick={pauseTimer}
                className="bg-[#3051A8] text-white w-16 rounded"
              >
                PAUSE
              </button>
            </>
          )}
        </div>
        <div className="flex gap-2 items-center">
          {!isEditing ? (
            <>
              <button
                onClick={handleReset}
                className="bg-[#3051A8] text-white w-16 rounded"
              >
                RESET
              </button>
              <button
                onClick={handleEditClick}
                className="bg-[#3051A8] text-white w-16 rounded"
              >
                EDIT
              </button>
            </>
          ) : (
            <button
              onClick={handleSaveClick}
              className="bg-[#3051A8] text-white w-16 rounded"
            >
              SAVE
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timer;
