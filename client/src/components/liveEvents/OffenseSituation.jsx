/* eslint-disable react/prop-types */

const offenseSituation = ["equal.att", "major.att","Minor.att", "7vs6"];

const OffenseSituation = ({selectedOffenseSituation ,setSelectedOffenseSituation}) => {

  return (
    <div className="p-1">
      <div className="font-semibold uppercase flex justify-center">
        {offenseSituation.map((offenseType, index) => (
          <span
            key={index}
            className={`border-2 text-xl px-3 py-2 border-black/50 cursor-pointer ${
              offenseType === selectedOffenseSituation ? "bg-red-600 text-white" : ""
            } ${index !== 0 ? "border-l-0" : ""}`}
            onClick={() => setSelectedOffenseSituation(offenseType)}
          >
            {offenseType}
          </span>
        ))}
      </div>
    </div>
  );
};

export default OffenseSituation;
