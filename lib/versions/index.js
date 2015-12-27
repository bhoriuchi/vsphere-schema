/**
 * vSphere Schema - schema definitions for vSphere objects in JSON format
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */


module.exports = function(env) {
	
	// require the versions sequentially so that newer versions can
	// extend older versions
	env.versions['5.1'] = require('./5.1')();
	
	// return the version hash
	return env.versions;
};