const Listing=require("./models/model.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingsschema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("errors","you must be logged in to be created liisting.");
        return  res.redirect("/login");
    }
    next();
};

module.exports.saverRedirectUrl=(req,res,next)=>{
    if( req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;

    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{

    let { id }=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("errors"," only owner can  have accesss!");
       return res.redirect(`/listing/${id}`);
    }
    next();
};

module.exports.validateListing=(req,res,next)=>{
    let{error}=listingsschema.validate(req.body);
    if(error){
        let errMSG=error.details.map((el)=> el.message).join(',');
        throw new ExpressError(400,errMSG);
    }else{
        next();
    }
};

module.exports.validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        let errMSG=error.details.map((el)=> el.message).join(',');
        throw new ExpressError(400,errMSG);
    }else{
        next();
    }
};

module.exports.isReviewAuthor=async(req,res,next)=>{

    let { id, reviewId }=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("errors"," only author can  have accesss!");
       return res.redirect(`/listing/${id}`);
    }
    next();
};
