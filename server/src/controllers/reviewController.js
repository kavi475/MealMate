import Review from "../models/Review.js";
import MenuItem from "../models/MenuItem.js";

// @desc    Get all reviews for a menu item
// @route   GET /api/reviews/item/:menuItemId
// @access  Public
export const getItemReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      menuItemId: req.params.menuItemId,
    }).sort({ createdAt: -1 });

    // Calculate average rating
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating =
      reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

    res.json({
      count: reviews.length,
      averageRating: parseFloat(averageRating),
      reviews,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Add a review
// @route   POST /api/reviews
// @access  User
export const addReview = async (req, res) => {
  try {
    const { menuItemId, rating, comment } = req.body;

    // Validate fields
    if (!menuItemId || !rating || !comment) {
      return res
        .status(400)
        .json({ error: "Please provide rating and comment" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    if (comment.trim().length < 3) {
      return res
        .status(400)
        .json({ error: "Comment must be at least 3 characters" });
    }

    if (comment.trim().length > 500) {
      return res
        .status(400)
        .json({ error: "Comment must be less than 500 characters" });
    }

    // Check if menu item exists
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    // Check if user already reviewed this item
    const existingReview = await Review.findOne({
      menuItemId,
      userId: req.userId,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ error: "You have already reviewed this item" });
    }

    // Create review
    const review = await Review.create({
      menuItemId,
      userId: req.userId,
      userName: req.user.name,
      rating: Number(rating),
      comment: comment.trim(),
    });

    // Update the menu item's average rating
    const allReviews = await Review.find({ menuItemId });
    const newAverage =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    menuItem.rating = parseFloat(newAverage.toFixed(1));
    await menuItem.save();

    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "You have already reviewed this item" });
    }
    res.status(400).json({ error: error.message });
  }
};

// @desc    Update own review
// @route   PUT /api/reviews/:id
// @access  User
export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Only the owner can update
    if (review.userId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ error: "You can only edit your own review" });
    }

    if (rating) {
      if (rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ error: "Rating must be between 1 and 5" });
      }
      review.rating = Number(rating);
    }

    if (comment) {
      if (comment.trim().length < 3) {
        return res
          .status(400)
          .json({ error: "Comment must be at least 3 characters" });
      }
      review.comment = comment.trim();
    }

    await review.save();

    // Update menu item rating
    const allReviews = await Review.find({ menuItemId: review.menuItemId });
    const newAverage =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await MenuItem.findByIdAndUpdate(review.menuItemId, {
      rating: parseFloat(newAverage.toFixed(1)),
    });

    res.json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Delete own review
// @route   DELETE /api/reviews/:id
// @access  User
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Only owner or admin can delete
    if (review.userId.toString() !== req.userId && req.userRole !== "admin") {
      return res
        .status(403)
        .json({ error: "You can only delete your own review" });
    }

    const menuItemId = review.menuItemId;
    await review.deleteOne();

    // Update menu item rating
    const remainingReviews = await Review.find({ menuItemId });
    const newAverage =
      remainingReviews.length > 0
        ? remainingReviews.reduce((sum, r) => sum + r.rating, 0) /
          remainingReviews.length
        : 4.0;

    await MenuItem.findByIdAndUpdate(menuItemId, {
      rating: parseFloat(newAverage.toFixed(1)),
    });

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews/admin/all
// @access  Admin
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("menuItemId", "name image")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({ count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
