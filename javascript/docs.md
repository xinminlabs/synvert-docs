---
layout: javascript
title: Terms
---

## Terms

### Snippet

Snippet is a piece of code to define what code need to convert and how
to convert the code.

### Rewriter

Rewriter is the top level namespace in a snippet.

One rewriter checks if the dependency version matches.

One rewriter contains one or many instances.

### Instance

Instance is an execution unit, it finds specified ast nodes, checks
if the nodes match some conditions, then add, replace or remove code.

One instance can contains any scopes or conditions.

### Scope

Scope just likes its name, different scope points to different
current node.

One scope defines some rules, it finds new nodes and changes
current node to matching node.

### Condition

Condition is used to check if the node matches the rules, condition
won't change the node scope.

### Action

Action does some real action, e.g. insert / replace / delete code.

## Rules

synvert compares acorns nodes with attributes, e.g. `type`, `property` and `arguments`, it
matches only when all of attributes match.

```javascript
// matches .trimleft()
{ type: "CallExpression", callee: { type: "MemberExpression", property: "trimLeft" }, arguments: { length: 0 } }
```

## Source code to acorns node

### javascript code

```javascript
const espree = require("espree");

const source = `
  class Button extends Component {
    constructor(props) {
      super(props);
    }
  }
`
const node = espree.parse(source, { ecmaVersion: "latest", sourceType: "module" });

// {
//   "type": "ClassDeclaration",
//   "id": {
//     "type": "Identifier",
//     "name": "Button"
//   },
//   "superClass": {
//     "type": "Identifier",
//     "name": "Component"
//   },
//   "body": {
//     "type": "ClassBody",
//     "body": [
//       {
//         "type": "MethodDefinition",
//         "static": false,
//         "computed": false,
//         "key": {
//           "type": "Identifier",
//           "name": "constructor"
//         },
//         "kind": "constructor",
//         "value": {
//           "type": "FunctionExpression",
//           "id": null,
//           "expression": false,
//           "generator": false,
//           "async": false,
//           "params": [
//             {
//               "type": "Identifier",
//               "name": "props"
//             }
//           ],
//           "body": {
//             "type": "BlockStatement",
//             "body": [
//               {
//                 "type": "ExpressionStatement",
//                 "expression": {
//                   "type": "CallExpression",
//                   "callee": {
//                     "type": "Super",
//                   },
//                   "arguments": [
//                     {
//                       "type": "Identifier",
//                       "name": "props"
//                     }
//                   ],
//                   "optional": false
//                 }
//               }
//             ]
//           }
//         }
//       }
//     ]
//   }
// }
```

## Node method

### toSource

return exactly source code for an acorns node.

```javascript
const source = `const user = { firstName: "Richard", lastName: "Huang" }`;
const node = espree.parse(source, { ecmaVersion: "latest", sourceType: "module" });
node.toSource()
// const user = { firstName: "Richard", lastName: "Huang" }
```

### childNodeSource

returns exactly source code for an acorns child node.

```javascript
const source = `const user = { firstName: "Richard", lastName: "Huang" }`;
const node = espree.parse(source, { ecmaVersion: "latest", sourceType: "module" });
node.childNodeSource("declarations.0.init.properties.0.value.value")
// Richard
```

### fixIndentToSource

return exactly source code for an acorns node with indent fixed.

```javascript
const source = `
                const user = {
                  firstName: "Richard",
                  lastName: "Huang"
                }
`;
const node = espree.parse(source, { ecmaVersion: "latest", sourceType: "module" });
node.fixIndentToSource()
// const user = {
//   firstName: "Richard",
//   lastName: "Huang"
// }
```

## Acorns node operator

### not

```javascript
const source = `const user = { firstName: "Richard", lastName: "Huang" }`;
const node = espree.parse(source, { ecmaVersion: "latest", sourceType: "module" });
```

matches

```javascript
{ type: 'VariableDeclarator', kind: { "const" } }
{ type: 'VariableDeclarator', kind: { not: "let" } }
```

### in

```javascript
const source = `class Synvert {}`;
const node = espree.parse(source, { ecmaVersion: "latest", sourceType: "module" });
```

matches

```javascript
{ type: "ClassDeclaration", id: { in: ["FooBar", "Synvert"] } }
```

### notIn

```javascript
const source = `class Synvert {}`;
const node = espree.parse(source, { ecmaVersion: "latest", sourceType: "module" });
```

