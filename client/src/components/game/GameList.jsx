import React, { useState } from "react";
import { FaInfoCircle, FaEdit, FaTrash } from "react-icons/fa";
import GameInfoModal from "./GameInfoModal";
import { getCode } from "country-list";
import WorldFlag from "react-world-flags";

const GameList = ({
  games,
  teams,
  openModal,
  handleDelete,
  competitions,
  handleStatusChange,
}) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const handleViewInfo = (game) => {
    setSelectedGame(game);
    setIsInfoModalOpen(true);
  };

  const closeInfoModal = () => {
    setIsInfoModalOpen(false);
    setSelectedGame(null);
  };

  const statusOptions = ["scheduled", "ongoing", "finished"];

  const getStatusClass = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-200";
      case "ongoing":
        return "bg-yellow-200";
      case "finished":
        return "bg-green-200";
      default:
        return "bg-gray-200";
    }
  };

  const calculateTimeLeft = (matchDate) => {
    const now = new Date();
    const gameDate = new Date(matchDate);
    const difference = gameDate - now;

    if (difference <= 0) return "Time's up";

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} left`;
    return `${minutes} minute${minutes > 1 ? "s" : ""} left`;
  };

  const getFlagCode = (teamName) => {
    if (teamName) {
      
      return getCode(teamName) || "";
    }
    return null
  };

  return (
    <div className="w-11/12 mx-auto">
      <div className="grid grid-cols-7  bg-white">
        <div className="font-bold border-b py-1">Home Team</div>
        <div className="font-bold border-b py-1">Away Team</div>
        <div className="font-bold border-b py-1">Competition</div>
        <div className="font-bold border-b py-1">Date</div>
        <div className="font-bold border-b py-1">Time Left</div>
        <div className="font-bold border-b py-1">Status</div>
        <div className="font-bold border-b py-1">Actions</div>

        {games?.map((game) => {
          const homeTeam = teams.find(
            (team) => team._id === game.home_team?._id
          );
          const awayTeam = teams.find(
            (team) => team._id === game.away_team?._id
          );
          const competition = competitions.find(
            (comp) => comp._id === game.competition
          );
          const homeFlagCode = getFlagCode(homeTeam?.name);
          const awayFlagCode = getFlagCode(awayTeam?.name);

          return (
            <React.Fragment key={game._id}>
              <div className="flex items-center gap-2 border-b py-1  ">
                {homeTeam?.name}
                {homeFlagCode && (
                  <WorldFlag code={homeFlagCode} className="w-6 h-4" />
                )}
                {game?.score.home}
              </div>
              <div className="flex items-center gap-2 border-b py-1 ">
                {game?.score.away}
                {awayFlagCode && (
                  <WorldFlag code={awayFlagCode} className="w-6 h-4" />
                )}
                {awayTeam?.name}
              </div>
              <div className="border-b py-1 flex items-center">{competition?.name}</div>
              <div className="border-b py-1 flex items-center">
                {new Date(game.match_date).toLocaleString()}
              </div>
              <div className="border-b py-1 flex items-center">
                {calculateTimeLeft(game.match_date)}
              </div>
              <div className="border-b py-1 flex items-center">
                <select
                  value={game.status}
                  onChange={(e) =>
                    handleStatusChange(game._id, e.target.value)
                  }
                  className={`${getStatusClass(
                    game.status
                  )} border-0 rounded-md px-2  capitalize`}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-center items-center space-x-2 border-b py-1 ">
                <button
                  onClick={() => handleViewInfo(game)}
                  className="bg-blue-500 text-white px-2 py-2 rounded-md hover:bg-blue-600 flex items-center"
                >
                  <FaInfoCircle />
                </button>
                <button
                  onClick={() => openModal(game)}
                  className="bg-green-500 text-white px-2 py-2 rounded-md hover:bg-green-600 flex items-center"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(game._id)}
                  className="bg-red-500 text-white px-2 py-2 rounded-md hover:bg-red-600 flex items-center"
                >
                  <FaTrash />
                </button>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <GameInfoModal
        isOpen={isInfoModalOpen}
        closeModal={closeInfoModal}
        game={selectedGame}
        teams={teams}
        competitions={competitions}
      />
    </div>
  );
};

export default GameList;
