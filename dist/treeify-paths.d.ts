export declare class PathTree<T = any> {
    path: string;
    ctx: T;
    constructor(path?: string);
    name: string;
    children: PathTree[];
}
export declare class Node extends PathTree {
}
type Paths = string[];
type PathContexts<Ctx = any> = [string, Ctx][];
type Options = {
    caseInsensitive: boolean;
    directoriesFirst: boolean;
    directoriesLast: boolean;
};
export default function treeifyPaths<Ctx>(paths?: Paths | PathContexts<Ctx>, options?: Partial<Options>): PathTree<Ctx>;
export {};
