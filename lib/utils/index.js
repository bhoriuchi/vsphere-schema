module.exports = function(env) {
	
	var _ = env.lodash;
	
	function inheritProps(from, obj) {
		return _.merge(obj, {properties: from.properties});
	}
	
	return {
		inheritProps: inheritProps
	};
};