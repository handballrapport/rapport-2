import { Schema, model } from "mongoose";
import Player from "./Player.js";
import HandballGame from "./Game.js";

const eventSchema = new Schema({
  game: {
    type: Schema.Types.ObjectId,
    ref: "HandballGame",
    required: true,
  },
  player: {
    type: Schema.Types.ObjectId,
    ref: "Player",
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  goalZone: {
    type: Number,
    required: false,
  },
  shotPosition: {
    type: String,
    required: false,
  },
  selectedTypeDefense: {
    type: String,
    required: false,
  },
  selectedOffenseSituation: {
    type: String,
    required: false,
  },
  selectedDefense: {
    type: String,
    required: false,
  },
  selectedOffense: {
    type: String,
    required: false,
  },
  sanction: {
    type: String,
    required: false,
  },
  period: {
    type: String,
    required: false,
  },
  goalkeeper: {
    type: Schema.Types.ObjectId,
    ref: "Player",
    required: false,
  },
  shotResult: {
    type: String,
    required: false,
  },
  timeEvent: {
    type: String,
    required: false,
  },
  team: {
    type: String,
    required: true, // Mark it as required if necessary
  },
});

eventSchema.index({ game: 1, player: 1, timestamp: 1 });

const Event = model("Event", eventSchema);

export default Event;
