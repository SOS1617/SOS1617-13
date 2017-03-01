var dateformat = require("dateformat");
var express = require("express");


console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-    G13'S START MODULE    -XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

console.log(dateformat());

var port = (process.env.PORT || 8082);

var app = express();
app.get("/time", (request, response) => {
        response.send("<html><body><h1>" + dateformat("dS mmmm 'of' yyyy, HH:MM:ss") + "<h1></html></body>")
    })

app.listen(port, (err) => {
    if (!err)
        console.log("Server inizializated on port " + port);
    else
        console.log("Error" + port + ": " + err)

});
//console.log("Server inizializated on port " + port);
console.log("-----------G13's server-----------------");
