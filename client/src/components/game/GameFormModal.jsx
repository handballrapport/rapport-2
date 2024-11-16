/* eslint-disable react/prop-types */
import Modal from "../Modal";
import RefereeList from "./RefereeList";
import TeamSelect from "./TeamSelect";
import CompetitionSelect from "./CompetitionSelect";
import DateTimeInput from "./DateTimeInput";

const GameFormModal = ({
  modalState,
  gameData,
  teams,
  competitions,
  isAdding,
  isUpdating,
  addError,
  updateError,
  closeModal,
  handleSubmit,
  setGameData,
}) => (
  <Modal
    isOpen={modalState.isModalOpen}
    closeModal={closeModal}
    title={modalState.editingGame ? "Update Game" : "Add Game"}
    width={"w-1/2"}
  >
    <form onSubmit={handleSubmit} className="flex flex-col items-center p-3">
      <CompetitionSelect
        competitions={competitions}
        gameData={gameData}
        setGameData={setGameData}
      />

      <TeamSelect
        teams={teams}
        gameData={gameData}
        setGameData={setGameData}
      />

      <DateTimeInput
        gameData={gameData}
        setGameData={setGameData}
      />

      <RefereeList
        referees={gameData.referees}
        setGameData={setGameData}
      />

      <button
        type="submit"
        className="w-full bg-[#3451a8] text-white font-semibold py-2 rounded-md hover:bg-[#3451a8]/90 transition flex justify-center"
        disabled={isAdding || isUpdating}
      >
        {isAdding ? (
          <div className="saving" />
        ) : isUpdating ? (
          <div className="updating " />
        ) : modalState.editingGame ? (
          "Update"
        ) : (
          "Save"
        )}
      </button>

      {(addError || updateError) && (
        <p className="text-red-500 mt-4">
          Failed to {modalState.editingGame ? "update" : "create"} game
        </p>
      )}
    </form>
  </Modal>
);

export default GameFormModal;
