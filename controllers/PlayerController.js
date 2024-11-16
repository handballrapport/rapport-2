import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { formatImage } from "../middleware/multerMiddleware.js";
import Player from "../models/Player.js";
import Team from "../models/Team.js";
import cloudinary from "../utils/cloudinaryConfig.js";
import HandballGame from '../models/Game.js';
export const createPlayer = asyncHandler(async (req, res) => {

  try {
    const { number, teamId } = req.body;

    let team;

    if (teamId) {
      team = await Team.findById(teamId);
      if (!team) {
        console.log("Team not found");
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Team not found" });
      }

      const existingPlayer = await Player.findOne({
        team: teamId,
        number: Number(number),
      });
      if (existingPlayer) {
        console.log(
          `Player with number ${number} already exists in the team:`,
          existingPlayer
        );
        return res.status(StatusCodes.CONFLICT).json({
          message: `Player with number ${number} already exists in the team`,
        });
      }
    }

    const newPlayer = { ...req.body };
    if (req.file) {
      const file = formatImage(req.file);
      const response = await cloudinary.v2.uploader.upload(file);
      newPlayer.avatar = response.secure_url;
      newPlayer.avatarPublicId = response.public_id;
    }
 
    const player = new Player(newPlayer);
    await player.save();

    if (teamId) {
      team.players.push(player._id);
      await team.save();
    }

    res.status(StatusCodes.CREATED).json(player);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred while creating the player" });
  }
});


export const getAllPlayers = asyncHandler(async (req, res) => {
  const players = await Player.find();
  res.status(StatusCodes.OK).json(players);
});

export const getPlayerById = asyncHandler(async (req, res) => {
  const player = await Player.findById(req.params.id);
  if (!player) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Player not found" });
  }

  res.status(StatusCodes.OK).json(player);
});

export const updatePlayer = asyncHandler(async (req, res) => {
  const newPlayer = { ...req.body };

  const oldPlayer = await Player.findById(req.params.id);
  const oldAvatarPublicId = oldPlayer?.avatarPublicId;

  if (req.file) {
    const file = formatImage(req.file);
    const response = await cloudinary.v2.uploader.upload(file);
    newPlayer.avatar = response.secure_url;
    newPlayer.avatarPublicId = response.public_id;
  }

  const updatedPlayer = await Player.findByIdAndUpdate(
    req.params.id,
    newPlayer,
    {
      new: true,
      runValidators: true,
    }
  );

  if (req.file && oldAvatarPublicId) {
    await cloudinary.v2.uploader.destroy(oldAvatarPublicId);
  }

  res.status(StatusCodes.OK).json({
    msg: "Player updated successfully",
    updatedPlayer,
  });
});



export const deletePlayer = asyncHandler(async (req, res) => {
  const player = await Player.findById(req.params.id);

  if (!player) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Player not found" });
  }

  // Delete player's avatar from Cloudinary if it exists
  if (player.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(player.avatarPublicId);
  }

  // Find all games where the player's team is either home or away
  const games = await HandballGame.find({
    $or: [
      { 'home_team': { $exists: true } },
      { 'away_team': { $exists: true } }
    ]
  }).populate('home_team away_team');

  for (const game of games) {
    // Remove player ID from home_team and away_team's players array
    if (game.home_team && game.home_team.players.includes(player._id)) {
      await Team.updateOne(
        { _id: game.home_team._id },
        { $pull: { players: player._id } }
      );
    }

    if (game.away_team && game.away_team.players.includes(player._id)) {
      await Team.updateOne(
        { _id: game.away_team._id },
        { $pull: { players: player._id } }
      );
    }
  }

  // Delete the player document
  await Player.deleteOne({ _id: req.params.id });

  res.status(StatusCodes.OK).json({ message: "Player removed and references to this player removed from teams." });
});



// Controller to update player statistics
export const updatePlayerStatistics = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  const { action, fields, values } = req.body; // Expecting action, fields, and optional values for "update"

  // Find the player by ID
  const player = await Player.findById(id);

  if (!player) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "Player not found" });
  }

  // Ensure the statistics array exists and has one element
  if (!player.statistics || player.statistics.length === 0) {
    player.statistics = [{
      goals: 0,
      shots: 0,
      assists: 0,
      saves: 0,
      conceded: 0,
      ballLosses: 0,
      blocks: 0,
      mistakes: 0,
      yellowCards: 0,
      redCards: 0,
      blueCards: 0,
      suspended: 0,
      onTargetShots: 0,  
      offTargetShots: 0,
    }];
  }

  // Iterate over the fields array and apply the action to each field
  for (const field of fields) {
    if (player.statistics[0][field] !== undefined) {
      if (action === 'increment') {
        player.statistics[0][field] += 1;
      } else if (action === 'decrement') {
        player.statistics[0][field] = Math.max(0, player.statistics[0][field] - 1);
      } else if (action === 'update') {
        const value = values[field];
        if (value !== undefined) {
          player.statistics[0][field] = value;
        } else {
          return res.status(StatusCodes.BAD_REQUEST).json({ message: `Missing value for field: ${field}` });
        }
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: `Invalid action` });
      }
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: `Invalid field: ${field}` });
    }
  }

  await player.updateOne({ statistics: player.statistics });

  res.status(StatusCodes.OK).json({ message: "Player statistics updated successfully", player });
});









