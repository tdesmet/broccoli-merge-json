# broccoli-merge-json

Merge multiple json files into one file.

## Installation

```bash
npm install --save-dev broccoli-merge-json
```

## Usage Example

```js
var mergeJSON = require('broccoli-merge-json');
var jsonTree = mergeJSON(sourceTree, {
  srcDir: '/languages',
  destDir: '/assets/languages'
});
```

This would create a .json for each sub directory in `/languages`. Each resulting
json file would contain the json files in the languages directory or any
sub directory.

for example the following directory structure

```
/languages
/languages/en
/languages/en/global.json
/languages/en/header.json
/languages/en/components.json
/languages/en/components/modal-dialog.json
/languages/en/components/date-selector.json
```

would result in the following json:

```js
{
  "global": {
    //contents of global.json
  },
  "header": {
    //contents of header.json
  },
  "components": {
    //contetns of components.json
    "modalDialog": {
      //contents of modal-dialog.json
    },
    "dateSelector": {
      //contents of date-select.json
    }
  }
}
```

## Options

### srcDir (required), destDir (required)

The `destDir` directory will be created, and all subdirectories of `srcDir`
will result in a .json file in the `destDir`.
