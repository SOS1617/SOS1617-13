"use strict";
/* global __dirname */

var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");

var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";

var app = express();

app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security

// @see: https://curlbuilder.com/
// @see: https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
// @see: https://i.stack.imgur.com/whhD1.png
// @see: https://blog.agetic.gob.bo/2016/07/elegir-un-codigo-de-estado-http-deja-de-hacerlo-dificil/
// sobre una coleccion no podemos hacer put y sobre un recurso no posdemos hacer post, los codigos de estado http dicen como se tratan 

//TBD
var goals = [{
    "name" : "Luciano",
    "Phone" : "647132052",
    "email" : "lucianodelvallecano@gmail.com"
},{
     "name" : "Toldo",
    "Phone" : "647125456",
    "email" : "toldo@gmail.com"
},{
     "name" : "Yopis",
    "Phone" : "645789123",
    "email" : "yopis@gmail.com"
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


// Base GET
app.get("/", function (request, response) {
    console.log("INFO: Redirecting to /contacts");
    response.redirect(301, BASE_API_PATH + "/contacts");
});


// GET a collection
app.get(BASE_API_PATH + "/contacts", function (request, response) {
    console.log("INFO : new request to /contacts");
    response.send(contacts);
    //TBD
});


// GET a single resource
app.get(BASE_API_PATH + "/contacts/:name", function (request, response) {
    var name = request.params.name;
    var filteredContact = contacts.filter((c)=>{
       return c.name === name;
        //esto es una opcion, la de arriba pero la mejor forma de comparar es la siguiente
       // return c.name.localeCompare(name, "en" ,{"sensitivy":"base"})===0;
    })
    //TBD
    response.send(filteredContact[0]);
});


//POST over a collection
app.post(BASE_API_PATH + "/contacts", function (request, response) {
    //TBD
});


//POST over a single resource
app.post(BASE_API_PATH + "/contacts/:name", function (request, response) {
    response.sendStatus(405);
});


//PUT over a collection
app.put(BASE_API_PATH + "/contacts", function (request, response) {
    response.sendStatus(405);
});


//PUT over a single resource
app.put(BASE_API_PATH + "/contacts/:name", function (request, response) {
    var updatedContact = request.body;
    var nameParam = request.params.name;
    contacts =contacts.map((c)=>{
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
   contacts.length=0;
   response.sendStatus(204);
    
    
});


//DELETE over a single resource
app.delete(BASE_API_PATH + "/contacts/:name", function (request, response) {
     var name = request.params.name;
     var l1 = contacts.length;
     contacts = contacts.filter((c)=>{
         return c.name!==name;
     });
     var l2= contacts.length;
     
     if(l1===l2){
         response.sendStatus(404);
         
         
     }else{
         response.sendStatus(204)
     }
     
});


app.listen(port);
console.log("Magic is happening on port " + port);