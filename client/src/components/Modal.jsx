/* eslint-disable react/prop-types */
import React from "react";
import { FaTimes } from "react-icons/fa";

const Modal = ({ isOpen, closeModal, children, title, width, height }) => {
  if (!isOpen) return null;

  // Default width and height classes
  const defaultWidth = "w-1/3";

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-20 backdrop-blur-sm">
      <div
        className={`bg-[#F2f2f2] rounded-sm shadow-2xl relative border-2 ${width || defaultWidth} `}
      >
        <div className="flex justify-between items-center border-b bg-white px-2">
          <h2 className="text-xl font-semibold text-center w-full py-2 capitalize">
            {title}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 w-8 h-8 flex justify-center items-center rounded-full"
          >
            <FaTimes className="bg-blue-900 p-1 text-white rounded-full text-2xl hover:scale-110 hover:rotate-180 transform transition duration-500" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
