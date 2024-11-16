/* eslint-disable react/prop-types */

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, isDeleting }) => {
  return (
    isOpen && (
      <div className="modal">
        <div className="modal-content">
          <h2>{title}</h2>
          <p>{message}</p>
          <div className="space-x-4">
            <button onClick={onConfirm} className="btn-danger">
              {isDeleting ? "Deleting..." : "Confirm"}
            </button>
            <button onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ConfirmModal;
