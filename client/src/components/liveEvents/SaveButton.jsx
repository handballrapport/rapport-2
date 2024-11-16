import { IoSaveOutline } from "react-icons/io5";

const SaveButton = ({saveEventData}) => {
  return (
    <button className="bg-green-500 text-white flex flex-col justify-center items-center py-3 text-3xl mb-2 w-28 rounded" onClick={saveEventData}>
      <IoSaveOutline />
    </button>
  );
};

export default SaveButton;
