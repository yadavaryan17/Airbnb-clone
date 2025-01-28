const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isloggedIn, isOwner,validateListing} = require("../middleware.js");



// index rout 
router.get("/",wrapAsync(async (req, res)=> {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
}));

//create new
router.get("/new",isloggedIn, (req, res)=> {
    res.render("listings/new.ejs")
})

// Show rout
router.get("/:id",wrapAsync( async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
    populate: {
        path: "author",
    },
}).
    populate("owner");
    if(!listing){ 
        req.flash("error", "Listing you are requested are not found!");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("./listings/show.ejs", {listing});
}));

//Creat route
router.post("/",
    isloggedIn,
    validateListing,
    wrapAsync(async (req,res, next)=> {
    // let {title, description, image ,price, country, location} = req.body; 
        const newListing = new Listing(req.body.listing); 
        // console.log(req.user);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
}));

//edit rout
router.get("/:id/edit",
    isloggedIn,
    isOwner,
    wrapAsync( async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    req.flash("success", "Listing Edited!")
    res.render("listings/edit.ejs", {listing});
}));

//Update route
router.put("/:id",
     isloggedIn,
     isOwner,
    validateListing
    , wrapAsync(async (req, res)=> {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`)
}));

//delete rout
router.delete("/:id",
    isloggedIn,
    isOwner,
    wrapAsync(async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Listing deleted!")

    res.redirect("/listings");
}));

module.exports = router;