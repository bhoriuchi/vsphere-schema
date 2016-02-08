var schema = require('../lib');
var _      = schema.env.lodash;

var vm = schema['5.1'].VirtualMachine.properties;


//console.log(vm.config);

//console.log(JSON.stringify(schema['5.1'].VirtualMachine.properties, null, '  '));

console.log(schema.getProperty('5.1', 'VirtualMachine', 'config'));