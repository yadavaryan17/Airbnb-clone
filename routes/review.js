const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {validatereview, isloggedIn,isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");



//Reviews
//post rout
router.post("/",
    isloggedIn,
    validatereview,
    wrapAsync(reviewController.creatReview)
);

//delete review rout
router.delete("/:reviewId",
    isloggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview)
)
module.exports = router;