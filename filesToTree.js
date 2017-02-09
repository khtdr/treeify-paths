"use strict";
var Node = (function () {
    function Node(path) {
        if (path === void 0) { path = ''; }
        this.path = path;
        this.name = '';
        this.children = [];
    }
    return Node;
}());
exports.Node = Node;
;
function fill(node, files) {
    var cMap = {};
    files.forEach(function (file) {
        var parts = file.split('/');
        if (!cMap[parts[0]]) {
            var fullPath = node.path + '/' + parts[0];
            cMap[parts[0]] = {
                files: [],
                obj: new Node(fullPath.replace(/^\//, ''))
            };
        }
        if (parts.length == 1) {
            cMap[parts[0]].obj.name = parts[0];
        }
        else {
            var dir = parts.shift();
            var rest = parts.join('/');
            cMap[dir].files.push(rest);
        }
    });
    var keys = Object.keys(cMap);
    keys.sort();
    keys.forEach(function (key) {
        fill(cMap[key].obj, cMap[key].files);
        node.children.push(cMap[key].obj);
    });
    return node;
}
function filesToTree(files) {
    if (files === void 0) { files = []; }
    return fill(new Node, files);
}
exports.__esModule = true;
exports["default"] = filesToTree;
