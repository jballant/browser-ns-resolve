Browser NS Resolve
==================

A simple wrapper around browser-resolve to allow you to namespace paths in 'require' statements.

```
var resolver = require('browser-ns-resolve')([{
    name: 'foo',
    path: '/path/to/foo'
}]);

var myModule = resolve.resolve('@foo/path/to/myModule.js');
```