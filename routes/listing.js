const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isloggedIn, isOwner,validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage });



// index rout 
router.get("/",wrapAsync(listingController.index));

//create new
router.get("/new",isloggedIn, (req, res)=> {
    res.render("listings/new.ejs")
})

// Show rout
router.get("/:id",wrapAsync(listingController.showListing));

// Creat route
router.post("/",
    isloggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.creatListing));



//edit rout
router.get("/:id/edit",
    isloggedIn,
    isOwner,
    wrapAsync(listingController.editListing));

//Update route
router.put("/:id",
     isloggedIn,
     isOwner,
     upload.single("listing[image]"),
    validateListing
    , wrapAsync(listingController.updateListing));

//delete rout
router.delete("/:id",
    isloggedIn,
    isOwner,
    wrapAsync(listingController.deleteListing));

module.exports = router;