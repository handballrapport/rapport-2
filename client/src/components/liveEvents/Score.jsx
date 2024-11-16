/* eslint-disable react/prop-types */
import FlagDisplay from "./FlagDisplay";

const Score = ({ score, homeTeamCode, awayTeamCode }) => {
    return (
      <div className="flex justify-center items-center gap-2">
        <FlagDisplay teamCode={homeTeamCode} team={homeTeamCode}  />
        <h2 className="text-4xl font-semibold">
          {score.teamA} - {score.teamB}
        </h2>
        <FlagDisplay teamCode={awayTeamCode} team={awayTeamCode} />
      </div>
    );
  };
  
  export default Score;
  