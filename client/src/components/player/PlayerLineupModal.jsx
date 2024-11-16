/* eslint-disable react/prop-types */
import { FaTimes } from "react-icons/fa";

const TeamLineup = ({ teamName, players, addAllToLineup, updateLineup }) => {
  // Toggle switch style
  const toggleStyle = {
    width: "50%",
    height: "25px",
    backgroundColor: "#ccc",
    borderRadius: "50px",
    position: "relative",
    cursor: "pointer",
    transition: "background-color 0.3s",
  };

  const circleStyle = {
    width: "22px",
    height: "22px",
    backgroundColor: "#fff",
    borderRadius: "50%",
    position: "absolute",
    top: "1.5px",
    left: "1.5px",
    transition: "transform 0.3s",
  };

  return (
    <div className=" border border-slate-400 p-1 rounded-md">
      <div className="flex w-full justify-between items-center mb-2 border-b-black/90 border p-2">
        <h3 className="text-lg font-semibold">{teamName}</h3>
        <button
          onClick={() => addAllToLineup(players)}
          className="bg-blue-900 text-white px-3 py-1 rounded hover:bg-green-700 transition duration-300"
        >
          Add All to Lineup
        </button>
      </div>
      {players.map((player) => (
        <div
          key={player._id}
          className="grid grid-cols-3 py-1 border-b-2 "
        >
          <div className=" flex justify-center items-center "> <span className={`bg-blue-200 w-6 h-6 flex items-center justify-center rounded-full font-bold  ${player.lineup ? "bg-red-500 text-white" : null}`}>{player.number}</span></div>
          <div className=" flex justify-center items-center "> <span className={`bg-blue-400 w-6 h-6 flex items-center justify-center rounded-full font-bold text-sm `}>{player.position}</span></div>
          <div
            className="relative"
            style={toggleStyle}
            onClick={() => updateLineup(player._id)}
          >
            <div
              style={{
                ...circleStyle,
                transform: player.lineup ? "translateX(140%)" : "translateX(0)",
                backgroundColor: player.lineup ? "#4caf50" : "#fff",
                boxShadow: player.lineup
                  ? "0 0 3px rgba(0, 0, 0, 0.2)"
                  : "none",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const PlayerLineupModal = ({
  isOpen,
  onClose,
  homePlayers,
  awayPlayers,
  updateLineup,
  home,
  away,
}) => {
  if (!isOpen) return null;

  const filterAndSortPlayers = (players) => {
    return players
      .filter((player) => player.position !== "TBD")
      .sort((a, b) => a.number - b.number);
  };

  const sortedHomePlayers = filterAndSortPlayers(homePlayers);
  const sortedAwayPlayers = filterAndSortPlayers(awayPlayers);

  const addAllToLineup = (players, teamType) => {
    players.forEach((player) => {
      if (!player.lineup) {
        updateLineup(player._id, teamType);
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className=" p-5 rounded-lg w-10/12 max-w-3xl relative bg-[#F2f2f2]">
        <h2 className="text-xl mb-4 text-center capitalize">Lineup Management</h2>
        <div className="grid grid-cols-2 gap-4">
          <TeamLineup
            teamName={home}
            players={sortedHomePlayers}
            addAllToLineup={(players) => addAllToLineup(players, "home")}
            updateLineup={(id) => updateLineup(id, "home")}
          />
          <TeamLineup
            teamName={away}
            players={sortedAwayPlayers}
            addAllToLineup={(players) => addAllToLineup(players, "away")}
            updateLineup={(id) => updateLineup(id, "away")}
          />
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 w-10 h-10 flex justify-center items-center rounded-full"
        >
          <FaTimes className="bg-blue-900 p-1 text-white rounded-full text-4xl hover:scale-110 hover:rotate-180 transform transition duration-500 absolute top-3 right-3" />
        </button>
      </div>
    </div>
  );
};

export default PlayerLineupModal;
