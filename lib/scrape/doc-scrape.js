/**
 * Document scraper/parser for vsphere documentation. tested on 5.1 documentation
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */

var cheerio   = require('cheerio');
var promise   = require('bluebird');
var fs        = promise.promisifyAll(require('fs'));
var _         = require('lodash');

var _self     = this;
_self.schema  = {};
_self.types   = {};

var ver       = '5.1';
var base      = __dirname + '/docs/' + ver + '/ReferenceGuide/';
var allTypes  = base + 'index-all_types.html';
var rx        = /\"_self.\w+\"/g;

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
			var name = hdr[1].trim().replace(/\W+/g, '');

			// create the object in the schema if it doesn't exist
			_self.schema[name] = _self.schema[name] || {};
			
			var tables = $('table');

			tables.each(function(idx, table) {
				
				var typeDesc = $(table).prev('p').text().trim();					

				// get the properties
				if ($(table).find('th').length > 1 && ['Properties', 'Enum Constants'].indexOf(typeDesc) !== -1) {
					
					$(table).find('tr').each(function(idx, row) {

						var cols = $(row).find('td');
						
						if (!$(cols['0']).attr('colspan') && $(cols['0']).text() !== '') {
							
							// get the property name
							var prop = $(cols['0']).find('a').first().attr('id');
							
							if (typeDesc === 'Enum Constants' && prop) {
								_self.schema[name].enum = _self.schema[name].enum || {};
								_self.schema[name].enum[prop] = prop;
							}
							else if (typeDesc === 'Properties' && prop) {
								// check for object type value
								if ($(cols['1']).find('a').length > 0) {
									var objName = $(cols['1']).find('a').first().text().trim().replace(/\W+/g, '');
									_self.schema[objName] = _self.schema[objName] || {};
									_self.schema[name].properties = _self.schema[name].properties || {};
									
									// set up the deps field
									_self.schema[name]._deps = _self.schema[name]._deps || {};
									_self.schema[name]._deps.deps = _self.schema[name]._deps.deps || {};
									
									_self.schema[name].properties[prop] = '_self.' + objName;
									_self.schema[name]._deps.deps[prop] = objName;
								}
								else {
									_self.schema[name].properties = _self.schema[name].properties || {};
									_self.schema[name].properties[prop] = $(cols['1']).text().trim();
								}
							}
						}
						// now look for an inherit specification but only take the first one
						else if (_.contains($(cols['0']).text().trim(), 'Properties inherited from') && !foundInherit) {
							foundInherit = true;
							var inherit = $(cols['0']).find('a').first().text().trim();
							_self.schema[name]._deps = _self.schema[name]._deps || {};
							_self.schema[name]._deps.inherit = inherit;
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
	
	var extended = [];
	var count    = 0;
	
	console.log(_self.schema.ClusterProfileConfigSpec);
	
	
	// get the objects that dont need to be extended
	_.forEach(_self.schema, function(o, k) {
		if (!_.has(o, '_deps.inherit')) {
			extended = _.union(extended, [k]);
		}
	});
	
	// now loop through the schema and try to extend until all
	// models have been extended. put a loop counter in case runaway
	while(extended.length < _.keys(_self.schema).length && count < 100) {
		console.log(count++);
		_.forEach(_self.schema, function(o, k) {
			if (!_.contains(extended, k) && _.has(o, '_deps.inherit') && _.contains(extended, o._deps.inherit)) {
				_.merge(_self.schema[k], _self.schema[o._deps.inherit]);
				extended = _.union(extended, [k]);
			}
		});
	}

	
	var modFile = __dirname + '/vsphere' + ver + '.js';
	var mod = 'module.exports = function() {\n\n' +
	'    var _self = this;\n\n';

	// create a new file
	return fs.writeFileAsync(modFile, mod, 'utf8').then(function() {
		return promise.each(_.keys(_self.schema), function(key) {
			
			var objBody = JSON.stringify(
				_.omit(
					_self.schema[key], '_deps'
				)
			);
			
			var match = objBody.match(rx);
			
			_.forEach(match, function(m) {
				objBody = objBody.replace(m, _.trim(m, '"'));
			});
			
			
			var objStr = '    _self.' + key + ' = ' + objBody + ';\n';
			return fs.appendFileAsync(modFile, objStr, 'utf8');
		});
	})
	.then(function() {
		return fs.appendFileAsync(modFile, '\n\nreturn _self;\n\n};', 'utf8');
	});
});

