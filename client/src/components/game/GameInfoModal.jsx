import { getCode } from "country-list";
import React from "react";
import WorldFlag from "react-world-flags";
import Modal from "../Modal";

const GameInfoModal = ({ isOpen, closeModal, game, teams, competitions }) => {
  if (!game) return null;

  const homeTeam = teams.find((team) => team._id === game.home_team._id);
  const awayTeam = teams.find((team) => team._id === game.away_team._id);
  const competition = competitions.find(
    (comp) => comp._id === game.competition
  );

  // Get country codes for home and away teams
  const homeTeamCountryCode = getCode(homeTeam?.name);
  const awayTeamCountryCode = getCode(awayTeam?.name);

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      title="Game Information"
      width={"w-1/2"}
    >
      <div className="p-4">
        <div className="flex items-center mb-4 justify-center gap-2">
          {homeTeamCountryCode && (
            <WorldFlag code={homeTeamCountryCode} className="w-8 h-5 mr-2" />
          )}
          <h4 className="text-lg font-bold flex gap-2 ">
            <span>{homeTeam?.name}</span>
            <span className="uppercase">vs</span>
            <span>{awayTeam?.name}</span>
          </h4>
          {awayTeamCountryCode && (
            <WorldFlag code={awayTeamCountryCode} className="w-8 h-5 ml-2" />
          )}
        </div>
        <div className="grid grid-cols-2 capitalize">
          <p className="border-b-2 mb-2 py-1">
            <strong>Competition:</strong> {competition?.name}
          </p>
          <div className="border-b-2 mb-2 py-1 flex items-center gap-2">
            <strong>Score:</strong>
            <div className="flex gap-2">
              <span>{homeTeam?.name}</span>
              <span>{game.score.home}</span>
            </div>
            <span>-</span>
            <div className="flex gap-2">
              <span>{game.score.away}</span>
              <span>{awayTeam?.name}</span>
            </div>
          </div>
          <p className="border-b-2 mb-2 py-1">
            <strong>Status:</strong> {game.status}
          </p>
          <p className="border-b-2 mb-2 py-1">
            <strong>Referees:</strong> {game.referees.join(", ")}
          </p>
          <p className="border-b-2 mb-2 py-1 ">
            <strong>Date:</strong> {new Date(game.match_date).toLocaleString()}
          </p>
          <p className="border-b-2 mb-2 py-1">
            <strong>Location:</strong> {game.location ? game.location : " not defined"}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default GameInfoModal;
