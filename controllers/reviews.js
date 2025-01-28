const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.creatReview =  async (req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    // console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New review added!")

    res.redirect(`/listings/${listing._id}`)
}

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
req.flash("success", " review Deleted!")
      
res.redirect(`/listings/${id}`)

}