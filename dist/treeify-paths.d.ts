export declare class PathTree<T = any> {
    path: string;
    ctx: T;
    constructor(path?: string);
    name: string;
    children: PathTree[];
}
export declare class Node extends PathTree {
}
export type Paths = string[];
export type PathContexts<Ctx = any> = [string, Ctx][];
export type Options = {
    caseInsensitive: boolean;
    directoriesFirst: boolean;
    directoriesLast: boolean;
};
export declare function treeifyPaths<Ctx>(paths?: Paths | PathContexts<Ctx>, options?: Partial<Options>): PathTree<Ctx>;
export default treeifyPaths;
