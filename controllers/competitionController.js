import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { formatImage } from "../middleware/multerMiddleware.js";
import Competition from "../models/competitionModel.js";
import cloudinary from "../utils/cloudinaryConfig.js";

export const createCompetition = asyncHandler(async (req, res) => {
  const newCompetition = { ...req.body };
  if (req.file) {
    const file = formatImage(req.file);
    const response = await cloudinary.v2.uploader.upload(file);
    newCompetition.avatar = response.secure_url;
    newCompetition.avatarPublicId = response.public_id;
  }
  const competition = new Competition(newCompetition);

  await competition.save();
  res.status(StatusCodes.CREATED).json(competition);
});

export const getAllCompetitions = asyncHandler(async (req, res) => {
  const competitions = await Competition.find();
  res.status(StatusCodes.OK).json(competitions);
});

export const getCompetitionById = asyncHandler(async (req, res) => {
  const competition = await Competition.findById(req.params.id);
  if (!competition) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Competition not found" });
  }
  res.status(StatusCodes.OK).json(competition);
});

export const updateCompetition = asyncHandler(async (req, res) => {
  const newCompetition = { ...req.body };

  const oldCompetition = await Competition.findById(req.params.id);
  const oldAvatarPublicId = oldCompetition?.avatarPublicId;

  if (req.file) {
    const file = formatImage(req.file);
    const response = await cloudinary.v2.uploader.upload(file);

    newCompetition.avatar = response.secure_url;
    newCompetition.avatarPublicId = response.public_id;
  }

  const updatedCompetition = await Competition.findByIdAndUpdate(
    req.params.id,
    newCompetition,
    {
      new: true,
      runValidators: true,
    }
  );

  if (req.file && oldAvatarPublicId) {
    const destroyResponse = await cloudinary.v2.uploader.destroy(
      oldAvatarPublicId
    );

  } else {
    console.log("No old avatar to delete or no new file uploaded.");
  }

  res.status(StatusCodes.OK).json({
    msg: "Competition updated successfully",
    updatedCompetition,
  });
});

export const deleteCompetition = asyncHandler(async (req, res) => {
  const competition = await Competition.findById(req.params.id);

  if (!competition) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Competition not found" });
  }

  // Delete the avatar from Cloudinary if it exists
  if (competition.avatarPublicId) {
    const destroyResponse = await cloudinary.v2.uploader.destroy(
      competition.avatarPublicId
    );

    console.log("Cloudinary destroy response:", destroyResponse);
  }

  // Delete the competition from the database
  await Competition.deleteOne({ _id: req.params.id });

  res.status(StatusCodes.OK).json({ message: "Competition removed" });
});
