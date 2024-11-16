import { IoMdClose } from "react-icons/io";

const PlayersModal = ({ isModalOpen, closeModal , team }) => {

  if (!isModalOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-30 w-full ">
      <h1 className="bg-red-100">players</h1>
      <button
        onClick={closeModal}
        className="bg-[#3051A8] hover:bg-[#3051A8]/90 transition-all duration-300 text-white  w-10 h-10 flex justify-center items-center top-2 right-2 rounded-full text-center font-semibold absolute "
      >
        <IoMdClose className="text-2xl" />
      </button>
    </div>
  );
};

export default PlayersModal;
