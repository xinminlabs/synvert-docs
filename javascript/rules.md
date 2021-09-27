---
layout: javascript
title: Rules
---

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
node.toSource()
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

If you want to get more, please read [here][1].

[1]: https://github.com/xinminlabs/synvert-core-javascript/blob/master/lib/ast-node-ext.js
