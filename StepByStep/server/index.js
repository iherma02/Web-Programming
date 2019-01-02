const express = require('express')
const path = require('path')
var bodyParser = require('body-parser')
var validator = require('validator')
var compress = require('compression')
const PORT = process.env.PORT || 5000

var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/danceTimes';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
  db = databaseConnection;
});

express()
 .use(express.static(path.join(__dirname, 'public')))
 .use(bodyParser.json())
 .use(bodyParser.urlencoded({ extended: true }))
 .use(compress())
 .get("/hello", function(request, response) {
          response.sendFile(path.join(__dirname  + '/public/hello.html'));
 })
 .get("/dance", function(request, response) {
          response.sendFile(path.join(__dirname + 'public/dance/index.html'))
 })

 .get('/display.json', function(request, response){
         var UseName = request.query.username;

  	response.set('Content-Type', 'text/html');
  	var homePage = '';

        db.collection('danceTimes', function(er, collection) {
 		//.limit(10) to only grab 10
 		collection.find({username: UseName}).limit(10).toArray(function(err, results) {


 			if (!err) {
 				homePage += "<!DOCTYPE HTML><html><head><title>Your Saved Moves</title></head><body><h1>Welcome " + username + ". Here are your saved Moves</h1>";
 				for (var count = 0; count < results.length; count++) {
 					homePage += "<p> You played " + results[count].id +" and have " + results[count].list + " as saved time spots </p>";
 				}
 				homePage += "</body></html>"
 				response.send(homePage);
 			} else {
 				response.send('<!DOCTYPE HTML><html><head><title>Sadness</title></head><body><h1>Everything is broken!</h1></body></html>');
 			}
 		});
 	});
 })

 /*
 app.get('/display.json', function(request, response){
 	var UseName = request.query.username;

 	response.set('Content-Type', 'text/html');
 	var homePage = '';

 	db.collection('Moves_db', function(er, collection) {
 		//.limit(10) to only grab 10
 		collection.find({username: UseName}).sort({score: -1}).limit(10).toArray(function(err, results) {


 			if (!err) {
 				homePage += "<!DOCTYPE HTML><html><head><title>Your Saved Moves</title></head><body><h1>Welcome " + username + ". Here are your saved Moves</h1>";
 				for (var count = 0; count < results.length; count++) {
 					homePage += "<p> You played " + results[count].songID +" and have " + results[count].moveTimes + " as saved time spots </p>";
 				}
 				homePage += "</body></html>"
 				response.send(homePage);
 			} else {
 				response.send('<!DOCTYPE HTML><html><head><title>Sadness</title></head><body><h1>Everything is broken!</h1></body></html>');
 			}
 		});
 	});



 });


 */
.post("/submit", function(request, response) {
          response.header("Access-Control-Allow-Origin", "*");
          response.header("Access-Control-Allow-Headers", "X-Requested-With");

          var username = request.body.username;
          var id = request.body.id;
          var list = request.body.list;

          var toInsert = {
                  "username":username,
                  "id":id,
                  "list":list
          };

          db.collection('times', function(error, collection) {
                  collection.insert(toInsert, function (errorUpdate, result) {
                          if (!error) {
                                  collection.find().limit(10).toArray(function(errorQuery, allScores) {
                                          if (!errorQuery) {
                                                  response.send(allScores);
                                          }
                                          else {
                                                  response.send('{"error":"Whoops, something is wrong with the database connection"}');
                                          }
                                  });
                          }
                          else {
                                  response.send('{"error":"Whoops, something is wrong with the database connection"}');
                          }
                  });
          });
})
.listen(PORT, () => console.log(`Listening on ${ PORT }`))
