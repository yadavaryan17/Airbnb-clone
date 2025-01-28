const Listing = require("../models/listing");

module.exports.index = async (req, res)=> {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
}

module.exports.showListing = async (req, res) => {
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
}

module.exports.creatListing = async (req,res, next)=> {
    // let {title, description, image ,price, country, location} = req.body; 
    let url = req.file.path;
    let filename = req.file.filename;
        const newListing = new Listing(req.body.listing); 
        newListing.owner = req.user._id;
        newListing.image = {url , filename};
        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
}

module.exports.editListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    req.flash("success", "Listing Edited!")
    res.render("listings/edit.ejs", {listing});
}

module.exports.updateListing = async (req, res)=> {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url , filename};
    await listing.save();
    }

    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`)
}

module.exports.deleteListing = async (req,res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Listing deleted!")

    res.redirect("/listings");
}