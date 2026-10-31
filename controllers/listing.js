const Listing = require("../models/listing");
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/Geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

/*module.exports.index = async (req,res)=>{
  const allListings= await Listing.find({});
  res.render("listings/index.ejs",{allListings});
};*/

module.exports.index = async (req, res) => {
  try {
    let { search } = req.query;
    let allListings;

    // Check if the user typed anything in the search bar
    if (search && search.trim() !== "") {
      allListings = await Listing.find({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
          { country: { $regex: search, $options: "i" } }
        ]
      });
    } else {
      // Default: Fetch all listings if there is no search query
      allListings = await Listing.find({});
    }

    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong during the search.");
    res.redirect("/listings");
  }
};


module.exports.renderNewForm = (req,res) => {
   res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res)=>{
       let {id}= req.params;
       const listing= await Listing.findById(id)
       .populate({ path: "reviews", populate:{ path: "author"},
      })
       .populate("owner");
       if(!listing){
         req.flash("errror","Listing you requested for does not exist");
         res.redirect("/listings");
       }
       res.render("listings/show.ejs",{ listing });
      };

module.exports.createListing = async(req,res,next) =>{
    
 let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location ,
  limit: 1
})
  .send()
  
   
/*let url = req.file ? req.file.path : "https://unsplash.com";
let filename = req.file ? req.file.filename : "listingimage";*/


    const newListing= new Listing(req.body.listing);
    newListing.owner= req.user._id;

    newListing.geometry=response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success","New Listing created!");
    res.redirect("/listings");
    };
    
module.exports.renderEditForm = async(req,res)=>{
      let {id}= req.params;
       const listing= await Listing.findById(id);
       if(!listing){
         req.flash("errror","Listing you requested for does not exist");
         res.redirect("/listings");
       }
       res.render("listings/edit.ejs",{ listing });
    };

module.exports.updateListing = async(req,res) =>{
     let {id}=req.params;

     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
     req.flash("success"," Listing Updated!");
     res.redirect(`/listings/${id}`);
    };

module.exports.destroyListing = async(req,res)=>{
     let {id}=req.params;
     let deletedListing=await Listing.findByIdAndDelete(id);
      
     console.log(deletedListing);
     req.flash("success","Listing deleted!");
     res.redirect("/listings");
    };    
