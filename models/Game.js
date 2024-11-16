import { Schema, model } from "mongoose";
const handballGameSchema = new Schema({
  home_team: {
    type: Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  away_team: {
    type: Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  competition: {
    type: Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  referees: [
    {
      type: String,
      required: true,
    },
  ],
  match_date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: false,
  },
  score: {
    home: {
      type: Number,
      default: 0,
    },
    away: {
      type: Number,
      default: 0,
    },
  },
  status: {
    type: String,
    enum: ["scheduled", "ongoing", "finished"],
    default: "scheduled",
  },
});

const HandballGame = model("HandballGame", handballGameSchema);
export default HandballGame;
