/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";

import CompetitionList from "../components/competition/CompetitionList";
import CompetitionModal from "../components/competition/CompetitionModal";
import ConfirmModal from "../components/ConfirmModal";
import Header from "../components/Header";
import {
  useAddCompetitionMutation,
  useDeleteCompetitionMutation,
  useGetCompetitionsQuery,
  useUpdateCompetitionMutation,
} from "../features/competitionSlice";
import { useGetGamesQuery } from "../features/gameSlice";

const Competition = () => {
  const [modalState, setModalState] = useState({
    isModalOpen: false,
    editingCompetition: null,
  });
  const [confirmModalState, setConfirmModalState] = useState({
    isConfirmModalOpen: false,
    competitionToDelete: null,
  });
  const [competitionData, setCompetitionData] = useState({
    name: "",
    avatar: null,
    avatarPreview: null,
  });

  const fileInputRef = useRef(null);

  const [
    addCompetition,
    { isLoading: isAdding, error: addError },
  ] = useAddCompetitionMutation();
  const [
    updateCompetition,
    { isLoading: isUpdating, error: updateError },
  ] = useUpdateCompetitionMutation();
  const [
    deleteCompetition,
    { isLoading: isDeleting, error: deleteError },
  ] = useDeleteCompetitionMutation();
  const {
    data: competitions,
    isLoading: isFetching,
    error: fetchError,
    refetch,
  } = useGetCompetitionsQuery();

  const { data: games } = useGetGamesQuery();
  const openModal = (competition = null) => {
    if (competition) {
      setModalState({ isModalOpen: true, editingCompetition: competition });
      setCompetitionData({
        name: competition.name,
        avatarPreview: competition.avatar,
        avatar: null,
      });
    } else {
      setModalState({ isModalOpen: true, editingCompetition: null });
      setCompetitionData({ name: "", avatar: null, avatarPreview: null });
    }
  };

  const closeModal = () => {
    setModalState({ ...modalState, isModalOpen: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", competitionData.name);
    if (competitionData.avatar) {
      formData.append("avatar", competitionData.avatar);
    }

    try {
      if (modalState.editingCompetition) {
        await updateCompetition({
          id: modalState.editingCompetition._id,
          formData,
        }).unwrap();
        toast.success("Competition updated successfully!");
      } else {
        await addCompetition(formData).unwrap();
        toast.success("Competition added successfully!");
      }
      refetch();
      closeModal();
    } catch (error) {
      toast.error("Failed to save competition.");
    }
  };

  const handleDelete = (id) => {
    const competitionInGame = games?.some((game) => game.competition === id);
    if (competitionInGame) {
      setConfirmModalState({
        isConfirmModalOpen: true,
        competitionToDelete: id,
        message:
          "Cannot delete competition engaged in a game.",
        isDeletable: false,
      });
    } else {
      setConfirmModalState({
        isConfirmModalOpen: true,
        competitionToDelete: id,
        message: "Are you sure you want to delete this competition?",
        isDeletable: true,
      });
    }
  };

  const confirmDelete = async () => {
    if (
      confirmModalState.competitionToDelete &&
      confirmModalState.isDeletable
    ) {
      try {
        await deleteCompetition(confirmModalState.competitionToDelete).unwrap();
        toast.success("Competition deleted successfully!");
        refetch();
      } catch (error) {
        toast.error("Failed to delete competition.");
      } finally {
        setConfirmModalState({
          isConfirmModalOpen: false,
          competitionToDelete: null,
        });
      }
    }
  };

  const cancelDelete = () => {
    setConfirmModalState({
      isConfirmModalOpen: false,
      competitionToDelete: null,
    });
  };

  return (
    <div className="w-full mx-auto p-8 rounded-lg h-[100vh]">
      <Header onOpenModal={openModal} />
      <CompetitionList
        isFetching={isFetching}
        fetchError={fetchError}
        competitions={competitions}
        openModal={openModal}
        handleDelete={handleDelete}
        noFlag
      />
      <CompetitionModal
        modalState={modalState}
        competitionData={competitionData}
        isAdding={isAdding}
        isUpdating={isUpdating}
        addError={addError}
        updateError={updateError}
        fileInputRef={fileInputRef}
        closeModal={closeModal}
        handleSubmit={handleSubmit}
        setCompetitionData={setCompetitionData}
      />
      <ConfirmModal
        isOpen={confirmModalState.isConfirmModalOpen}
        title="Confirm Deletion"
        message={confirmModalState.message}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isDeleting={isDeleting}
        disableConfirm={!confirmModalState.isDeletable}
      />
    </div>
  );
};

export default Competition;
