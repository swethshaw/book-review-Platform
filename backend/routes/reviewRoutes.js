import express from "express";
import protect from "../middleware/authMiddleware.js";
import Review from "../models/Review.js";

const router = express.Router();

// Get all reviews
router.get("/", async (req, res) => {
  const reviews = await Review.find().populate("book", "title");
  res.json(reviews);
});

// Create review (protected)
router.post("/", protect, async (req, res) => {
  const { bookId, rating, comment } = req.body;

  const review = new Review({
    user: req.user._id,
    book: bookId,
    rating,
    comment,
  });

  const createdReview = await review.save();
  res.status(201).json(createdReview);
});

export default router;
