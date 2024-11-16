/* eslint-disable react/prop-types */
const offense = ["assist", "r7m", "tech.f"];

const Offense = ({ selectedOffense, setSelectedOffense }) => {
  return (
    <div className="p-1">
      <div className="font-semibold uppercase flex justify-center">
        {offense.map((offenseType, index) => (
          <span
            key={index}
            className={`border-2 border-black/50 px-3 text-xl py-[2px] cursor-pointer ${
              offenseType === selectedOffense ? "bg-red-600 text-white" : ""
            } ${index !== 0 ? "border-l-0" : ""}`}
            onClick={() => setSelectedOffense(offenseType)}
          >
            {offenseType}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Offense;
