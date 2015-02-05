var express = require('express');
var bodyParser = require('body-parser');
var swig = require('swig');
var logger= require('morgan');
var routes = require('./routes/index');
var path = require('path');
var app = express();

app.listen(3000, function(){
	console.log('App is listening on port 3000');
})

app.use(logger(":method :url :status :response-time ms - :res[content-length]"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use('/', routes);
swig.setDefaults({cache: false});

app.engine('html', swig.renderFile);
app.set('views', './views');
app.set('view engine', 'html');

//ERROR HANDLERS
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;
