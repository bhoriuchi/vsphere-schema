module.exports = function(env, version) {
	return {
		properties: {
			chainId: 'xsd.int',
			changeTag: 'xsd.string',
			computeResource: version.ComputeResourceEventArgument,
			createdTime: 'xsd:dateTime',
			datacenter: version.DatacenterEventArgument,
			ds: version.DatastoreEventArgument,
			dvs: version.DvsEventArgument,
			fullFormattedMessage: 'xsd:string',
			host: version.HostEventArgument,
			key: 'xsd:int',
			net: version.NetworkEventArgument,
			userName: 'xsd:string',
			vm: version.VmEventArgument
		}
	};
};