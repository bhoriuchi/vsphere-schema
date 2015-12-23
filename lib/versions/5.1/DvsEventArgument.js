module.exports = function(env, version) {
	return {
		properties: {
			dvs: version.ManagedObjectReference
		}
	};
};