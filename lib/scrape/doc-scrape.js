/**
 * Document scraper for vsphere documentation located at http://vijava.sourceforge.net/vSphereAPIDoc/ver51/ReferenceGuide/
 */

var cheerio   = require('cheerio');
var promise   = require('bluebird');
var fs        = promise.promisifyAll(require('fs'));
var _         = require('lodash');



var _self     = this;
_self.schema  = {};
_self.inherit = {};
_self.types   = {};

var base      = __dirname + '/docs/5.1/ReferenceGuide/';
var allTypes  = base + 'index-all_types.html';


function getDoc(doc) {
	// pull the object page
	return fs.readFileAsync(base + doc, 'utf8').then(function(data) {
		
		var hdr = [];
		var foundInherit = false;
		
		// load the html into jquery
		var $ = cheerio.load(data);
		
		
		// get the object name and type
		try { hdr  = $('h1').first().text().split('-'); }
		catch(err) {}
		
		// if the name and type were found proceed
		if (hdr.length > 1) {
			
			var type = hdr[0].trim();
			var name = hdr[1].trim();
			
			console.log('Getting', name);
			
			// create the object in the schema if it doesn't exist
			_self.schema[name] = _self.schema[name] || {};
			
			var tables = $('table');

			tables.each(function(idx, table) {
				
				// get the properties
				if ($(table).find('th').length > 2 && $(table).prev('p').text() === 'Properties') {
					
					$(table).find('tr').each(function(idx, row) {

						var cols = $(row).find('td');
						
						if ($(cols['0']).attr('nowrap') === '1' && $(cols['0']).text() !== '') {
							
							// get the property name
							var prop = $(cols['0']).find('a').first().attr('id');
							
							// set the property name
							_self.schema[name][prop] = {};
							
							// check for object type value
							if ($(cols['1']).find('a').length > 0) {
								var objName = $(cols['1']).find('a').first().text().trim();

								_self.schema[objName] = _self.schema[objName] || {};
								_self.schema[name][prop] = _self.schema[objName];
							}
							else {
								_self.schema[name][prop] = $(cols['1']).text();
							}
						}
						// now look for an inherit specification but only take the first one
						else if (_.contains($(cols['0']).text().trim(), 'Properties inherited from') && !foundInherit) {
							foundInherit = true;
							_self.inherit[name] = $(cols['0']).find('a').first().text().trim();
						}
					});
				}
			});
			
			
		}
		else {
			console.log('failed to get name for', doc);
		}
	});
}

// get a list of all types
function getTypes() {
	return fs.readFileAsync(allTypes, 'utf8').then(function(data) {
		// load the html into jquery
		var $ = cheerio.load(data);
		
		var links = $('a[title]');
		
		links.each(function(idx, link) {
			if ($(link).attr('title') && $(link).attr('target') && $(link).attr('href')) {
				_self.types[$(link).attr('title')] = $(link).attr('href');
			}
		});
	});
}





// run the code
getTypes().then(function() {
	return promise.each(_.keys(_self.types), function(type) {
		return getDoc(_self.types[type]);
	});
})
.then(function() {
	console.log(JSON.stringify(_self.schema, null, '  '));
});


/*
getDoc('vim.alarm.AlarmState.html')
.then(function() {
	console.log('SCHEMA');
	console.log(JSON.stringify(_self.schema, null, '  '));
	console.log('INHERIT');
	console.log(JSON.stringify(_self.inherit, null, '  '));
	process.exit();
});
*/

