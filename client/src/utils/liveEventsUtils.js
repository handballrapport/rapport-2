import toast from "react-hot-toast";

export const handleGameChange = (event, games, setSelectedGame) => {
  const gameId = event.target.value;
  const game = games.find((g) => g._id === gameId);
  setSelectedGame(game);
  localStorage.setItem("selectedGameId", gameId);
  toast.success("Game selected successfully");
};

export const handlePlayerClick = (
  playerId,
  teamType,
  selectedPlayer,
  selectedTeam,
  players,
  setPlayers,
  swapPlayer,
  setSelectedPlayer,
  setSelectedTeam,
  resetSelection
) => {
  if (selectedPlayer && selectedTeam === teamType) {
    swapPlayer(selectedPlayer._id, playerId, teamType, players, setPlayers);
    resetSelection(setSelectedPlayer, setSelectedTeam);
  } else {
    setSelectedPlayer(players[teamType].find((p) => p._id === playerId));
    setSelectedTeam(teamType);
    toast("Player selected", {
      icon: "⚽",
    });
  }
};

export const resetSelection = (setSelectedPlayer, setSelectedTeam) => {
  setSelectedPlayer(null);
  setSelectedTeam(null);
  toast.dismiss();
};

export const swapPlayer = async (
  firstPlayerId,
  secondPlayerId,
  teamType,
  players,
  setPlayers,
  updatePlayer
) => {
  const teamPlayers = players[teamType];
  const firstPlayer = teamPlayers.find((p) => p._id === firstPlayerId);
  const secondPlayer = teamPlayers.find((p) => p._id === secondPlayerId);

  if (firstPlayer?.position === "TBD" || secondPlayer?.position === "TBD") {
    setTimeout(() => {
      toast.error("TBD cannot be swapped", { duration: 1000 });
    }, 100);
    return;
  }

  if (firstPlayer?.lineup === secondPlayer?.lineup) {
    toast.error("Cannot swap players with the same lineup status", {
      duration: 1000,
    });
    return;
  }

  if (firstPlayer && secondPlayer) {
    const updatedFirstPlayer = { ...firstPlayer, lineup: !firstPlayer.lineup };
    const updatedSecondPlayer = {
      ...secondPlayer,
      lineup: !secondPlayer.lineup,
    };

    try {
      const formDataFirstPlayer = new FormData();
      formDataFirstPlayer.append("lineup", updatedFirstPlayer.lineup);

      const formDataSecondPlayer = new FormData();
      formDataSecondPlayer.append("lineup", updatedSecondPlayer.lineup);

      await updatePlayer({ id: firstPlayerId, formData: formDataFirstPlayer });
      await updatePlayer({
        id: secondPlayerId,
        formData: formDataSecondPlayer,
      });

      setPlayers((prevPlayers) => {
        const updatedPlayers = prevPlayers[teamType].map((p) => {
          if (p._id === firstPlayerId) return updatedFirstPlayer;
          if (p._id === secondPlayerId) return updatedSecondPlayer;
          return p;
        });
        return { ...prevPlayers, [teamType]: updatedPlayers };
      });
      toast.success("Players swapped successfully");
    } catch (error) {
      toast.error("Failed to swap players");
    }
  }
};
