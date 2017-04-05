var exports = module.exports= {};

exports.register = function(app,dbC,BASE_API_PATH,checkApiKeyFunction){
// Base GET

app.get("/", function(request, response) {
    console.log("INFO: Redirecting to /corners");
    response.redirect(301, "/corners");
});

//Load Initial Data

app.get(BASE_API_PATH + "/corners/loadInitialData", (request, response) => {
    if(!checkApiKeyFunction(request,response)) return;
        
        dbC.find({}).toArray(function(error, corners) {
            if (error) {
                console.error("Error data from db");
                response.sendStatus(500);
            }
            else {
                    dbC.remove({});
                    dbC.insert([
                        {
                        "country": "Spain",
                        "year": "2010",
                        "corner1": "2",
                        "corner2": "1",
                        "corner3": "0"
                    },{
                        "country": "Spain",
                        "year": "2011",
                        "corner1": "2",
                        "corner2": "1",
                        "corner3": "0"
                    },
                    {
                        "country": "Germany",
                        "year": "2011",
                        "corner1": "1",
                        "corner2": "0",
                        "corner3": "4"
                    }, {
                        "country": "Greece",
                        "year": "2014",
                        "corner1": "5",
                        "corner2": "3",
                        "corner3": "3"
                       
            }])
                    
                    console.log("OK");
                    response.sendStatus(201);
                
            }
        });
    });

//GET a una coleccion

app.get(BASE_API_PATH + "/corners",(request,response)=>{
    if(!checkApiKeyFunction(request,response)) return;
  
  //busqueda
  var corner = request.query;
  var country = request.country;
  var year = corner.year;
  var corner1 = corner.corner1;
  var corner2 = corner.corner2;
  var corner3 = corner.corner3;
  
  //paginación
  
  var limit = parseInt(corner.limit);
  var offset = parseInt(corner.offset);
  var elements = [];
  
  
  if(limit>0 && offset>0){
   console.log("INFO : new request to /corners");
    dbC.find({}).skip(offset).limit(limit).toArray(function(err, corners) {
     if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
                
                var filtered = corners.filter((param)=>{
                      if ((country == undefined || param.country == country) && (year == undefined || param.year == year) && 
                (corner1 == undefined || param.corner1 == corner1) && (corner2 == undefined || param.corner2 == corner2 ) && 
                ( corner3 == undefined || param.year == corner3 ) ) {
                return param;
                }
                });
            }
            if(filtered.length > 0){
                elements= insertar(filtered,elements,limit,offset);
                response.sendStatus(elements);
           
            } 
            else {
                console.log("WARNING: No existe elemento con esas propiedades");
                response.sendStatus(404);
            }
        });
}else{
     dbC.find({}).toArray( function (err, corners) {
         if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
                 var filtered = corners.filter((param)=>{
                      if ((country == undefined || param.country == country) && (year == undefined || param.year == year) && 
                (corner1 == undefined || param.corner1 == corner1) && (corner2 == undefined || param.corner2 == corner2 ) && 
                ( corner3 == undefined || param.year == corner3 ) ) {
                return param;
                }
                });
            }
            if (filtered.length > 0) {
       console.log("INFO: Sending stat: " + JSON.stringify(filtered, 2, null));
       response.send(filtered);
      }
    else {
       console.log("WARNING: There are not any corners with this properties");
       response.sendStatus(404); // not found
    }
    });
    }
});
   
        
  // FUNCION PAGINACIÓN
  
var insertar = function(elements,array,limit,offset){
    var i = offset;
    var ii = limit;
    while(ii>0){
        array.push(elements[i]);
        ii--;
        i++;
    }
    return elements;
};

//GET a un recurso

