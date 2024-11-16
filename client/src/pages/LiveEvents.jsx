import { useEffect, useState } from "react";
import { IoSaveOutline } from "react-icons/io5";
import GameSelect from "../components/game/GameSelect";
import Defense from "../components/liveEvents/Defense";
import LineUp from "../components/liveEvents/LineUp";
import Offense from "../components/liveEvents/Offense";
import OffenseSituation from "../components/liveEvents/OffenseSituation";
import Period from "../components/liveEvents/Period";
import Pitch from "../components/liveEvents/Pitch";
import Sanctions from "../components/liveEvents/Sanctions";
import Scoreboard from "../components/liveEvents/Scoreboard";
import Substitutes from "../components/liveEvents/Substitutes";
import TeamName from "../components/liveEvents/TeamName";
import TypeDefense from "../components/liveEvents/TypeDefense";
import Modal from "../components/Modal";
import PlayerLineupModal from "../components/player/PlayerLineupModal";
import ShotResult from "../components/ShotResult";
import { useTimer } from "../contexts/TimerContext";
import { useAddEventMutation } from "../features/eventSlice";
import { useGetGamesQuery, useUpdateGameMutation } from "../features/gameSlice";
import {
  useUpdatePlayerMutation,
  useUpdatePlayerStatisticsMutation,
} from "../features/playerSlice";
import { useGetTeamByIdQuery } from "../features/teamSlice";
import {
  handleGameChange,
  handlePlayerClick,
  resetSelection,
  swapPlayer,
} from "../utils/liveEventsUtils";
const LiveEvents = () => {
  const { time: currentTime } = useTimer();
  const [period, setPeriod] = useState(
    () => localStorage.getItem("activePeriod") || null
  );

  const [goalZone, setGoalZone] = useState(null);
  const [shotResult, setShotResult] = useState(null);
  const [shotPosition, setShotPosition] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [players, setPlayers] = useState({ home: [], away: [] });
  const [timeEvent, setTimeEvent] = useState(null);
  const [goalkeeperID, setGoalkeeper] = useState(null);
  const [selectedTypeDefense, setSelectedTypeDefense] = useState("6-0");
  const [selectedOffenseSituation, setSelectedOffenseSituation] = useState(
    "equal.att"
  );
  const [isGoalZoneModalOpen, setIsGoalZoneModalOpen] = useState(false);
  const [selectedDefense, setSelectedDefense] = useState(null);
  const [selectedOffense, setSelectedOffense] = useState(null);
  const [sanction, setSanction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: games, isLoading  , refetch: gameRefetch} = useGetGamesQuery();
  const [updatePlayer] = useUpdatePlayerMutation();
  const [addEvent] = useAddEventMutation();
  const [updatePlayerStatistics] = useUpdatePlayerStatisticsMutation();

  const homeTeamId = selectedGame?.home_team?._id;
  const awayTeamId = selectedGame?.away_team?._id;

  const {
    data: homeTeam,
    isLoading: isHomeTeamLoading,
  } = useGetTeamByIdQuery(homeTeamId, { skip: !homeTeamId });
  const {
    data: awayTeam,
    isLoading: isAwayTeamLoading,
  } = useGetTeamByIdQuery(awayTeamId, { skip: !awayTeamId });
  const [
    updateGame,
    { isLoading: isUpdating, error: updateError },
  ] = useUpdateGameMutation();
  useEffect(() => {
    const savedGameId = localStorage.getItem("selectedGameId");
    if (savedGameId && games) {
      const savedGame = games.find((g) => g._id === savedGameId);
      setSelectedGame(savedGame);
    }
  }, [games]);

  useEffect(() => {
    if (homeTeam && awayTeam) {
      setPlayers({
        home: homeTeam.players,
        away: awayTeam.players,
      });
    }
  }, [homeTeam, awayTeam]);

  useEffect(() => {
    if (goalZone !== null && goalZone !== 10) {
      setIsGoalZoneModalOpen(true);
    }
  }, [goalZone]);

  useEffect(() => {
    if (period) {
      localStorage.setItem("activePeriod", period);
    }
  }, [period]);
  useEffect(() => {
    // This will re-render the component when selectedGame changes
    if (selectedGame) {
      setSelectedGame(selectedGame); // Trigger re-render
    }
  }, [selectedGame]);
  const handleTimeEvent = (time) => {
    setTimeEvent(time);
  };

  const handlePlayerSelection = (playerId, teamType) => {
    if (selectedTeam && selectedTeam !== teamType) {
      setGoalZone(null);
      setShotPosition(null);
      setSelectedTypeDefense("6-0");
      setSelectedOffenseSituation("equal.att");
      setTimeEvent(null);
      setSelectedDefense(null);
      setSelectedOffense(null);
      setSanction(null);
    }

    handleTimeEvent(currentTime);

    handlePlayerClick(
      playerId,
      teamType,
      selectedPlayer,
      selectedTeam,
      players,
      setPlayers,
      (firstPlayerId, secondPlayerId, teamType, players, setPlayers) =>
        swapPlayer(
          firstPlayerId,
          secondPlayerId,
          teamType,
          players,
          setPlayers,
          updatePlayer
        ),
      setSelectedPlayer,
      setSelectedTeam,
      () => resetSelection(setSelectedPlayer, setSelectedTeam)
    );
  };

  const saveEventData = async () => {
    // Ensure a game is selected
    if (!selectedGame || !selectedGame._id) {
        console.error("No game selected. Please select a game before saving an event.");
        return;
    }

    const eventData = {
        player: selectedPlayer ? selectedPlayer._id : null,
        game: selectedGame._id, // Ensure the game ID is included
        timestamp: new Date(),
        goalZone,
        shotPosition,
        shotResult: shotResult ? shotResult : null,
        selectedTypeDefense,
        selectedOffenseSituation,
        timeEvent,
        selectedDefense,
        selectedOffense,
        sanction,
        period,
        goalkeeper: goalkeeperID ? goalkeeperID : null,
        team: selectedTeam === "home" ? homeTeam._id : awayTeam._id, // Ensure the team ID is included
    };

    try {
        // Save the event
        await addEvent(eventData).unwrap();

        // Update the score if a goal is scored
        if (shotResult === "Goal") {
            const updatedScore = { ...selectedGame.score };

            if (selectedTeam === "home") {
                updatedScore.home += 1;
            } else if (selectedTeam === "away") {
                updatedScore.away += 1;
            }

            // Update the local state for immediate UI feedback
            setSelectedGame(prevGame => ({
                ...prevGame,
                score: updatedScore
            }));

            // Send the updated score as JSON to the server
            await updateGame({
                id: selectedGame._id,
                formData: { score: updatedScore },
            }).unwrap();

            // Optionally, refetch the games to ensure the latest data
            gameRefetch();
        }

        // Update player statistics
        const playerStatisticsUpdates = ["shots"];
        if (goalZone === 10) {
            playerStatisticsUpdates.push("offTargetShots");
        } else if (shotResult === "Goal") {
            playerStatisticsUpdates.push("goals");
            playerStatisticsUpdates.push("onTargetShots");
        } else if (shotResult === "Saved") {
            playerStatisticsUpdates.push("onTargetShots");
        }

        if (sanction) {
            const sanctionStats = {
                "Yellow Card": "yellowCards",
                "Red Card": "redCards",
                "Blue Card": "blueCards",
                "2 Minutes": "suspended",
            };
            playerStatisticsUpdates.push(sanctionStats[sanction]);
        }

        if (selectedPlayer && playerStatisticsUpdates.length > 0) {
            await updatePlayerStatistics({
                id: selectedPlayer._id,
                action: "increment",
                fields: playerStatisticsUpdates,
            }).unwrap();
        }

        // Update goalkeeper statistics
        const goalkeeperStatisticsUpdates = [];
        if (shotResult === "Goal") {
            goalkeeperStatisticsUpdates.push("conceded");
        } else if (shotResult === "Saved") {
            goalkeeperStatisticsUpdates.push("saves");
        }

        if (goalkeeperID && goalkeeperStatisticsUpdates.length > 0) {
            await updatePlayerStatistics({
                id: goalkeeperID,
                action: "increment",
                fields: goalkeeperStatisticsUpdates,
            }).unwrap();
        }

    } catch (error) {
        console.error("Failed to save event or update statistics:", error);
    }

    resetSelections();
};




  const resetSelections = () => {
    resetSelection(setSelectedPlayer, setSelectedTeam); 
    setGoalZone(null);
    setShotPosition(null);
    setSelectedTypeDefense("6-0");
    setSelectedOffenseSituation("equal.att");
    setTimeEvent(null);
    setSelectedDefense(null);
    setSelectedOffense(null);
    setSanction(null);
    setShotResult(null);
    setGoalkeeper(null);
  };

  const updateLineup = (playerId, teamType) => {
    const player = players[teamType].find((p) => p._id === playerId);
    if (player) {
      const updatedPlayer = { ...player, lineup: !player.lineup };

      const formData = {
        lineup: updatedPlayer.lineup,
      };

      updatePlayer({ id: playerId, formData })
        .then(() => {
          setPlayers((prevPlayers) => ({
            ...prevPlayers,
            [teamType]: prevPlayers[teamType].map((p) =>
              p._id === playerId ? updatedPlayer : p
            ),
          }));
        })
        .catch((error) =>
          console.error("Failed to update player lineup:", error)
        );
    }
  };

  if (isLoading || isHomeTeamLoading || isAwayTeamLoading) {
    return <div className="spinner absolute top-[50%] right-[50%]" />;
  }

  const oppositeTeamGoalkeepers =
    selectedTeam === "home"
      ? players.away.filter(
          (player) => player.position === "GK" && player.lineup
        )
      : players.home.filter(
          (player) => player.position === "GK" && player.lineup
        );

  
  return (
    <>
      <GameSelect
        games={games}
        selectedGame={selectedGame}
        onGameChange={(event) =>
          handleGameChange(event, games, setSelectedGame)
        }
      />
      {selectedGame && homeTeam && awayTeam && (
        <div className="">
          <Period activePeriod={period} setActivePeriod={setPeriod} />
          <Scoreboard
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            homePlayers={players?.home}
            awayPlayers={players?.away}
            saveEventData={saveEventData}
            selectedGame={selectedGame}
          />
          <div className="flex justify-center items-stretch flex-col md:flex-row p-2">
            <div className="flex flex-col justify-start items-start w-4/12">
              <TeamName team={homeTeam.name} />
              <LineUp
                margin={"ml-0"}
                team={players?.home?.filter((player) => player.lineup)}
                activePlayer={selectedPlayer}
                onPlayerClick={(playerId) =>
                  handlePlayerSelection(playerId, "home")
                }
              />
              <Substitutes
                team={players.home.filter((player) => !player.lineup)}
                onPlayerClick={(playerId) =>
                  handlePlayerSelection(playerId, "home")
                }
              />
            </div>
            <div className="w-5/12 flex rounded-md flex-col items-center justify-between">
              <Pitch
                goalZone={goalZone}
                setGoalZone={setGoalZone}
                shotPosition={shotPosition}
                setShotPosition={setShotPosition}
              />
              <Sanctions sanction={sanction} setSanction={setSanction} />
              <div className="flex">
                <Defense
                  selectedDefense={selectedDefense}
                  setSelectedDefense={setSelectedDefense}
                />
                <Offense
                  selectedOffense={selectedOffense}
                  setSelectedOffense={setSelectedOffense}
                />
              </div>
            </div>
            <div className="flex flex-col justify-start items-end gap-0 w-4/12 bg-[#fbfbfb]">
              <TeamName team={awayTeam.name} />
              <LineUp
                justify={"justify-end"}
                margin={"mr-0"}
                team={players.away.filter((player) => player.lineup)}
                activePlayer={selectedPlayer}
                onPlayerClick={(playerId) =>
                  handlePlayerSelection(playerId, "away")
                }
              />
              <Substitutes
                justify={"justify-end"}
                team={players.away.filter((player) => !player.lineup)}
                onPlayerClick={(playerId) =>
                  handlePlayerSelection(playerId, "away")
                }
              />
            </div>
          </div>
          <div className="flex justify-center items-center flex-col">
            <div className="flex">
              <TypeDefense
                selectedTypeDefense={selectedTypeDefense}
                setSelectedTypeDefense={setSelectedTypeDefense}
              />
              <OffenseSituation
                selectedOffenseSituation={selectedOffenseSituation}
                setSelectedOffenseSituation={setSelectedOffenseSituation}
              />
            </div>
            <button
              onClick={saveEventData}
              className="bg-green-500 text-white flex flex-col justify-center items-center py-2 w-full rounded"
            >
              <IoSaveOutline className="text-2xl" />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="font-bold top-10 right-10 w-24 h-24 mt-4 absolute scale-btn"
            >
              Manage Lineup
            </button>
          </div>
        </div>
      )}
      <PlayerLineupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        homePlayers={players.home}
        awayPlayers={players.away}
        updateLineup={updateLineup}
        home={homeTeam?.name}
        away={awayTeam?.name}
      />
      <Modal
        isOpen={isGoalZoneModalOpen}
        closeModal={() => setIsGoalZoneModalOpen(false)}
      >
        <ShotResult
          shotResult={shotResult}
          setShotResult={setShotResult}
          goalkeepers={oppositeTeamGoalkeepers}
          goalkeeper={goalkeeperID}
          setGoalkeeper={setGoalkeeper}
          saveEventData={saveEventData}
          closeModal={() => setIsGoalZoneModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default LiveEvents;
