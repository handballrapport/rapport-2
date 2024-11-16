import Card from "../Card";

const CompetitionList = ({
  isFetching,
  fetchError,
  competitions,
  openModal,
  handleDelete,
}) => {
  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="spinner"></div>
      </div>
    );
  }

  if (fetchError)
    return <p className="text-red-500">Error loading competitions</p>;

  return (
    <div className="flex gap-2 flex-wrap">
      {competitions.map((competition) => (
        <Card
          key={competition._id}
          item={competition}
          openModal={openModal}
          handleDelete={handleDelete}
          noFlag
        />
      ))}
    </div>
  );
};

export default CompetitionList;
