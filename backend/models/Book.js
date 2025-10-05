import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a book title"],
    },
    author: {
      type: String,
      required: [true, "Please add the author name"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    genre: {
      type: String,
      required: [true, "Please specify a genre"],
    },
    year: {
      type: Number,
      required: [true, "Please provide published year"],
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
