
export class Node {
  constructor(
    public path: string = '',
  ) {}
  name: string = '';
  children: Node[] = [];
};

function fill (node:Node, files:string[]) {
  let cMap = {};
  files.forEach(file => {
    let parts = file.split('/');
    if (!cMap[parts[0]]) {
      let fullPath = node.path + '/' + parts[0];
      cMap[parts[0]] = {
        files:[],
        obj: new Node(fullPath.replace(/^\//, ''))
      };
    }
    if (parts.length == 1) {
      cMap[parts[0]].obj.name = parts[0];
    } else {
      let dir = parts.shift();
      let rest = parts.join('/');
      cMap[dir].files.push(rest);
    }
  });
  let keys = Object.keys(cMap);
  keys.sort();
  keys.forEach(key => {
    fill(cMap[key].obj, cMap[key].files)
    node.children.push(cMap[key].obj);
  });
  return node;
}


export default function filesToTree (files: string[] = []): Node {
  return fill(new Node, files);
}

