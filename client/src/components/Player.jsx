const Player = ({ firstName, lastName, team, position, profileImage, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="relative border-2 border-slate-400 hover:border-transparent duration-700 rounded-lg w-full h-full cursor-pointer overflow-hidden group shadow-lg hover:shadow-2xl transition-all "
    >
      <div
        className="absolute inset-0 transform transition-transform duration-500 ease-in-out group-hover:scale-110"
        style={{
          backgroundImage: `url(${profileImage})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: "100%",
          width: "100%",
        }}
      ></div>
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      ></div>
      <div
        className="absolute inset-0 flex flex-col items-center justify-end text-white transform translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 p-4"
      >
        <span className="font-bold text-xl mb-1">{`${firstName} ${lastName}`}</span>
        <span>{position}</span>
      </div>
    </div>
  );
};

export default Player;
