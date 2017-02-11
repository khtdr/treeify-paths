
# paths-to-tree

Provide a __list of file names__:
  - blog/all.html
  - blog/2036/overflows.html
  
And recieve a __directory-like tree__:
  - blog
      - all.html
      - 2036
          - overflows.html

### Use Cases

Useful when converting a list of file names into a nested UL/LI tree. Nice for site maps, etc.


## Installation:


Install it with NPM:
```bash
npm install --save paths-to-tree

```javascript
import pathsToTree from 'paths-to-tree';
```

If you are not using NPM, install the library by downloading the [source file](https://raw.githubusercontent.com/khtdr/paths-to-tree/master/paths-to-tree.js) and including it in your project:
```bash
curl -o paths-to-tree.js "https://raw.githubusercontent.com/khtdr/paths-to-tree/master/paths-to-tree.js"
```
```javascript
let paths_to_tree = require('./paths-to-tree').default;
```

## Usage:

This module provides a function `pathsToTree` that takes a list of file names and returns a directory-like tree.


### the following script:
```javascript
import pathsToTree from 'paths-to-tree';
console.log(JSON.stringify(pathsToTree([
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


## Testing

The mocha [tests have many examples](./tests.js)

```bash
> paths-to-tree@1.0.0 pretest khtdr/paths-to-tree
> tsc lib.ts && mv lib.js paths-to-tree.js

> paths-to-tree@1.0.0 test khtdr/paths-to-tree
> mocha tests.js

  pathsToTree([...arguments])
    arguments: none
      ✓ should return an empty object
    arguments: empty list
      ✓ should return an empty object
    arguments: list with a single file
      ✓ should return a single file
      ✓ should return with nested children
    arguments: multiple file names
      ✓ should return with nested children
      ✓ should alphabetize
      ✓ should ignore duplicates

  7 passing (8ms)
```
