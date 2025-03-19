const express = require("express");
const router = express.Router();
const User =require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js")
const userController = require("../controllers/users.js");

//signup rout
router.get("/signup", (req, res)=> {
    res.render("../views/users/signup.ejs")
});

//signup Create rout
router.post("/signup",wrapAsync( userController.signup)
);

//Login
router.get("/login", (req, res)=> {
    res.render("../views/users/login.ejs")
});


router.post("/login", saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    userController.login
);

router.get("/logout", userController.logout)

module.exports = router;