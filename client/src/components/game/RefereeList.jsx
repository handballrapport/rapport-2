/* eslint-disable react/prop-types */
import { FaPlus } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Input from "../Input";

const RefereeList = ({ referees, setGameData }) => {
  const handleRefereeChange = (index, value) => {
    const newReferees = [...referees];
    newReferees[index] = value;
    setGameData((prevState) => ({ ...prevState, referees: newReferees }));
  };

  const handleRemoveReferee = (index) => {
    const newReferees = referees.filter((_, i) => i !== index);
    setGameData((prevState) => ({ ...prevState, referees: newReferees }));
  };

  const handleAddReferee = () => {
    setGameData((prevState) => ({ ...prevState, referees: [...referees, ""] }));
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <p>Referees</p>
      <div className="grid grid-cols-2 items-center mb-2 w-full ">
        <button
          type="button"
          onClick={handleAddReferee}
          className="w-10 h-10 flex justify-center items-center bg-[#3451a8] text-white font-semibold py-2 rounded-md hover:bg-[#3451a8]/90 transition"
        >
          <FaPlus className="text-xl" />
        </button>
        <div>

        {referees.map((referee, index) => (
          <div key={index} className="flex items-center w-full">
            <Input
              type="text"
              value={referee}
              onChange={(e) => handleRefereeChange(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3451a8]"
              />
            <button
              type="button"
              onClick={() => handleRemoveReferee(index)}
              className="ml-2 p-2 bg-red-500 text-white rounded-md"
              >
              <IoMdClose />
            </button>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default RefereeList;
