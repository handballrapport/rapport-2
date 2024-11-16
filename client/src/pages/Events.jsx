import { useEffect, useState } from "react";
import GameSelect from "../components/game/GameSelect";
import {
  useDeleteEventMutation,
  useGetAllEventsQuery,
  useGetEventByIdQuery,
  useUpdateEventMutation,
} from "../features/eventSlice";
import { useGetGamesQuery, useUpdateGameMutation } from "../features/gameSlice";
import { useUpdatePlayerStatisticsMutation } from "../features/playerSlice";
import { useGetTeamByIdQuery } from "../features/teamSlice";
import Modal from "./../components/Modal";
const offenseSituation = ["equal.att", "major.att", "Minor.att", "7vs6"],
  defense = ["steal", "block", "7mc"],
  sanctions = ["Yellow Card", "2 Minutes", "Red Card", "Blue Card"],
  positions = [
    "LW",
    "RW",
    "LB",
    "CB",
    "RB",
    "C6",
    "L6",
    "R6",
    "7M",
    "FB",
    "FTO",
    "EG",
    "BT",
  ],
  periods = [
    "first_half",
    "second_half",
    "first_extra_time",
    "second_extra_time",
    "third_extra_time",
    "fourth_extra_time",
  ];

const EventPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [updatedEventData, setUpdatedEventData] = useState({
    shotResult: "",
    sanction: "",
    period: "",
    selectedDefense: "",
    selectedOffenseSituation: "",
    shotPosition: "",
    team: "",
    player: "",
  });
  const [filteredEvents, setFilteredEvents] = useState([]);

  const [players, setPlayers] = useState([]);
  const { data: events, refetch } = useGetAllEventsQuery();
  const { data: selectedEvent } = useGetEventByIdQuery(selectedEventId, {
    skip: !selectedEventId,
  });
  const { data: games } = useGetGamesQuery(); 
  const { data: team } = useGetTeamByIdQuery(updatedEventData.team, {
    skip: !updatedEventData.team,
  });
  const [updateEvent] = useUpdateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();
  const [updatePlayerStatistics] = useUpdatePlayerStatisticsMutation();
  const [updateGame] = useUpdateGameMutation(); // Import the updateGame mutation

  useEffect(() => {
    const savedGameId = localStorage.getItem("selectedGameId");
    if (savedGameId && games) {
      const savedGame = games.find((g) => g._id === savedGameId);
      setSelectedGame(savedGame);
    }
  }, [games]);

  useEffect(() => {
    if (team) {
      setPlayers(team.players || []);
    }
  }, [team]);

  useEffect(() => {
    if (selectedEvent) {
      setUpdatedEventData({
        shotResult: selectedEvent.shotResult || "",
        sanction: selectedEvent.sanction || "",
        period: selectedEvent.period || "",
        selectedDefense: selectedEvent.selectedDefense || "",
        selectedOffenseSituation: selectedEvent.selectedOffenseSituation || "",
        shotPosition: selectedEvent.shotPosition || "",
        team: selectedEvent.team || "",
        player: selectedEvent.player._id || "",
      });
    }
  }, [selectedEvent]);
  useEffect(() => {
    if (events && selectedGame) {
      const filtered = events?.filter(event => event.game?._id === selectedGame?._id);
      setFilteredEvents(filtered);
    }
  }, [events, selectedGame]);
  const handleDeleteEvent = async (id) => {
    try {
      // Fetch the event to get the player and goalkeeper information
      const eventToDelete = events.find((event) => event._id === id);
      if (!eventToDelete) return

      const { player, goalkeeper, shotResult, sanction, team } = eventToDelete;

      const playerStatisticsUpdates = ["shots"];
      const goalkeeperStatisticsUpdates = [];

      // Determine which statistics to decrement
      if (shotResult === "Goal") {
        playerStatisticsUpdates.push("goals");
        playerStatisticsUpdates.push("onTargetShots");
        if (goalkeeper) goalkeeperStatisticsUpdates.push("conceded");

        // Update the score in the associated game
        if (selectedGame) {
          const updatedScore = { ...selectedGame.score };

          if (team === selectedGame.home_team._id) {
            updatedScore.home = Math.max(0, updatedScore.home - 1);
          } else if (team === selectedGame.away_team._id) {
            updatedScore.away = Math.max(0, updatedScore.away - 1);
          }

          await updateGame({
            id: selectedGame._id,
            formData: { score: updatedScore },
          }).unwrap();
        }
      } else if (shotResult === "Saved") {
        playerStatisticsUpdates.push("onTargetShots");
        if (goalkeeper) goalkeeperStatisticsUpdates.push("saves");
      }

      if (sanction === "Yellow Card") {
        playerStatisticsUpdates.push("yellowCards");
      } else if (sanction === "Red Card") {
        playerStatisticsUpdates.push("redCards");
      } else if (sanction === "Blue Card") {
        playerStatisticsUpdates.push("blueCards");
      } else if (sanction === "2 Minutes") {
        playerStatisticsUpdates.push("suspended");
      }

      // Decrement player statistics
      if (player) {
        await updatePlayerStatistics({
          id: player._id,
          action: "decrement",
          fields: playerStatisticsUpdates,
        });
      }

      // Decrement goalkeeper statistics
      if (goalkeeper) {
        await updatePlayerStatistics({
          id: goalkeeper._id,
          action: "decrement",
          fields: goalkeeperStatisticsUpdates,
        });
      }

      // Proceed to delete the event
      await deleteEvent(id).unwrap();
      refetch(); // Refetch the events to update the list
    } catch (error) {
      console.error("Failed to delete event or update statistics:", error);
    }
  };

  const handleGameChange = (e) => {
    const selectedGameId = e.target.value;
    const game = games.find((game) => game._id === selectedGameId);
    setSelectedGame(game);
  };
  
    const handleUpdateEvent = async () => {
      try {
        if (!selectedEventId) return;
    
        const {
          player: originalPlayer,
          goalkeeper: originalGoalkeeper,
          shotResult: oldShotResult,
          sanction: oldSanction,
          team: originalTeam,
        } = selectedEvent;
    
        const {
          player: updatedPlayer,
          goalkeeper: updatedGoalkeeper,
          shotResult: newShotResult,
          sanction: newSanction,
          team: updatedTeam,
        } = updatedEventData;
    
        // Ensure we are only working with IDs
        const originalPlayerId = originalPlayer?._id || originalPlayer;
        const originalGoalkeeperId = originalGoalkeeper?._id || originalGoalkeeper;
        const updatedPlayerId = updatedPlayer?._id || updatedPlayer;
        const updatedGoalkeeperId = updatedGoalkeeper?._id || updatedGoalkeeper;
    
     
    
        const isPlayerChanged = originalPlayerId !== updatedPlayerId;
        const isShotResultChanged = oldShotResult !== newShotResult;
        const isSanctionChanged = oldSanction !== newSanction;
    
        const decrementPlayerStats = [];
        const incrementPlayerStats = [];
        const decrementGoalkeeperStats = [];
        const incrementGoalkeeperStats = [];
    
        // Create a copy of the score object to avoid modifying the original object
        const updatedScore = { ...selectedGame.score };
    
        // Helper functions to update player and goalkeeper statistics
        const updateStats = async (playerId, goalkeeperId, action) => {
          console.log("Updating stats for player ID:", playerId, "and goalkeeper ID:", goalkeeperId, "with action:", action);
          if (playerId) {
            await updatePlayerStatistics({
              id: playerId,
              action,
              fields:
                action === "decrement"
                  ? decrementPlayerStats
                  : incrementPlayerStats,
            }).unwrap();
          }
          if (goalkeeperId) {
            await updatePlayerStatistics({
              id: goalkeeperId,
              action,
              fields:
                action === "decrement"
                  ? decrementGoalkeeperStats
                  : incrementGoalkeeperStats,
            }).unwrap();
          }
        };
    
        // Adjust statistics if the player has changed
        if (isPlayerChanged) {
          if (oldShotResult === "Goal") {
            decrementPlayerStats.push("goals", "onTargetShots", "shots");
          } else if (oldShotResult === "Saved") {
            decrementPlayerStats.push("onTargetShots");
            decrementGoalkeeperStats.push("saves");
          } else {
            decrementPlayerStats.push("offTargetShots");
          }
    
          if (oldSanction) {
            decrementPlayerStats.push(getSanctionStat(oldSanction));
          }
    
          if (newShotResult === "Goal") {
            incrementPlayerStats.push("goals", "onTargetShots", "shots");
            incrementGoalkeeperStats.push("conceded");
          } else if (newShotResult === "Saved") {
            incrementPlayerStats.push("onTargetShots");
            incrementGoalkeeperStats.push("saves");
          } else {
            incrementPlayerStats.push("offTargetShots");
          }
    
          if (newSanction) {
            incrementPlayerStats.push(getSanctionStat(newSanction));
          }
    
          await updateStats(originalPlayerId, originalGoalkeeperId, "decrement");
          await updateStats(updatedPlayerId, updatedGoalkeeperId, "increment");
        } else {
          // Handle changes in shot result and sanction when player does not change
          if (isShotResultChanged) {
            adjustScoreAndStatsForShotResult(
              oldShotResult,
              newShotResult,
              updatedTeam,
              updatedScore,
              decrementPlayerStats,
              incrementPlayerStats,
              decrementGoalkeeperStats,
              incrementGoalkeeperStats
            );
          }
    
          if (isSanctionChanged) {
            decrementPlayerStats.push(getSanctionStat(oldSanction));
            incrementPlayerStats.push(getSanctionStat(newSanction));
          }
    
          await updateStats(originalPlayerId, originalGoalkeeperId, "decrement");
          await updateStats(originalPlayerId, originalGoalkeeperId, "increment");
        }
    
        // Update the score on the server
        await updateGame({
          id: selectedGame._id,
          formData: { score: updatedScore },
        }).unwrap();
    
        // Update the event itself
        await updateEvent({
          id: selectedEventId,
          updatedEvent: updatedEventData,
        }).unwrap();
    
        resetEventState();
      } catch (error) {
        console.error("Failed to update event or update statistics:", error);
      }
    };
    
    

  // Helper functions
  const getSanctionStat = (sanction) => {
    const sanctionMap = {
      "Yellow Card": "yellowCards",
      "Red Card": "redCards",
      "Blue Card": "blueCards",
      "2 Minutes": "suspended",
    };
    return sanctionMap[sanction];
  };

  const adjustScoreAndStatsForShotResult = (
    oldShotResult,
    newShotResult,
    team,
    score,
    decrementPlayerStats,
    incrementPlayerStats,
    decrementGoalkeeperStats,
    incrementGoalkeeperStats
  ) => {
    if (oldShotResult === "Goal" && newShotResult !== "Goal") {
      adjustScore(score, team, -1);
      decrementPlayerStats.push("goals", "onTargetShots", "shots");
      decrementGoalkeeperStats.push("conceded");
    } else if (oldShotResult !== "Goal" && newShotResult === "Goal") {
      adjustScore(score, team, 1);
      incrementPlayerStats.push("goals", "onTargetShots", "shots");
      incrementGoalkeeperStats.push("conceded");
    } else {
      if (oldShotResult === "Saved") {
        decrementPlayerStats.push("onTargetShots");
        decrementGoalkeeperStats.push("saves");
      } else if (oldShotResult !== "Goal" && oldShotResult !== "Saved") {
        decrementPlayerStats.push("offTargetShots");
      }

      if (newShotResult === "Saved") {
        incrementPlayerStats.push("onTargetShots");
        incrementGoalkeeperStats.push("saves");
      } else if (newShotResult !== "Goal" && newShotResult !== "Saved") {
        incrementPlayerStats.push("offTargetShots");
      }
    }
  };

  const adjustScore = (score, team, value) => {
    if (team === selectedGame.home_team._id) {
      score.home += value;
    } else if (team === selectedGame.away_team._id) {
      score.away += value;
    }
  };

  const resetEventState = () => {
    setUpdatedEventData({
      shotResult: "",
      sanction: "",
      period: "",
      selectedDefense: "",
      selectedOffenseSituation: "",
      shotPosition: "",
      team: "",
      player: "",
    });
    setSelectedEventId(null);
    setIsModalOpen(false);
    refetch();
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">Manage Events</h1>

      {/* Game Selector */}
      <GameSelect
        games={games}
        selectedGame={selectedGame}
        onGameChange={handleGameChange}
      />

      {/* Conditionally render the events table only if a game is selected */}
      {selectedGame && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th>Team</th>
                <th>Period</th>
                <th>Defense</th>
                <th>Offense Situation</th>
                <th>Defense type</th>
                <th>Offense</th>
                <th>Shot Position</th>
                <th>Shot Zone</th>
                <th>Result</th>
                <th>Sanction</th>
                <th>Player</th>
                <th>Time (MM:SS)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents?.map((event) => (
                <tr key={event._id}>
                  <td className="pl-2">
                    {event.team === selectedGame.home_team._id
                      ? selectedGame.home_team.name
                      : selectedGame.away_team.name}
                  </td>
                  <td className="pl-2">
                    {event?.period
                      ?.replace("_", " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </td>
                  <td className="pl-2">
                    {event?.selectedDefense ? event?.selectedDefense : "-"}
                  </td>
                  <td className="pl-2">
                    {event?.selectedOffenseSituation
                      ? event?.selectedOffenseSituation
                      : "-"}
                  </td>
                  <td className="pl-2">
                    {event?.selectedTypeDefense
                      ? event?.selectedTypeDefense
                      : "null"}
                  </td>
                  <td className="pl-2">
                    {event?.player ? event?.selectedOffense : "null"}
                  </td>
                  <td className="pl-2">
                    {event?.shotPosition ? event?.shotPosition : "-"}
                  </td>
                  <td className="pl-2">
                    {event?.goalZone ? event?.goalZone : "-"}
                  </td>
                  <td className="pl-2">
                    {event?.shotResult ? event?.shotResult : "-"}
                  </td>
                  <td className="pl-2">
                    {event?.sanction ? event?.sanction : "-"}
                  </td>
                  <td className="pl-2">
                    {event?.player ? event?.player.number : "null"}
                  </td>
                  <td className="pl-2">
                    {Math.floor(event.timeEvent / 60)}:
                    {String(event.timeEvent % 60).padStart(2, "0")}
                  </td>
                  <td className="pl-2">
                    <button
                      onClick={() => {
                        setSelectedEventId(event._id);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="text-red-600 hover:text-red-900 ml-4"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Update */}
      <Modal isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)}>
        {selectedEventId && selectedEvent && (
          <>
            <h2 className="text-lg font-bold mb-4">Edit Event</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Shot Result Input */}
              <input
                type="text"
                placeholder="Shot Result"
                value={updatedEventData.shotResult}
                onChange={(e) =>
                  setUpdatedEventData({
                    ...updatedEventData,
                    shotResult: e.target.value,
                  })
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />

              {/* Sanction Input */}
              <select
                value={updatedEventData.sanction}
                onChange={(e) =>
                  setUpdatedEventData({
                    ...updatedEventData,
                    sanction: e.target.value,
                  })
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Sanction</option>
                {sanctions.map((sanction) => (
                  <option key={sanction} value={sanction}>
                    {sanction}
                  </option>
                ))}
              </select>

              {/* Period Input */}
              <select
                value={updatedEventData.period}
                onChange={(e) =>
                  setUpdatedEventData({
                    ...updatedEventData,
                    period: e.target.value,
                  })
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Period</option>
                {periods.map((period) => (
                  <option key={period} value={period}>
                    {period
                      .replace("_", " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </option>
                ))}
              </select>

              {/* Defense Input */}
              <select
                value={updatedEventData.selectedDefense}
                onChange={(e) =>
                  setUpdatedEventData({
                    ...updatedEventData,
                    selectedDefense: e.target.value,
                  })
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Defense</option>
                {defense.map((def) => (
                  <option key={def} value={def}>
                    {def
                      .replace("_", " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </option>
                ))}
              </select>

              {/* Offense Situation Input */}
              <select
                value={updatedEventData.selectedOffenseSituation}
                onChange={(e) =>
                  setUpdatedEventData({
                    ...updatedEventData,
                    selectedOffenseSituation: e.target.value,
                  })
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Offense Situation</option>
                {offenseSituation.map((situation) => (
                  <option key={situation} value={situation}>
                    {situation
                      .replace(".", " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </option>
                ))}
              </select>

              {/* Shot Position Input */}
              <select
                value={updatedEventData.shotPosition}
                onChange={(e) =>
                  setUpdatedEventData({
                    ...updatedEventData,
                    shotPosition: e.target.value,
                  })
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Shot Position</option>
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>

              {/* Team Selection */}
              <select
                value={updatedEventData.team}
                onChange={(e) =>
                  setUpdatedEventData({
                    ...updatedEventData,
                    team: e.target.value,
                  })
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Team</option>
                <option value={selectedGame?.home_team?._id}>
                  {selectedGame?.home_team?.name}
                </option>
                <option value={selectedGame?.away_team?._id}>
                  {selectedGame?.away_team?.name}
                </option>
              </select>

              {/* Player Selection */}
              <select
                value={updatedEventData.player}
                onChange={(e) =>
                  setUpdatedEventData({
                    ...updatedEventData,
                    player: e.target.value,
                  })
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Player</option>
                {players.map((player) => (
                  <option key={player._id} value={player._id}>
                    {player.firstName} {player.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleUpdateEvent}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update Event
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
    
  );
};

export default EventPage;
