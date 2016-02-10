var cheerio   = require('cheerio');
var promise   = require('bluebird');
var fs        = promise.promisifyAll(require('fs'));
var _         = require('lodash');

// parses vsphere documentation
function getDoc(doc, base, _self) {
	
	// pull the object page
	return fs.readFileAsync(base + doc, 'utf8').then(function(data) {
		
		var hdr = [];
		var foundInherit = false;
		var passedProps  = false;
		
		// load the html into jquery
		var $ = cheerio.load(data);
		
		var getParams = function(mTable, _self, name, mName) {
			$(mTable).find('tr').each(function(idx, row) {
				if (idx > 0) {
					
					var pName = '';
					
					$(row).find('td').each(function(idx, col) {
						var colText = $(col).text().trim();

						if (idx === 0) {
							pName = colText;
						}
						else if (idx === 1) {
							_self.schema[name].methods[mName].params[pName] = colText;
						}
					});
				}
			});	
		};
		
		var getReturnValue = function(rTable, _self, name, mName) {
			$(rTable).find('tr').each(function(idx, row) {
				if (idx === 1) {

					$(row).find('td').each(function(idx, col) {
						var colText = $(col).text().trim().split(' ')[0].trim();

						if (idx === 0) {
							_self.schema[name].methods[mName].returns = (colText && colText !== 'None') ? colText : null;
						}
					});
				}
			});
		};
		
		
		// get the object name and type
		try { hdr  = $('h1').first().text().split('-'); }
		catch(err) {}
		
		// if the name and type were found proceed
		if (hdr.length > 1) {
			
			var type = hdr[0].trim();
			var name = hdr[1].split('(')[0].trim().replace(/\W+/g, '');

			// create the object in the schema if it doesn't exist
			_self.schema[name] = _self.schema[name] || {};
			_self.schema[name].type = name;
			
			var tables = $('table');

			tables.each(function(idx, table) {
				
				var typeDesc = $(table).prev('p').text().trim();
				//console.log('TypeDesc', typeDesc);

				// get the properties
				if ($(table).find('th').length > 1 && ['Properties', 'Enum Constants'].indexOf(typeDesc) !== -1) {
					
					// set a flag to tell we have passed the properties
					passedProps = true;

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
						else if (_.includes($(cols['0']).text().trim(), 'Properties inherited from') && !foundInherit) {
							foundInherit = true;
							var inherit = $(cols['0']).find('a').first().text().trim();
							_self.schema[name]._deps = _self.schema[name]._deps || {};
							_self.schema[name]._deps.inherit = inherit;
						}
					});
				}
				else if (passedProps && typeDesc === 'Methods') {
					
					_self.schema[name].methods = _self.schema[name].methods || {};
					
					$(table).find('.r0').first().find('a').each(function(idx, link) {
						var mHref  = $(link).attr('href').replace('#', '');
						var mName  = $(link).text().trim();
						var method = $('a[name=' + mHref + ']');
						
						// add the method
						_self.schema[name].methods[mName] = {
							params: {},
							returns: null,
							//faults: {}
						};
						
						var mTable = $(method).nextAll('table').first();
						var mType  = $(mTable).prev('p').text().trim();
						
						if (mType === 'Parameters') {
							getParams(mTable, _self, name, mName);
						}
						else if (mType === 'Return Value') {
							getReturnValue(mTable, _self, name, mName);
						}
						
						var rTable = $(mTable).nextAll('table').first();
						mType = $(rTable).prev('p').text().trim();
						
						if (mType === 'Return Value') {
							getReturnValue(rTable, _self, name, mName);
						}
						else if (mType === 'Parameters') {
							getParams(rTable, _self, name, mName);
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
function getTypes(allTypes, _self) {
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

module.exports = {
	getTypes: getTypes,
	getDoc: getDoc
};

