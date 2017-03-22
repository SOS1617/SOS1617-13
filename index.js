var dateformat = require("dateformat");
var express = require("express");
var app = express();
var path = require("path");

console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-    G13'S START MODULE    -XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

console.log(dateformat());

var port = (process.env.PORT || 8082);
app.use("/", express.static( path.join(__dirname,"public")));

app.use("/apis", express.static( path.join(__dirname,"apis")));

app.get("/time", (request, response) => {
        response.send("<html><body><h1>" + dateformat("dS mmmm 'of' yyyy, HH:MM:ss") + "<h1></html></body>")
    })
    

app.listen(port, () => {
    console.log("Server inizializated on port  " +port);
}).on("error",(e) =>{
    console.log("Server can not be started: " +e);
    process.exit(1);
});
//console.log("Server inizializated on port " + port);
console.log("-----------G13's server-----------------");
