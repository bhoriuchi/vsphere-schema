module.exports = function(env) {
	var s = {};
	var inheritProps = env.utils.inheritProps;
	
	
	// ENUMS
	s.ManagedEntityStatus          = require('./ManagedEntityStatus')(env, s);
	
	
	// no dependencies
	s.DynamicProperty              = require('./DynamicProperty')(env, s);
	s.ManagedObjectReference       = require('./ManagedObjectReference')(env, s);
	
	
	// single dependencies
	s.DynamicData                  = require('./DynamicData')(env, s);
	
	// event objects
	s.EventArgument                = inheritProps(s.DynamicData, require('./EventArgument')(env, s));
	s.EntityEventArgument          = inheritProps(s.EventArgument, require('./EntityEventArgument')(env, s));
	s.ComputeResourceEventArgument = inheritProps(s.EntityEventArgument, require('./ComputeResourceEventArgument')(env, s));
	s.DatacenterEventArgument      = inheritProps(s.EntityEventArgument, require('./DatacenterEventArgument')(env, s));
	s.DatastoreEventArgument       = inheritProps(s.EntityEventArgument, require('./DatastoreEventArgument')(env, s));
	s.DvsEventArgument             = inheritProps(s.EntityEventArgument, require('./DvsEventArgument')(env, s));
	s.HostEventArgument            = inheritProps(s.EntityEventArgument, require('./HostEventArgument')(env, s));
	s.NetworkEventArgument         = inheritProps(s.EntityEventArgument, require('./NetworkEventArgument')(env, s));
	s.VmEventArgument              = inheritProps(s.EntityEventArgument, require('./VmEventArgument')(env, s));
	s.Event                        = inheritProps(s.DynamicData, require('./Event')(env, s));
	
	// inherit properties
	s.PrivilegePolicyDef           = inheritProps(s.DynamicData, require('./PrivilegePolicyDef')(env, s));
	
	
	s.CustomFieldValue             = inheritProps(s.DynamicData, require('./CustomFieldValue')(env, s));
	s.CustomFieldDef               = inheritProps(s.DynamicData, require('./CustomFieldDef')(env, s));
	 
	
	s.ExtensibleManagedObject      = require('./ExtensibleManagedObject')(env, s);
	
	
	
	
	
	
	
	
	return s;
};