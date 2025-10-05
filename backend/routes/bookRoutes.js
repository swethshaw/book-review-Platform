import express from "express";
import protect from "../middleware/authMiddleware.js";
import Book from "../models/Book.js";

const router = express.Router();

// Get all books
router.get("/", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// Create book (protected)
router.post("/", protect, async (req, res) => {
  const { title, author, description } = req.body;

  const book = new Book({
    user: req.user._id,
    title,
    author,
    description,
  });

  const createdBook = await book.save();
  res.status(201).json(createdBook);
});

export default router;
