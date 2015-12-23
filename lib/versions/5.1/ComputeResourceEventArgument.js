module.exports = function(env, version) {
	return {
		properties: {
			computeResource: version.ManagedObjectReference
		}
	};
};