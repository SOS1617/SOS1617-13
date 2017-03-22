"use strict";
/* global __dirname */

var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require("path");

var MongoClient = require("mongodb").MongoClient;

var mdbURL= "mongodb://mongodb://luciano:aspire5536@ds137760.mlab.com:37760/lucianodb";


var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";

var db;

MongoClient.content(mdbURL, {native_parser:true},function (err,datbase){
    if(err){
        console.log(" Can not conect to db: "+err);
        process.exit(1)
    }
    db = database.collection("goals");
    
    app.listen(port, ()=> {
  console.log("Magic is happening on port " + port);  

});

var app = express();

app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security


/*var goals = [{
    "city" : "spain",
    "hour" : "15:30",
    "goals_first_team" : "2",
    "goals_second_team" : "1",
    "team_a" : "madrid",
    "team_b" : "barça"
    
},{
    "city" : "seville",
    "hour" : "17:40",
    "goals_first_team" : "1",
    "goals_second_team" : "0",
    "team_a" : "sevilla",
    "team_b" : "betis"
},{
    "city" : "malaga",
    "hour" : "17:40",
    "goals_first_team" : "0",
    "goals_second_team" : "1",
    "team_a" : "malaga",
    "team_b" : "español"
}];

var corners = [{
    "country" : "Spain",
    "year" : "2010",
    "corner1" : "2",
    "corne2" : "1",
    "corner3" : "0"
},{
    "country" : "Germany",
    "year" : "2011",
    "corner1" : "1",
    "corne2" : "0",
    "corner3" : "4"
},{
    "country" : "Greece",
    "year" : "2014",
    "corner1" : "5",
    "corne2" : "3",
    "corner3" : "3"
}];

var victory = [{
    "city" : "seville",
    "foul" : "3",
    "goal_total" : "100",
    "loose" : "1",
    "victory" : "1",
    "year" : "2010",
    "name" : "betis"
    
},{
     "city" : "madrid",
    "foul" : "5",
    "goal_total" : "150",
    "loose" : "3",
    "victory" : "34",
    "year" : "2015",
    "name" : "madrid"
},{
     "city" : "barcelona",
    "foul" : "6",
    "goal_total" : "200",
    "loose" : "3",
    "victory" : "2",
    "year" : "2016",
    "name" : "barcelona"
}];*/


// Base GET goals
app.get("/", function (request, response) {
    console.log("INFO: Redirecting to /goals");
    response.redirect(301, BASE_API_PATH + "/goals");
    
});

// Base GET corners
app.get("/", function (request, response) {
    console.log("INFO: Redirecting to /corners");
    response.redirect(301, BASE_API_PATH + "/corners");
    
});

// Base GET victory
app.get("/", function (request, response) {
    console.log("INFO: Redirecting to /victory");
    response.redirect(301, BASE_API_PATH + "/victory");
    
});



// GET a collection goals
app.get(BASE_API_PATH + "/goals", function (request, response) {
    console.log("INFO : new request to /goals");
     db.find({}).toArray( function (err, goals) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending goals: " + JSON.stringify(goals, 2, null));
            response.send(goals);
        }
    });
});

// GET a collection corners
app.get(BASE_API_PATH + "/corners", function (request, response) {
    console.log("INFO : new request to /corners");
    response.send(corners);
    //TBD
});

// GET a collection victory
app.get(BASE_API_PATH + "/victory", function (request, response) {
    console.log("INFO : new request to /victory");
    response.send(victory);
    //TBD
});



// GET a single resource goals city
app.get(BASE_API_PATH + "/goals/:city", function (request, response) {
    var city = request.params.city;
    var filteredContact = goals.filter((c)=>{
       return c.city === city;
    })
    response.send(filteredContact[0]);
});

// GET a single resource corners country
app.get(BASE_API_PATH + "/corners/:country", function (request, response) {
    var country = request.params.country;
    var filteredContact = corners.filter((c)=>{
       return c.country === country;
    })
    response.send(filteredContact[0]);
});

// GET a single resource victory
app.get(BASE_API_PATH + "/victory/:city", function (request, response) {
    var city = request.params.city;
    var filteredContact = victory.filter((c)=>{
    })
    response.send(filteredContact[0]);
});


//POST over a collection
app.post(BASE_API_PATH + "/goals", function (request, response) {
    //TBD
});


//POST over a single resource
app.post(BASE_API_PATH + "/goals/:city", function (request, response) {
    response.sendStatus(405);
});


//PUT over a collection
app.put(BASE_API_PATH + "/goals", function (request, response) {
    response.sendStatus(405);
});


//PUT over a single resource
app.put(BASE_API_PATH + "/goals/:city", function (request, response) {
    var updatedContact = request.body;
    var nameParam = request.params.name;
    goals =city.map((c)=>{
        if(c.name===nameParam){
            return
        }else{
            return c;
        }
    });
    response.send(updatedContact);
});


//DELETE over a collection
app.delete(BASE_API_PATH + "/contacts", function (request, response) {
   goals.length=0;
   response.sendStatus(204);
    
    
});


//DELETE over a single resource
app.delete(BASE_API_PATH + "/contacts/:name", function (request, response) {
     var name = request.params.name;
     var l1 = goals.length;
     goals = goals.filter((c)=>{
         return c.name!==name;
     });
     var l2= goals.length;
     
     if(l1===l2){
         response.sendStatus(404);
         
         
     }else{
         response.sendStatus(204)
     }
     
});

});