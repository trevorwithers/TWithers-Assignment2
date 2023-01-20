const express = require("express");
const app = express();
const queries = require("./mysql/queries");


app.set("view engine", "ejs");
app.use(express.static("public"));
app.listen(3000);

// This is the main page
app.get("/", (request, response) =>{
    let states = queries.returnStates();
    let cities = queries.returnCities();
    Promise.all([states, cities])
    .then(results => {
        response.render("index", {states: results[0], cities: results[1], title: "Airbnb Search App"})
    });
});

// This is the page that displays one listing
app.get("/airbnb/find-one", (request, response) => {
    let bedrooms = request.query.bedrooms;
    let amenitiesArray = request.query.amenities;
    let maxPrice = request.query.maxPrice;
    let maxGuests = request.query.maxGuests;
    queries.findListing(
        { 
            amenities: amenitiesArray,
            number_rooms: bedrooms,
            max_price: maxPrice,
            max_guests: maxGuests
        }).then(result => {
            if (result[0] == null) {  
                response.render("noResults", {title: "Airbnb Search App"});
            }
            else
            {
                let reviews = queries.findReviews({id: result[0].id});
                let amenitiesList = queries.listAmenities({id: result[0].id});
                Promise.all([reviews, amenitiesList])
                    .then(data => {  
                        response.render("listing", { listing: result[0], reviews: data[0], amenities: data[1]});
                    });
            }
        });
});

// This is the page that displays multiple listings
app.get ("/airbnb/find-many", async (request, response) => {
    let selectedBedrooms = request.query.bedrooms;
    let selectedState = request.query.state;
    let selectedCity = request.query.city;

    queries.findListings(
    {
        pState: selectedState,
        pCity: selectedCity,
        number_rooms: selectedBedrooms 
    })
    .then(result => {
        if (result[0] == null) {
            response.render("noResults", {title: "Airbnb Search App"});
        }
        else {
            response.render("listings", { pHeading: "Results", listings: result });
        }
    });
});

// This is the page that displays the single listing from the multiple listings page
app.get("/find-many/display-one", (request, response) => {
    queries.fManyDisplayOne({ id: request.query.id })
        .then(result => {
            let reviews = queries.findReviews({ id: result[0].id });
            let amenitiesList = queries.listAmenities({ id: result[0].id });
            Promise.all([reviews, amenitiesList])
                .then(data => {
                    response.render("listing", {listing: result[0], reviews: data[0], amenities: data[1]});
            });
    });
});

// This is the page that lists all of the listings for a single user
app.get("/display-user", (request, response) => {
    let userId = request.query.userID;
    queries.displayUser({ userID: userId })
        .then(result => {
            response.render("listings", {pHeading: result[0].first_name + " " + result[0].last_name, listings: result });
    });   
});

// This is the page that displays all users who have a listing
app.get("/display-user/all", (request, response) => {
    let userId = request.query.userID;
    queries.displayUserAll({ userID: userId })
        .then(result => {
            response.render("users", {users: result});
    });   
});

// This is the page that displays a world map with map pins for each listing
// The map pins are clickable and will display the listing
app.get("/display-world-map", (request, response) => {
    queries.getLongLat()
        .then(result => {
            response.render("worldMap", {locations: result, title: "Airbnb Search App"});
    });
});
