/* eslint-disable react/prop-types */
import WorldFlag from "react-world-flags";

const FlagDisplay = ({ teamCode, team, onFlagClick }) => {
  return teamCode ? (
    <WorldFlag
      code={teamCode}
      className="w-16 h-16 "
      alt={`${team.name} Flag`}
      onClick={() => onFlagClick(team)}
    />
  ) : null;
};

export default FlagDisplay;
