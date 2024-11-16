/* eslint-disable react/prop-types */
const TeamSelect = ({ teams, gameData, setGameData }) => (
    <div className="mb-4 w-full flex justify-between items-center space-x-2">
      <select
        name="home_team"
        value={gameData.home_team}
        onChange={(e) =>
          setGameData({ ...gameData, home_team: e.target.value })
        }
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3451a8]"
        required
      >
        <option value="">Choose Home Team</option>
        {teams.map((team) => (
          <option
            key={team._id}
            value={team._id}
            disabled={team._id === gameData.away_team}
          >
            {team.name}
          </option>
        ))}
      </select>
  
      <select
        name="away_team"
        value={gameData.away_team}
        onChange={(e) =>
          setGameData({ ...gameData, away_team: e.target.value })
        }
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3451a8]"
        required
      >
        <option value="">Choose Away Team</option>
        {teams.map((team) => (
          <option
            key={team._id}
            value={team._id}
            disabled={team._id === gameData.home_team}
          >
            {team.name}
          </option>
        ))}
      </select>
    </div>
  );
  
  export default TeamSelect;
  