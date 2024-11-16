/* eslint-disable react/prop-types */
import demiTerrain from "/demi-terrain.png";

const playerPositions = [
  { position: "LW", x: "8%", y: "40%" },
  { position: "RW", x: "92%", y: "40%" },
  { position: "LB", x: "15%", y: "80%" },
  { position: "CB", x: "50%", y: "85%" },
  { position: "RB", x: "85%", y: "80%" },
  { position: "C6", x: "50%", y: "60%" },
  { position: "L6", x: "20%", y: "55%" },
  { position: "R6", x: "80%", y: "55%" },
  { position: "7M", x: "50%", y: "70%" },
  { position: "FB", x: "10%", y: "95%" },
  { position: "FTO", x: "35%", y: "95%" },
  { position: "EG", x: "65%", y: "95%" },
  { position: "BT", x: "90%", y: "95%" },
];

const goalZonePositions = [
  { zone: 1, x: "calc(50% + 0px)", y: "calc(21% + 0px)" },
  { zone: 2, x: "calc(50% + 40px)", y: "calc(21% + 0px)" },
  { zone: 3, x: "calc(50% + 80px)", y: "calc(21% + 0px)" },
  { zone: 4, x: "calc(50% + 0px)", y: "calc(25% + 40px)" },
  { zone: 5, x: "calc(50% + 40px)", y: "calc(25% + 40px)" },
  { zone: 6, x: "calc(50% + 80px)", y: "calc(25% + 40px)" },
  { zone: 7, x: "calc(50% + 0px)", y: "calc(30% + 80px)" },
  { zone: 8, x: "calc(50% + 40px)", y: "calc(30% + 80px)" },
  { zone: 9, x: "calc(50% + 80px)", y: "calc(30% + 80px)" },
  { zone: 10, x: "10%", y: "5%" },
];

const Pitch = ({ goalZone, setGoalZone, shotPosition, setShotPosition }) => {
  const handlePlayerClick = (index) => {
    setShotPosition(playerPositions[index].position);
  };

  const handleGoalZoneClick = (index) => {
    setGoalZone(goalZonePositions[index].zone);
  };

  return (
    <div
      className="w-[70%] bg-cover bg-center  relative h-[50vh]"
      style={{
        backgroundImage: `url(${demiTerrain})`,
        backgroundSize: "100% 100%",
      }}
    >
      <div className="grid grid-cols-3 grid-rows-3 gap-3 w-[36%] h-[22%] absolute top-[21%] left-[50.3%] transform -translate-x-1/2 -translate-y-1/2 p-1">
        {goalZonePositions.slice(0, 9).map((zone, index) => (
          <div
            key={index}
            onClick={() => handleGoalZoneClick(index)}
            className={`text-white font-bold flex justify-center items-center rounded-sm text-2xl text-center w-[100%] h-[120%] cursor-pointer ${
              goalZone === goalZonePositions[index].zone
                ? "bg-red-500"
                : "bg-[#012c61]"
            }`}
          >
            {zone.zone}
          </div>
        ))}
      </div>
      {goalZonePositions.slice(9).map((zone, index) => (
        <span
          key={index + 9}
          onClick={() => handleGoalZoneClick(index + 9)}
          className={`absolute bg-[#012c61] rounded-[3px] text-white w-[40%] flex justify-center items-center font-semibold cursor-pointer ${
            goalZone === goalZonePositions[index + 9].zone
              ? "bg-red-500"
              : "bg-[#012c61]"
          }`}
          style={{
            top: zone.y,
            right: zone.x,
            transform: "translate(-50%, -50%)",
          }}
        >
          10
        </span>
      ))}
      {playerPositions.map((player, index) => (
        <div
          key={index}
          onClick={() => handlePlayerClick(index)}
          className={`absolute text-white font-bold cursor-pointer rounded-sm text-center flex justify-center items-center w-[80px]  h-[30px] ${
            shotPosition === playerPositions[index].position ? "bg-red-500" : "bg-[#012c61]"
          }`}
          style={{
            top: player.y,
            left: player.x,
            transform: "translate(-50%, -50%)",
          }}
        >
          {player.position}
        </div>
      ))}
    </div>
  );
};

export default Pitch;
