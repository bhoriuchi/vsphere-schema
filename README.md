

# vsphere-schema
---
`vsphere-schema` is a collection of vSphere API schemas in JSON format along with a few methods to navigate the schema. Versions `2.5` - `6.0` are currently included. All data has been scraped from `VMware` provided documentation and compiled using [`vsphere-doc-scrape`](https://github.com/bhoriuchi/vsphere-doc-scrape).

---

### Format

vSphere Objects are stored in the following format. Objects with circular references have those references replaced with a `"[Circular]"`

**`<Version>`** `{Object}` - API version, keyed on the version string `2.5` - `6.0`
  * **`<Type Name>`**
    * **`type`** `{string}` - Name of the type
    * [**`inherits`**] `{string}` - The name of the type that this Type inherits from
    * **`properties`** `{Object}` - Hash of properties and their types
      * [**`<Property Name>`**] `{Object | string}` - Either an XML data type string or a Type object
    * **`methods`** `{Object}` - Hash of methods
      * [**`<Method Name>`**] `{Object}` - Method object
        * [**`deprecated`**] `{string | boolean}` - Name of the replacement method or if true completely removed
        * **`params`** {Object} - Parameter hash
          * **`<Param Name>`** `{Object}` - Parameter object
            * **`required`** `{boolean}` - If the parameter is required
            * **`type`** `{string}` - Type name
        * **`returns`** `{string | none}` - Type returned by the method

---

### API

##### .getSchema(`version`)
A simple method to get a specific schema

**`Parameters`**
* `version` `{string}` - API version `2.5` - `6.0`

**`Returns`** `{Object}` - The schema object

##### .hasMethod(`version`, `type`, `method`)
Check if a method exists

**`Parameters`**
* `version` `{string}` - API version `2.5` - `6.0`
* `type` `{string}` - Type name
* `method` `{string}` - Method name

**`Returns`** `{boolean}` - Whether the method exists

##### .hasProperty(`version`, `type`, `property`)
Check if a property exists

**`Parameters`**
* `version` `{string}` - API version `2.5` - `6.0`
* `type` `{string}` - Type name
* `property` `{string}` - Property name

**`Returns`** `{boolean}` - Whether the property exists

##### .getProperty(`version`, `type`, `property`)
Get a property

**`Parameters`**
* `version` `{string}` - API version `2.5` - `6.0`
* `type` `{string}` - Type name
* `property` `{string}` - Property name

**`Returns`** `{*}` - The property

##### .getEventTypes(`version`)
Gets the names of all Types ending with Event

**`Parameters`**
* `version` `{string}` - API version `2.5` - `6.0`

**`Returns`** `{string[]}` - Event Type names

---

### Examples
```js
var vschema = require('vsphere-schema');

// access version 4.1
var v41 = vschema['4.1']
console.log(v41.VirtualMachine);

// or using the getSchema method get version 5.0
var v50 = vschema.getSchema('5.0');
console.log(v50.VirtualMachine);

// check if a property exists
var pExists = vschema.hasProperty('6.0', 'Datastore', 'name');
// pExists = true

// get a specific property
var prop = vschema.getProperty('5.5', 'VirtualMachine', 'config');

// check if a method exists
var mExists = vschema.hasMethod('6.0', 'VirtualMachine', 'Remove');
// mExists = false

```
