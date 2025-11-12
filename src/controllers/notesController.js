import { Note } from "../models/note.js";
import createHttpError from "http-errors";

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;

    const pageNumber = Number(page);
    const perPageNumber = Number(perPage);

    let query = Note.find();

    if (tag) {
      query = query.where("tag").equals(tag);
    }

    if (search) {
      query = query.find({ $text: { $search: search } });
    }

    const [notes, totalNotes] = await Promise.all([
      query
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * perPageNumber)
        .limit(perPageNumber)
        .exec(),
      Note.countDocuments(
        search ? { $text: { $search: search }, ...(tag ? { tag } : {}) } : tag ? { tag } : {}
      ),
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
    const note = await Note.findById(noteId);

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
    const newNote = await Note.create({ title, content, tag });

    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      throw createHttpError(404, "Note not found");
    }

    res.status(200).json(deletedNote);
  } catch (error) {
    next(error);
  }
};


export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const updatedNote = await Note.findByIdAndUpdate(noteId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedNote) {
      throw createHttpError(404, "Note not found");
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};
