var schema = require('../lib');
var _      = schema.env.lodash;



console.log(JSON.stringify(schema['5.1'].VirtualMachine.properties.guest.properties.disk.properties, null, '  '));

console.log(schema.getProperty('5.1', 'VirtualMachine', 'guest.disk'));