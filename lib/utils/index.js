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
	function hasProperty(version, type, prop) {
		var p = property(version, type, prop);
		return _.has(p.version, p.path);
	}
	
	
	// function to check if an object has a specific method
	function hasMethod(version, type, method) {
		if (_.has(env.versions, version)) {
			return _.has(env.versions[version], type + '.methods.' + method);
		}
		return false;
	}
	
	// function to get a property
	function getProperty(version, type, prop) {
		var p = property(version, type, prop);
		return _.get(p.version, p.path);
	}
	
	// function to get a schema
	function getSchema(version) {

		if (_.has(env.versions, version)) {
			return env.versions[version];
		}
		else {
			throw 'The API version requested is not supported. Supported versions are ' + env.versions.join(', ');
		}
	}
	
	// return all event types
	function getEventTypes(version) {
		if (_.has(env.versions, version)) {
			return _.filter(_.keys(env.versions[version]), function(type) {
				return type.match(/Event$/);
			});
		}
		return null;
	}
	
	
	// gets object type data
	function objectType(version, type) {
		if (objectTypes[version]) {
			return _.get(objectTypes[version], type);
		}
		return null;
	}
	
	
	// return all of the methods
	return {
		hasMethod     : hasMethod,
		hasProperty   : hasProperty,
		getProperty   : getProperty,
		getSchema     : getSchema,
		getEventTypes : getEventTypes,
		objectType    : objectType
	};
};