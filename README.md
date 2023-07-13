# treeify-paths

[![NPM version](https://img.shields.io/npm/v/treeify-paths.svg)](https://www.npmjs.com/package/treeify-paths)
[![npm](https://img.shields.io/npm/dm/treeify-paths.svg)]()

Provide a **list of file names**:

- blog/all.html
- blog/2036/overflows.html

And recieve a **directory-like tree**:

- blog
  - all.html
  - 2036
    - overflows.html

### Use Cases

Useful when converting a list of file names into a nested UL/LI tree. Nice for site maps, etc.

- [Live example](https://runkit.com/khtdr/treeify-paths)
- [Download example](https://runkit.com/downloads/khtdr/treeify-paths/1.0.0.zip)

## Installation:

Install it with NPM:

```bash
npm install --save treeify-paths
```

```javascript
import treeifyPaths from "treeify-paths";
```

If you are not using NPM, install the library by downloading the [source file](https://raw.githubusercontent.com/khtdr/treeify-paths/master/treeify-paths.js) and including it in your project:

```bash
curl -o treeify-paths.js "https://raw.githubusercontent.com/khtdr/treeify-paths/master/treeify-paths.js"
```

```javascript
let treeify_paths = require("./treeify-paths").default;
```

## Usage:

This module provides a function `treeifyPaths` that takes a list of file names and returns a directory-like tree.

### the following script:

```javascript
import treeifyPaths from 'treeify-paths';
console.log(JSON.stringify(treeifyPaths([
  'about.html',
  'careers',
  'careers/job-1.html',
  'careers/job-2.html',
  'to/some/page.aspx',
]), null, 3);
```

### produces the following output:

```json
{
  "path": "",
  "name": "",
  "children": [
    {
      "path": "about.html",
      "name": "about.html",
      "children": []
    },
    {
      "path": "careers",
      "name": "careers",
      "children": [
        {
          "path": "careers/job-1.html",
          "name": "job-1.html",
          "children": []
        },
        {
          "path": "careers/job-2.html",
          "name": "job-2.html",
          "children": []
        }
      ]
    },
    {
      "path": "to",
      "name": "",
      "children": [
        {
          "path": "to/some",
          "name": "",
          "children": [
            {
              "path": "to/some/page.aspx",
              "name": "page.aspx",
              "children": []
            }
          ]
        }
      ]
    }
  ]
}
```

### Controlling the behavior

You may pass in a list of `path`/`context` pairs. The context is available in the result.

```javascript
import treeifyPaths from 'treeify-paths';
console.log(JSON.stringify(treeifyPaths([
  ['about.html', {admin:false}],
  ['careers', {admin:false}],
  ['careers/job-1.html', {admin:false}],
  ['careers/job-2.html', {admin:false}],
  ['to/some/page.aspx', {admin:true}],
]), null, 3);
```

The context is available on the result:

```json
{
  "path": "about.html",
  "name": "about.html",
  "children": [],
  "ctx": { "admin": false }
}
```

By default:

- sorting is `case-sensitive`
- directories and files are treated the same

There are options for overridding this:

```javascript
import treeifyPaths from "treeify-paths";
treeifyPaths([], {
  caseInsensitive: true, // default false
  directoriesFirst: true, // default false
  directoriesLast: true, // default false
});
```

## Testing

The mocha [tests have many examples](./tests.js)

```bash
> npm run test

  treeifyPaths([...arguments])
    arguments: none
      ✔ should return an empty object
    arguments: empty list
      ✔ should return an empty object
    arguments: list with a single file
      ✔ should return a single file
      ✔ should ignore leading slashes
      ✔ should return with nested children
    arguments: multiple file names
      ✔ should return with nested children
      ✔ should ignore perimeter slashes and empty or redundant entries
      ✔ should alphabetize
      ✔ should alphabetize case-sensitve
      ✔ should not respect directories
      ✔ should ignore duplicates
      ✔ should be able to target directories

  12 passing (7ms)
```
