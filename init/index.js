const mongoose=require("mongoose");
const Listing=require("../models/model.js");
const initdata=require("./data.js");
main().then((res)=>{
    console.log("successfull");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  
}

const initDB=async()=>{
    await Listing.deleteMany({});
  initdata.data= initdata.data.map((obj)=>({...obj, owner: "6757330e9c80b34d3b1e87e8" }));
  await Listing.insertMany(initdata.data);
    console.log("data was initialized...");
};

initDB();

