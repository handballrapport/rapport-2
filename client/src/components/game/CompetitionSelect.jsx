/* eslint-disable react/prop-types */
const CompetitionSelect = ({ competitions, gameData, setGameData }) => (
    <div className="w-1/2 rounded-md">
      <div className="mb-4 w-full flex flex-col items-center rounded-md">
        <select
          name="competition"
          value={gameData.competition}
          onChange={(e) =>
            setGameData({ ...gameData, competition: e.target.value })
          }
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3451a8]"
          required
        >
          <option value="">Choose Competition</option>
          {competitions.map((competition) => (
            <option key={competition._id} value={competition._id}>
              {competition.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
  
  export default CompetitionSelect;
  