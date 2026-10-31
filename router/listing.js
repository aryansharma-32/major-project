const express = require("express");
const router =  express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js"); 
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");

const listingController = require("../controllers/listing.js");



 //INDEX ROUTEa
  router.get("/", wrapAsync(listingController.index));

 //NEW route
    router.get("/new", isLoggedIn, listingController.renderNewForm);  

 //SHOW route 
    router.get("/:id", wrapAsync(listingController.showListing));

 //CREATE route
    router.post("/", validateListing, wrapAsync(listingController.createListing));     

    //EDIT route
    router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.rednerEditForm));

    //UPDATE route
    router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

    //DELETE route
    router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));
   
   
module.exports = router;