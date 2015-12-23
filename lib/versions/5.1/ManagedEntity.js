module.exports = function(env, version) {
	return {
		properties: {
			alarmActionsEnabled: 'xsd.boolean',
			configIssue: [version.Event],
			configStatus: version.ManagedEntityStatus,
			customValue: [version.CustomFieldValue],
			//declaredAlarmState: [version.AlarmState],
			disabledMethod: ['xsd:string'],
			effectiveRole: ['xsd:int'],
			name: 'xsd:string',
			//overallStatus: version.ManagedEntityStatus,
			parent: version.ManagedObjectReference,
			//permission: [version.Permission],
			recentTask: [version.ManagedObjectReference],
			//tag: [version.Tag],
			//triggeredAlarmState: [version.AlarmState]
		}
	};
	
	//TODO: finish related models
};