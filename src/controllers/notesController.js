import { Note } from "../models/note.js";
import createHttpError from "http-errors";

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;
    const { _id: userId } = req.user;

    const pageNumber = Number(page);
    const perPageNumber = Number(perPage);

    let filter = { userId };

    if (tag) {
      filter.tag = tag;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const query = Note.find(filter);

    const [notes, totalNotes] = await Promise.all([
      query
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * perPageNumber)
        .limit(perPageNumber)
        .exec(),

      Note.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalNotes / perPageNumber);

    res.status(200).json({
      page: pageNumber,
      perPage: perPageNumber,
      totalNotes,
      totalPages,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const { _id: userId } = req.user;

    const note = await Note.findOne({ _id: noteId, userId });

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const { title, content, tag } = req.body;
    const { _id: userId } = req.user;

    const newNote = await Note.create({
      title,
      content,
      tag,
      userId,
    });

    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const { _id: userId } = req.user;

    const deletedNote = await Note.findOneAndDelete({ _id: noteId, userId });

    if (!deletedNote) {
      throw createHttpError(404, "Note not found or not yours");
    }

    res.status(200).json(deletedNote);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const { _id: userId } = req.user;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      throw createHttpError(404, "Note not found or not yours");
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};
