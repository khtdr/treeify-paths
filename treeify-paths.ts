export class PathTree<T = any> {
  declare ctx: T;
  constructor(public path: string = "") {}
  name: string = "";
  children: PathTree[] = [];
}

// Legacy
export class Node extends PathTree {}

function fill(
  node: PathTree,
  paths: PathContexts,
  options: Partial<Options> = {}
) {
  let cMap: Record<string, { paths: PathContexts; obj: PathTree }> = {};
  paths.forEach(([file, ctx]) => {
    let parts = file.split("/");
    if (!cMap[parts[0]]) {
      let fullPath = node.path + "/" + parts[0];
      cMap[parts[0]] = {
        paths: [],
        obj: new PathTree(fullPath.replace(/^\//, "")),
      };
    }
    if (parts.length == 1) {
      cMap[parts[0]].obj.name = parts[0];
      cMap[parts[0]].obj.ctx = ctx;
    } else {
      let dir = parts.shift();
      let rest = parts.join("/");
      cMap[dir].paths.push([rest, ctx]);
      cMap[dir].obj.ctx = ctx;
    }
  });
  let keys = Object.keys(cMap);
  if (options.caseInsensitive)
    keys.sort((a, b) =>
      a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase())
    );
  else keys.sort();
  keys.forEach((key) => {
    fill(cMap[key].obj, cMap[key].paths, options);
    node.children.push(cMap[key].obj);
  });
  if (options.directoriesFirst)
    node.children.sort((a, b) => {
      if (a.children.length && !b.children.length) return -1;
      if (b.children.length && !a.children.length) return 1;
      return -1;
    });
  else if (options.directoriesLast)
    node.children.sort((a, b) => {
      if (a.children.length && !b.children.length) return 1;
      if (b.children.length && !a.children.length) return -1;
      return -1;
    });
  return node;
}

type Paths = string[];
type PathContexts<Ctx = any> = [string, Ctx][];
type Options = {
  caseInsensitive: boolean;
  directoriesFirst: boolean;
  directoriesLast: boolean;
};

export default function treeifyPaths<Ctx>(
  paths: Paths | PathContexts<Ctx> = [],
  options: Partial<Options> = {}
): PathTree<Ctx> {
  const pathCtxs = isPaths(paths)
    ? paths.map((path): [string, Ctx] => [path, undefined])
    : paths;
  return fill(new PathTree(), pathCtxs, options);
}

function isPaths(data: Paths | PathContexts): data is Paths {
  return typeof data[0] === "string";
}
