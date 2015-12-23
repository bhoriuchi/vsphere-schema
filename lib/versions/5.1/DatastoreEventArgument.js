module.exports = function(env, version) {
	return {
		properties: {
			datastore: version.ManagedObjectReference
		}
	};
};