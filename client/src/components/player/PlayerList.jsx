/* eslint-disable react/prop-types */
import Card from "../Card";

const PlayerList = ({
  players,
  isFetching,
  fetchError,
  openModal,
  handleDelete,
}) => {
  if (isFetching) return <div>Loading...</div>;
  if (fetchError) return <div>Error loading players.</div>;
  if (!players || players.length === 0) return <div>No players found.</div>;

  const sortedPlayers = [...players].sort((a, b) => a.number - b.number);

  return (
    <div className="flex gap-1 flex-wrap">
      {sortedPlayers.map((player) => (
        <div key={player._id} className="border-2 p-1 border-[#3451a8] rounded-lg">
          <Card
            item={player}
            openModal={openModal}
            handleDelete={handleDelete}
            player
          />
        </div>
      ))}
    </div>
  );
};

export default PlayerList;
