import { getCode } from "country-list";
import React, { useState } from "react";
import WorldFlag from "react-world-flags";

const GameSelect = ({ games, selectedGame, onGameChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelect = (gameId) => {
    onGameChange({ target: { value: gameId } });
    setIsDropdownOpen(false);
  };

  const selectedGameDetails = games?.find(
    (game) => game._id === selectedGame?._id
  );

  return (
    <div className="ml-2 w-1/3  relative border-2 rounded-md bg-slate-300 p-2">
      <button
        className=" w-full  text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md flex items-center justify-between"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {selectedGameDetails ? (
          <div className="flex items-center gap-2 justify-center w-full">
            <span className="flex items-center">
              {selectedGameDetails.home_team.name && (
                <WorldFlag
                  code={getCode(selectedGameDetails.home_team.name)}
                  className="w-6 h-4 mr-2"
                />
              )}
              {selectedGameDetails.home_team.name}
            </span>
            <span>vs</span>
            <span className="flex items-center">
              {selectedGameDetails.away_team.name && (
                <WorldFlag
                  code={getCode(selectedGameDetails.away_team.name)}
                  className="w-6 h-4 mr-2"
                />
              )}
              {selectedGameDetails.away_team.name}
            </span>
          </div>
        ) : (
          "Choose a game"
        )}
      </button>
      {isDropdownOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          {games.map((game) => {
            const homeTeamCode = getCode(game.home_team.name);
            const awayTeamCode = getCode(game.away_team.name);

            return (
                <li
                key={game._id}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center justify-between gap-2 "
                onClick={() => handleSelect(game._id)}
              >
                <span className="flex  items-center">
                  {homeTeamCode && (
                    <WorldFlag code={homeTeamCode} className="m-2 w-6 h-4" />
                  )}
                  <span>{game.home_team.name}</span>
                </span>
                <span className="">VS</span>
                <span className="flex items-center ">
                    <span>{game.away_team.name}</span>
                  {awayTeamCode && (
                    <WorldFlag code={awayTeamCode} className="m-2 w-6 h-4" />
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default GameSelect;
