/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { CiImageOn } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

const AvatarUploadSection = ({ avatarPreview, fileInputRef, setFormData }) => {
  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // If a file is selected, update the avatar and avatarPreview
      setFormData((prevData) => ({ ...prevData, avatar: file }));

      // Generate and set the avatar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          avatarPreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      // If no file is selected (input cleared), remove the avatar and avatarPreview
      setFormData((prevData) => ({
        ...prevData,
        avatar: null,
        avatarPreview: null,
      }));
    }
  };

  const handleDeleteClick = () => {
    // Remove the avatar and avatarPreview from the form data
    setFormData((prevData) => ({
      ...prevData,
      avatar: null,
      avatarPreview: null,
    }));
  };

  return (
    <div className="mb-4 w-full flex flex-col justify-center items-center">
      <div
        className="bg-[#DDDbDC] w-36 h-36 flex justify-center items-center rounded-md cursor-pointer overflow-hidden"
        onClick={handleIconClick}
      >
        {avatarPreview ? (
          <img
            src={avatarPreview}
            alt="Avatar Preview"
            className="object-cover w-full h-full"
          />
        ) : (
          <CiImageOn className="text-8xl text-black/50" />
        )}
      </div>
      <input
        type="file"
        id="avatar-input"
        name="avatar"
        className="hidden"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <div className="flex space-x-4 mt-4">
        <button
          type="button"
          onClick={handleIconClick}
          className="bg-[#3451a8] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#3451a8]/90 transition duration-700 hover:scale-95"
        >
          Choose Image
        </button>
        {avatarPreview && (
          <button
            type="button"
            onClick={handleDeleteClick}
            className="flex items-center bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition duration-700 hover:scale-95"
          >
            <MdDelete className="mr-2" />
            Delete Image
          </button>
        )}
      </div>
    </div>
  );
};

export default AvatarUploadSection;
