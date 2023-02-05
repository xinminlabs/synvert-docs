---
layout: javascript
title: synvert-javascript
redirect_to: /
---

[synvert-javascript](https://github.com/xinminlabs/synvert-javascript) is a command tool to rewrite javascript code automatically, it depends on `synvert-core-javascript` and `synvert-snippets-javascript`.

[synvert-core-javascript](https://github.com/xinminlabs/synvert-core-javascript) provides a set of DSLs to rewrite javascript code.

[synvert-snippets-javascript](https://github.com/xinminlabs/synvert-snippets-javascript) provides official snippets to
rewrite javascript code.

Here is an example of synvert snippet.

```javascript
const Synvert = require("synvert-core");

new Synvert.Rewriter("jquery", "deprecate-event-shorthand", () => {
  description('jQuery event shorthand is deprecated.');

  withinFiles(Synvert.ALL_FILES, function () {
    // $('#test').click(function(e) { });
    // =>
    // $('#test').on('click', function(e) { });
    withNode(
      {
        type: "CallExpression",
        callee: { type: "MemberExpression", object: /^\$/, property: 'click' },
        arguments: { length: 1, first: { type: { in: ["FunctionExpression", "ArrowFunctionExpression"] } } },
      },
      () => {
        replace("callee.property", { with: "on" });
        insert("'click', ", { to: "arguments.0", at: "beginning" });
      }
    );

    // $form.submit();
    // =>
    // $form.trigger('submit');
    withNode(
      {
        type: "CallExpression",
        callee: { type: "MemberExpression", object: /^\$/, property: 'submit' },
        arguments: { length: 0 },
      },
      () => {
        replace(["callee.property", "arguments"], { with: "trigger('submit')" });
      }
    );
  });
});
```

### Installation

To install the latest version, run

```
$ npm install -g synvert
```

This will also install `synvert-core-javascript`.

Before using synvert, you need to sync all official snippets first.

```
$ synvert-javascript --sync
```

Then you can use synvert to rewrite your javascript code, e.g.

```
$ synvert-javascript -r jquery/migrate
```

### Usage

```
$ synvert-javascript --help
Write javascript code to change javascript code

USAGE
  $ synvert-javascript

OPTIONS
  -d, --load=load          load custom snippets, snippet paths can be local file path or remote http url
  -f, --format=format      output format
  -g, --generate=generate  generate a snippet with snippet name
  -h, --help               show CLI help
  -l, --list               list snippets
  -r, --run=run            run a snippet with snippet name
  -s, --show=show          show a snippet with snippet name
  -v, --version
  --enableEcmaFeaturesJsx  enable EcmaFeatures jsx
  --path=path              [default: .] project path
  --show-run-process         show processing files when running a snippet
  --skipFiles=skipFiles    [default: node_modules/**] skip files, splitted by comma
  --sync                   sync snippets
```

#### Sync snippets

[Official Snippets](https://github.com/xinminlabs/synvert-snippets-javascript) are available on github,
you can sync them any time you want.

```
$ synvert-javascript --sync
```

#### List snippets

List all available snippets.

```
$ synvert-javascript -l

$ synvert-javascript --list --format json
```

#### Show a snippet

Describe what a snippet does.

```
$ synvert-javascript -s jquery/migrate
```

#### Run a snippet

Run a snippet, analyze and then rewrite code.

```
$ synvert-javascript -r jquery/migrate
```

Load custom snippet

```
$ synvert-javascript --load https://raw.githubusercontent.com/xinminlabs/synvert-snippets-javascript/master/lib/javascript/no-useless-constructor.js --run javascript/no-useless-constructor

$ synvert-javascript --load ~/Sites/xinminlabs/synvert-snippets-javascript/lib/javascript/no-useless-constructor.js --run jquery/no-useless-constructor
```

Show processing files when running a snippet.

```
$ synvert-javascript -r javascript/trailing-comma --show-run-process
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

### Use Docker

You can run `synvert-javascript` command in a docker container.

```
docker pull xinminlabs/awesomecode-synvert-javascript

docker run xinminlabs/awesomecode-synvert-javascript synvert-javascript --list

docker run -v <your project path>:/app xinminlabs/awesomecode-synvert-javascript synvert-javascript --run javascript/trailing-comma /app
```
