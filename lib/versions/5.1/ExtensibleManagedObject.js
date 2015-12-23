module.exports = function(env, version) {
	return {
		properties: {
			availableField: [version.CustomFieldDef],
			value: [version.CustomFieldValue]
		},
		methods: {
			setCustomValue: {
				parameters: {
					'_this': version.ManagedObjectReference,
					key: 'xsd:string',
					value: 'xsd:string'
				}
			},
			faults: [
			    'InvalidArgument',
			    'RuntimeFault'
			]
		}
	};
};