var express = require('express');
var router = express.Router();
var models = require('../models');
var Promise = require('bluebird');
var crawl = require('./crawler.js')

router.get('/', function(req, res, next){

	// models.Event.find({}, function(err, result){
	// 	res.render(result);
	// })
	console.log("initiated");
	var sample1 = [{
		title: "sample 1",
		url: "undefined",
		date: "Jan 15, 2015"},
		{title: "sample 2",
		url: "www.google.com",
		date: "yesterday"}];

	res.render('index', sample1);
})

router.post('/submit', function(req, res, next){
	//get objects from crawler
	//filter objects by whats already in the database
	//create new events for what is new
	//add events to the db
	//refresh page 
	console.log("post request acknowledged...");
	Promise.fromNode(function(callback){
		crawl(callback)
	}).then(function(allUnfilteredEvents){
		res.render("index", allUnfilteredEvents);
	})
})

module.exports = router;