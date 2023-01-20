const mysql = require("./config.js");

// This function searches the database for a single listing based on the criteria passed in
function findListing(criteria) {
    let safeQuery = "";

    // If the amenities array is empty, then we don't need to join the place_amenity table
    if(criteria.amenities == null) {
        let query = `SELECT A.*, B.name as cityName, C.name as stateName, D.first_name, D.last_name, D.email
                        FROM places A
                        JOIN cities B on A.city_id = B.id
                        JOIN states C on C.id = B.state_id
                        JOIN users D ON A.user_id = D.id
                        WHERE A.number_rooms >= ?
                        AND A.price_by_night <= ?
                        AND A.max_guest <= ?`;
        safeQuery = mysql.functions.format(query, [criteria.number_rooms, criteria.max_price, criteria.max_guests]);
    }
    // If the amenities array is not empty, then we need to join the place_amenity table
    else
    {
        let query = `SELECT A.*, B.name as cityName, C.name as stateName, D.first_name, D.last_name, D.email
                        FROM places A
                        JOIN cities B on A.city_id = B.id
                        JOIN states C on C.id = B.state_id
                        JOIN users D ON A.user_id = D.id
                        WHERE A.id IN (
                            SELECT place_id FROM place_amenity 
                            WHERE amenity_id 
                            IN(?)
                            GROUP BY place_id
                            HAVING count(place_id) >= ?)
                        AND A.number_rooms >= ?
                        AND A.price_by_night <= ?
                        AND A.max_guest <= ?`;
        safeQuery = mysql.functions.format(query, [criteria.amenities, criteria.amenities.length, criteria.number_rooms, criteria.max_price, criteria.max_guests]);
    }
    
    return querySql(safeQuery);
}

// This function gets all the amenities from the database for a given listing
function listAmenities(criteria) {
    let query = `SELECT A.name FROM amenities A 
                    JOIN place_amenity B ON A.id = B.amenity_id 
                    JOIN places C ON C.id = B.place_id
                    WHERE C.id = ?`;
    let safeQuery = mysql.functions.format(query, [criteria.id]);
    return querySql(safeQuery);
}

// This function finds all the listings that match the criteria passed in
function findListings(criteria) {
    let selectQuery = `SELECT A.*, B.name as cityName, C.name as stateName 
                            FROM places A
                            JOIN cities B ON A.city_id = B.id
                            JOIN states C on B.state_id = C.id
                            WHERE C.id = ? AND B.id = ? AND number_rooms >= ?`;
    let safeQuery = mysql.functions.format(selectQuery, [criteria.pState, criteria.pCity, criteria.number_rooms]);
    return querySql(safeQuery);
}

// This function returns all the states from the database
function returnStates() {
    let query = `SELECT id, name 
                    FROM states 
                    ORDER BY name ASC`;
    return querySql(query);
}

// This function returns all the cities from the database
function returnCities(){
    let query = `SELECT state_id, id, name 
                    FROM cities 
                    ORDER BY name ASC`;
    return querySql(query);
}

// This function returns a single listing based on multiple listings page
function fManyDisplayOne(criteria) {
    let query = `SELECT A.*, B.first_name, B.last_name, C.name as cityName, D.name as stateName
                    FROM places A 
                    JOIN users B on A.user_id = B.id
                    JOIN cities C on A.city_id = C.id
                    JOIN states D on C.state_id = D.id
                    WHERE A.id = ?`;
    let safeQuery = mysql.functions.format(query, [criteria.id]);
    return querySql(safeQuery);
}

// This function returns all the listings for a given user
function displayUser(criteria) {
    let query = `SELECT A.*, B.name as cityName, C.name as stateName, D.first_name, D.last_name, D.email
                    FROM places A  
                    JOIN cities B ON A.city_id = B.id 
                    JOIN states C on B.state_id = C.id
                    JOIN users D ON A.user_id = D.id
                    WHERE A.user_id = ? 
                    ORDER BY C.name, B.name ASC`;
    let safeQuery = mysql.functions.format(query, [criteria.userID]);
    return querySql(safeQuery);
}

// This function returns all the users from the database
function displayUserAll() {
    let query = `SELECT A.*, B.first_name, B.last_name
                    FROM places A
                    JOIN users B ON A.user_id = B.id
                    ORDER BY B.last_name, B.first_name ASC`;
    return querySql(query);
}

// This function returns all the reviews for a given listing
function findReviews(criteria) {
    let query = `SELECT text
                    FROM reviews
                    WHERE place_id = ?`;
    let safeQuery = mysql.functions.format(query, [criteria.id]);
    return querySql(safeQuery);
}

// This function returns the location information for all listings
function getLongLat() {
    let query = `SELECT A.latitude, A.longitude, A.name, A.user_id, A.id, 
                        B.first_name, B.last_name, 
                        C.name As cityName, C.id AS cityID, 
                        D.name AS stateName, D.id AS stateID 
                    FROM places A
                    JOIN users B ON B.id = A.user_id 
                    JOIN cities C ON C.id = A.city_id 
                    JOIN states D ON D.id = C.state_id`;
    return querySql(query);
}

// This exports the functions to be used in other files
module.exports = {
    "findListing": findListing,
    "findListings": findListings,
    "querySql": querySql,
    "fManyDisplayOne": fManyDisplayOne,
    "returnCities": returnCities,
    "displayUser": displayUser,
    "returnStates": returnStates,
    "displayUserAll": displayUserAll,
    "listAmenities": listAmenities,
    "findReviews": findReviews,
    "getLongLat": getLongLat
};


/*****************************************************************
 *        You can ignore everything below here!
 *****************************************************************/

// don't worry too much about this function! 
// it has been written to return the data from your database query
// *** it DOES NOT need modifying! ***
function querySql(sql) {
    let con = mysql.getCon();

    con.connect(function(error) {
        if (error) {
          return console.error(error);
        } 
      });

    return new Promise((resolve, reject) => {
        con.query(sql, (error, sqlResult) => {
            if(error) {
                return reject(error);
            }           

            return resolve(sqlResult);
        });

        con.end();
    });
}