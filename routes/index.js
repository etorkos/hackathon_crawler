var express = require('express');
var router = express.Router();
var models = require('../models/');

router.get('/', function(req, res, next){
	models.Event.find({}, function(err, result){
		res.render(result);
	})
})

module.exports = router;