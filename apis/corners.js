var exports = module.exports= {};

exports.register = function(app,dbC,vic,checkApiKeyFunction){
	
// Base GET

app.get("/", function(request, response) {
    console.log("INFO: Redirecting to /corners");
    response.redirect(301, "/corners");
});

//Load Initial Data

app.get(vic + "/loadInitialData", (request, response) => {
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
                        "corne2": "1",
                        "corner3": "0"
                    },{
                        "country": "Spain",
                        "year": "2011",
                        "corner1": "2",
                        "corne2": "1",
                        "corner3": "0"
                    },
                    {
                        "country": "Germany",
                        "year": "2011",
                        "corner1": "1",
                        "corne2": "0",
                        "corner3": "4"
                    }, {
                        "country": "Greece",
                        "year": "2014",
                        "corner1": "5",
                        "corne2": "3",
                        "corner3": "3"
                       
            }])
                    
                    console.log("OK");
                    response.sendStatus(201);
                
            }
        });
    });

//GET a una coleccion

app.get(vic,(request,response)=>{
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
                ( corner3 == undefined || param.corner3 == corner3 )) {
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
//POST a un recurso

app.post(vic + "/:country",(request,response)=>{
    if(!checkApiKeyFunction(request,response)) return;

    response.sendStatus(405);
});



//GET a un recurso

app.get(vic + "/:country",(request,response)=>{
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
                    console.log("WARNING: There are not any contact with country " + country);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});

//GET a recurso concreto con 2 parametros

app.get(vic + "/corners/:country/:year", function (request, response) {
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









//POST a una coleccion

app.post(vic + "/corners", function(request, response) {
        if(!checkApiKeyFunction(request,response)) return;

    var newcorners = request.body;
    console.log(newcorners);
    if (!newcorners) {
        console.log("WARNING: New POST request to /corners/ without country, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New POST request to /corners with body: " + JSON.stringify(newcorners, 2, null));
        if (!newcorners.country || !newcorners.year || !newcorners.corner1 || !newcorners.corner2 || !newcorners.corner3) {
            console.log("WARNING: The corners " + JSON.stringify(newcorners, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            dbC.find({}).toArray( function(err, corners) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    var cornersBeforeInsertion = corners.filter((corners) => {
                        return (corners.country.localeCompare(corners.country, "en", {
                            'sensitivity': 'base'
                        }) === 0);
                    });
                    if (cornersBeforeInsertion.length > 0) {
                        console.log("WARNING: The corner " + JSON.stringify(corners, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    }
                    else {
                        console.log("INFO: Adding corner " + JSON.stringify(corners, 2, null));
                        dbC.insert(corners);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});


//PUT a un recurso

app.put(vic +"/:country",(request,response)=>{
        if(!checkApiKeyFunction(request,response)) return;

    
    var updatedcorner = request.body;
    var country = request.params.country;
    
    if (updatedcorner.country!=country) {
        console.log("WARNING: New PUT request to /corners/ without corner, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT");
         if (!updatedcorner.country || !updatedcorner.year || !updatedcorner.corner1 || !updatedcorner.corner2 || !updatedcorner.corner3) {
            console.log("WARNING: PUT incorrect");
            response.sendStatus(422); // unprocessable entity
        } else {
            
            dbC.update({country:updatedcorner.country},
            
           
            {
                country:updatedcorner.country,
                year:updatedcorner.year,
                corner1:updatedcorner.corner1,
                corner2:updatedcorner.corner2,
                corner3:updatedcorner.corner3,
                
                
            });
            
            response.sendStatus(200);
        }
    }
    
});

//DELETE a un recurso

app.delete(vic+"/:country",(request,response)=>{
        if(!checkApiKeyFunction(request,response)) return;

    var country=request.params.country;
    
     if (!country) {
        console.log("WARNING: New DELETE request to sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE r");
        dbC.remove({country: country}, {}, function (error, country) {
            if (error) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            }  else {
                    
                    console.log("deleted");
                    response.sendStatus(200); // not found
                }
            
        });
    }
});

//DELETE a una coleccion

app.delete(vic,(request,response)=>{
        if(!checkApiKeyFunction(request,response)) return;

    
    console.log("INFO: New DELETE");
    dbC.remove({}, {multi: true}, function (error, corners) {
        if (error) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            corners=JSON.parse(corners);
            if (corners.n > 0) {
                console.log("INFO: All the corners have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no corners to delete");
                response.sendStatus(404); // not found
            }
        }
    });

});


//PUT a una coleccion

app.put(vic,(request,response)=>{
    response.sendStatus(405);
});


};