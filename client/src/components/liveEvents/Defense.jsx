/* eslint-disable react/prop-types */

const defense = ["steal", "block", "7mc"];

const Defense = ({setSelectedDefense , selectedDefense}) => {

  return (
    <div className="p-1">
      <div className="font-semibold uppercase flex justify-center">
        {defense.map((defenseType, index) => (
          <span
            key={index}
            className={`border-2 px-3 py-[2px] border-black/50 cursor-pointer text-xl  ${
              defenseType === selectedDefense ? "bg-red-600 text-white" : ""
            } ${index !== 0 ? "border-l-0" : ""}`}
            onClick={() => setSelectedDefense(defenseType)}
          >
            {defenseType}
          </span>
        ))}
      </div>

    </div>
  );
};

export default Defense;
