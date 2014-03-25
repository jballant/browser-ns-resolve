Browser NS Resolve
==================

A simple wrapper around browser-resolve to allow you to namespace paths in 'require' statements.

```
var resolver = require('browser-ns-resolve')([{
    name: 'foo',
    path: '/path/to/foo'
}]);

var myModulePath = resolve.resolve('@foo/path/to/myModule.js');
// myModulePath = "/path/to/foo/path/to/myModule.js"
```