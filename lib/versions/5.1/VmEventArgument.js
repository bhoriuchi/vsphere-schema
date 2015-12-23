module.exports = function(env, version) {
	return {
		properties: {
			vm: version.ManagedObjectReference
		}
	};
};