const express=require("express");
const router=express.Router();
const Listing=require("../models/model.js");
const wrapAsyc=require("../utils/wrapAsyc.js");
//  const ExpressError=require("../utils/ExpressError.js");
//  const {listingsschema}=require("../schema.js");
const{isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const lisitngcontroler=require("../controler/listing.js");
const multer  = require('multer');
const {storage}=require("../clodeconfig.js");
const upload = multer({ storage });

router.route("/")
.get(
 wrapAsyc(lisitngcontroler.index))
.post(isLoggedIn,
       
        upload.single('listing[image]'),
        validateListing,
        wrapAsyc(lisitngcontroler.createListing)
    );



//New Route
router.get("/new",isLoggedIn,lisitngcontroler.renderNewForm);



router.route("/:id")
.get(wrapAsyc(lisitngcontroler.showListing))
.put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
     wrapAsyc(lisitngcontroler.updatingListing))
 .delete(
        isLoggedIn,
        isOwner,
        wrapAsyc(lisitngcontroler.destroiListing));




//editing listing 
router.get("/:id/edit",isLoggedIn,
    wrapAsyc(lisitngcontroler.editingListing));



module.exports=router;