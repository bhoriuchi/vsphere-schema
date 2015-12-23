module.exports = function(env, version) {
	return {
		properties: {
			createPrivilege: 'xsd.string',
			deletePrivilege: 'xsd.string',
			readPrivilege: 'xsd.string',
			updatePrivilege: 'xsd.string'
		}
	};
};