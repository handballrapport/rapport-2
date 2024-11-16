import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import Event from "../models/event.js";
import HandballGame from "../models/Game.js";
import Player from "../models/Player.js";

export const createEvent = asyncHandler(async (req, res) => {
  try {
    const {
      player: playerId,
      game: gameId,
      timestamp,
      goalZone,
      shotPosition,
      selectedTypeDefense,
      selectedOffenseSituation,
      selectedDefense,
      selectedOffense,
      sanction,
      period,
      shotResult,
      goalkeeper: goalkeeperId,
      timeEvent,
      team
    } = req.body;

    // Validate player
    const player = await Player.findById(playerId);
    if (!player) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Player not found" });
    }

    // Validate game
    const game = await HandballGame.findById(gameId);
    if (!game) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Game not found" });
    }

    // If a goalkeeper is specified, validate the goalkeeper
    let goalkeeper = null;
    if (goalkeeperId) {
      goalkeeper = await Player.findById(goalkeeperId);
      if (!goalkeeper) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Goalkeeper not found" });
      }
    }

    // Create new event
    const newEvent = new Event({
      player: playerId,
      game: gameId,
      timestamp: timestamp || Date.now(),
      goalZone,
      shotPosition,
      selectedTypeDefense,
      selectedOffenseSituation,
      selectedDefense,
      selectedOffense,
      sanction,
      period,
      shotResult,
      goalkeeper: goalkeeper ? goalkeeper._id : null,
      timeEvent,
      team
    });

    await newEvent.save();

    res.status(StatusCodes.CREATED).json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred while creating the event" });
  }
});

export const getAllEvents = asyncHandler(async (req, res) => {
  try {
    const events = await Event.find().populate("player game goalkeeper");
    res.status(StatusCodes.OK).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred while fetching events" });
  }
});

export const getEventById = asyncHandler(async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("player game goalkeeper");
    if (!event) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Event not found" });
    }

    res.status(StatusCodes.OK).json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred while fetching the event" });
  }
});

export const updateEvent = asyncHandler(async (req, res) => {
  try {
    const {
      player: playerId,
      game: gameId,
      timestamp,
      goalZone,
      shotPosition,
      selectedTypeDefense,
      selectedOffenseSituation,
      selectedDefense,
      selectedOffense,
      sanction,
      period,
      shotResult,
      goalkeeper: goalkeeperId,
      timeEvent,
      team
    } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Event not found" });
    }

    // Update player if provided
    if (playerId) {
      const player = await Player.findById(playerId);
      if (!player) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Player not found" });
      }
      event.player = playerId;
    }

    // Update game if provided
    if (gameId) {
      const game = await HandballGame.findById(gameId);
      if (!game) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Game not found" });
      }
      event.game = gameId;
    }

    // Update goalkeeper if provided
    if (goalkeeperId) {
      const goalkeeper = await Player.findById(goalkeeperId);
      if (!goalkeeper) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Goalkeeper not found" });
      }
      event.goalkeeper = goalkeeper._id;
    }

    // Update other fields
    if (timestamp) event.timestamp = timestamp;
    if (goalZone !== undefined) event.goalZone = goalZone;
    if (shotPosition !== undefined) event.shotPosition = shotPosition;
    if (selectedTypeDefense !== undefined) event.selectedTypeDefense = selectedTypeDefense;
    if (selectedOffenseSituation !== undefined) event.selectedOffenseSituation = selectedOffenseSituation;
    if (selectedDefense !== undefined) event.selectedDefense = selectedDefense;
    if (selectedOffense !== undefined) event.selectedOffense = selectedOffense;
    if (sanction !== undefined) event.sanction = sanction;
    if (period !== undefined) event.period = period;
    if (shotResult !== undefined) event.shotResult = shotResult;
    if (timeEvent !== undefined) event.timeEvent = timeEvent;
    if (team !== undefined) event.team = team;

    await event.save();

    res.status(StatusCodes.OK).json({
      msg: "Event updated successfully",
      event,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred while updating the event" });
  }
});

export const deleteEvent = asyncHandler(async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
console.log(event)
    if (!event) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Event not found" });
    }

    await Event.deleteOne({ _id: req.params.id });

    res.status(StatusCodes.OK).json({ message: "Event removed" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "An error occurred while deleting the event" });
  }
});
