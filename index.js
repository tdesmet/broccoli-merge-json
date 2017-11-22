var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var helpers = require('broccoli-kitchen-sink-helpers');
var changeCase = require('change-case');

var Plugin = require('broccoli-plugin');

module.exports = Merger;
Merger.prototype = Object.create(Plugin.prototype);
Merger.prototype.constructor = Merger;

function Merger (inputNode, options) {
  if (!(this instanceof Merger)) return new Merger(inputNode, options);
  Plugin.call(this, [inputNode]);
  this.options = options || {};
}


function addObject(currentObject, path, objectToAdd) {
  var prop = path[0];
  prop = changeCase.camel(prop);

  if (path.length === 1) {
    if (prop.toLowerCase() === "index") {
      //copy properties from objectToAdd to currentObject
      Object.keys(objectToAdd).forEach(function(key) {
        currentObject[key] = objectToAdd[key];
      });
    } else {
      if (typeof(currentObject[prop]) === "object") {
        //copy properties from objectToAdd to currentObject[prop]
        var objectToAddTo = currentObject[prop];
        Object.keys(objectToAdd).forEach(function(key) {
          objectToAddTo[key] = objectToAdd[key];
        });
      } else {
        currentObject[prop] = objectToAdd;
      }
    }
  } else {
    var nextObject = currentObject[prop] || {};
    currentObject[prop] = nextObject;
    addObject(nextObject, path.slice(1), objectToAdd);
  }
}

Merger.prototype.build = function() {
  var sourcePath = this.inputPaths[0];
  var destPath   = path.join(this.outputPath, this.options.destDir);

  if (destPath[destPath.length -1] === '/') {
    destPath = destPath.slice(0, -1);
  }

  if (!fs.existsSync(destPath)) {
    mkdirp.sync(destPath);
  }

  var subDirNames = fs.readdirSync(sourcePath).filter(function(d) {
    var stats = fs.statSync(path.join(sourcePath, d));
    return d[0] != '.' && stats.isDirectory(); // exclude anything that starts with a . and isn't a directory
  });

  subDirNames.forEach(function(subDirName) {
    var outputFile = path.join(destPath, subDirName + '.json');
    var filesDir = path.join(sourcePath, subDirName);

    var inputFiles = helpers.multiGlob(['**/*.json'], {cwd: filesDir})

    var output = {};
    var test = "";
    inputFiles.forEach(function(inputFile) {
      var parts = inputFile.split("/");
      var fileContent = JSON.parse(fs.readFileSync(path.join(filesDir, inputFile)));
      parts[parts.length - 1] = path.basename(parts[parts.length - 1], '.json');
      addObject(output, parts, fileContent);
    });
    fs.writeFileSync(outputFile, JSON.stringify(output));
  });  
}