matches

```javascript
{ type: "ClassDeclaration", id: { notIn: ["Foo", "Bar"] } }
```

If you want to get more, please read [here](https://github.com/xinminlabs/synvert-core-javascript/blob/master/lib/ast-node-ext.js)

## DSL

Synvert provides a simple dsl to define a snippet.

```javascript
const Synvert = require("synvert-core");

new Synvert.Rewriter("group_name", "snippet_name", () => {
  description("description")

  ifNode(nodeVersion)
  ifNpm(npmName, npmVersion)

  withinFiles(filePattern, function () {
    withinNode(rules, () => {
      remove();
    });
  });

  withinFiles(filesPattern, function () {
    withNode(rules, () => {
      unlessExistNode(rules, () => {
        append(code);
      });
    });
  });
});
```

### description

Describe what the snippet does.

```javascript
description("description of snippet");
```

### ifNode

Checks if current nodejs version is greater than or equal to the
specified version.

```javascript
ifNode("10.0.0")
```

### ifNpm

Checks the npm package version in `package-lock.json` or `yarn.lock`,
if npm version is less than, greater than or equal to the version in `ifNpm`,
the snippet will be executed, otherwise, the snippet will be ignored.

```javascript
ifNpm("espree", "= 2.0.0")
ifNpm("espree", "> 2.0.0")
ifNpm("espree", "< 2.0.0")
ifNpm("espree", ">= 2.0.0")
ifNpm("espree", "<= 2.0.0")
```

### withinFile / withinFiles

Find files according to file pattern, the function will be executed
only for the matching files.

```javascript
withinFile("test/utils.js", function () {
  // find nodes
  // check nodes
  // insert / replace / delete code
});
```

```javascript
withinFiles("test/**/*.spec.js", function () {
  // find nodes
  // check nodes
  // insert / replace / delete code
});
```

### withNode / withinNode

Find acorns nodes according to the rules, the function will be executed
for the matching nodes.

```javascript
withNode({ type: "ExpressionStatement", directive: "use strict" }, () => {
  // check nodes
  // insert / replace / delete code
});
```

```javascript
withNode({ type: "CallExpression", callee: { type: "MemberExpression", property: 'trimLeft' } }, () => {
  // check nodes
  // insert / replace / delete code
});
```

### gotoNode

Go to the specified child code.

```javascript
withNode({ type: "MethodDefinition", key: "handleClick", value: { async: true } }, () => {
  gotoNode("key", () => {
    // change code in method key
  });
});
```

```javascript
withNode({ type: "MethodDefinition", key: "handleClick", value: { async: true } }, () => {
  gotoNode("value.body", () => {
    // change code in method value body
  });
});
```

### ifExistNode

Check if the node matches rules exists, if matches, then executes the function.

```javascript
ifExistNode({ type: 'ExpressionStatement', directive: "use strict" }, () => {
  // insert / replace / delete code
});
```

### unlessExistNode

Check if the node matches rules does not exist, if does not match,
then executes the function.

```javascript
unlessExistNode({ type: 'ExpressionStatement', directive: "use strict" }, () => {
  // insert / replace / delete code
});
```

### ifOnlyExistNode

Check if the current node contains only one child node and the child
node matches rules, if matches, then executes the node.

```javascript
ifOnlyExistNode({ type: "ExpressionStatement", directive: "use strict" }, () => {
  // insert / replace / delete code
});
```

### append

Add the code at the bottom of the current node body.

```javascript
append("use strict");
```

### prepend

Add the code at the top of the current node body.

```javascript
prepend("use strict");
```

### insert

Insert the code at the beginning or end of the current node.

```javascript
insert("async ", { at: "beginning" });
insert(",", { to: "arguments.last", at: "end" });
```

### replaceWith

Replace the current node with the code.

```javascript
{% raw %}
replaceWith("export {{expression.right}}");
{% endraw %}
```

### replace

Reaplce child node with the code.

```javascript
replace("callee", { with: "Object.hasOwn" });
```

### remove

Remove the current node.

```javascript
remove();
```

### deleteNode

Delete the child nodes

```javascript
deleteNode(['object', 'dot']);
```

### addSnippet

Add other snippet, it's easy to reuse other snippets.

```javascript
addSnippet("javascript", "prefer-class-properties");
```
