/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Card from "../Card";
import { GoPencil } from "react-icons/go";

const TeamList = ({
  isFetching,
  fetchError,
  teams,
  openModal,
  handleDelete,
}) => {
  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <span className="spinner" />
      </div>
    );
  }

  if (fetchError) return <p className="text-red-500">Error loading teams</p>;

  const sortedTeams = teams.slice().sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="flex  gap-1 flex-wrap ">
      <div className="bg-slate-50 w-40 items-center justify-center font-bold border-2  rounded-md flex capitalize">
        {teams.length} teams added
      </div>
      <div className="flex flex-wrap gap-10 ">
        {sortedTeams.map((team) => (
          <div key={team._id} className=" rounded-md relative top-0 right-0 ">
              <Card
                key={team._id}
                item={team}
                openModal={openModal}
                handleDelete={handleDelete}
                totalCards={teams.length}
              />
            <Link to={`/dashboard/teams/${team._id}/${team.name}`} className="w-full absolute bg-[#3451a8] text-white text-center capitalize rounded-b-md">show team
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamList;
