
class PathTree<T = any> {
  declare ctx: T;
  constructor(public path: string = "") {}
  name: string = "";
  children: PathTree[] = [];
}

type PathContext<T = any> = [string, T];
const stripLeadingSlash = (path: string) => path.replace(/^\//, "");

function fill(node: PathTree, paths: PathContext[]) {
  let cMap: Record<string, any> = {};
  paths.forEach(([file, ctx]) => {
    let parts = stripLeadingSlash(file).split("/");
    if (!cMap[parts[0]]) {
      let fullPath = node.path + "/" + parts[0];
      cMap[parts[0]] = {
        paths: [],
        obj: new PathTree(stripLeadingSlash(fullPath)),
      };
      cMap[parts[0]].obj.ctx = ctx;
    }
    if (parts.length == 1) {
      // found the leaf node, use the value as the name
      cMap[parts[0]].obj.name = parts[0];
      cMap[parts[0]].obj.ctx = ctx;
    } else {
      let dir = parts.shift();
      let rest = parts.join("/");
      cMap[dir!].paths.push([rest, ctx]);
    }
  });
  let keys = Object.keys(cMap);
  keys.sort((a, b) => a.localeCompare(b));
  keys.forEach((key) => {
    fill(cMap[key].obj, cMap[key].paths);
    node.children.push(cMap[key].obj);
  });
  return node;
}

function treeifyPaths<T>(paths: PathContext<T>[] = []): PathTree<T> {
  return fill(new PathTree(), paths);
}
