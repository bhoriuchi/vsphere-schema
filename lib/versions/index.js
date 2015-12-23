module.exports = function(env) {
	
	// require the versions sequentially so that newer versions can
	// extend older versions
	env.versions['5.1'] = require('./5.1')(env);
	
	// return the version hash
	return env.versions;
};