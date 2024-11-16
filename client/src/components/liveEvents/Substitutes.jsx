import React from "react";
import PlayerCard from "./PlayerCard"; // Make sure to import the PlayerCard component

const Substitutes = ({ justify, team, onPlayerClick }) => {
  // Handler to manage player click and swap logic
  const handlePlayerClick = (player) => {
    onPlayerClick(player._id); // Trigger the parent function with the player's ID
  };

  // Sort players based on the specified order and filter by position
  const getPlayersByPosition = (positions) => {
    return team
      ?.filter((player) => positions.includes(player.position))
      .sort((a, b) => positions.indexOf(a.position) - positions.indexOf(b.position));
  };

  return (
    <div className="flex flex-wrap justify-center gap-1 mx-auto p-1 rounded-md">
      {/* First row (e.g., GK, TBD) */}
      <div className={`flex gap-1 w-full ${justify}`}>
        {getPlayersByPosition(["TBD", "GK"]).map((substitute, index) => (
          <PlayerCard
            key={index}
            position={substitute.position}
            number={substitute.number}
            name={`${substitute.firstName} ${substitute.secondName}`}
            color={substitute.color}
            text="text-black"
            onClick={() => handlePlayerClick(substitute)}
          />
        ))}
      </div>

      {/* Second row (e.g., LW, PV, RW) */}
      <div className={`flex gap-1 w-full ${justify}`}>
        {getPlayersByPosition(["RW", "PV", "LW"]).map((substitute, index) => (
          <PlayerCard
            key={index}
            position={substitute.position}
            number={substitute.number}
            name={`${substitute.firstName} ${substitute.secondName}`}
            color={substitute.color}
            text="text-black"
            onClick={() => handlePlayerClick(substitute)}
          />
        ))}
      </div>

      {/* Third row (e.g., LB, CB, RB) */}
      <div className={`flex gap-1 w-full ${justify}`}>
        {getPlayersByPosition(["RB", "CB", "LB"]).map((substitute, index) => (
          <PlayerCard
            key={index}
            position={substitute.position}
            number={substitute.number}
            name={`${substitute.firstName} ${substitute.secondName}`}
            color={substitute.color}
            text="text-black"
            onClick={() => handlePlayerClick(substitute)}
          />
        ))}
      </div>

      {/* Additional substitutes */}
      <div className={`flex gap-1 w-full ${justify}`}>
        {team
          ?.filter(
            (player) =>
              !["GK", "TBD", "LW", "PV", "RW", "LB", "CB", "RB"].includes(player.position)
          )
          .map((substitute, index) => (
            <PlayerCard
              key={index}
              position={substitute.position}
              number={substitute.number}
              name={`${substitute.firstName} ${substitute.secondName}`}
              color={substitute.color}
              text="text-black"
              onClick={() => handlePlayerClick(substitute)}
            />
          ))}
      </div>
    </div>
  );
};

export default Substitutes;
