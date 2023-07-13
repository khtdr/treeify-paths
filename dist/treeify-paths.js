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
Object.defineProperty(exports, "__esModule", { value: true });
exports.treeifyPaths = exports.Node = exports.PathTree = void 0;
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
    var children = {};
    paths.forEach(function (_a) {
        var file = _a[0], ctx = _a[1];
        var parts = stripSlashes(file).split("/");
        var dir = parts[0];
        if (!children[dir]) {
            var fullPath = "".concat(node.path, "/").concat(parts[0]);
            children[dir] = {
                paths: [],
                obj: new PathTree(stripSlashes(fullPath)),
            };
        }
        if (parts.length == 1) {
            children[dir].obj.name = dir;
            children[dir].obj.ctx = ctx;
        }
        else {
            parts.shift();
            var rest = parts.join("/");
            children[dir].paths.push([rest, ctx]);
            children[dir].obj.ctx = ctx;
        }
    });
    var keys = Object.keys(children);
    if (options.caseInsensitive)
        keys.sort(function (a, b) {
            return a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase());
        });
    else
        keys.sort();
    keys.forEach(function (key) {
        var child = children[key].obj;
        fill(child, children[key].paths, options);
        if (child.name || child.path || child.children.length)
            node.children.push(child);
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
exports.treeifyPaths = treeifyPaths;
exports.default = treeifyPaths;
var stripSlashes = function (path) {
    return path
        .replace(/^\/*/, "")
        .replace(/\/*$/, "");
};
var isPaths = function (data) {
    return typeof data[0] === "string";
};
