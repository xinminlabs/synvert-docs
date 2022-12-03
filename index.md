---
layout: default
title: Synvert
---

Synvert (short for syntax + convert) provides a complete solution to rewrite (refactor) the source code.

Different than linter tools (e.g. rubocop) and codemod tools (e.g. jscodeshift),
synvert allows you to write snippet code to rewrite your source code.

The best advantage is that you don't need to learn all of the APIs,
synvert can generate the snippet code for you.

![Generate Snippet]({{ site.baseurl }}/img/generate-snippet.png){:width="50%"}

It supports Typescript, Javascript and Ruby so far.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Node Query](#node-query)
- [Node Mutation](#node-mutation)
- [Synvert Core](#synvert-core)
- [Synvert Snippets](#synvert-snippets)
- [Synvert CLI](#synvert-cli)
- [Synvert API](#synvert-api)
- [Synvert GUI](#synvert-gui)
  - [Features](#features)
  - [Download](#download)
- [Synvert VSCode Extension](#synvert-vscode-extension)
  - [Features](#features-1)
  - [Download](#download-1)
- [Synvert Web (Playground)](#synvert-web-playground)
- [Why named "Synvert"?](#why-named-synvert)

![Synvert Component]({{ site.baseurl }}/img/synvert-component.png)

## Node Query

It defines a NQL (node query language) and node rules to query AST nodes.

e.g. to match javascript code `string.match(/unicorn/)`

NQL can be
```
.CallExpression[expression=.PropertyAccessExpression[name=match]][arguments.length=1][arguments.0=.RegularExpressionLiteral]
```

Node rules can be
```javascript
{ nodeType: "CallExpression", expression: { nodeType: "PropertyAccessExpression", name: "match" }, arguments: { length: 1, 0: { nodeType: "RegularExpressionLiteral" } } }
```

The ruby version is [here](https://github.com/xinminlabs/node-query-ruby){:target="_blank"}.

The javascript version is [here](https://github.com/xinminlabs/node-query-javascript){:target="_blank"}.

## Node Mutation

It provides a set of APIs to rewrite AST node source code.

e.g. to replace javascript code `string.match(/unicorn/)` with `/unicorn/.test(string)`.

```javascript
{% raw %}replaceWith("{{arguments.0}}.test({{expression.expression}})");{% endraw %}
```

The ruby version is [here](https://github.com/xinminlabs/node-mutation-ruby){:target="_blank"}.

The javascript version is [here](https://github.com/xinminlabs/node-mutation-javascript){:target="_blank"}.

## Synvert Core

Synvert core defines a set of DSLs to rewrite code.

e.g. to find javascript code `string.match(/unicorn/)` and replace it with `/unicorn/.test(string)`.

```javascript
const Synvert = require("synvert-core");

new Synvert.Rewriter("javascript", "prefer-regexp-test", () => {
  description("string.match(/unicorn/) => /unicorn/.test(string)");

  configure({ parser: "typescript" });
  withinFiles(Synvert.ALL_FILES, () => {
    findNode(`.CallExpression[expression=.PropertyAccessExpression[name=match]][arguments.length=1][arguments.0=.RegularExpressionLiteral]`, () => {
      {% raw %}replaceWith("{{arguments.0}}.test({{expression.expression}})");{% endraw %}
    });
  });
});
```

The ruby version is [here](https://github.com/xinminlabs/synvert-core-ruby){:target="_blank"}.

The javascript version is [here](https://github.com/xinminlabs/synvert-core-javascript){:target="_blank"}.

## Synvert Snippets

Synvert snippets use the synvert core DSLs to define how to fine AST nodes and how to rewrite the AST node source code.

The ruby version is [here](https://github.com/xinminlabs/synvert-snippets-ruby){:target="_blank"}.

The javascript version is [here](https://github.com/xinminlabs/synvert-snippets-javascript){:target="_blank"}.

## Synvert CLI

Synvert CLI is a command line tool to run the synvert snippet to rewrite the source code.

The ruby version is [here](https://github.com/xinminlabs/synvert-ruby){:target="_blank"}.

The javascript version is [here](https://github.com/xinminlabs/synvert-javascript){:target="_blank"}.

## Synvert API

Synvert API is a web API to query snippets, generate snippet and parse snippet.

## Synvert GUI

Synvert GUI is a Windows and Mac app to use synvert.

### Features

- Generate a snippet based on your inputs and outputs.

![GUI Generate Snippet]({{ site.baseurl }}/img//gui-generate-snippet.png){:width="50%"}

- List search results based on the snippet code.

![GUI Search Results]({{ site.baseurl }}/img//gui-search-results.png){:width="50%"}

### Download

[Mac OS](https://download-synvert.xinminlabs.com/download/latest/osx)

[Windows x64](https://download-synvert.xinminlabs.com/download/latest/windows_64), it's not signed and Microsoft SmartScreen will block it.

## Synvert VSCode Extension

[Synvert VSCode extension](https://marketplace.visualstudio.com/items?itemName=xinminlabs.synvert){:target="_blank"} is a VSCode extension to use synvert.

### Features

- Search and replace. After adding a snippet, you can search the code, and replace all or any of the results.

![Search and Replace](demos/search-and-replace-1.gif)

- Search a snippet. You can search a snippet by group, name or description.

![Search snippet](demos/search-snippet-1.gif)

- Generate a snippet. You can generate a snippet by adding some input codes and output codes.

![Generate snippet](demos/generate-snippet-1.gif)

### Download

Synvert VSCode extension can be downloaded [here](https://marketplace.visualstudio.com/items?itemName=xinminlabs.synvert){:target="_blank"}

## Synvert Web (Playground)

[Synvert Playground](https://playground.synvert.net/){:target="_blank"} is a web interface to play with synvert.

[Node Playground](https://node-playground.synvert.net/){:target="_blank"} is a web interface to play with node query and node mutation.

## Why named "Synvert"?

The name "Synvert" is a combination of "Syntax" and "Convert".
