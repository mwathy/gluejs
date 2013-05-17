var path = require('path');

// This task takes something that looks like this:
// { files: [ { name: /path/to/foo }]}
// into:
// { path: { to: { ".": [ 'foo' ] }}}
//
// which makes many tasks a lot easier since you can recurse into directories in a JSON structure
// files are always stored in the special key "."

module.exports = function(tree){
  var structured = {};
  // regroup the files by splitting each name on the directory separator

  tree.files.forEach(function(obj) {
    var pathParts = obj.name.split(path.sep).filter(function(item) { return item.length > 0; }),
        current = structured,
        i, part;

    for(i = 0; i < pathParts.length - 1; i++) {
      part = pathParts[i];
      if(!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }

    // the last part is the file name - store under { ".": [ filename, filename ] }
    current['.'] = (current['.'] ? current['.'] : [] ).concat(pathParts[pathParts.length - 1 ]);

  });

  tree.structured = structured;
};