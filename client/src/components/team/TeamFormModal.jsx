/* eslint-disable react/prop-types */
import Modal from "../Modal";
import AvatarUploadSection from "../AvatarUploadSection";
import Select from 'react-select';
import countryList from 'react-select-country-list';

const TeamFormModal = ({
  modalState,
  teamData,
  isAdding,
  isUpdating,
  addError,
  updateError,
  fileInputRef,
  closeModal,
  handleSubmit,
  setTeamData,
}) => {
  const options = countryList().getData();

  const handleCountryChange = selectedOption => {
    setTeamData({ ...teamData, name: selectedOption.label });
  };

  return (
    <Modal
      isOpen={modalState.isModalOpen}
      closeModal={closeModal}
      title={modalState.editingTeam ? "Edit Team" : "Add Team"}
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center p-3"
      >
        <AvatarUploadSection
          avatarPreview={teamData.avatarPreview}
          fileInputRef={fileInputRef}
          setFormData={setTeamData}
          formData={teamData}
        />
        <div className="mb-4 w-full flex justify-center items-center">
          <Select
            options={options}
            value={options.find(option => option.label === teamData.name)}
            onChange={handleCountryChange}
            placeholder="Enter team name"
            className="w-3/4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3451a8]"
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
          ) : modalState.editingTeam ? (
            "Update"
          ) : (
            "Save"
          )}
        </button>
        {(addError || updateError) && (
          <p className="text-red-500 mt-4">
            Failed to {modalState.editingTeam ? "update" : "create"} team
          </p>
        )}
      </form>
    </Modal>
  );
};

export default TeamFormModal;
