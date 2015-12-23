module.exports = function(env, version) {
	return {
		properties: {
			fieldDefPrivileges: version.PrivilegePolicyDef,
			fieldInstancePrivileges: version.PrivilegePolicyDef,
			key: 'xsd.int',
			managedObjectType: 'xsd.string',
			name: 'xsd.string',
			type: 'xsd.string'
		}
	};
};