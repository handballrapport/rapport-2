import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { formatImage } from "../middleware/multerMiddleware.js";
import Team from "../models/Team.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import Player from "../models/Player.js";

export const createTeam = asyncHandler(async (req, res) => {
  const newTeam = { ...req.body };
  if (req.file) {
    const file = formatImage(req.file);
    const response = await cloudinary.v2.uploader.upload(file);
    newTeam.avatar = response.secure_url;
    newTeam.avatarPublicId = response.public_id;
  }
  
  const team = new Team(newTeam);
  await team.save();
  
  res.status(StatusCodes.CREATED).json(team);
});

export const getAllTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find().populate('players');
  res.status(StatusCodes.OK).json(teams);
});

export const getTeamById = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id).populate('players');
  
  if (!team) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Team not found" });
  }
  
  res.status(StatusCodes.OK).json(team);
});

export const updateTeam = asyncHandler(async (req, res) => {
  const newTeam = { ...req.body };
  
  const oldTeam = await Team.findById(req.params.id);
  const oldAvatarPublicId = oldTeam?.avatarPublicId;
  
  if (req.file) {
    const file = formatImage(req.file);
    const response = await cloudinary.v2.uploader.upload(file);
    newTeam.avatar = response.secure_url;
    newTeam.avatarPublicId = response.public_id;
  }
  
  const updatedTeam = await Team.findByIdAndUpdate(req.params.id, newTeam, {
    new: true,
    runValidators: true,
  });
  
  if (req.file && oldAvatarPublicId) {
    await cloudinary.v2.uploader.destroy(oldAvatarPublicId);
  }
  
  res.status(StatusCodes.OK).json({
    msg: "Team updated successfully",
    updatedTeam,
  });
});

export const deleteTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id).populate('players');
  
  if (!team) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Team not found" });
  }

  // Delete all players associated with the team
  if (team.players.length > 0) {
    await Player.deleteMany({ _id: { $in: team.players } });
  }

  // Delete the team's avatar from cloudinary if exists
  if (team.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(team.avatarPublicId);
  }
  
  // Delete the team
  await Team.deleteOne({ _id: req.params.id });
  
  res.status(StatusCodes.OK).json({ message: "Team and associated players removed" });
});
