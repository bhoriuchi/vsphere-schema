var schema = require('../lib');
var _      = schema.env.lodash;

//var vm = schema['5.1'].VirtualMachine.properties;
//console.log(vm.config);
//console.log(JSON.stringify(schema.env.versions['6.0'].VirtualMachine, null, '  '));
//console.log(schema.getProperty('dev', 'VirtualMachine', 'config'));
console.log(schema.utils.getEventTypes('2.5'));


