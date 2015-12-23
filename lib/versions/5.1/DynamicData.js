module.exports = function(env, version) {
	return {
		properties: {
			dynamicProperty: [version.DynamicProperty],
			dynamicType: 'xsd.string'
		}
	};
};