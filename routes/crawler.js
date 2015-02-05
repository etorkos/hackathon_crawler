var cheerio = require('cheerio'),
request = require('request'),
fs = require('fs'),
http = require('http'),
Promise = require('bluebird');

Promise.promisifyAll(require("request"));


var search = function(callback){
	var time = new Date(),
	hackathons = [];

	request.getAsync('https://www.hackerleague.org/hackathons', function(err, resp, body){ //site only advertises hackathons
		if(!err && resp.statusCode == 200){
			var $ = cheerio.load(body);
			$( '.container .thumbnail').each(function(){
				var data = $(this);
				var name = data.children().children().text();
				var link = '//www.hackerleague.org' + data.children().children().attr('href');
				var location = data.find('.text-uppercase').text();
				var date = data.find('.hackathon_date').text().replace(/st|nd|rd|th/g, "");
				if(isInNyc(location)){
					var a = {name: name, link: link, location: location, date: date}
					hackathons.push(a);
					console.log('added a hackerleague hackathon');
				}
		});
	}}).then(
	request.getAsync()



	).then(
	request.getAsync('https://www.eventbrite.com/d/new-york--new-york/hackathon/?crt=regular&page=1&slat=40.7128&slng=-74.0059&sort=date&vp_ne_lat=40.9153&vp_ne_lng=-73.7003&vp_sw_lat=40.4914&vp_sw_lng=-74.2591', function(err, resp, body){
		if(!err & resp.statusCode == 200){
			var $ = cheerio.load(body);
			$('.l-block-stack .l-block-2').each(function(){
				var data = $(this);
				var name = data.find('.omnes').text();
				name = name.split(/\s{2,}/)[1];
				var location = data.find('.bullet-list-ico').children().next().children().next().text();
				var link = data.children().attr('href');
				var date = data.find('.bullet-list-ico').children().children().next().attr('datetime');
				location = location.split(/\s{2,}/)[1];

				if(isInNycForEventBrite(location) && isAHackathon(name)){
					var a = {name: name, link: link, location: location, date: date}
					hackathons.push(a);
					console.log('added an eventbrite hackathon');
				}
			})

			return callback(null, removeDuplicates(hackathons));

		}
	})).nodeify(callback);

	function isInNyc (string){
		var a= 'nyc', b= 'new york', c = 'manhattan', d="brooklyn", e = 'bronx', f = 'queens', g = 'new york city';
		var loc = string.split(',')[0].toLowerCase();
		var loc2 = string.split(',')[1].toLowerCase();
		if(a.indexOf(loc) > -1 || b.indexOf(loc) > -1 ||c.indexOf(loc) > -1 || d.indexOf(loc) > -1 || e.indexOf(loc) > -1 || f.indexOf(loc) > -1 || g.indexOf(loc) > -1) {
			return true;
		}
		else{
			return false;
		}
	}

	function isInNycForEventBrite (string){
		var a= "nyc", b= "new york", c = "manhattan", d="brooklyn", e = "bronx", f = "queens", g = "new york city";
		var loc = string.split(',')[1].toLowerCase();
		if(a.indexOf(loc) || b.indexOf(loc) ||c.indexOf(loc) || d.indexOf(loc) || e.indexOf(loc) || f.indexOf(loc) || g.indexOf(loc) ) {
			return true;
		}
		else{
			return false;
		}
	}

	function isAHackathon (title) {
		var a = "hackathon";
		var titleMod = title.toLowerCase();
		if (titleMod.indexOf(a) > -1){
			return true;
		}
		else {
			return false;
		}
	}

	function removeDuplicates (array){
		var checkedHackathons = [];
		checkedHackathons.push(array.shift());
		for(var a = 0; a < array.length; a++){
			var unique = true;
			for(var b=0; b<checkedHackathons.length; b++){
				if(array[a].name === checkedHackathons[b].name){
					unique = false;
				}
			}
			if(unique){
				checkedHackathons.push(array[a]);
			}
		}
		return checkedHackathons;
	}
}

module.exports = search;