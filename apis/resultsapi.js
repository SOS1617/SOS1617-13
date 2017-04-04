//...............................................API Results.....Llopis..............................................................;//
var exports = module.exports= {};

exports.register = function(app,dbresult,Llopisapi,checkApiKey){


// Base GET
app.get("/", function(request, response) {
    console.log("INFO: Redirecting to /results");
    response.redirect(301, "/results");
});

//Load Initial Data

app.get(Llopisapi + "/loadInitialData", (request, response) => {
    if(!checkApiKey(request,response)) return;
        
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

app.get(Llopisapi,(request,response)=>{
    if(!checkApiKey(request,response)) return;
  
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
                (goal_total == undefined || param.goal_total == goal_total) && (victory == undefined || param.victory == victory ) && 
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
                (goal_total == undefined || param.goal_total == goal_total) && (victory == undefined || param.victory == victory ) && 
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
//POST a un recurso

app.post(Llopisapi + "/:city",(request,response)=>{
    if(!checkApiKey(request,response)) return;

    response.sendStatus(405);
});



//GET a un recurso

app.get(Llopisapi + "/:city",(request,response)=>{
    if(!checkApiKey(request,response)) return;
  
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

//POST a una coleccion

app.post(Llopisapi + "/results", function(request, response) {
        if(!checkApiKey(request,response)) return;

    var newresults = request.body;
    console.log(newresults);
    if (!newresults) {
        console.log("WARNING: New POST request to /results/ without city, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New POST request to /results with body: " + JSON.stringify(newresults, 2, null));
        if (!newresults.city || !newresults.foul || !newresults.loose || !newresults.victory || !newresults.year || !newresults.name ) {
            console.log("WARNING: The results " + JSON.stringify(newresults, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            dbresult.find({}).toArray( function(err, results) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    var ResultsBeforeInsertion = results.filter((results) => {
                        return (results.city.localeCompare(results.city, "en", {
                            'sensitivity': 'base'
                        }) === 0);
                    });
                    if (ResultsBeforeInsertion.length > 0) {
                        console.log("WARNING: The result " + JSON.stringify(results, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    }
                    else {
                        console.log("INFO: Adding result " + JSON.stringify(results, 2, null));
                        dbresult.insert(results);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});


//PUT a un recurso

app.put(Llopisapi +"/:city",(request,response)=>{
        if(!checkApiKey(request,response)) return;

    
    var updatedresult = request.body;
    var city = request.params.city;
    
    if (updatedresult.city!=city) {
        console.log("WARNING: New PUT request to /results/ without corner, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT");
         if (!updatedresult.city || !updatedresult.foul || !updatedresult.loose || !updatedresult.victory || !updatedresult.year|| !updatedresult.name) {
            console.log("WARNING: PUT incorrect");
            response.sendStatus(422); // unprocessable entity
        } else {
            
            dbresult.update({city:updatedresult.city},
            
           
            {
                city:updatedresult.city,
                foul:updatedresult.foul,
                victory:updatedresult.victory,
                loose:updatedresult.loose,
                year:updatedresult.year,
                name:updatedresult.name,
                
                
            });
            
            response.sendStatus(200);
        }
    }
    
});

//DELETE a un recurso

app.delete(Llopisapi+"/:city",(request,response)=>{
        if(!checkApiKey(request,response)) return;

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
});

//DELETE a una coleccion

app.delete(Llopisapi,(request,response)=>{
        if(!checkApiKey(request,response)) return;

    
    console.log("INFO: New DELETE");
    dbresult.remove({}, {multi: true}, function (error, results) {
        if (error) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            results=JSON.parse(results);
            if (results.n > 0) {
                console.log("INFO: All the results have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no results to delete");
                response.sendStatus(404); // not found
            }
        }
    });

});


//PUT a una coleccion

app.put(Llopisapi,(request,response)=>{
    response.sendStatus(405);
});


};