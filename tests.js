const assert = require("assert");
const treeifyPaths = require(".").default;
const PathTree = require(".").PathTree;

function match(value, shape) {
  for (let key in shape) {
    if (key == "children") {
      assert.equal(value.children.length, shape.children.length, "child count");
      for (let i = 0, max = value.children.length; i < max; i++) {
        match(value.children[i], shape.children[i]);
      }
    } else {
      assert.equal(value[key], shape[key], "attribute: <" + key + ">");
    }
  }
}

describe("treeifyPaths([...arguments])", () => {
  describe("arguments: none", () => {
    it("should return an empty object", () => {
      match(treeifyPaths(), {
        constructor: PathTree,
        children: [],
      });
    });
  });

  describe("arguments: empty list", () => {
    it("should return an empty object", () => {
      match(treeifyPaths([]), {
        constructor: PathTree,
        children: [],
      });
    });
  });

  describe("arguments: list with a single file", () => {
    it("should return a single file", () => {
      match(treeifyPaths(["index"]), {
        constructor: PathTree,
        children: [{ name: "index", path: "index", constructor: PathTree }],
      });
    });
    it("should ignore leading slashes", () => {
      match(treeifyPaths(["/index"]), {
        constructor: PathTree,
        children: [{ name: "index", path: "index", constructor: PathTree }],
      });
    });
    it("should return with nested children", () => {
      match(treeifyPaths(["path/to/index"]), {
        constructor: PathTree,
        children: [
          {
            name: "",
            path: "path",
            constructor: PathTree,
            children: [
              {
                name: "",
                path: "path/to",
                constructor: PathTree,
                children: [
                  {
                    name: "index",
                    path: "path/to/index",
                    constructor: PathTree,
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      });
    });
  });

  describe("arguments: multiple file names", () => {
    it("should return with nested children", () => {
      match(treeifyPaths(["path", "path/to/index", "x/y/z", "path/here"]), {
        constructor: PathTree,
        children: [
          {
            name: "path",
            path: "path",
            constructor: PathTree,
            children: [
              {
                name: "here",
                path: "path/here",
                constructor: PathTree,
                children: [],
              },
              {
                name: "",
                path: "path/to",
                constructor: PathTree,
                children: [
                  {
                    name: "index",
                    path: "path/to/index",
                    constructor: PathTree,
                    children: [],
                  },
                ],
              },
            ],
          },
          {
            name: "",
            path: "x",
            constructor: PathTree,
            children: [
              {
                name: "",
                path: "x/y",
                constructor: PathTree,
                children: [
                  {
                    name: "z",
                    path: "x/y/z",
                    constructor: PathTree,
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      });
    });
    it("should ignore perimeter slashes and empty or redundant entries", () => {
      match(treeifyPaths(["/","/index/", "", "/index"]), {
        constructor: PathTree,
        children: [{ name: "index", path: "index", constructor: PathTree }],
      });
    });
    it("should alphabetize", () => {
      match(treeifyPaths(["d", "a", "b/c", "b/b/b", "b/a", "c/d", "b"]), {
        constructor: PathTree,
        children: [
          { name: "a", path: "a", constructor: PathTree, children: [] },
          {
            name: "b",
            path: "b",
            constructor: PathTree,
            children: [
              { name: "a", path: "b/a", constructor: PathTree, children: [] },
              {
                name: "",
                path: "b/b",
                constructor: PathTree,
                children: [
                  {
                    name: "b",
                    path: "b/b/b",
                    constructor: PathTree,
                    children: [],
                  },
                ],
              },
              { name: "c", path: "b/c", constructor: PathTree, children: [] },
            ],
          },
          {
            name: "",
            path: "c",
            constructor: PathTree,
            children: [
              { name: "d", path: "c/d", constructor: PathTree, children: [] },
            ],
          },
          { name: "d", path: "d", constructor: PathTree, children: [] },
        ],
      });
    });
    it("should alphabetize case-sensitve", () => {
      match(treeifyPaths(["d", "a", "B/c", "B/b/b", "B/a", "c/d", "B"]), {
        constructor: PathTree,
        children: [
          {
            name: "B",
            path: "B",
            constructor: PathTree,
            children: [
              { name: "a", path: "B/a", constructor: PathTree, children: [] },
              {
                name: "",
                path: "B/b",
                constructor: PathTree,
                children: [
                  {
                    name: "b",
                    path: "B/b/b",
                    constructor: PathTree,
                    children: [],
                  },
                ],
              },
              { name: "c", path: "B/c", constructor: PathTree, children: [] },
            ],
          },
          { name: "a", path: "a", constructor: PathTree, children: [] },
          {
            name: "",
            path: "c",
            constructor: PathTree,
            children: [
              { name: "d", path: "c/d", constructor: PathTree, children: [] },
            ],
          },
          { name: "d", path: "d", constructor: PathTree, children: [] },
        ],
      });
      match(
        treeifyPaths(["d", "a", "B/c", "B/b/b", "B/a", "c/d", "B"], {
          caseInsensitive: true,
        }),
        {
          constructor: PathTree,
          children: [
            { name: "a", path: "a", constructor: PathTree, children: [] },
            {
              name: "B",
              path: "B",
              constructor: PathTree,
              children: [
                { name: "a", path: "B/a", constructor: PathTree, children: [] },
                {
                  name: "",
                  path: "B/b",
                  constructor: PathTree,
                  children: [
                    {
                      name: "b",
                      path: "B/b/b",
                      constructor: PathTree,
                      children: [],
                    },
                  ],
                },
                { name: "c", path: "B/c", constructor: PathTree, children: [] },
              ],
            },
            {
              name: "",
              path: "c",
              constructor: PathTree,
              children: [
                { name: "d", path: "c/d", constructor: PathTree, children: [] },
              ],
            },
            { name: "d", path: "d", constructor: PathTree, children: [] },
          ],
        }
      );
    });
    it("should not respect directories", () => {
      match(treeifyPaths(["a-file.txt", "b/another.txt"]), {
        constructor: PathTree,
        children: [
          {
            name: "a-file.txt",
            path: "a-file.txt",
            constructor: PathTree,
            children: [],
          },
          {
            name: "",
            path: "b",
            constructor: PathTree,
            children: [
              {
                name: "another.txt",
                path: "b/another.txt",
                constructor: PathTree,
                children: [],
              },
            ],
          },
        ],
      });
      match(
        treeifyPaths(["a-file.txt", "b/another.txt"], {
          directoriesFirst: true,
        }),
        {
          constructor: PathTree,
          children: [
            {
              name: "",
              path: "b",
              constructor: PathTree,
              children: [
                {
                  name: "another.txt",
                  path: "b/another.txt",
                  constructor: PathTree,
                  children: [],
                },
              ],
            },
            {
              name: "a-file.txt",
              path: "a-file.txt",
              constructor: PathTree,
              children: [],
            },
          ],
        }
      );
      match(
        treeifyPaths(["b-file.txt", "a/another.txt"], {
          directoriesLast: true,
        }),
        {
          constructor: PathTree,
          children: [
            {
              name: "b-file.txt",
              path: "b-file.txt",
              constructor: PathTree,
              children: [],
            },
            {
              name: "",
              path: "a",
              constructor: PathTree,
              children: [
                {
                  name: "another.txt",
                  path: "a/another.txt",
                  constructor: PathTree,
                  children: [],
                },
              ],
            },
          ],
        }
      );
    });
    it("should ignore duplicates", () => {
      match(treeifyPaths(["a", "a", "a"]), {
        constructor: PathTree,
        children: [{ name: "a", path: "a", children: [] }],
      });
    });
    it("should be able to target directories", () => {
      match(treeifyPaths(["a", "a/file.txt"]), {
        constructor: PathTree,
        children: [
          {
            name: "a",
            path: "a",
            children: [
              {
                path: "a/file.txt",
                name: "file.txt",
                children: [],
              },
            ],
          },
        ],
      });
      match(treeifyPaths(["a/file.txt"]), {
        constructor: PathTree,
        children: [
          {
            name: "",
            path: "a",
            children: [
              {
                path: "a/file.txt",
                name: "file.txt",
                children: [],
              },
            ],
          },
        ],
      });
    });
  });
});
