const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsyc=require("../utils/wrapAsyc.js");
const passport = require("passport");
const {saverRedirectUrl}=require("../middleware.js");
const usercontroler=require("../controler/user.js");

router.route("/signup")
.get(
    usercontroler.singuprender
 )
 .post(wrapAsyc(usercontroler.singup));


 router.route("/login")
 .get(
    usercontroler.loginrender
  )
  .post(
    saverRedirectUrl,
 passport.authenticate("local",
{failureRedirect:'/login',failureFlash:true}),
usercontroler.login
);


router.get("/logout",
    usercontroler.logout
);

module.exports=router;