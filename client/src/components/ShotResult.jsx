import { useEffect, useState } from "react";

const ShotResult = ({
  setShotResult,
  goalkeepers,
  goalkeeper,
  setGoalkeeper,
  saveEventData,
  closeModal,
}) => {
  const [shouldSave, setShouldSave] = useState(false);

  useEffect(() => {
    if (shouldSave && goalkeeper) {
      saveEventData();
      closeModal();
      setShouldSave(false); // Reset the flag after saving
    }
  }, [goalkeeper, shouldSave, saveEventData, closeModal]);

  const handleButtonClick = (result) => {
    setShotResult(result);
  };

  const handleGoalkeeperSelect = (goalkeeper) => {
    setGoalkeeper(goalkeeper);
    setShouldSave(true);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-lg font-bold mb-4">Select Shot Result:</h3>
      <div className="flex gap-4 mb-4">
        <button
          onClick={() => handleButtonClick("Goal")}
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          Goal
        </button>
        <button
          onClick={() => handleButtonClick("Saved")}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Saved
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold">Opposite Team Goalkeepers:</h3>
        <div className="flex gap-2 flex-wrap mt-2">
          {goalkeepers.length > 0 ? (
            goalkeepers.map((gk) => (
              <button
                key={gk._id}
                className="bg-gray-300 text-black py-2 px-4 rounded"
                onClick={() => handleGoalkeeperSelect(gk._id)}
              >
                {gk.number}
              </button>
            ))
          ) : (
            <p className="text-md">No goalkeepers available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShotResult;
