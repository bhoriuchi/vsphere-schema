

# vsphere-schema
---
`vsphere-schema` is a collection of vSphere API schemas in JSON format along with a few methods to navigate the schema. Versions `2.5` - `6.0` are currently included. All data has been scraped from `VMware` provided documentation.

### Format

vSphere Objects are stored in the following format

```js

{
    ObjectName: {
        type: 'Object Type Name',
        properties: {
            propertyName1: 'Property Type String',
            propertyName2: {
                type: 'Object Type Name',
                properties: {
                    ....
                },
                methods: {
                    ....
                }
            },
            ...
        },
        methods: {
            methodName1: {
                params: {
                    param1: 'Param Type String',
                    ...
                },
                returns: 'Return Type String'
            },
            ....
        }
    }
}

```

### Usage

To access a specific API version

```js
var vschema = require('vsphere-schema');

// access version 4.1
var v41 = vschema['4.1']

// or using the getSchema method get version 5.0
var v50 = vschema.getSchema('5.0');

// check if a property exists
var exists = vschema.hasProperty('6.0', 'Datastore', 'name');

// get a specific property
var prop = vschema.getProperty('5.5', 'VirtualMachine', 'config');

```


### Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
