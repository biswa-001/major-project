const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsyc=require("../utils/wrapAsyc.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/model.js");
const{validateReview, isLoggedIn}=require("../middleware.js");
const {isReviewAuthor}=require("../middleware.js");
const reviewcontroler=require("../controler/review.js");

//post the review 
router.post("/reviews",isLoggedIn,
  validateReview,wrapAsyc(reviewcontroler.createReview));


//delte review route

router.delete("/reviews/:reviewId", 
  isLoggedIn,
  isReviewAuthor,
  wrapAsyc(reviewcontroler.destroyReview) 
);

module.exports=router;