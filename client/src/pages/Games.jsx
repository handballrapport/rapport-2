// pages/Games.js
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  useGetGamesQuery,
  useAddGameMutation,
  useUpdateGameMutation,
  useDeleteGameMutation,
} from "../features/gameSlice";
import { useGetTeamsQuery } from "../features/teamSlice.js";
import { useGetCompetitionsQuery } from "../features/competitionSlice.js";
import GameList from "../components/game/GameList";
import GameFormModal from "../components/game/GameFormModal";
import ConfirmModal from "../components/ConfirmModal";
import Header from "../components/Header.jsx"

const Games = () => {
  const [modalState, setModalState] = useState({
    isModalOpen: false,
    editingGame: null,
  });
  const [confirmModalState, setConfirmModalState] = useState({
    isConfirmModalOpen: false,
    gameToDelete: null,
  });
  const [gameData, setGameData] = useState({
    home_team: "",
    away_team: "",
    referees: [],
    match_date: "",
    location: "",
    score: { home: 0, away: 0 },
    status: "scheduled",
    competition:""
  });

  const [
    addGame,
    { isLoading: isAdding, error: addError },
  ] = useAddGameMutation();
  const [
    updateGame,
    { isLoading: isUpdating, error: updateError },
  ] = useUpdateGameMutation();
  const [
    deleteGame,
    { isLoading: isDeleting, error: deleteError },
  ] = useDeleteGameMutation();
  const {
    data: games,
    isLoading: isFetching,
    error: fetchError,
    refetch,
  } = useGetGamesQuery();
  const { data: teams, isLoading: teamLoading, error: teamError } = useGetTeamsQuery();
  const { data: competitions, isLoading: competitionLoading, error: competitionError } = useGetCompetitionsQuery();

  const openModal = (game = null) => {
    if (game) {
      setModalState({ isModalOpen: true, editingGame: game });
      setGameData({
        home_team: game.home_team._id,
        away_team: game.away_team._id,
        referees: game.referees,
        match_date: new Date(game.match_date).toISOString().slice(0, 16),
        location: game.location,
        score: game.score,
        status: game.status,
        competition: game.competition
      });
    } else {
      setModalState({ isModalOpen: true, editingGame: null });
      setGameData({
        home_team: "",
        away_team: "",
        referees: [],
        match_date: "",
        location: "",
        score: { home: 0, away: 0 },
        status: "scheduled",
        competition: ""
      });
    }
  };

  const closeModal = () => {
    setModalState({ ...modalState, isModalOpen: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalState.editingGame) {
        await updateGame({
          id: modalState.editingGame._id,
          formData: gameData,
        }).unwrap();
        toast.success("Game updated successfully!");
      } else {
        await addGame(gameData).unwrap();
        toast.success("Game added successfully!");
      }
      refetch();
      closeModal();
    } catch (error) {
      toast.error("Failed to save game.");
    }
  };

  const handleDelete = (id) => {
    setConfirmModalState({ isConfirmModalOpen: true, gameToDelete: id });
  };

  const confirmDelete = async () => {
    const gameId = confirmModalState.gameToDelete;
    if (gameId) {
      try {
        await deleteGame(gameId).unwrap();
        toast.success("Game deleted successfully!");
        refetch();
      } catch (error) {
        toast.error("Failed to delete game.");
      } finally {
        setConfirmModalState({
          isConfirmModalOpen: false,
          gameToDelete: null,
        });
      }
    } else {
      toast.error("No game ID found to delete.");
    }
  };

  const cancelDelete = () => {
    setConfirmModalState({
      isConfirmModalOpen: false,
      gameToDelete: null,
    });
  };

  // New function to handle status change
  const handleStatusChange = async (gameId, newStatus) => {
    try {
      await updateGame({
        id: gameId,
        formData: { status: newStatus },
      }).unwrap();
      toast.success("Status updated successfully!");
      refetch();
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  if (isFetching || teamLoading || competitionLoading) return <div className="text-center mt-5 absolute top-[50%] right-[50%] spinner"></div>;
  if (fetchError || teamError || competitionError) return <div className="text-center mt-5 text-red-500">Error loading data</div>;

  return (
    <div className="w-full mx-auto p-8 rounded-lg h-[100vh]">
      <Header onOpenModal={openModal} />
      <GameList
        isFetching={isFetching}
        fetchError={fetchError}
        games={games}
        teams={teams}
        competitions={competitions}
        openModal={openModal}
        handleDelete={handleDelete}
        handleStatusChange={handleStatusChange} // Pass handleStatusChange to GameList
      />
      <GameFormModal
        modalState={modalState}
        gameData={gameData}
        teams={teams}
        competitions={competitions}
        isAdding={isAdding}
        isUpdating={isUpdating}
        addError={addError}
        updateError={updateError}
        closeModal={closeModal}
        handleSubmit={handleSubmit}
        setGameData={setGameData}
      />
      <ConfirmModal
        isOpen={confirmModalState.isConfirmModalOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this game?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Games;
