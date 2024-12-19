if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');

const flash = require('connect-flash');
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");




const listing=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const userrouter=require("./routes/user.js");

const dburl=process.env.ATLASTDB_URL;

app.use(methodOverride('_method'));

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.engine("ejs",ejsMate);
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));


app.listen(8000,()=>{
    console.log("the app is listing on 8000");
});

main().then((res)=>{
    console.log("successfull");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dburl);

  
}

const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION",err);
});


const sessionOption={
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60* 60* 1000 ,
        maxAge:7 * 24 * 60* 60* 1000 ,
        httpOnly:true,
    },
};




app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.errors=req.flash("errors");
    res.locals.currUser=req.user;
    next();
});



app.use("/listing",listing);
app.use("/listing/:id",reviews);
app.use("/",userrouter);

app.all("*",(req,res,next)=>{
    next( new ExpressError(404,"page is not found"));
});

app.use((err,req,res,next)=>{
    let{statuscode=500,message="something went wrong"}= err;
res.status(statuscode).render("Erro.ejs",{message});
  
});
