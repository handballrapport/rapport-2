/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { getCode } from "country-list";
import { useState, useEffect } from "react";
import { useTimer } from "../../contexts/TimerContext";
import SaveButton from "./SaveButton";
import Score from "./Score";
import Timer from "./Timer";

const Scoreboard = ({ homeTeam, awayTeam, saveEventData, selectedGame }) => {
  const {
    time,
    setTime,
    isPaused,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useTimer();

  // Initialize score based on selectedGame prop
  const [score, setScore] = useState({
    teamA: selectedGame?.score?.home,
    teamB: selectedGame?.score?.away,
  });

  // Update the score state when selectedGame prop changes
  useEffect(() => {
    if (selectedGame) {
      setScore({
        teamA: selectedGame.score.home,
        teamB: selectedGame.score.away,
      });
    }
  }, [selectedGame]);

  const homeTeamCode = getCode(homeTeam.name);
  const awayTeamCode = getCode(awayTeam.name);

  return (
    <div className="text-center font-sans p-3 flex justify-center gap-28 border-b-2 border-black mb-1 w-11/12 mx-auto">
      <Timer
        time={time}
        setTime={setTime}
        isPaused={isPaused}
        startTimer={startTimer}
        pauseTimer={pauseTimer}
        resetTimer={resetTimer}
      />
      <SaveButton saveEventData={saveEventData} />
      <Score
        score={score}
        homeTeamCode={homeTeamCode}
        awayTeamCode={awayTeamCode}
      />
    </div>
  );
};

export default Scoreboard;
