module.exports = function(env, version) {
	return {
		properties: {
			host: version.ManagedObjectReference
		}
	};
};