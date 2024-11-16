/* eslint-disable react/prop-types */
import { useState } from "react";
import AvatarUploadSection from "../AvatarUploadSection";
import Input from "../Input";
import Modal from "../Modal";

const positions = ["GK", "LW", "PV", "RW", "LB", "CB", "RB", "TBD"];

const PlayerFormModal = ({
  modalState,
  playerData,
  isAdding,
  isUpdating,
  addError,
  updateError,
  fileInputRef,
  closeModal,
  handleSubmit,
  setPlayerData,
  tbd,
}) => {
  const [validationError, setValidationError] = useState("");
  const validateNumber = (number) => {
    const num = parseInt(number, 10);
    if (isNaN(num) || num < 1 || num > 99) {
      setValidationError("Player number must be between 1 and 99.");
      return false;
    }
    setValidationError("");
    return true;
  };

  const onNumberChange = (e) => {
    const { value } = e.target;
    setPlayerData({ ...playerData, number: value });
    validateNumber(value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validateNumber(playerData.number)) {
      // Ensure all required fields are filled
      if (
        !playerData.firstName ||
        !playerData.secondName ||
        !playerData.position ||
        !playerData.number
      ) {
        setValidationError("All fields are required.");
        return;
      }
      setValidationError("");
      handleSubmit(e);
    }
  };

  const handlePositionClick = (position) => {
    setPlayerData({ ...playerData, position });
  };

  const filteredPositions =
    tbd === false ? positions : positions.filter((pos) => pos !== "TBD");

  return (
    <Modal
      isOpen={modalState.isModalOpen}
      closeModal={closeModal}
      title={modalState.editingPlayer ? "Edit Player" : "Add Player"}
    >
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center justify-center p-3"
      >
        <AvatarUploadSection
          avatarPreview={playerData.avatarPreview}
          fileInputRef={fileInputRef}
          setFormData={setPlayerData}
          formData={playerData}
        />
        <div className="flex w-full gap-1">
          <Input
            type="text"
            value={playerData.firstName}
            onChange={(e) =>
              setPlayerData({ ...playerData, firstName: e.target.value })
            }
            placeholder="First Name"
            required
            className="mb-4 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3451a8]"
          />
          <Input
            type="text"
            value={playerData.secondName}
            onChange={(e) =>
              setPlayerData({ ...playerData, secondName: e.target.value })
            }
            placeholder="Second Name"
            required
            className="mb-4 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3451a8]"
          />
        </div>
        <Input
          type="number"
          value={playerData.number}
          onChange={onNumberChange}
          placeholder="Player Number"
          min="1"
          max="99"
          required
          className="mb-2 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3451a8]"
        />
        <div className="py-2">
          {validationError && (
            <p className="text-red-500 w-full">*{validationError}</p>
          )}
        </div>
        <div className="mb-4 w-full flex flex-wrap  flex-col justify-center gap-2 items-center">
          <div className="gap-2 flex">
            {filteredPositions.map((position) => (
              <button
                key={position}
                type="button"
                onClick={() => handlePositionClick(position)}
                className={`p-2 border border-gray-300 rounded-md focus:outline-none w-10 h-10 ${
                  playerData.position === position
                    ? "bg-[#3451a8] text-white"
                    : "bg-white text-black"
                } transition duration-300 ease-in-out`}
              >
                {position}
              </button>
            ))}
          </div>
          {tbd ? (
            ""
          ) : (
            <span className="text-red-500 bg-red-100 p-1 rounded">
              * Please add the TBD player to the team before assigning any
              numbers. The number used for the TBD player will default to 0 and
              can be reassigned to another player once the TBD player is saved.
            </span>
          )}
        </div>
        <button
          type="submit"
          className="w-1/2 bg-[#3451a8] text-white font-semibold py-1 h-11 rounded-md hover:bg-[#3451a8]/90 transition capitalize tracking-widest duration-700 hover:scale-95 flex justify-center items-center"
          disabled={isAdding || isUpdating}
        >
          {isAdding || isUpdating ? (
            <div className="saving" />
          ) : modalState.editingPlayer ? (
            "Update"
          ) : (
            "Save"
          )}
        </button>
        {(addError || updateError) && (
          <p className="text-red-500 mt-4">
            Failed to {modalState.editingPlayer ? "update" : "create"} player
          </p>
        )}
      </form>
    </Modal>
  );
};

export default PlayerFormModal;
