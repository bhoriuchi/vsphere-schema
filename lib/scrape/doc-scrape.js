/**
 * Document scraper/parser for vsphere documentation
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */

var promise   = require('bluebird');
var fs        = promise.promisifyAll(require('fs'));
var _         = require('lodash');
var util      = require('./docUtil');

var _self     = this;
_self.schema  = {};
_self.types   = {};

var ver       = '2.5';
var base      = __dirname + '/docs/' + ver + '/ReferenceGuide/';
var allTypes  = base + 'index-all_types.html';
var rx        = /\"_self.\w+\"/g;

// run the code
util.getTypes(allTypes, _self).then(function() {
	return promise.each(_.keys(_self.types), function(type) {
		return util.getDoc(_self.types[type], base, _self);
	});
})
.then(function() {

	var count    = 0;
	
	// now create a dependency organized list. start with objects that have circular references
	var circulars = {
		LocalizedMethodFault: _self.schema.LocalizedMethodFault,
		OvfConsumerOstNode: _self.schema.OvfConsumerOstNode,
		VirtualDiskFlatVer1BackingInfo: _self.schema.VirtualDiskFlatVer1BackingInfo,
		VirtualDiskFlatVer2BackingInfo: _self.schema.VirtualDiskFlatVer2BackingInfo,
		VirtualDiskRawDiskMappingVer1BackingInfo: _self.schema.VirtualDiskRawDiskMappingVer1BackingInfo,
		VirtualDiskSeSparseBackingInfo: _self.schema.VirtualDiskSeSparseBackingInfo,
		VirtualDiskSparseVer1BackingInfo: _self.schema.VirtualDiskSparseVer1BackingInfo,
		VirtualDiskSparseVer2BackingInfo: _self.schema.VirtualDiskSparseVer2BackingInfo,
		VirtualMachineSnapshotTree: _self.schema.VirtualMachineSnapshotTree,
		ProfileApplyProfileProperty: _self.schema.ProfileApplyProfileProperty,
		HostSystemResourceInfo: _self.schema.HostSystemResourceInfo,
		ProfileProfileStructureProperty: _self.schema.ProfileProfileStructureProperty
	};
	var mergedCirculars = false;
	var includes = {};
	var lastIncludeCount = -1;
	count = 0;
	var circCount = 0;
	var updates;
	
	while(_.keys(includes).length < _.keys(_self.schema).length && count < 100) {
		updates = 0;
		console.log('Ordering Dependencies Loop:', count++);
		_.forEach(_self.schema, function(o, k) {
			
			var deps    = _.get(o, '_deps.deps');
			var depKeys = _.keys(deps);
			var depVals = _.uniq(_.values(deps));
			var incKeys = _.keys(includes);
			var inter   = _.intersection(incKeys, depVals);
			var exts    = _.get(o, '_deps.inherit');
			var hasExt  = exts && _.includes(incKeys, exts);
			var itHas   = _.includes(_.keys(includes), k);
			
			if ((!exts || hasExt) && (!deps || depKeys.length === 0 || inter.length === depVals.length) && !itHas) {
				includes[k] = o;
				updates++;
			}
			else if (updates === 0) {
				_.forEach(circulars, function(c, n) {
					var ikeys   = _.keys(includes);
					var ideps   = _.get(c, '_deps.deps');
					var iexts   = _.get(c, '_deps.inherit');
					var isValid = _.includes(_.keys(_self.schema), n);
					var iHas    = _.includes(ikeys, n);
					var iHasExt = _.includes(ikeys, iexts);
					var iHasDep = ideps && _.intersection(ikeys, ideps).length === ideps.length;
					
					if (isValid && !iHas && (circCount > 0 || ((!iexts || iHasExt) && (!ideps || iHasDep)))) {
						circCount = 0;
						includes[n] = c;
						updates++;
					}
				});
			}
			else if (exts && _.includes(depVals, exts) && hasExt && !itHas) {
				includes[k] = o;
				updates++;
			}
		});

		if (updates === 0) {
			circCount++;
			console.log('Circluar Count:', circCount);
		}
		
		lastIncludeCount = _.keys(includes).length;
		console.log('Includes count', _.keys(includes).length, ', goal', _.keys(_self.schema).length);
	}
	
	
	var modFile = __dirname.replace('/scrape', '/versions/dev/index.js');
	var mod = '// vSphere Schema v' + ver + '\n' +
	'module.exports = function(env) {\n\n' +
	'    var merge     = env.merge;\n' +
	'    var _self = this;\n\n';

	// create a new file
	return fs.writeFileAsync(modFile, mod, 'utf8').then(function() {
		return promise.each(_.keys(includes), function(key) {
			
			var objBody = JSON.stringify(
				_.omit(
					includes[key], '_deps'
				)
			);
			
			var match = objBody.match(rx);
			
			_.forEach(match, function(m) {
				objBody = objBody.replace(m, _.trim(m, '"'));
			});
			
			var objStr;
			var inherit = _.get(includes[key], '_deps.inherit');
			if (inherit) {
				objStr = '    _self.' + key + ' = merge(' + objBody + ', _self.' + inherit + ');\n';
			}
			else {
				objStr = '    _self.' + key + ' = ' + objBody + ';\n';
			}

			return fs.appendFileAsync(modFile, objStr, 'utf8');
		});
	})
	.then(function() {
		return fs.appendFileAsync(modFile, '\n\nreturn _self;\n\n};', 'utf8');
	});
});

