---
layout: default
title: Synvert
---

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Install CLI](#install-cli)
- [Use CLI](#use-cli)
- [Synvert Snippet](#synvert-snippet)
  - [APIs](#apis)
    - [General APIs](#general-apis)
    - [Scope APIs](#scope-apis)
    - [Condition APIs](#condition-apis)
    - [Action APIs](#action-apis)
    - [Other APIs](#other-apis)
    - [Attributes](#attributes)
  - [Query Nodes](#query-nodes)
    - [Node Query Language](#node-query-language)
    - [Node Rules](#node-rules)
  - [Evaluated Value](#evaluated-value)

## Install CLI

First, instal synvert npm locally:

```
$ npm install -g synvert
```

Second, sync the official snippets: (this is optional, synvert is completely working with remote snippets)

```
$ synvert-javascript --sync
```

## Use CLI

You can rewrite your code by running a snippet

```
$ synvert-javascript --run javascript/no-unused-imports
```

Specify the repository path

```
$ synvert-javascript --run javascript/no-unused-imports --root-path ~/Sites/xinminlabs/awesomecode.io
```

Run a snippet from remote url

```
$ synvert-javascript --run https://raw.githubusercontent.com/synvert-hq/synvert-snippets-javascript/master/lib/javascript/no-unused-imports.js --root-path ~/Sites/xinminlabs/awesomecode.io
```

Run a snippet from local file path

```
$ synvert-javascript --run ~/.synvert-javascript/lib/javascript/no-unused-imports.js --root-path ~/Sites/xinminlabs/awesomecode.io
```

Skip paths

```
$ synvert-javascript --run javascript/no-unused-imports --skip-paths "node_modules/**,dist/**" --root-path ~/Sites/xinminlabs/awesomecode.io
```

Only paths

```
$ synvert-javascript --run javascript/no-unused-imports --only-paths frontend/src/ --root-path ~/Sites/xinminlabs/awesomecode.io
```

Show processing files when running a snippet.

```
$ synvert-javascript --run javascript/no-unused-imports --show-run-process --root-path ~/Sites/xinminlabs/awesomecode.io
```

## Synvert Snippet

The following is a typical synvert snippet:

```javascript
{% raw %}const Synvert = require("synvert-core");

new Synvert.Rewriter("jquery", "deprecate-event-shorthand", () => {
  ifNpm("jquery", ">= 3.6.0");

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, function () {
    // $('#test').click(function(e) { });
    // =>
    // $('#test').on('click', function(e) { });
    findNode(
      `.CallExpression
        [expression=.PropertyAccessExpression
          [expression IN (/^\\$/ /^jQuery/)]
          [name IN (click change submit)]]
        [arguments.length=1][arguments.0.nodeType IN (FunctionExpression ArrowFunction)]`,
      () => {
        replace("expression.name", { with: "on" });
        insert("'{{expression.name}}', ", { to: "arguments.0", at: "beginning" });
      }
    );
  });
});
{% endraw %}
```

The snippet only works when `jquery` npm is greater than or equal to 3.6.0, it finds all javascript files,
for each javascript file, it finds the `$().click(fn)` or `jQuery().submit(fn)` code and
replace with `$().on('click', fn)` and `$().on('submit', fn)` code.

### APIs

[synvert-core](https://github.com/synvert-hq/synvert-core-javascript) provides a set of APIs to query and mutate code based on AST nodes.

#### General APIs

* [configure](https://synvert-hq.github.io/synvert-core-javascript/Rewriter.html#configure) - configure the rewriter, set the parser.

```javascript
configure({ parser: Synvert.Parser.TYPESCRIPT });
```

* [description](https://synvert-hq.github.io/synvert-core-javascript/Rewriter.html#description) - describe what the snippet does

```javascript
description("describe what the snippet does");
```

* [ifNode](https://synvert-hq.github.io/synvert-core-javascript/Rewriter.html#ifNode) - check if node version is greater than or equal to the specified node version

```javascript
ifNode("18.0.0")
```

* [ifNpm](https://synvert-hq.github.io/synvert-core-javascript/Rewriter.html#ifNpm) - check the version of the specifid npm package

```javascript
ifNpm("jquery", ">= 3.6.0")
```

* [withinFiles](https://synvert-hq.github.io/synvert-core-javascript/Rewriter.html#withinFiles) - find specified files

```javascript
withinFiles("**/*.js", function () {
});
```

* [withinFile](https://synvert-hq.github.io/synvert-core-javascript/Rewriter.html#withinFile) - alias to withinFiles

```javascript
withinFile("test/utils.js", function () {
});
```

* [addFile](https://synvert-hq.github.io/synvert-core-javascript/Rewriter.html#addFile) - add a new file

```javascript
addFile("jest.config.js", `
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};
`.trim());
```

* [removeFile](https://synvert-hq.github.io/synvert-core-javascript/Rewriter.html#removeFile) - remove a file

```javascript
removeFile("jest.config.js");
```

* [addSnippet](https://synvert-hq.github.io/synvert-core-javascript/Rewriter.html#addSnippet) - call another snippet

```javascript
addSnippet("jquery", "deprecate-event-shorthand");
addSnippet("javascript/no-useless-constructor");
addSnippet("https://github.com/synvert-hq/synvert-snippets-javascript/blob/main/lib/javascript/no-useless-constructor.js");
addSnippet("/Users/flyerhzm/.synvert-javascript/lib/javascript/no-useless-constructor.js");
```

#### Scope APIs

You can use scope apis to find the matching nodes or move to the specified node.

* [withinNode](https://synvert-hq.github.io/synvert-core-javascript/Instance.html#withinNode) - recursively find matching ast nodes

```javascript
// import React from "react"
withNode({ nodeType: "ImportDeclaration", importClause: { name: "React" }, moduleSpecifier: { text: "react" }, }, () => {
});
```

* [withNode](https://synvert-hq.github.io/synvert-core-javascript/Instance.html#withNode) - alias to withNode

* [findNode](https://synvert-hq.github.io/synvert-core-javascript/Instance.html#findNode) - alias to withNode

```javascript
// constructor () {}
findNode(".Constructor[parameters.length=0][body.statements.length=0]", () => {
});
```

* [gotoNode](https://synvert-hq.github.io/synvert-core-javascript/Instance.html#gotoNode) - go to a child node

```javascript
// import React, { useEffect, useState } from "react";
gotoNode("importClause.namedBindings", () => {
});
```

#### Condition APIs

You can use condition apis to check if the current node matches the rules.

* [ifExistNode](https://synvert-hq.github.io/synvert-core-javascript/Instance.html#ifExistNode) - check if matching node exist in the child nodes

```javascript
ifExistNode(".CallExpression[expression=useState]", () => {
  // call function if matches
}, () => {
  // call function if does not match
});
```

* [unlessExistNode](https://synvert-hq.github.io/synvert-core-javascript/Instance.html#unlessExistNode) - check if matching node does not exist in the child nodes

```javascript
unlessExistNode('.ExpressionStatement[expression.text="use strict"]', () => {
  // call function if matches
}, () => {
  // call function if does not match
});
```

* [ifOnlyExistNode](https://synvert-hq.github.io/synvert-core-javascript/Instance.html#ifOnlyExistNode) - check if current node has only one child node and the child node matches

```javascript
ifOnlyExistNode(".ExpressionStatement[expression=.CallExpression[expression=.SuperKeyword]]", () => {
  // call function if there is only one child node and the child node matches
}, () => {
  // call function if does not match
});
```

* [ifAllNodes](https://synvert-hq.github.io/synvert-core-javascript/Instance.html#ifAlNodes) - check if all nodes match or not

```javascript
ifAllNodes(
  { nodeType: "BindingElement" },
  { match: { name: { in: ["foo", "bar"] } } },
  () => {
    // call function if name of all BindingElement nodes is either foo or bar
  },
  () => {
    // call function if does not match
  }
);
```

#### Action APIs

You can use action apis to rewrite the source code.

* [append](https://synvert-hq.github.io/synvert-core-javascript/Instance.html#append) - append the code to the bottom of the current node body

```javascript
// constructor() {
//   super();
// }
// =>
// constructor() {
//   super();
//   this.foo = "bar";
// }
findNode(".Constructor", () => {
  append('this.foo = "bar";');
});
```

* [prepend](https://synvert-hq.github.io/synvert-core-javascript/Instance.html#prepend) - prepend the code to the top of the current node body

```javascript
// constructor() {
//   this.foo = "bar";
// }
// =>
// constructor() {
//   super();
//   this.foo = "bar";
// }
findNode(".Constructor", () => {
  prepend("super();");
});
```

* [insert](https://synvert-hq.github.io/synvert-core-javascript/Instance.html#insert) - insert code
  * option `at`, `beginning` or `end` (default), insert code at the beginning or end of the current node
  * option `to`, insert code to the child node of the current node

```javascript
// NaN
// =>
// Number.NaN
findNode(`.Identifier[escapedText=NaN]`, () => {
  insert("Number.", { at: "beginning" });
});
```

```javascript
// const object = {
//   hello: 'hello',
//   allo: 'allo',
//   hola: 'hola'
// };
// =>
// const object = {
//   hello: 'hello',
//   allo: 'allo',
//   hola: 'hola',
// };
findNode(`.ObjectLiteralExpression[multiLine=true][properties.hasTrailingComma=false]`, function () {
  insert(",", { to: "properties.-1", at: "end" });
});
```

* [insertAfter](https://synvert-hq.github.io/synvert-core-javascript/Instance.html#insertAfter) - insert the code next to the current node

```javascript
// <Field
//   name="email"
//   type="email"
// />
// =>
// <Field
//   name="email"
//   type="email"
//   autoComplete="email"
// />
findNode(
  `.JsxSelfClosingElement
    [tagName=Field]
    [attributes=.JsxAttributes
      [properties not includes .JsxAttribute[name=autoComplete]]
      [properties includes .JsxAttribute[name=name][initializer=.StringLiteral[text="email"]]]
      [properties includes .JsxAttribute[name=type][initializer=.StringLiteral[text="email"]]]
    ]`,
  () => {
    insertAfter(`  autoComplete="email"`, { to: "attributes.properties.-1" });
  }
);
```

* [insertBefore](https://synvert-hq.github.io/synvert-core-javascript/Instance.html#insertBefore) - insert the code previous to the current node

```javascript
// <Field
//   name="email"
//   type="email"
// />
// =>
// <Field
//   autoComplete="email"
//   name="email"
//   type="email"
// />
findNode(
  `.JsxSelfClosingElement
    [tagName=Field]
    [attributes=.JsxAttributes
      [properties not includes .JsxAttribute[name=autoComplete]]
      [properties includes .JsxAttribute[name=name][initializer=.StringLiteral[text="email"]]]
      [properties includes .JsxAttribute[name=type][initializer=.StringLiteral[text="email"]]]
    ]`,
  () => {
    insertBefore(`  autoComplete="email"`, { to: "attributes.properties.0" });
  }
);
```

* [replace](https://synvert-hq.github.io/synvert-core-javascript/Instance.html#replace) - replace the code of specified child nodes

```javascript
{% raw %}// foo.substr(start, length);
// =>
// foo.slice(start, start + length);
findNode(`.CallExpression[expression=.PropertyAccessExpression[name=substr]][arguments.length=2]`, () => {
  replace("arguments.1", { with: "{{arguments.0}} + {{arguments.1}}" });
  replace("expression.name", { with: "slice" });
});{% endraw %}
```

* [deleteNode](https://synvert-hq.github.io/synvert-core-javascript/Instance#deleteNode) - delete code the code of specified child nodes

```javascript
{% raw %}// const someObject = {
//   cat: cat,
//   dog: dog,
//   bird: bird
// }
// =>
// const someObject = {
//   cat,
//   dog,
//   bird
// }
findNode(`.PropertyAssignment[name=.Identifier][initializer=.Identifier][key="{{value}}"]`, () => {
  deleteNode(["semicolon", "initializer"]);
});{% endraw %}
```

* [remove](https://synvert-hq.github.io/synvert-core-javascript/Instance.html#remove) - remove the whole code of current node

```javascript
// class A {
//   constructor () {
//   }
// }
// =>
// class A {
// }
findNode(".Constructor[parameters.length=0][body.statements.length=0]", () => {
  remove();
});
```

* [replaceWith](https://synvert-hq.github.io/synvert-core-javascript/Instance.html#replaceWith) - replace the whole code of current node

```javascript
{% raw %}// string.match(/unicorn/)
// =>
// /unicorn/.test(string)
findNode(
  `.CallExpression[expression=.PropertyAccessExpression[name=match]][arguments.0=.RegularExpressionLiteral][arguments.length=1]`,
  () => {
    replaceWith("{{arguments.0}}.test({{expression.expression}})");
  }
);{% endraw %}
```

* [noop](https://synvert-hq.github.io/synvert-core-javascript/Instance.html#noop) - no operation

#### Other APIs

* [callHelper](https://synvert-hq.github.io/synvert-core-javascript/Instance.html#callHelper) - call a helper to run shared code

```javascript
// define helper in helpers/remove-imports.js
callHelper("helpers/remove-imports", { importNames: ["Component", "Fragment"] })
```

* [indent](https://synvert-hq.github.io/synvert-core-javascript/Instance#indent) - set proper indent of a string code

#### Attributes

* [filePath](https://synvert-hq.github.io/synvert-core-javascript/Instance.html#filePath) - get the file path
* [currentNode](https://synvert-hq.github.io/synvert-core-javascript/Instance.html#currentNode) - current ast node
* [mutationAdapter](https://synvert-hq.github.io/synvert-core-javascript/Instance.html#mutationAdapter) - get a [mutation adapter](https://github.com/synvert-hq/node-mutation-javascript/blob/main/src/adapter.ts) to get some helper methods

### Query Nodes

Synvert uses [node_query](https://www.npmjs.com/package/@synvert-hq/node-query) npm to query nodes,
so that you can use NQL (node query language) or node rules to query AST nodes.

#### Node Query Language

##### nql matches node type

```
.ClassDeclaration
```

It matches ClassDeclaration node

##### nql matches attribute

```
.NewExpression[expression=UserAccount]
```

It matches NewExpression node whose expression value is UserAccount

```
.NewExpression[arguments.0="Murphy"][arguments.-1=1]
```

It matches NewExpression node whose first argument is "Murphy" and second argument is 1

##### nql matches nested attribute

```
.NewExpression[expression.escapedText=UserAccount]
```

It matches NewExpression node whose escapedText of expression is UserAccount

##### nql matches evaluated value

```
{% raw %}.PropertyAssignment[name="{{initializer}}"]{% endraw %}
```

It matches PropertyAssignement node whose node value of name matches node value of intiailizer

##### nql matches nested selector

```
.VariableDeclaration[initializer=.NewExpression[expression=UserAccount]]
```

It matches VariableDelclaration node whose initializer is a NewExpression node whose expression is UserAccount

##### nql matches property

```
.NewExpression[arguments.length=2]
```

It matches NewExpression node whose arguments length is 2

##### nql matches operators

```
.NewExpression[expression=UserAccount]
```

Value of expression is equal to UserAccount

```
.NewExpression[expression^=User]
```

Value of expression starts with User

```
.NewExpression[expression$=Account]
```

Value of expression ends with Account

```
.NewExpression[expression*=Acc]
```

Value of expression contains Account

```
.NewExpression[arguments.length!=0]
```

Length of arguments is not equal to 0

```
.NewExpression[arguments.length>=2]
```

Length of arguments is greater than or equal to 2

```
.NewExpression[arguments.length>1]
```

Length of arguments is greater than 1

```
.NewExpression[arguments.length<=2]
```

Length of arguments is less than or equal to 2

```
.NewExpression[arguments.length<3]
```

Length of arguments is less than 3

```
.NewExpression[arguments INCLUDES "Murphy"]
```

It matches NewExpressioin node one of whose arguments is "Murphy"

```
.NewExpression[arguments NOT INCLUDES "Murphy"]
```

It matches NewExpressioin node none of whose arguments is "Murphy"

```
.ClassDeclaration[name IN (User Account UserAccount)]
```

Value of name matches any of User, Account and UserAccount

```
.ClassDeclaration[name NOT IN (User Account)]
```

Value of name does not match all of User and Account

```
.ClassDeclaration[name=~/^User/]
```

Value of name starts with User

```
.ClassDeclaration[name!=~/^User/]
```

Value of name does not start with User

```
.ClassDeclaration[name IN (/User/ /Account/)]
```

Value of name matches any of /User/ and /Account/

##### nql matches array node attribute

```
.NewExpression[arguments=("Murphy" 1)]
```

It matches NewExpressioin node whose arguments are ["Murphy", 1]

##### nql matches * in attribute key

```
.Constructor[parameters.*.name IN (name id)]
```

It matches Constructor whose parameters' names are all in [name id]

##### nql matches multiple selectors

###### Descendant combinator

```
.ClassDeclaration .Constructor
```

It matches Constructor node whose ancestor matches the ClassDeclaration node

###### Child combinator

```
.ClassDeclaration > .PropertyDeclaration
```

It matches PropertyDeclaration node whose parent matches the ClassDeclartion node

###### Adjacent sibling combinator

```
.PropertyDeclaration[name=name] + .PropertyDeclaration
```

It matches PropertyDeclaration node only if it immediately follows the PropertyDeclaration whose name is name

###### General sibling combinator

```
.PropertyDeclaration[name=name] ~ .PropertyDeclaration
```

It matches PropertyDeclaration node only if it follows the PropertyDeclaration whose name is name

##### nql matches goto scope

```
.ClassDeclaration members .PropertyDeclaration
```

It matches PropertyDeclaration node who is in the members of ClassDeclaration node

##### nql matches :has and :not_has pseudo selector

```
.ClassDeclaration:has(.Constructor)
```

It matches ClassDeclaration node if it has a Constructor node

```
.ClassDeclaration:not_has(.Constructor)
```

It matches ClassDeclaration node if it does not have a Constructor node

##### nql matches :first-child and :last-child selector

```
.MethodDefinition:first-child
```

It matches the first MethodDefinition node

```
.MethodDefinition:last-child
```

It matches the last MethodDefinition node

##### nql matches multiple expressions

```
.JSXOpeningElement[name=Fragment], .JSXClosingElement[name=Fragment]
```

It matches JSXOpeningElement node whose name is Fragment or JSXClosingElement node whose name is Fragment

#### Node Rules

##### rules matches node type

```
{ nodeType: "ClassDeclaration" }
```

It matches ClassDeclaration node

##### rules matches attribute

```
{ nodeType: "NewExpression", expression: "UserAccount" }
```

It matches NewExpression node whose expression value is UserAccount

```
{ nodeType: "NewExpression", arguments: { 0: "Murphy", 1: 1 } }
```

It matches NewExpression node whose first argument is "Murphy" and second argument is 1

##### rules matches nested attribute

```
{ nodeType: "NewExpression", expression: { escapedText: "UserAccount" } }
```

It matches NewExpression node whose escapedText of expression is UserAccount

##### rules matches evaluated value

```
{% raw %}{ nodeType: "PropertyAssignment", name: "{{initializer}}" }{% endraw %}
```

It matches PropertyAssignement node whose node value of name matches node value of intiailizer

##### rules matches nested selector

```
{ nodeType: "VariableDeclaration", initializer: { nodeType: "NewExpression", expression: "UserAccount" } }
```

It matches VariableDelclaration node whose initializer is a NewExpression node whose expression is UserAccount

##### rules matches property

```
{ nodeType: "NewExpression", arguments: { length: 2 } }
```

It matches NewExpression node whose arguments length is 2

##### rules matches operators

```
{ nodeType: "NewExpression", expression: "UserAccount" }
```

Value of expression is equal to UserAccount

```
{ nodeType: "NewExpression", arguments: { length: { not: 0 } } }
```

Length of arguments is not equal to 0

```
{ nodeType: "NewExpression", arguments: { length: { gte: 2 } } }
```

Length of arguments is greater than or equal to 2

```
{ nodeType: "NewExpression", arguments: { length: { gt: 1 } } }
```

Length of arguments is greater than 1

```
{ nodeType: "NewExpression", arguments: { length: { lte: 2 } } }
```

Length of arguments is less than or equal to 2

```
{ nodeType: "NewExpression", arguments: { length: { lt: 3 } } }
```

Length of arguments is less than 3

```
{ nodeType: "NewExpression", arguments: { includes: "Murphy" } }
```

It matches NewExpressioin node one of whose arguments is "Murphy"

```
{ nodeType: "NewExpression", arguments: { notIncludes: "Murphy" } }
```

It matches NewExpressioin node none of whose arguments is "Murphy"

```
{ nodeType: "ClassDeclaration", name: { in: [User Account UserAccount] } }
```

Value of name matches any of User, Account and UserAccount

```
{ nodeType: "ClassDeclaration", name: { notIn: [User Account] } }
```

Value of name does not match all of User and Account

```
{ nodeType: "ClassDeclaration", name: /^User/ }
```

Value of name starts with User

```
{ nodeType: "ClassDeclaration", name: { not: /^User/ } }
```

Value of name does not start with User

```
{ nodeType: "ClassDeclaration", name: { in: [/User/, /Account/] } }
```

Value of name matches any of /User/ and /Account/

##### rules matches array node attribute

```
{ nodeType: "NewExpression", arguments: ["Murphy", 1] }
```

It matches NewExpressioin node whose arguments are ["Murphy", 1]

### Evaluated Value

Evaluated value uses syntax `{%raw%}{{ ... }}{%endraw%}` to fetch child node or value, e.g.

```javascript
{% raw %}// string.match(/unicorn/)
// =>
// /unicorn/.test(string)
replaceWith("{{arguments.0}}.test({{expression.expression}})");{% endraw %}
```
