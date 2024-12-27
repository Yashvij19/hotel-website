const express=require("express");
const app= express();
const mongoose= require("mongoose");
const path= require("path");
const methodOverride = require('method-override')

const ejsMate=require('ejs-mate');

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname,"views"));
app.engine("ejs" , ejsMate);

app.use(express.urlencoded({ extended:true }));
app.use(methodOverride('_method'))


app.use(express.static(path.join(__dirname , "/public")));

const Listing =require("./models/Listing.js");

async function main(){
    mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main().then(()=>{
    console.log("connected to MongoDB");
}).catch((err)=>{
    console.log(err);
})


app.listen(8080 , () => {
    console.log("post is running");
}
)

app.get('/', async(req, res)=>{
    let allListing= await   Listing.find();
    res.render("index.ejs", {allListing});  
}
)
// app.get("/testListing",(req, res)=>{
//     let sample=new Listing({
//         title: "Villa",
//         description: "beautiful test villa",
       
//         price:3000,
//         location:"jamnagar",
//         country: "India",

//     });
//     sample.save();
//     console.log(sample);
//     res.send("hello sir");

// })



app.get("/listings", async(req, res)=>{
 let allListing= await   Listing.find();
 res.render("index.ejs", {allListing}); 
})

app.get("/listings/:id", async(req, res)=>{
    let id=req.params.id;
    let listing=await Listing.findById(id);
    res.render("show.ejs",{listing});
})


app.get("/listing/new", (req,res)=>{

    // res.send("create new listing");
    res.render("new.ejs");
})

app.post("/listing/new", async(req,res)=>{

    // humne backend mai html form mai req.body mai data as a object send kiya hai
    let listing = req.body.listing;
    

    listing.image = !listing.image || listing.image.trim() === ""   // If empty
    // wes set the set(v) link 
        ? "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"  
        // but in case linnk is give but not valid then                                  
        : listing.image.startsWith("http")        // If it starts with 'http' chek link is valid or not 
            ? listing.image                       // Keep the provided value if the link is given and it also rigth 
            // now if link in given but not start with https or we can say that is not ccorect
            : "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60";   

    // res.send("create new listing");
    let newListing = new Listing(listing);
    await newListing.save();
   
    res.redirect("/listings");
   
})


app.get("/listings/:id/edit", async(req,res)=>{
    let id=req.params.id;
    let listing=await Listing.findById(id);
    res.render("edit.ejs",{listing});
});

app.put("/listings/:id/edit" ,async(req,res)=>{
    let id=req.params.id;

   await Listing.findByIdAndUpdate(id,{...req.body.listing});
res.redirect("/listings");
})

app.delete("/listings/:id/del",async(req,res)=>{
    let id=req.params.id;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   res.redirect("/listings");
})