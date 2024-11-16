import { Schema, model } from "mongoose";

const competitionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    avatarPublicId: {
      type: String,  
    },
  },
  {
    timestamps: true,
  }
);

const Competition = model("Competition", competitionSchema);

export default Competition;
