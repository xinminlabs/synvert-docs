---
layout: javascript
title: DSL
---

Synvert provides a simple dsl to define a snippet.

```javascript
const Synvert = require("synvert-core");

new Synvert.Rewriter("group_name", "snippet_name", () => {
  description "description"

  ifNpm(npm_name, npm_version)

  withinFiles(file_pattern, function () {
    withinNode(rules, () => {
      remove();
    });
  });

  withinFiles(files_pattern, function () {
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
ifNpm "espree", "= 2.0.0"
ifNpm "espree", "> 2.0.0"
ifNpm "espree", "< 2.0.0"
ifNpm "espree", ">= 2.0.0"
ifNpm "espree", "<= 2.0.0"
```

### withinFile / withinFiles

Find files according to file pattern, the function will be executed
only for the matching files.

```javascript
withinFile("test/utils.js", function () {
  // find nodes
  // check nodes
  // add / replace / remove code
});
```

```javascript
withinFiles("test/**/*.spec.js", function () {
  // find nodes
  // check nodes
  // add / replace / remove code
});
```

### withNode / withinNode

Find acorns nodes according to the [rules][1], the function will be executed
for the matching nodes.

```javascript
withNode({ type: "ExpressionStatement", directive: "use strict" }, () => {
  // check nodes
  // add / replace / remove code
});
```

```javascript
withNode({ type: "CallExpression", callee: { type: "MemberExpression", property: 'trimLeft' } }, () => {
  // check nodes
  // add / replace / remove code
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

Check if the node matches [rules][1] exists, if matches, then executes
the function.

```javascript
ifExistNode({ type: 'ExpressionStatement', directive: "use strict" }, () => {
  // add / replace / remove code
});
```

### unlessExistNode

Check if the node matches [rules][1] does not exist, if does not match,
then executes the function.

```javascript
unlessExistNode({ type: 'ExpressionStatement', directive: "use strict" }, () => {
  // add / replace / remove code
});
```

### ifOnlyExistNode

Check if the current node contains only one child node and the child
node matches [rules][1], if matches, then executes the node.

```javascript
ifOnlyExistNode({ type: "ExpressionStatement", directive: "use strict" }, () => {
  // add / replace / remove code
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
insert(",", { at: "end" });
insert("async ", { at: "beginning" });
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
withNode({ type: "ExpressionStatement", directive: "use strict" }, () => {
  remove();
});
```

### deleteNode

Delete the child nodes

```javascript
withNode({ type: "MethodDefinition", key: property, value: { async: true } }, function () {
  deleteNode("async");
});
```

### addSnippet

Add other snippet, it's easy to reuse other snippets.

```javascript
addSnippet("javascript", "prefer-class-properties");
```

Check out the source code of DSLs here: [this][2] and [that][3]

[1]: /javascript/rules/
[2]: https://github.com/xinminlabs/synvert-core-javascript/blob/master/lib/rewriter.js
[3]: https://github.com/xinminlabs/synvert-core-javascript/blob/master/lib/instance.js
