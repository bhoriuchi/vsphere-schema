module.exports = function(env) {
	return {
		dynamicProperty: [env.version['5.1'].DynamicProperty],
		dynamicType: 'xsd.string'
	};
};