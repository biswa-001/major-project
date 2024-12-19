const Listing=require("../models/model.js");
const mbxGeocoding =require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async(req,res)=>{
    let allistings= await  Listing.find();
   
    res.render("listings/home.ejs",{allistings});
};

module.exports.renderNewForm=(req,res)=>{

   
    res.render("listings/new.ejs");
};

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    let sd= await Listing.findById(id)
    .populate({path:"reviews",
        populate:{
            path:"author",
        }
    })
    .populate("owner");
    if(!sd){
     req.flash("errors","errors ! the listing does not exits.");
     res.redirect("/listing");
    }
  
    res.render("listings/show.ejs",{sd});
};

module.exports.createListing=async(req,res,next)=>{

 let response=  await geocodingClient
 .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
     .send()
      
      

let url=req.file.path;
let filename=req.file.filename;


let listing=req.body.listing;
const newlisting=  new Listing(listing);
newlisting.owner=req.user._id;
newlisting.image={url, filename};
newlisting.geometry= response.body.features[0].geometry;
 let savedlisting=await newlisting.save();
 
req.flash("success","New Listing add");
res.redirect("/listing");

};

module.exports.editingListing=async(req,res)=>{
 let {id}=req.params;
    const Ed= await Listing.findById(id);
    if(!Ed){
        req.flash("errors","errors ! the listing does not exits.");
        res.redirect("/listing");
       }
    let originalimgurl= Ed.image.url;
    originalimgurl=originalimgurl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{Ed,originalimgurl});
};

module.exports.updatingListing=async(req,res)=>{
    let {id}=req.params;
 let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
if( typeof req.file !== "undefined"){
 let url=req.file.path;
let filename=req.file.filename;
listing.image={url, filename};
await listing.save();
}

  req.flash("success"," Listing updated");
  res.redirect(`/listing/${id}`);
};

module.exports.destroiListing=async(req,res)=>{
    let {id}=req.params;
  const dl=  await Listing.findByIdAndDelete(id,{});
 
 
  req.flash("success"," Listing deleted");
  res.redirect("/listing");

};