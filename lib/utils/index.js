/**
 * vSphere Schema - schema definitions for vSphere objects in JSON format
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */


module.exports = function(env) {
	
	var _ = env.lodash;
	var objectTypes = require('./objectTypes')(env);
	
	// function to get a property path
	function property(version, model, prop) {
		if (typeof(version) === 'string' && _.has(env.versions, version)) {
			version = env.versions[version];
		}
		else if (!_.isObject(version) || Array.isArray(version)) {
			return null;
		}
		
		return {
			version: version,
			path: model + '.properties.' + prop.replace(/\./g, '.properties.')
		};
	}
	
	
	// function to see if a path exists
	function hasProperty(version, model, prop) {
		var p = property(version, model, prop);
		return _.has(p.version, p.path);
	}
	
	// function to get a property
	function getProperty(version, model, prop) {
		var p = property(version, model, prop);
		return _.get(p.version, p.path);
	}
	
	// function to get a schema
	function getSchema(version) {
		
		var majorVersion = 5;
		
		try {
			majorVersion = parseInt(version.split('.')[0], 10);
		} catch(err) {}
		
		if (_.has(env.versions, version)) {
			return env.versions[version];
		}
		else if (majorVersion < 2) {
			throw 'The vSphere API v2.5 is the minimum supported version';
		}
		else {
			return env.versions['5.1'];
		}
	}
	
	// gets object type data
	function objectType(version, type) {
		
		if (objectTypes[version]) {
			return _.get(objectTypes[version], type);
		}
		
		return null;
	}
	
	return {
		hasProperty : hasProperty,
		getProperty : getProperty,
		getSchema   : getSchema,
		objectType  : objectType
	};
};