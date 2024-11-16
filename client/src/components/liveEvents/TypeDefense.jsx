const typeDefense = ["6-0", "5-1", "3-2-1", "4-2", "3-3", "autre"];

const TypeDefense = ({ selectedTypeDefense, setSelectedTypeDefense }) => {
  return (
    <div className="p-1">
      <div className="font-semibold uppercase flex justify-center">
        {typeDefense.map((defenseType, index) => (
          <span
            key={index}
            className={`border-2 text-xl px-3 py-2 border-black/50 cursor-pointer ${
              defenseType === selectedTypeDefense ? "bg-red-600 text-white" : ""
            } ${index !== 0 ? "border-l-0" : ""}`}
            onClick={() => setSelectedTypeDefense(defenseType)}
          >
            {defenseType}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TypeDefense;
