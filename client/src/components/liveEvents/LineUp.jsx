/* eslint-disable react/prop-types */
import PlayerCard from "./PlayerCard";

const LineUp = ({ justify, margin, team, activePlayer, onPlayerClick }) => {
  
  const handlePlayerClick = (player) => {
    onPlayerClick(player._id); 
  };

  
  const getPlayersByPosition = (positions) => {
    return team
      ?.filter((player) => positions.includes(player.position))
      .sort((a, b) => positions.indexOf(a.position) - positions.indexOf(b.position));
  };

  return (
    <div
      className={`flex flex-wrap gap-3 mx-auto w-9/12 bg-black/20 p-1 rounded-md  overflow-auto  ${margin}`}
    >
      {/* Goalkeeper and TBD section */}
      <div className={`flex gap-3 w-full items-center  flex-wrap ${justify}`}>
        {getPlayersByPosition(["GK", "TBD"]).map((player, index) => (
          <PlayerCard
            key={index}
            position={player.position}
            number={player.number}
            name={`${player.firstName} ${player.secondName}`}
            color={"bg-[#eb596dd8]"}
            isActive={activePlayer?._id === player._id}
            onClick={() => handlePlayerClick(player)}
          />
        ))}
      </div>

      {/* LW, PV, RW section */}
      <div className={`flex gap-3 w-full items-center flex-wrap  ${justify}`}>
        {getPlayersByPosition(["LW", "PV", "RW"]).map((player, index) => (
          <PlayerCard
            key={index}
            position={player.position}
            number={player.number}
            name={`${player.firstName} ${player.secondName}`}
            color={"bg-white"}
            isActive={activePlayer?._id === player._id}
            onClick={() => handlePlayerClick(player)}
          />
        ))}
      </div>

      {/* LB, CB, RB section */}
      <div className={`flex gap-3 w-full items-center flex-wrap ${justify}`}>
        {getPlayersByPosition(["LB", "CB", "RB"]).map((player, index) => (
          <PlayerCard
            key={index}
            position={player.position}
            number={player.number}
            name={`${player.firstName} ${player.secondName}`}
            color={"bg-white"}
            isActive={activePlayer?._id === player._id}
            onClick={() => handlePlayerClick(player)}
          />
        ))}
      </div>
    </div>
  );
};

export default LineUp;
