---
layout: default
title: Synvert
---

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

![Synvert Component]({{ site.baseurl }}/assets/img/synvert-component.png){:width="50%"}

## Node Query

It defines a NQL (node query language) and node rules to query AST nodes.

The ruby version is [here](https://github.com/xinminlabs/node-query-ruby){:target="_blank"}.

The javascript/typescript version is [here](https://github.com/xinminlabs/node-query-javascript){:target="_blank"}.

## Node Mutation

It provides a set of APIs to rewrite AST node source code.

The ruby version is [here](https://github.com/xinminlabs/node-mutation-ruby){:target="_blank"}.

The javascript/typescript version is [here](https://github.com/xinminlabs/node-mutation-javascript){:target="_blank"}.

## Synvert Core

Synvert core makes use of node query and node mutation to define a set of DSLs to query and rewrite code.

The ruby version is [here](https://github.com/xinminlabs/synvert-core-ruby){:target="_blank"}.

The javascript/typescript version is [here](https://github.com/xinminlabs/synvert-core-javascript){:target="_blank"}.

## Synvert Snippets

Synvert snippets use the synvert core DSLs to define how to fine AST nodes and how to rewrite the AST node source code.

The ruby version is [here](https://github.com/xinminlabs/synvert-snippets-ruby){:target="_blank"}.

The javascript/typescript version is [here](https://github.com/xinminlabs/synvert-snippets-javascript){:target="_blank"}.

## Synvert CLI

Synvert CLI is a command line tool to run the synvert snippet to rewrite the source code.

The ruby version is [here](https://github.com/xinminlabs/synvert-ruby){:target="_blank"}.

The javascript/typescript version is [here](https://github.com/xinminlabs/synvert-javascript){:target="_blank"}.

## Synvert API

Synvert API is a web API to query snippets, generate snippet and parse snippet.

## Synvert GUI

Synvert GUI is a Windows and Mac app to use synvert.

### Features

- Generate a snippet based on your inputs and outputs.

![GUI Generate Snippet]({{ site.baseurl }}/assets/img/gui-generate-snippet.png){:width="50%"}

- List search results based on the snippet code.

![GUI Search Results]({{ site.baseurl }}/assets/img/gui-search-results.png){:width="50%"}

### Download

<a id="mac-download" href="#">Mac App</a>

<a id="win-download" href="#">Windows x64 App</a>, it's not signed and Microsoft SmartScreen will block it.

## Synvert VSCode Extension

[Synvert VSCode extension](https://marketplace.visualstudio.com/items?itemName=xinminlabs.synvert){:target="_blank"} is a VSCode extension to use synvert.

### Features

- Search and replace. After adding a snippet, you can search the code, and replace all or any of the results.

![Search and Replace]({{ site.baseurl }}/assets/img/vscode-search-and-replace.gif){:width="50%"}

- Search a snippet. You can search a snippet by group, name or description.

![Search snippet]({{ site.baseurl }}/assets/img/vscode-search-snippet.gif)

- Generate a snippet. You can generate a snippet by adding some input codes and output codes.

![Generate snippet]({{ site.baseurl }}/assets/img/vscode-generate-snippet.gif)

### Download

Synvert VSCode extension can be downloaded [here](https://marketplace.visualstudio.com/items?itemName=xinminlabs.synvert){:target="_blank"}

## Synvert Web (Playground)

[Synvert Playground](https://playground.synvert.net/){:target="_blank"} is a web interface to play with synvert.

[Node Playground](https://node-playground.synvert.net/){:target="_blank"} is a web interface to play with node query and node mutation.

## Why named "Synvert"?

The name "Synvert" is a combination of "Syntax" and "Convert".
