/* eslint-disable react/prop-types */
import AvatarUploadSection from "../AvatarUploadSection";
import Input from "../Input";
import Modal from "../Modal";

const CompetitionModal = ({
  modalState,
  competitionData,
  isAdding,
  isUpdating,
  addError,
  updateError,
  fileInputRef,
  closeModal,
  handleSubmit,
  setCompetitionData,
}) => (
  <Modal
    isOpen={modalState.isModalOpen}
    closeModal={closeModal}
    title={
      modalState.editingCompetition ? "Edit Competition" : "Add Competition"
    }
  >
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center p-3"
    >
      <AvatarUploadSection
        avatarPreview={competitionData.avatarPreview}
        fileInputRef={fileInputRef}
        setFormData={setCompetitionData}
        competitionData={competitionData}
      />
      <div className="mb-4 w-full flex justify-center items-center">
        <Input
          type="text"
          id="name"
          name="name"
          placeholder="Enter competition name"
          value={competitionData.name}
          onChange={(e) =>
            setCompetitionData({ ...competitionData, name: e.target.value })
          }
          className="w-3/4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3451a8]"
          required
        />
      </div>
      <button
        type="submit"
        className="w-1/2 bg-[#3451a8] text-white font-semibold py-1 h-11 rounded-md hover:bg-[#3451a8]/90 transition capitalize tracking-widest duration-700 hover:scale-95 flex justify-center items-center"
        disabled={isAdding || isUpdating}
      >
        {isAdding ? (
          <div className="saving" />
        ) : isUpdating ? (
          <div className="updating" />
        ) : modalState.editingCompetition ? (
          "Update"
        ) : (
          "Save"
        )}
      </button>
      {(addError || updateError) && (
        <p className="text-red-500 mt-4">
          Failed to {modalState.editingCompetition ? "update" : "create"}{" "}
          competition
        </p>
      )}
    </form>
  </Modal>
);

export default CompetitionModal;
