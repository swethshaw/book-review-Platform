import Review from "../models/Review.js";

export const addReview = async (req, res) => {
  try {
    const { bookId, rating, reviewText } = req.body;
    const review = await Review.create({
      bookId,
      userId: req.user.id,
      rating,
      reviewText
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Error adding review", error: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.userId.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: "Error updating review", error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.userId.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    await review.deleteOne();
    res.json({ message: "Review removed" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error: error.message });
  }
};
