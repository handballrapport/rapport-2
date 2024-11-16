/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";
import Header from "../components/Header";
import TeamFormModal from "../components/team/TeamFormModal";
import TeamList from "../components/team/TeamList";
import { useGetGamesQuery } from "../features/gameSlice"; 
import {
  useAddTeamMutation,
  useDeleteTeamMutation,
  useGetTeamsQuery,
  useUpdateTeamMutation,
} from "../features/teamSlice";

const Teams = () => {
  const [modalState, setModalState] = useState({
    isModalOpen: false,
    editingTeam: null,
  });
  const [confirmModalState, setConfirmModalState] = useState({
    isConfirmModalOpen: false,
    teamToDelete: null,
  });
  const [teamData, setTeamData] = useState({
    name: "",
    avatar: null,
    avatarPreview: null,
  });

  const fileInputRef = useRef(null);

  const [
    addTeam,
    { isLoading: isAdding, error: addError },
  ] = useAddTeamMutation();
  const [
    updateTeam,
    { isLoading: isUpdating, error: updateError },
  ] = useUpdateTeamMutation();
  const [
    deleteTeam,
    { isLoading: isDeleting, error: deleteError },
  ] = useDeleteTeamMutation();
  const {
    data: teams,
    isLoading: isFetching,
    error: fetchError,
    refetch,
  } = useGetTeamsQuery();

  const { data: games } = useGetGamesQuery(); 

  const openModal = (team = null) => {
    if (team) {
      setModalState({ isModalOpen: true, editingTeam: team });
      setTeamData({
        name: team.name,
        avatarPreview: team.avatar,
        avatar: null,
      });
    } else {
      setModalState({ isModalOpen: true, editingTeam: null });
      setTeamData({ name: "", avatar: null, avatarPreview: null });
    }
  };

  const closeModal = () => {
    setModalState({ ...modalState, isModalOpen: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", teamData.name);
    if (teamData.avatar) {
      formData.append("avatar", teamData.avatar);
    }

    try {
      if (modalState.editingTeam) {
        await updateTeam({
          id: modalState.editingTeam._id,
          formData,
        }).unwrap();
        toast.success("Team updated successfully!");
      } else {
        await addTeam(formData).unwrap();
        toast.success("Team added successfully!");
      }
      refetch();
      closeModal();
    } catch (error) {
      toast.error("Failed to save team. Maybe the team already exists.");
    }
  };

  const handleDelete = (id) => {
    
    const teamInGame = games?.some(
      (game) => game.home_team._id === id || game.away_team._id === id
    );
  
    if (teamInGame) {
      
      setConfirmModalState({
        isConfirmModalOpen: true,
        teamToDelete: id,
        message: "Cannot delete team engaged in a scheduled or ongoing game.",
        isDeletable: false,
      });
    } else {
      setConfirmModalState({
        isConfirmModalOpen: true,
        teamToDelete: id,
        message: "Are you sure you want to delete this team?",
        isDeletable: true,
      });
    }
  };

  const confirmDelete = async () => {
    const teamId = confirmModalState.teamToDelete;
    if (teamId) {
      try {
        await deleteTeam(teamId).unwrap();
        toast.success("Team deleted successfully!");
        refetch();
      } catch (error) {
        toast.error("Failed to delete team.");
      } finally {
        setConfirmModalState({
          isConfirmModalOpen: false,
          teamToDelete: null,
        });
      }
    } else {
      toast.error("No team ID found to delete.");
    }
  };

  const cancelDelete = () => {
    setConfirmModalState({
      isConfirmModalOpen: false,
      teamToDelete: null,
    });
  };

  return (
    <div className="w-full mx-auto p-8 rounded-lg h-[100vh]">
      <Header onOpenModal={openModal} />
      <TeamList
        isFetching={isFetching}
        fetchError={fetchError}
        teams={teams}
        openModal={openModal}
        handleDelete={handleDelete}
      />
      <TeamFormModal
        modalState={modalState}
        teamData={teamData}
        isAdding={isAdding}
        isUpdating={isUpdating}
        addError={addError}
        updateError={updateError}
        fileInputRef={fileInputRef}
        closeModal={closeModal}
        handleSubmit={handleSubmit}
        setTeamData={setTeamData}
      />
      <ConfirmModal
        isOpen={confirmModalState.isConfirmModalOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this team?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isDeleting={isDeleting}
        disableConfirm={!confirmModalState.isDeletable} 

      />
    </div>
  );
};

export default Teams;