app.get(BASE_API_PATH + "/:country",(request,response)=>{
    if(!checkApiKeyFunction(request,response)) return;
  
    var country = request.params.country;
      if (!country) {
        console.log("WARNING: New GET request to /corners/:country without country, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET");
        dbC.find({"country" : country}).toArray(function(error, country) {
            if (error) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
                var filteredcountry=country.filter((s)=>{
                    return (s.country.localeCompare(country,"en",{"sensitivity":"base"})===0);
                });
             
                if (filteredcountry.length > 0) {
                    var c = filteredcountry[0]; //since we expect to have exactly ONE corners with this country
                    console.log("INFO: Sending country");
                    response.send(c);
                } else {
                    console.log("WARNING: There are not any corners with country " + country);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});

//GET a recurso concreto con 2 parametros

app.get(BASE_API_PATH + "/corners/:country/:year", function (request, response) {
    if(!checkApiKeyFunction(request,response)) return;
    var country = request.params.country;
    var year = request.params.year;
    if (!country || !year) {
        console.log("WARNING: New GET request to /corners/:country without country or without year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /corners/" + country + "/" + year);
        dbC.find({country:country, $and:[{year:year}]}).toArray(function (err, corners) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else if (corners.length > 0) { 
                    var corner = corners[0]; //since we expect to have exactly ONE contact with this name
                    console.log("INFO: Sending corner: " + JSON.stringify(corner, 2, null));
                    response.send(corner);
                } else {
                    console.log("WARNING: There are not any country with country " + country +  "and year " + year);
                    response.sendStatus(404); // not found
                
                }
        });
}
});

//POST a un recurso

app.post(BASE_API_PATH + "corners/:country",(request,response)=>{
    if(!checkApiKeyFunction(request,response)) return;
    var country = request.params.country;
    console.log("WARNING: New POST request to /corners/" + country + ", sending 405...");
    response.sendStatus(405); // method not allowed
});



//POST a una coleccion

app.post(BASE_API_PATH + "/corners", function(request, response) {
    
     if(!checkApiKeyFunction(request,response)) return;
    var newcorner = request.body;
    console.log(newcorner);
    if (!newcorner) {
        console.log("WARNING: New POST request to /corners/ without country, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New POST request to /corners with body: " + JSON.stringify(newcorner, 2, null));
        if (!newcorner.country || !newcorner.year || !newcorner.corner1 || !newcorner.corner2 || !newcorner.corner3) {
            console.log("WARNING: The corner " + JSON.stringify(newcorner, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            dbC.find({}).toArray( function(err, corners) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    var cornersBeforeInsertion = corners.filter((corner) => {
                        return (corner.country.localeCompare(newcorner.country, "en", {
                            'sensitivity': 'base'
                        }) === 0);
                    });
                    if (cornersBeforeInsertion.length > 0) {
                        console.log("WARNING: The corner " + JSON.stringify(newcorner, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    }
                    else {
                        console.log("INFO: Adding corner " + JSON.stringify(newcorner, 2, null));
                        dbC.insert(newcorner);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});
//PUT a un recurso

app.put(BASE_API_PATH + "/corners/:country", function(request, response) {
  if(!checkApiKeyFunction(request,response)) return;  
    var updatedcorner = request.body;
    var country = request.params.country;
    console.log(country);
    if (!updatedcorner) {
        console.log("WARNING: New PUT request to /corners/ without establishment, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New PUT request to /corner/" + country + " with data " + JSON.stringify(updatedcorner, 2, null));
        if (!updatedcorner.country || !updatedcorner.year || !updatedcorner.corner1 || !updatedcorner.corner2 || !updatedcorner.corner3) {
            console.log("WARNING: The corner " + JSON.stringify(updatedcorner, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            dbC.find({}).toArray( function(err, corners) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    var cornersBeforeInsertion = corners.filter((corner) => {
                        return (corner.country.localeCompare(country, "en", {
                            'sensitivity': 'base'
                        }) === 0);
                    });
                    if (cornersBeforeInsertion.length > 0) {
                        dbC.update({
                            country: country
                        }, updatedcorner);
                        console.log("INFO: Modifying corner with country " + country + " with data " + JSON.stringify(updatedcorner, 2, null));
                        response.send(updatedcorner); // return the updated corner
                    }
                    else {
                        console.log("WARNING: There is not any corner with country " + country);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});





//DELETE a un recurso

app.delete(BASE_API_PATH+"/:country", function (request, response) {
    if (!checkApiKeyFunction(request, response)) return;
    var cityParam = request.params.country;
    if (!cityParam) {
        console.log("WARNING: New DELETE request to /goals/:year without city, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /goals/" + cityParam);
        dbC.remove({country:cityParam},{},function (err, result) {
            var numRemoved = JSON.parse(result);
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: corner removed: " + numRemoved);
                if (numRemoved.n === 1) {
                    console.log("INFO: The corner with country " + cityParam + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                } else {
                    console.log("WARNING: There are no corner to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});







//DELETE a collection

app.delete(BASE_API_PATH + "/corners", function(request, response) {
     if(!checkApiKeyFunction(request,response)) return;
    console.log("INFO: New DELETE request to /corners");
    dbC.remove({}, {
        multi: true
    }, function(err, numRemoved) {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        }
        else {
            response.sendStatus(204);
        }
    });
});


//PUT a una coleccion

app.put(BASE_API_PATH,(request,response)=>{
    response.sendStatus(405);
});


};