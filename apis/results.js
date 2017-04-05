//...............................................API Results.....Llopis..............................................................;//
var exports = module.exports= {};

exports.register = function(app,dbresult,BASE_API_PATH,checkApiKeyFunction){
// Base GET

app.get("/", function(request, response) {
    console.log("INFO: Redirecting to /results");
    response.redirect(301, "/results");
});

//Load Initial Data

app.get(BASE_API_PATH + "/results/loadInitialData", (request, response) => {
    if(!checkApiKeyFunction(request,response)) return;
        
        dbresult.find({}).toArray(function(error, results) {
            if (error) {
                console.error("Error data from db");
                response.sendStatus(500);
            }
            else {
                    dbresult.remove({});
                    dbresult.insert([
                        {
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
                       
            }])
                    
                    console.log("OK");
                    response.sendStatus(201);
                
            }
        });
    });

//GET a una coleccion

app.get(BASE_API_PATH + "/results",(request,response)=>{
    if(!checkApiKeyFunction(request,response)) return;
  
  //busqueda
  var result = request.query;
  var city = result.city;
  var foul = result.foul;
  var goal_total = result.goal_total;
  var loose = result.loose;
  var victory = result.victory;
  var year = result.year;
  var name = result.name;
  
  //paginación
  
  var limit = parseInt(result.limit);
  var offset = parseInt(result.offset);
  var elements = [];
  
  
  if(limit>0 && offset>0){
   console.log("INFO : new request to /results");
    dbresult.find({}).skip(offset).limit(limit).toArray(function(err, results) {
     if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
                
                var filtered = results.filter((param)=>{
                      if ((city == undefined || param.city == city) && (foul == undefined || param.foul == foul) && 
                (goal_total == undefined || param.goal_total == goal_total) &&(loose == undefined || param.loose == loose ) && (victory == undefined || param.victory == victory ) && 
                ( year == undefined || param.year == year )&& (name == undefined || param.name == name) ) {
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
     dbresult.find({}).toArray( function (err, results) {
         if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
                 var filtered = results.filter((param)=>{
                      if ((city == undefined || param.city == city) && (foul == undefined || param.foul == foul) && 
                (goal_total == undefined || param.goal_total == goal_total) && (loose == undefined || param.loose == loose ) && (victory == undefined || param.victory == victory ) && 
                ( year == undefined || param.year == year )&& (name == undefined || param.name == name) ) {
                return param;
                }
                });
            }
            if (filtered.length > 0) {
       console.log("INFO: Sending stat: " + JSON.stringify(filtered, 2, null));
       response.send(filtered);
      }
    else {
       console.log("WARNING: There are not any results with this properties");
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

app.get(BASE_API_PATH + "/:city",(request,response)=>{
    if(!checkApiKeyFunction(request,response)) return;
  
    var city = request.params.city;
      if (!city) {
        console.log("WARNING: New GET request to /results/:city without city, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET");
        dbresult.find({"city" : city}).toArray(function(error, city) {
            if (error) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
                var filteredcity=city.filter((s)=>{
                    return (s.city.localeCompare(city,"en",{"sensitivity":"base"})===0);
                });
             
                if (filteredcity.length > 0) {
                    var c = filteredcity[0]; //since we expect to have exactly ONE results with this city
                    console.log("INFO: Sending city");
                    response.send(c);
                } else {
                    console.log("WARNING: There are not any contact with city " + city);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});

//GET a recurso concreto con 2 parametros

app.get(BASE_API_PATH + "/results/:city/:year", function (request, response) {
    if(!checkApiKeyFunction(request,response)) return;
    var city = request.params.city;
    var year = request.params.year;
    if (!city || !year) {
        console.log("WARNING: New GET request to /results/:city without city or without year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /results/" + city + "/" + year);
        dbresult.find({city:city, $and:[{year:year}]}).toArray(function (err, results) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else if (results.length > 0) { 
                    var result = results[0]; //since we expect to have exactly ONE contact with this name
                    console.log("INFO: Sending result: " + JSON.stringify(result, 2, null));
                    response.send(result);
                } else {
                    console.log("WARNING: There are not any city with city " + city +  "and year " + year);
                    response.sendStatus(404); // not found
                
                }
        });
}
});

//POST a un recurso

app.post(BASE_API_PATH + "results/:city",(request,response)=>{
    if(!checkApiKeyFunction(request,response)) return;
    var city = request.params.city;
    console.log("WARNING: New POST request to /results/" + city + ", sending 405...");
    response.sendStatus(405); // method not allowed
});



//POST a una coleccion

//POST over a collection
app.post(BASE_API_PATH + "/results", function(request, response) {
    
     if(!checkApiKeyFunction(request,response)) return;
    var newresult = request.body;
    console.log(newresult);
    if (!newresult) {
        console.log("WARNING: New POST request to /results/ without city, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New POST request to /results with body: " + JSON.stringify(newresult, 2, null));
        if (!newresult.city || !newresult.foul || !newresult.goal_total || !newresult.loose || !newresult.victory || !newresult.year ||!newresult.name) {
            console.log("WARNING: The result " + JSON.stringify(newresult, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            dbresult.find({}).toArray( function(err, results) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    var ResultsBeforeInsertion = results.filter((result) => {
                        return (result.city.localeCompare(newresult.city, "en", {
                            'sensitivity': 'base'
                        }) === 0);
                    });
                    if (ResultsBeforeInsertion.length > 0) {
                        console.log("WARNING: The result " + JSON.stringify(newresult, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    }
                    else {
                        console.log("INFO: Adding result " + JSON.stringify(newresult, 2, null));
                        dbresult.insert(newresult);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});


//PUT A UN RECURSO

//PUT over a single resource
//PUT over a single resource
app.put(BASE_API_PATH + "/results/:city", function(request, response) {
    if(!checkApiKeyFunction(request,response)) return;
    var updatedresult = request.body;
    var city = request.params.city;
    if (!updatedresult) {
        console.log("WARNING: New PUT request to /results-stats/ without establishment, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New PUT request to /result/" + city + " with data " + JSON.stringify(updatedresult, 2, null));
        if (!updatedresult.city || !updatedresult.foul || !updatedresult.goal_total || !updatedresult.loose || !updatedresult.victory || !updatedresult.year ||!updatedresult.name) {
            console.log("WARNING: The result " + JSON.stringify(updatedresult, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            dbresult.find({}).toArray( function(err, results) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    var resultsBeforeInsertion = results.filter((result) => {
                        return (result.city.localeCompare(city, "en", {
                            'sensitivity': 'base'
                        }) === 0);
                    });
                    if (resultsBeforeInsertion.length > 0) {
                        dbresult.update({
                            city: city
                        }, updatedresult);
                        console.log("INFO: Modifying result with city " + city + " with data " + JSON.stringify(updatedresult, 2, null));
                        response.send(updatedresult); // return the updated result
                    }
                    else {
                        console.log("WARNING: There is not any result with city " + city);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});




//PUT a un recurso
/*
app.put(BASE_API_PATH +"/:city",(request,response)=>{
 if(!checkApiKeyFunction(request,response)) return;
 
 var updatedresult = request.body;
    var city = request.params.city;
    
    if (updatedresult.city!=city) {
        console.log("WARNING: New PUT request to /results/ without city, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT");
         if (!updatedresult.city || !updatedresult.foul || !updatedresult.goal_total|| !updatedresult.loose || !updatedresult.victory || !updatedresult.year|| !updatedresult.name) {
            console.log("WARNING: PUT incorrect");
            response.sendStatus(422); // unprocessable entity
        } else {
            
            dbresult.update({city:updatedresult.city},
            
           
            {
                city:updatedresult.city,
                foul:updatedresult.foul,
                goal_total:updatedresult.goal_total,
                victory:updatedresult.victory,
                loose:updatedresult.loose,
                year:updatedresult.year,
                name:updatedresult.name,
                
                
            });
            
            response.sendStatus(200);
        }
    }
    
});

*/

//DELETE a un recurso

/*app.delete(BASE_API_PATH+"/:city",(request,response)=>{
        if(!checkApiKeyFunction(request,response)) return;

    var city=request.params.city;
    
     if (!city) {
        console.log("WARNING: New DELETE request to sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE r");
        dbresult.remove({city: city}, {}, function (error, city) {
            if (error) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            }  else {
                    
                    console.log("deleted");
                    response.sendStatus(200); // not found
                }
            
        });
    }
});*/

//DELETE a un recurso

//DELETE over a single resource
app.delete(BASE_API_PATH + "/results/:city", function(request, response) {
    if(!checkApiKeyFunction(request,response)) return;
    var city = request.params.city;
    if (!city) {
        console.log("WARNING: New DELETE request to /results/:city without city, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New DELETE request to /results/" + city);
        dbresult.remove({
            city: city
        }, {}, function(err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            }
            else {
               response.sendStatus(204);
            }
        });
    }
});









//DELETE a una coleccion
/*
app.delete(BASE_API_PATH,(request,response)=>{
        if(!checkApiKeyFunction(request,response)) return;

    
    console.log("INFO: New DELETE");
    dbresult.remove({}, {multi: true}, function (error, results) {
        if (error) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            var numremoved=JSON.parse(results);
            if (numremoved.na > 0) {
                console.log("INFO: All the results have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no results to delete");
                response.sendStatus(404); // not found
            }
        }
    });

});

*/

//DELETE over a collection

app.delete(BASE_API_PATH + "/results", function(request, response) {
     if(!checkApiKeyFunction(request,response)) return;
    console.log("INFO: New DELETE request to /results");
    dbresult.remove({}, {
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