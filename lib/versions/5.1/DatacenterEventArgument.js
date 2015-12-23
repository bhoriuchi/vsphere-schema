module.exports = function(env, version) {
	return {
		properties: {
			datacenter: version.ManagedObjectReference
		}
	};
};