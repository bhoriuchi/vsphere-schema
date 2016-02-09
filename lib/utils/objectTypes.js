/**
 * vSphere Schema
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
module.exports = function(env) {
	
	// modules
	var _     = env.lodash;
	var util  = env.util;
	
	var types = {};
	
	var containerView = {
		type: 'ContainerView',
		path: 'view'
	};
	
	
	// vsphere 2.5 api types
	types['2.5'] = {
		'Alarm': {},
		'AlarmManager': {},
		'AuthorizationManager': {},
		'ClusterComputeResource': {
			listSpec: containerView
		},
		'ComputeResource': {
			listSpec: containerView
		},
		'ContainerView': {},
		'CustomFieldsManager': {},
		'CustomizationSpecManager': {},
		'Datacenter': {
			listSpec: containerView
		},
		'Datastore': {
			listSpec: containerView
		},
		'DiagnosticManager': {},
		'EnvironmentBrowser': {},
		'EventHistoryCollector': {},
		'EventManager': {},
		'ExtensibleManagedObject': {},
		'ExtensionManager': {},
		'FileManager': {},
		'Folder': {
			listSpec: containerView
		},
		'HistoryCollector': {},
		'HostAutoStartManager': {},
		'HostBootDeviceSystem': {},
		'HostCpuSchedulerSystem': {},
		'HostDatastoreBrowser': {},
		'HostDatastoreSystem': {},
		'HostDateTimeSystem': {},
		'HostDiagnosticSystem': {},
		'HostFirewallSystem': {},
		'HostFirmwareSystem': {},
		'HostHealthStatusSystem': {},
		'HostLocalAccountManager': {},
		'HostMemorySystem': {},
		'HostNetworkSystem': {},
		'HostPatchManager': {},
		'HostServiceSystem': {},
		'HostSnmpSystem': {},
		'HostStorageSystem': {},
		'HostSystem': {
			listSpec: containerView
		},
		'HostVMotionSystem': {},
		'InventoryView': {},
		'LicenseManager': {},
		'ListView': {},
		'ManagedEntity': {},
		'ManagedObjectView': {},
		'Network': {
			listSpec: containerView
		},
		'OptionManager': {},
		'PerformanceManager': {},
		'PropertyCollector': {},
		'PropertyFilter': {},
		'ResourcePool': {
			listSpec: containerView
		},
		'ScheduledTask': {},
		'ScheduledTaskManager': {},
		'SearchIndex': {},
		'ServiceInstance': {},
		'SessionManager': {},
		'Task': {
			listSpec: {
				type: 'TaskManager',
				id: 'TaskManager',
				path: 'recentTask'
			}
		},
		'TaskHistoryCollector': {},
		'TaskManager': {},
		'UserDirectory': {},
		'View': {},
		'ViewManager': {},
		'VirtualDiskManager': {},
		'VirtualMachine': {
			listSpec: containerView
		},
		'VirtualMachineSnapshot': {}
	};
	
	
	// vsphere api 4.0 types
	types['4.0'] = _.merge(_.cloneDeep(types['2.5']), {
		'ClusterProfile': {},
		'ClusterProfileManager': {},
		'DistributedVirtualPortgroup': {},
		'DistributedVirtualSwitch': {},
		'DistributedVirtualSwitchManager': {},
		'HostKernelModuleSystem': {},
		'HostPciPassthruSystem': {},
		'HostProfile': {},
		'HostProfileManager': {},
		'HostVirtualNicManager': {},
		'HttpNfcLease': {},
		'IpPoolManager': {},
		'LicenseAssignmentManager': {},
		'LocalizationManager': {},
		'OvfManager': {},
		'Profile': {},
		'ProfileComplianceManager': {},
		'ProfileManager': {},
		'ResourcePlanningManager': {},
		'VirtualApp': {},
		'VirtualizationManager': {},
		'VirtualMachineCompatibilityChecker': {},
		'VirtualMachineProvisioningChecker': {},
		'VmwareDistributedVirtualSwitch': {}
	});
	
	// vsphere 4.1 api types
	types['4.1'] = _.merge(_.cloneDeep(types['4.0']), {
		'HostActiveDirectoryAuthentication': {},
		'HostAuthenticationManager': {},
		'HostAuthenticationStore': {},
		'HostDirectoryStore': {},
		'HostLocalAuthentication': {},
		'HostPowerSystem': {},
		'StorageResourceManager': {}
	});
	
	// vsphere 5.0 api types
	types['5.0'] = _.merge(_.cloneDeep(types['4.1']), {
		'GuestAuthManager': {},
		'GuestFileManager': {},
		'GuestOperationsManager': {},
		'GuestProcessManager': {},
		'HostCacheConfigurationManager': {},
		'HostEsxAgentHostManager': {},
		'HostImageConfigManager': {},
		'IscsiManager': {},
		'StoragePod': {}
	});
	
	// vsphere 5.1 api types
	types['5.1'] = _.merge(_.cloneDeep(types['5.0']), {
		'SessionManager': {},
		'SimpleCommand': {}
	});
	
	
	// vsphere 5.5 api types
	types['5.5'] = _.merge(_.cloneDeep(types['5.1']), {
		'DatastoreNamespaceManager': {},
		'HostGraphicsManager': {},
		'HostVFlashManager': {},
		'HostVsanInternalSystem': {},
		'HostVsanSystem': {},
		'OpaqueNetwork': {}
	});
	
	// vsphere 6.0 api types
	types['6.0'] = _.merge(_.cloneDeep(types['5.5']), {
		'CertificateManager': {},
		'ClusterEVCManager': {},
		'GuestAliasManager': {},
		'GuestWindowsRegistryManager': {},
		'HostAccessManager': {},
		'HostCertificateManager': {},
		'IoFilterManager': {},
		'MessageBusProxy': {},
		'OverheadMemoryManager': {},
		'VRPResourceManager': {},
		'VsanUpgradeSystem': {}
	});	
	
	return types;
};