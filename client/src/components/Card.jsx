/* eslint-disable react/prop-types */

import { getCode } from "country-list";
import { FaEdit, FaTrash } from "react-icons/fa";
import WorldFlag from "react-world-flags";

const Card = ({ item, openModal, handleDelete, noFlag, player }) => {
  const ActionButton = ({ onClick, icon: Icon, bgColor, hoverBgColor }) => (
    <button
      onClick={onClick}
      className={`${bgColor} text-white p-2 shadow-md w-full flex justify-center items-center transition rounded-md duration-300 hover:${hoverBgColor}`}
    >
      <Icon className="text-xl" />
    </button>
  );

  let countryAbbreviation;
  if (!player) {
    countryAbbreviation =
      getCode(item.name) || item.name.slice(0, 2).toUpperCase();
  }

  return (
    <div className="group">
      <div
        className="bg-cover  bg-center rounded-lg shadow-lg p-4 w-40 h-40 flex flex-col justify-between relative  border-2 cursor-pointer overflow-hidden hover:scale-95 duration-700"
        style={{
          backgroundImage: `url(${item.avatar || "defaultImageUrl"})`,
        }}
      >
        <div className="absolute  inset-0 bg-gradient-to-t from-black  via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out rounded-lg z-10"></div>

        <div className="flex  flex-col items-center relative h-full z-20">
          {player && !item.avatar ? (
            <div className="rounded-full  h-28 w-28 flex items-center justify-center mb-4 z-10 bg-black/10">
              <span className="text-3xl  text-black/15 font-black">
                {item.position}-{item.number}
              </span>
            </div>
          ) : item?.avatar ? null : noFlag && !item.avatar ? (
            <div className="rounded-md  h-28 w-28 flex items-center justify-center mb-4 bg-gray-200">
              <span className="text-2xl font-black">{countryAbbreviation}</span>
            </div>
          ) : (
            <div className="rounded-md h-28 w-28 flex items-center justify-center mb-4 z-10">
              <WorldFlag code={countryAbbreviation} className="w-full h-full" />
            </div>
          )}
          <div className="flex justify-center items-center text-black absolute bottom-0 left-0 right-0 group-hover:top-5 group-hover:transform group-hover:-translate-y-1/2 transition-all duration-700 ease-in-out w-full z-20">
            <h3
              className={` ${
                noFlag ? "text-sm" : "text-2xl "
              } font-black rounded-md text-center flex justify-center items-center`}
            >
              {player ? null : item.name.toUpperCase()}
            </h3>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between gap-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition duration-700 ease-in-out z-20">
          <ActionButton
            onClick={() => openModal(item)}
            icon={FaEdit}
            bgColor="bg-yellow-500"
            hoverBgColor="bg-yellow-600"
          />
          <ActionButton
            onClick={() => handleDelete(item._id)}
            icon={FaTrash}
            bgColor="bg-red-500"
            hoverBgColor="bg-red-600"
          />
        </div>
      </div>
      {
        player && 
        <div className="flex flex-col text-xl pl-1  font-bold capitalize bg-gray-300 rounded-sm cursor-pointer">
        <span>name :{item.firstName}</span>
        <span>number :{item.number}</span>
        <span>position :{item.position}</span>
      </div>
      }
    </div>
  );
};

export default Card;
