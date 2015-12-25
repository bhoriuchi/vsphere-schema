var debate  = require('debate');
var cheerio = require('cheerio');
var _       = require('lodash');

// pull the object page
debate.rest.get('http://vijava.sourceforge.net/vSphereAPIDoc/ver51/ReferenceGuide/vim.alarm.AlarmState.html')
.then(function(data) {

	// load the html into jquery
	var $ = cheerio.load(data.rawData);
	
	var tables = $('table');

	tables.each(function(idx, table) {
		
		if ($(table).find('th').length > 2 && $(table).prev('p').text() === 'Properties') {
			
			$(table).find('tr').each(function(idx, row) {

				var cols = $(row).find('td');
				
				if (!$(cols['0']).attr('colspan') && $(cols['0']).text() !== '') {
					console.log($(cols['0']).text(), $(cols['1']).text());
				}
			});
		}
	});
	
	//console.log(tables);
	
	
	// exit
	process.exit();
});