/* eslint-disable react/prop-types */


const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isDeleting,
  disableConfirm, 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md text-center">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="mb-6">{ disableConfirm ? "Cannot delete team engaged in a game." :message}</p>
        <div className="flex justify-center gap-4">
          {!isDeleting ? (
            disableConfirm ? (
              <button
                onClick={onCancel}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
              >
                I Understand
              </button>
            ) : (
              <>
                <button
                  onClick={onConfirm}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
                >
                  Confirm
                </button>
                <button
                  onClick={onCancel}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
              </>
            )
          ) : (
            <div className="loader" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
