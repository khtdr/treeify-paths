"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Node = exports.PathTree = void 0;
var PathTree = /** @class */ (function () {
    function PathTree(path) {
        if (path === void 0) { path = ""; }
        this.path = path;
        this.name = "";
        this.children = [];
    }
    return PathTree;
}());
exports.PathTree = PathTree;
// Legacy
var Node = /** @class */ (function (_super) {
    __extends(Node, _super);
    function Node() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Node;
}(PathTree));
exports.Node = Node;
function fill(node, paths, options) {
    if (options === void 0) { options = {}; }
    var cMap = {};
    paths.forEach(function (_a) {
        var file = _a[0], ctx = _a[1];
        var parts = file.split("/");
        if (!cMap[parts[0]]) {
            var fullPath = node.path + "/" + parts[0];
            cMap[parts[0]] = {
                paths: [],
                obj: new PathTree(fullPath.replace(/^\//, ""))
            };
        }
        if (parts.length == 1) {
            cMap[parts[0]].obj.name = parts[0];
            cMap[parts[0]].obj.ctx = ctx;
        }
        else {
            var dir = parts.shift();
            var rest = parts.join("/");
            cMap[dir].paths.push([rest, ctx]);
            cMap[dir].obj.ctx = ctx;
        }
    });
    var keys = Object.keys(cMap);
    if (options.caseInsensitive)
        keys.sort(function (a, b) {
            return a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase());
        });
    else
        keys.sort();
    keys.forEach(function (key) {
        fill(cMap[key].obj, cMap[key].paths, options);
        node.children.push(cMap[key].obj);
    });
    if (options.directoriesFirst)
        node.children.sort(function (a, b) {
            if (a.children.length && !b.children.length)
                return -1;
            if (b.children.length && !a.children.length)
                return 1;
            return -1;
        });
    else if (options.directoriesLast)
        node.children.sort(function (a, b) {
            if (a.children.length && !b.children.length)
                return 1;
            if (b.children.length && !a.children.length)
                return -1;
            return -1;
        });
    return node;
}
function treeifyPaths(paths, options) {
    if (paths === void 0) { paths = []; }
    if (options === void 0) { options = {}; }
    var pathCtxs = isPaths(paths)
        ? paths.map(function (path) { return [path, undefined]; })
        : paths;
    return fill(new PathTree(), pathCtxs, options);
}
exports["default"] = treeifyPaths;
function isPaths(data) {
    return typeof data[0] === "string";
}
