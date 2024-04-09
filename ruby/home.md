---
layout: ruby
title: synvert-ruby
redirect_to: /
---

[synvert-ruby](https://github.com/synvert-hq/synvert-ruby) is a command tool to rewrite ruby code automatically,
it depends on `synvert-core-ruby` and `synvert-snippets-ruby`.

[synvert-core-ruby](https://github.com/synvert-hq/synvert-core-ruby) provides a set of DSLs to rewrite ruby code.

[synvert-snippets-ruby](https://github.com/synvert-hq/synvert-snippets-ruby) provides official snippets to
rewrite ruby code.

Here is an example of synvert snippet.

```ruby
Synvert::Rewriter.new 'ruby', 'map_and_flatten_to_flat_map' do
  description <<~EOS
    It converts `map` and `flatten` to `flat_map`

    ```ruby
    enum.map do
      # do something
    end.flatten
    ```

    =>

    ```ruby
    enum.flat_map do
      # do something
    end
    ```
  EOS

  within_files Synvert::ALL_RUBY_FILES do
    with_node type: 'send', receiver: { type: 'block', caller: { type: 'send', message: 'map' } }, message: 'flatten', arguments: { size: 0 } do
      delete :message, :dot
      replace 'receiver.caller.message', with: 'flat_map'
    end
  end
end
```

### Installation

To install the latest version, run

```
$ gem install synvert
```

This will also install `synvert-core-ruby`.

Before using synvert, you need to sync all official snippets first.

```
$ synvert-ruby --sync
```

Then you can use synvert to rewrite your ruby code, e.g.

```
$ synvert-ruby -r factory_bot/use_short_syntax
```

### Usage

```
$ synvert-ruby -h
Usage: synvert-ruby [project_path]
    -d, --load SNIPPET_PATHS         load custom snippets, snippet paths can be local file path or remote http url
    -l, --list                       list all available snippets
    -q, --query QUERY                query specified snippets
    -s, --show SNIPPET_NAME          show specified snippet description, SNIPPET_NAME is combined by group and name, e.g. ruby/new_hash_syntax
    -o, --open SNIPPET_NAME          Open a snippet
    -g, --generate NEW_SNIPPET_NAME  generate a new snippet
        --sync                       sync snippets
        --execute                    execute snippet
    -r, --run SNIPPET_NAME           run specified snippet, e.g. ruby/new_hash_syntax
        --show-run-process           show processing files when running a snippet
        --skip FILE_PATTERNS         skip specified files or directories, separated by comma, e.g. app/models/post.rb,vendor/plugins/**/*.rb
    -f, --format FORMAT              output format
    -v, --version                    show this version
```

#### Sync snippets

[Official Snippets](https://github.com/synvert-hq/synvert-snippets-ruby) are available on github,
you can sync them any time you want.

```
$ synvert-ruby --sync
```

#### List snippets

List all available snippets

```
$ synvert-ruby -l

$ synvert-ruby --list --format json
```

#### Show a snippet

Describe what a snippet does.

```
$ synvert-ruby -s factory_bot/use_short_syntax
```

#### Open a snippet

Open a snippet in your editor, editor is defined in
`ENV['SNIPPET_EDITOR']` or `ENV['EDITOR']`

```
$ synvert-ruby -o factory_bot/use_short_syntax
```

#### Run a snippet

Run a snippet, analyze and then rewrite code.

```
$ synvert-ruby -r factory_bot/use_short_syntax ~/Sites/synvert-hq/synvert-core-ruby
```

Load custom snippet

```
$ synvert-ruby --load ~/.custom-snippets/my-own-snippet.rb -r my-own-snippet ~/Sites/synvert-hq/synvert-core-ruby
```

Show processing files when running a snippet.

```
$ synvert-ruby -r factory_bot/use_short_syntax --show-run-process ~/Sites/synvert-hq/synvert-core-ruby
```

#### Generate a snippet

Generate a new snippet

```
$ synvert-ruby -g ruby/convert_foo_to_bar
```

### Docker

You can run `synvert-ruby` command in a docker container.

```
docker pull xinminlabs/awesomecode-synvert-ruby

docker run xinminlabs/awesomecode-synvert-ruby synvert-ruby --list

docker run -v <your project path>:/app xinminlabs/awesomecode-synvert-ruby synvert-ruby --run default/check_syntax /app
```
