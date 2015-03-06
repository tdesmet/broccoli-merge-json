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

The following directory structure

```
├─┬ languages
  └─┬ en
    ├── index.json
    ├── global.json
    ├── header.json
    ├── components.json
    └─┬ components
      ├── modal-dialog.json
      └── date-selector.json
```

would result in the following `en.json`:

```js
{
  // contents of index.json 
  "global": {
    //contents of global.json
  },
  "header": {
    //contents of header.json
  },
  "components": {
    //contents of components.json
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
