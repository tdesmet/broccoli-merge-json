var fs = require('fs');
var path = require('path');
var test = require('tap').test;
var Builder = require('broccoli').Builder;
var merger = require('..');

var fixturePath = path.join(__dirname, 'fixtures');

test('merge files correctly', function(t) {
  var tree = merger(fixturePath, {
    srcDir: '/languages',
    destDir: '/foo'
  });

  var builder = new Builder(tree);
  builder.
    build().
    then(function(result) {
      var resultEnFile = path.join(result.directory, 'foo', 'en.json');
      var fileEnExists = fs.existsSync(resultEnFile);
      t.ok(fileEnExists, "File en.json exists");
      var resultEn = {};
      if (fileEnExists) {
        resultEn = JSON.parse(fs.readFileSync(resultEnFile));
      }

      t.strictDeepEqual(resultEn, {
        "global": {
          "KEY1": "global file key"
        },
        "header": {
          "KEY1": "header file key"
        },
        "modules": {
          "KEY1": "modules file key",
          "testComponent": {
            "KEY1": "test component key"
          },
          "secondComponent": {
            "KEY1": "second component key"
          }
        }
      }, "result file has correct json content");

      var resultFrFile = path.join(result.directory, 'foo', 'fr.json');
      var fileFrExists = fs.existsSync(resultFrFile);
      t.ok(fileFrExists, "File fr.json exists");
      var resultFr = {};
      if (fileFrExists) {
        resultFr = JSON.parse(fs.readFileSync(resultFrFile));
      }

      t.strictDeepEqual(resultFr, {
        "global": {
          "KEY1": "french global file key"
        },
        "header": {
          "KEY1": "french header file key"
        },
        "modules": {
          "testComponent": {
            "KEY1": "french test component key"
          },
          "secondComponent": {
            "KEY1": "french component key"
          }
        }
      }, "result file has correct json content");
      t.end();
    });
});

test('output should contain two files', function(t) {
  var tree = merger(fixturePath, {
    srcDir: '/languages',
    destDir: '/foo'
  });

  var builder = new Builder(tree);
  builder.
    build().
    then(function(result) {
      t.ok(fs.existsSync(path.join(result.directory, 'foo', 'en.json')), "File en.json exists");
      t.ok(fs.existsSync(path.join(result.directory, 'foo', 'fr.json')), "File en.json exists");
      t.end();
    });
});
