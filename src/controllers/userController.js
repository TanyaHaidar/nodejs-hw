import createHttpError from "http-errors";
import { User } from "../models/user.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw createHttpError(400, "Avatar image is required");
    }

    const avatarURL = await saveFileToCloudinary(req.file.buffer);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatarURL },
      { new: true }
    );

    return res.status(200).json({
      message: "Avatar uploaded successfully",
      avatarURL: updatedUser.avatarURL,
    });
  } catch (error) {
    next(error);
  }
};
