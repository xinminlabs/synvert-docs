---
layout: page
title: CLI
---

<script type="text/javascript" src="https://asciinema.org/a/11973.js" id="asciicast-11973" async></script>

### Installation

Synvert is distributed using [RubyGems][1].

To install the latest version, run

```
$ gem install synvert
```

This will install synvert, along with synvert-core and other dependencies.

### Usage

Now you can use synvert to convert your ruby code.

```
$ synvert -h
Usage: synvert [project_path]
    -d, --load SNIPPET_PATHS         load custom snippets, snippet paths can be local file path or remote http url
    -l, --list                       list all available snippets
    -o, --open SNIPPET_NAME          Open a snippet
    -q, --query QUERY                query specified snippets
        --skip FILE_PATTERNS         skip specified files or directories, separated by comma, e.g. app/models/post.rb,vendor/plugins/**/*.rb
    -s, --show SNIPPET_NAME          show specified snippet description, SNIPPET_NAME is combined by group and name, e.g. ruby/new_hash_syntax
        --sync                       sync snippets
    -r, --run SNIPPET_NAME           run specified snippet, e.g. ruby/new_hash_syntax
    -g, --generate NEW_SNIPPET_NAME  generate a new snippet
    -f, --format FORMAT              output format
    -v, --version                    show this version
```

##### Sync snippets

[snippets][2] are available on github, you can sync them any time you want.

```
$ synvert --sync
```

##### List snippets

List all available snippets

```
$ synvert -l
```

##### Show a snippet

Describe what a snippet does.

```
$ synvert -s factory_bot/use_short_syntax
```

##### Open a snippet

Open a snippet in your editor, editor is defined in
`ENV['SNIPPET_EDITOR']` or `ENV['EDITOR']`

```
$ synvert -o factory_bot/use_short_syntax
```

##### Run a snippet

Run a snippet, analyze and then change code.

```
$ synvert -r factory_bot/use_short_syntax ~/Sites/xinminlabs/awesomecode.io
```

It's recommended that you use version control software like [git][3],
after using synvert, you can use check what changes synvert does to
your ruby code.

You can write your own snippets then load them by `--load`.

##### Generate a snippet

Generate a new snippet

```
$ synvert -g group/name
```

### Dependencies

Synvert uses [parser][4] and [ast][5], parser helps to parse ruby source
code and rewrite ast nodes, ast is a small library for working with
immutable abstract syntax trees. It's highly recommended to look through
these 2 libraries.

[1]: https://rubygems.org
[2]: https://github.com/xinminlabs/synvert-snippets-ruby
[3]: https://git-scm.com/
[4]: https://github.com/whitequark/parser
[5]: https://github.com/whitequark/ast
