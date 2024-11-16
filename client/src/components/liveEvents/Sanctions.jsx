/* eslint-disable react/prop-types */

const sanctions = [
  { label: "Yellow Card", color: "bg-yellow-500" },
  { label: "2 Minutes", color: "bg-gray-500" },
  { label: "Red Card", color: "bg-red-500" },
  { label: "Blue Card", color: "bg-blue-800" },
];

const Sanctions = ({ sanction, setSanction }) => {
  const handleSanctionClick = (selectedSanction) => {
    setSanction(selectedSanction);
  };

  return (
    <div className="">
      <div className="flex gap-4 ">
        {sanctions.map((sanctionItem) => (
          <button
            key={sanctionItem.label}
            className={`${
              sanctionItem.color
            } text-white w-11 h-11 rounded flex justify-center items-center ${
              sanction === sanctionItem.label
                ? "border-2 border-slate-400"
                : "border-transparent"
            }`}
            onClick={() => handleSanctionClick(sanctionItem.label)}
          >
            {sanctionItem.label === "2 Minutes" ? " 2' " : ""}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sanctions;
