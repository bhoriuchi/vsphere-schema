var schema = require('../lib');
var _      = schema.env.lodash;
var docUtil = require('../lib/scrape/docUtil');

//var vm = schema['5.1'].VirtualMachine.properties;
//console.log(vm.config);
//console.log(JSON.stringify(schema.env.versions['dev'].VirtualMachine, null, '  '));
//console.log(schema.getProperty('10.0', 'Action', 'dynamicProperty'));

var _self     = this;
_self.schema  = {};
_self.types   = {};
var ver       = '2.5';
var base      = __dirname.replace('/example', '/lib/scrape') + '/docs/' + ver + '/ReferenceGuide/';
var doc       = 'vim.ManagedEntity.html';


docUtil.getDoc(doc, base, _self).then(function() {
	console.log(_self.schema.ManagedEntity.methods);
});
