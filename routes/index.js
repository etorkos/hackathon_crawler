var express = require('express');
var router = express.Router();
var models = require('../models');
var Promise = require('bluebird');
var crawl = require('./crawler.js')

router.get('/', function(req, res, next){

	models.Event.find({}, function(err, result){
		res.render('index', {events: result});
	})

})

router.post('/submit', function(req, res, next){
	//get objects from crawler
	//remove old elements from the database //NOT YET DONE!?
	//filter objects by whats already in the database (done with uniqueness call)
	//create new events for what is new
	//add events to the db

	//refresh page 
	
	console.log("post request acknowledged...");
	
	Promise.fromNode(function(callback){
		crawl(callback)
	}).then(function(allUnfilteredEvents){
		console.log("adding events");
		allUnfilteredEvents.forEach(function(row){
			var newModel = new models.Event({
				name: row.name,
				location: row.location,
				link: row.link,
				date: row.date
			});
			console.log(newModel.name);
			newModel.save(function(err){
				if (err){
					console.log(err);
				}
			});
			console.log("logged one");
		})
	}).then(
		removeFromDatabase(function(){
			console.log("database queried");
		})
	).then(function(){
		console.log("refreshing...")
		res.redirect('/');
	})
})


router.post('/purge', function(req, res, next){
	models.Event.find({}).remove(function(err, result){
		if (err){
			console.log(err)
		}
		console.log("removed items form the db");
		res.redirect('/');	
	})

})

function removeFromDatabase ( cb){
	console.log("initiated");
	var todayDate = new Date();
	models.Event.find( {date: {$lt: todayDate}}).remove(function(err, result){
		console.log("checked the db");
		console.log(result);
		if(err){
			console.log(err);
		}
		if(result.length){
			console.log("There were "+result.length+" events removed from the db");
		}
		cb(null, result);
	})
}

module.exports = router;