---
layout: javascript
title: Get Started
---

## CLI

### Installation

To install the latest version, run

```
$ npm install -g synvert
```

This will install `synvert-javascript`, along with `synvert-core-javascript` and other dependencies.

### Usage

Now you can use synvert to convert your javascript code.

```
$ synvert-javascript -h
Write javascript code to change javascript code

USAGE
  $ synvert-javascript

OPTIONS
  -g, --generate=generate  generate a snippet with snippet name
  -h, --help               show CLI help
  -l, --list               list snippets
  -r, --run=run            run a snippet with snippet name
  -s, --show=show          show a snippet with snippet name
  -v, --version
  --enableEcmaFeaturesJsx  enable EcmaFeatures jsx
  --path=path              [default: .] project path
  --showRunProcess         show processing files when running a snippet
  --skipFiles=skipFiles    [default: node_modules/**] skip files, splitted by comma
  --sync                   sync snippets
```

#### Sync snippets

[snippets](https://github.com/xinminlabs/synvert-snippets-javascript) are available on github,
you can sync them any time you want.

```
$ synvert-javascript --sync
```

#### List snippets

List all available snippets

```
$ synvert-javascript -l
```

#### Show a snippet

Describe what a snippet does.

```
$ synvert-javascript -s javascript/trailing-comma
```

#### Run a snippet

Run a snippet, analyze and then change code.

```
$ synvert-javascript -r javascript/trailing-comma
```

It's recommended that you use version control software like git,
after using synvert, you can use check what changes synvert does to
your javascript code.

Show processing files when running a snippet.

```
$ synvert-javascript -r javascript/trailing-comma --showRunProcess
```

Enable EcmaFeatures jsx.

```
$ synvert-javascript -r javascript/trailing-comma --enableEcmaFeaturesJsx
```

Skip files.

```
$ synvert-javascript -r javascript/trailing-comma --skipFiles=test/**
```

Customize path.

```
$ synvert-javascript -r javascript/trailing-comma --path=/repos/synvert
```

#### Generate a snippet

```
$ synvert-javascript -g javascript/convert-foo-to-bar
```

## Docker

You can run `synvert-javascript` command in a docker container.

```
docker pull xinminlabs/awesomecode-synvert-javascript

docker run xinminlabs/awesomecode-synvert-javascript synvert-javascript --list

docker run -v <your project path>:/app xinminlabs/awesomecode-synvert-javascript synvert-javascript --run javascript/trailing-comma /app
```
