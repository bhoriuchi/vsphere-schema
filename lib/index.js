var _ = require('lodash');
var promise = require('bluebird');


// create the environment hash
var env = {
	lodash: _,
	debate: require('debate'),
	xml2js: require('xml2json'),
	promise: promise,
	versions: {}
};

// require the utils
env.utils   = require('./utils')(env);

// require all versions
env.versions = require('./versions')(env);


function getSchema(host, file, circular, types) {
	
	types    = types    || [];
	file     = file     || 'vim-types.xsd';
	circular = circular || [];
	
	// if the file has already been analyzed, return
	if (_.contains(circular, file)) {
		return;
	}
	
	// push the file to circular
	circular.push(file);
	
	// construct the url
	var schema, url = 'https://' + host + '/sdk/' + file;
	
	return env.debate.rest.get(url, {ignoreSSL: true})
	.then(function(response) {

		schema = env.xml2js.toJson(response.rawData, {object: true, coerce: true});
		
		types  = _.union(types, schema.schema.complexType, schema.schema.simpleType);

		var includes = _.get(schema, 'schema.include') || [];
		includes     = Array.isArray(includes) ? includes : [includes];
		
		//console.log(includes);
		
		return promise.each(includes, function(include) {
			return getSchema(host, include.schemaLocation, circular, types);
		})
		.then(function() {
			return types;
		});
	})
	.caught(function(err) {
		throw err;
	});
}


function buildSchema(host) {
	
	var schema = {};
	
	return getSchema(host).then(function(types) {
		
		// create a rough version of the schema
		_.forEach(types, function(type) {
			/*
			if (!_.has(type, 'complexContent')) {
				console.log(type.name, type.sequence);
			}*/
			
			schema[type.name] = _.omit(type, 'name');
		});
		
		// create an array of key names
		var typeNames = _.keys(schema);
		
		
		
		return schema;
	});
}



var schema = {
	buildSchema: buildSchema,
	getSchema: getSchema,
	env: env,
	utils: env.utils,
	versions: env.versions,
	'5.1': env.versions['5.1']
};


module.exports = schema;
