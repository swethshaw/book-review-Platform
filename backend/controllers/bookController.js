import Book from "../models/Book.js";
import Review from "../models/Review.js";

export const addBook = async (req, res) => {
  try {
    const { title, author, description, genre, year } = req.body;
    const book = await Book.create({
      title,
      author,
      description,
      genre,
      year,
      addedBy: req.user.id
    });
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: "Error adding book", error: error.message });
  }
};

export const getBooks = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const books = await Book.find().skip(skip).limit(limit).populate("addedBy", "name");
    const count = await Book.countDocuments();

    res.json({
      books,
      currentPage: page,
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("addedBy", "name");
    if (!book) return res.status(404).json({ message: "Book not found" });

    const reviews = await Review.find({ bookId: book._id }).populate("userId", "name");
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length
        : 0;

    res.json({ book, reviews, avgRating });
  } catch (error) {
    res.status(500).json({ message: "Error fetching book details", error: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.addedBy.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Error updating book", error: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.addedBy.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    await book.deleteOne();
    res.json({ message: "Book removed" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting book", error: error.message });
  }
};
