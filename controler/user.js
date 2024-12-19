
const User=require("../models/user.js");
 module.exports.singuprender=(req,res)=>{
    res.render("users/singup.ejs");
};

module.exports.singup=async(req,res)=>{
 try{
    let{username,email,password}=req.body;
const newUser=new User({email,username});
const registeruser=await User.register(newUser,password);

req.login(registeruser,(err)=>{
    if(err){
       return next(err) ;
    }
    req.flash("success","welcome to Wandelust");
    res.redirect("/listing");
});

}catch(e){
req.flash("errors",e.message);
res.redirect("/signup");
}

};
module.exports.loginrender= (req,res)=>{
    res.render("users/login.ejs")
};

module.exports.login=async(req,res)=>{
    req.flash("success","you are login in");
    let redirectUrl=res.locals.redirectUrl || "/listing"
    res.redirect(redirectUrl);
  };

  module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
          return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listing");
    })

};