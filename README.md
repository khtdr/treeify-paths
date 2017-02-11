
# filesToTree

## Installation:

Install the source by downloading it and including it in your project:
```bash
curl -o filesToTree "https://raw.githubusercontent.com/khtdr/filesToTree/master/filesToTree.js"
```
Or install it with NPM if you are using it:
```bash
npm install --save github:khtdr/filesToTree#v1.0.0
```

## Usage:

### the following script:
```javascript
import filesToTree from 'filesToTree';
console.log(JSON.stringify(filesToTree([
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


## DOCs

The mocha [tests have many examples](./tests.js)

```bash
> file-tree@1.0.0 pretest khtdr/file-tree
> tsc lib.ts && mv lib.js index.js


> file-tree@1.0.0 test khtdr/file-tree
> mocha tests.js



  filesToTree([...arguments])
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


  7 passing (9ms)

```
