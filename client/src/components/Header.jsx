/* eslint-disable react/prop-types */
import { getCode } from "country-list";
import { FaPlus } from "react-icons/fa";
import WorldFlag from "react-world-flags";

const Header = ({ onOpenModal, team }) => {
  let countryCode;
  if (team) {
    countryCode = getCode(team);
  }

  return (
    <div className="flex  gap-5 items-center mb-6 border-b-2 pb-2">
      <button
        onClick={() => onOpenModal()}
        className="bg-[#3451a8] text-white p-2 rounded-md shadow-md hover:bg-[#3451a8]/90 transition duration-300 hover:scale-105"
      >
        <FaPlus className="text-4xl" />
      </button>
      {team && countryCode ? (
        <div className="flex items-center ">
          <WorldFlag
            code={countryCode}
            className="w-{40px} h-[40px] mr-2 border-2 border-slate-500 rounded-md"
          />
          <span className="font-bold tracking-widest">{team}</span>
        </div>
      ) : (
        <span>{team}</span>
      )}
    </div>
  );
};

export default Header;
