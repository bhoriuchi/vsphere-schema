var schema = require('../lib');
var _      = schema.env.lodash;

var v = '6.0';

//var vm = schema['5.1'].VirtualMachine.properties;
//console.log(vm.config);
//console.log(JSON.stringify(schema.env.versions[v].VirtualMachine));
//console.log(JSON.stringify(schema.env.versions[v].MethodFault));
//console.log(JSON.stringify(schema.getProperty(v, 'VirtualMachine', 'config'), null, '  '));
console.log(JSON.stringify(schema.getProperty(v, 'VirtualMachine', 'config'), null, '  '));
//console.log(schema.utils.getEventTypes('2.5'));


