//...............................................API GOALS.....Luciano..............................................................;//
var exports = module.exports= {};

exports.register = function(app,dbGoal,luc,checkApiKey){


// Base GET
app.get("/", function(request, response) {
    console.log("INFO: Redirecting to /goals");
    response.redirect(301, "/goals");
});

//Load Initial Data

app.get(luc + "/loadInitialData", (request, response) => {
    if(!checkApiKey(request,response)) return;
        
        dbGoal.find({}).toArray(function(error, goals) {
            if (error) {
                console.error("Error data from db");
                response.sendStatus(500);
            }
            else {
                    dbGoal.remove({});
                    dbGoal.insert([{
                       "city": "madrid",
                                "hour": "15:30",
                                "goals_first_team": 2,
                                "goals_second_team": 1,
                                "team_a": "madrid",
                                "team_b": "barça"

                            }, {
                                "city": "seville",
                                "hour": "17:40",
                                "goals_first_team": 1,
                                "goals_second_team": 0,
                                "team_a": "sevilla",
                                "team_b": "betis"
                            }, {
                                "city": "malaga",
                                "hour": "17:40",
                                "goals_first_team": 0,
                                "goals_second_team": 1,
                                "team_a": "malaga",
                                "team_b": "español"
                    }])
                    
                    console.log("OK");
                    response.sendStatus(201);
                
            }
        });
    });

//GET a una coleccion

app.get(luc,(request,response)=>{
    if(!checkApiKey(request,response)) return;
  
  //busqueda
  var goal = request.query;
  var city = goal.city;
  var hour = goal.hour;
  var goals_first_team= goal.goals_first_team;
  var goals_second_team= goal.goals_second_team;
  var team_a = goal.team_a;
  var team_b = goal.team_b;
  
  //paginación
  
  var limit = parseInt(goal.limit);
  var offset = parseInt(goal.offset);
  var elements = [];
  
  
  if(limit>0 && offset>0){
   console.log("INFO : new request to /goals");
    dbGoal.find({}).skip(offset).limit(limit).toArray(function(err, goals) {
     if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
                
                var filtered = goals.filter((param)=>{
                      if ((city == undefined || param.city == city) && (hour == undefined || param.hour == hour) && 
                (goals_first_team == undefined || param.goals_first_team == goals_first_team) && (goals_second_team == undefined || param.goals_second_team == goals_second_team) && 
                (team_a == undefined || param.team_a == city)&& (team_b == undefined || param.team_b == team_b) ) {
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
     dbGoal.find({}).toArray( function (err, goals) {
         if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
                 var filtered = goals.filter((param)=>{
                      if ((city == undefined || param.city == city) && (hour == undefined || param.hour == hour) && 
                (goals_first_team == undefined || param.goals_first_team == goals_first_team) && (goals_second_team == undefined || param.goals_second_team == goals_second_team) && 
                (team_a == undefined || param.team_a == city)&& (team_b == undefined || param.team_b == team_b) ) {
                return param;
                }
                });
            }
            if (filtered.length > 0) {
       console.log("INFO: Sending stat: " + JSON.stringify(filtered, 2, null));
       response.send(filtered);
      }
    else {
       console.log("WARNING: There are not any goals with this properties");
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

app.post(luc +"/:city",(request,response)=>{
    if(!checkApiKey(request,response)) return;

    response.sendStatus(405);
});



//GET a un recurso

app.get(luc +"/:city",(request,response)=>{
    if(!checkApiKey(request,response)) return;
  
    var city = request.params.city;
      if (!city) {
        console.log("WARNING: New GET request to /goals/:city without city, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET");
        dbGoal.find({"city" : city}).toArray(function(error, team_a) {
            if (error) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
                var filteredcity=team_a.filter((s)=>{
                    return (s.city.localeCompare(city,"en",{"sensitivity":"base"})===0);
                });
             
                if (filteredcity.length > 0) {
                    var c = filteredcity[0]; //since we expect to have exactly ONE goals with this city
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

app.post(luc + "/goals", function(request, response) {
        if(!checkApiKey(request,response)) return;

    var newgoals = request.body;
    console.log(newgoals);
    if (!newgoals) {
        console.log("WARNING: New POST request to /results/ without city, sending 400...");
        response.sendStatus(400); // bad request
    }
    else {
        console.log("INFO: New POST request to /goals with body: " + JSON.stringify(newgoals, 2, null));
        if (!newgoals.city || !newgoals.hour || !newgoals.goals_first_team || !newgoals.goals_second_team || !newgoals.team_a || !newgoals.team_b ) {
            console.log("WARNING: The goals " + JSON.stringify(newgoals, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        }
        else {
            dbGoal.find({}).toArray( function(err, goals) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                }
                else {
                    var ResultsBeforeInsertion = goals.filter((goals) => {
                        return (goals.city.localeCompare(goals.city, "en", {
                            'sensitivity': 'base'
                        }) === 0);
                    });
                    if (ResultsBeforeInsertion.length > 0) {
                        console.log("WARNING: The result " + JSON.stringify(goals, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    }
                    else {
                        console.log("INFO: Adding result " + JSON.stringify(goals, 2, null));
                        dbGoal.insert(goals);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});


//PUT a un recurso

app.put(luc +"/:city",(request,response)=>{
        if(!checkApiKey(request,response)) return;

    
    var updatedGoal = request.body;
    var city = request.params.city;
    
    if (updatedGoal.city!=city) {
        console.log("WARNING: New PUT request to /goals/ without corner, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT");
         if (!updatedGoal.city || !updatedGoal.hour || !updatedGoal.goals_first_team || !updatedGoal.goals_second_team || !updatedGoal.team_a|| !updatedGoal.team_b) {
            console.log("WARNING: PUT incorrect");
            response.sendStatus(422); // unprocessable entity
        } else {
            
            dbGoal.update({city:updatedGoal.city},
            
           
            {
                city:updatedGoal.city,
                hour:updatedGoal.hour,
                goals_first_team:updatedGoal.goals_first_team,
                goals_second_team:updatedGoal.goals_second_team,
                team_a:updatedGoal.team_a,
                team_b:updatedGoal.team_b,
                
                
            });
            
            response.sendStatus(200);
        }
    }
    
});

//DELETE a un recurso

app.delete(luc+"/:city",(request,response)=>{
        if(!checkApiKey(request,response)) return;

    var city=request.params.city;
    
     if (!city) {
        console.log("WARNING: New DELETE request to sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE r");
        dbGoal.remove({city: city}, {}, function (error, team_a) {
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

app.delete(luc,(request,response)=>{
        if(!checkApiKey(request,response)) return;

    
    console.log("INFO: New DELETE");
    dbGoal.remove({}, {multi: true}, function (error, goals) {
        if (error) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            goals=JSON.parse(goals);
            if (goals > 0) {
                console.log("INFO: All the goals have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no goals to delete");
                response.sendStatus(404); // not found
            }
        }
    });

});


//PUT a una coleccion

app.put(luc,(request,response)=>{
    response.sendStatus(405);
});
};
