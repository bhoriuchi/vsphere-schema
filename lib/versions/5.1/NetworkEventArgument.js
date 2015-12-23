module.exports = function(env, version) {
	return {
		properties: {
			network: version.ManagedObjectReference
		}
	};
};