/* eslint-disable react/prop-types */
const PlayerCard = ({
  position,
  number,
  name,
  color,
  text,
  isActive,
  onClick, // Added onClick prop
}) => {
  return (
    <div
      onClick={onClick} // Handle the click event
      className={`${
        color ? color : "bg-slate-200"
      } p-1 text-center flex  ${
        isActive ? "border-red-900 border-2" : ""
      } justify-center items-center border-black relative rounded-md w-20 h-20 cursor-pointer overflow-hidden ${text}`}
    >
      <div className="absolute top-0 left-1 font-bold text-[16px]">{position}</div>
      <div className="text-5xl font-bold ">{number}</div>
      <div className="font-bold text-sm mt-0 absolute bottom-0 left-1">{name.slice(0, 9)}</div>
    </div>
  );
};

export default PlayerCard;
