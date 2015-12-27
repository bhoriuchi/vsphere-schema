/**
 * vSphere Schema - schema definitions for vSphere objects in JSON format
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */


module.exports = function(env) {
	
	var _ = env.lodash;
	
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
	
	
	return {
		hasProperty: hasProperty,
		getProperty: getProperty
	};
};