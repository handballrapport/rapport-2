import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import Header from "../components/Header";
import PlayerFormModal from "../components/player/PlayerFormModal";
import PlayerList from "../components/player/PlayerList";
import {
  useAddPlayerMutation,
  useDeletePlayerMutation,
  useGetPlayersQuery,
  useUpdatePlayerMutation,
} from "../features/playerSlice";

const PlayerDetail = () => {
  const { id: teamId, team } = useParams();

  const [modalState, setModalState] = useState({
    isModalOpen: false,
    editingPlayer: null,
  });
  const [confirmModalState, setConfirmModalState] = useState({
    isConfirmModalOpen: false,
    playerToDelete: null,
  });
  const [playerData, setPlayerData] = useState({
    firstName: "",
    secondName: "",
    position: "",
    number: "",
    avatar: null,
    avatarPreview: null,
  });

  const fileInputRef = useRef(null);

  const [
    addPlayer,
    { isLoading: isAdding, error: addError },
  ] = useAddPlayerMutation();
  const [
    updatePlayer,
    { isLoading: isUpdating, error: updateError },
  ] = useUpdatePlayerMutation();
  const [
    deletePlayer,
    { isLoading: isDeleting, error: deleteError },
  ] = useDeletePlayerMutation();
  const {
    data: players,
    isLoading: isFetching,
    error: fetchError,
    refetch,
  } = useGetPlayersQuery();

  // Filter players based on the teamId
  const filteredPlayers = players?.filter(
    (player) => player.team === teamId && player.position !== "TBD"
  );
  const TBD = players
    ?.filter((player) => player.team === teamId)
    .map((player) => player.position)
    .includes("TBD");
  const openModal = (player = null) => {
    if (player) {
      setModalState({ isModalOpen: true, editingPlayer: player });
      setPlayerData({
        firstName: player.firstName,
        secondName: player.secondName,
        position: player.position,
        number: player.number,
        avatarPreview: player.avatar,
        avatar: null,
      });
    } else {
      setModalState({ isModalOpen: true, editingPlayer: null });
      setPlayerData({
        firstName: "",
        secondName: "",
        position: "",
        number: "",
        avatar: null,
        avatarPreview: null,
      });
    }
  };

  const closeModal = () => {
    setModalState({ ...modalState, isModalOpen: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object and append the necessary fields
    const formData = new FormData();
    formData.append("firstName", playerData.firstName);
    formData.append("secondName", playerData.secondName);
    formData.append("position", playerData.position);
    formData.append("number", playerData.number);
    formData.append("team", teamId);
    formData.append("teamId", teamId); // Append teamId to FormData
    if (playerData.avatar) {
      formData.append("avatar", playerData.avatar);
    }

    try {
      if (modalState.editingPlayer) {
        await updatePlayer({
          id: modalState.editingPlayer._id,
          formData, // Pass FormData directly
        }).unwrap();
        toast.success("Player updated successfully!");
      } else {
        await addPlayer(
          formData // Pass FormData directly
        ).unwrap();
        toast.success("Player added successfully!");
      }
      refetch();
      closeModal();
    } catch (error) {
      toast.error("Failed to save player. Maybe the player already exists.");
    }
  };

  const handleDelete = (id) => {
    setConfirmModalState({ isConfirmModalOpen: true, playerToDelete: id });
  };

  const confirmDelete = async () => {
    const playerId = confirmModalState.playerToDelete;
    if (playerId) {
      try {
        await deletePlayer(playerId).unwrap();
        toast.success("Player deleted successfully!");
        refetch();
      } catch (error) {
        toast.error("Failed to delete player.");
      } finally {
        setConfirmModalState({
          isConfirmModalOpen: false,
          playerToDelete: null,
        });
      }
    } else {
      toast.error("No player ID found to delete.");
    }
  };

  const cancelDelete = () => {
    setConfirmModalState({
      isConfirmModalOpen: false,
      playerToDelete: null,
    });
  };

  return (
    <div className="w-full mx-auto p-8 rounded-lg h-[100vh]">
      <Header onOpenModal={() => openModal()} team={team} />
      <PlayerList
        isFetching={isFetching}
        fetchError={fetchError}
        players={filteredPlayers} // Pass filtered players
        openModal={openModal}
        handleDelete={handleDelete}
      />
      <PlayerFormModal
        modalState={modalState}
        playerData={playerData}
        isAdding={isAdding}
        isUpdating={isUpdating}
        addError={addError}
        updateError={updateError}
        fileInputRef={fileInputRef}
        closeModal={closeModal}
        handleSubmit={handleSubmit}
        setPlayerData={setPlayerData}
        tbd={TBD}
      />
      <ConfirmModal
        isOpen={confirmModalState.isConfirmModalOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this player?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default PlayerDetail;
