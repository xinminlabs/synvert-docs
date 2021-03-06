---
layout: ruby
title: synvert-ruby
---

[synvert-ruby](https://github.com/xinminlabs/synvert-ruby) is a command tool to rewrite ruby code automatically,
it depends on `synvert-core-ruby` and `synvert-snippets-ruby`.

[synvert-core-ruby](https://github.com/xinminlabs/synvert-core-ruby) provides a set of DSLs to rewrite ruby code.

[synvert-snippets-ruby](https://github.com/xinminlabs/synvert-snippets-ruby) provides official snippets to
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

[Official Snippets](https://github.com/xinminlabs/synvert-snippets-ruby) are available on github,
you can sync them any time you want.

```
$ synvert-ruby --sync
```

#### List snippets

List all available snippets

```
$ synvert-ruby -l

$ synvert-ruby --list --form json
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
$ synvert-ruby -r factory_bot/use_short_syntax ~/Sites/xinminlabs/synvert-core-ruby
```

Load custom snippet

```
$ synvert-ruby --load ~/.custom-snippets/my-own-snippet.rb -r my-own-snippet ~/Sites/xinminlabs/synvert-core-ruby
```

Show processing files when running a snippet.

```
$ synvert-ruby -r factory_bot/use_short_syntax --show-run-process ~/Sites/xinminlabs/synvert-core-ruby
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

### GUI

![GUI Snippet Show Screenshot]({{ site.baseurl }}/img/gui_snippet_show_screenshot.png)
![GUI Snippet New Single Screenshot]({{ site.baseurl }}/img//gui_snippet_new_single_screenshot.png)
![GUI Snippet New Multi First Screenshot]({{ site.baseurl }}/img//gui_snippet_new_multi_first_screenshot.png)
![GUI Snippet New Multi Second Screenshot]({{ site.baseurl }}/img//gui_snippet_new_multi_second_screenshot.png)
![GUI Snippet Diff Screenshot]({{ site.baseurl }}/img//gui_snippet_diff_screenshot.png)

The GUI provides the following features

* List official snippets
* Show a snippet and its source code
* **Generate a snippet based on your inputs and outputs**
* Run a snippet on your workspace
* Show diff code after running a snippet and commit changes
* Sync snippets up to date
* Setup in docker mode or native mode

The best feature is that it can help you to write your own snippets without learning AST, you just need to fill in the inputs and outputs ruby code.

#### Download

[Mac OS](https://download-synvert.xinminlabs.com/download/latest/osx)

[Windows x64](https://download-synvert.xinminlabs.com/download/latest/windows_64), it's not signed and Microsoft SmartScreen will block it.

#### How to write inputs/outputs?

You can write input and output code to ask synvert to write the snippet for you.

Let me show you some examples:

##### Simple Case

From rails 2 to rails 3, I want to change migration code from `def self.up` to `def up`.

I fill in input as

```ruby
def self.up
  # migration code
end
```

and output as

```ruby
def up
  # migration code
end
```

it will generate the snippet as

```ruby
Synvert::Rewriter.execute do
  within_files '**/*.rb' do
    with_node type: 'defs', name: 'up' do
      delete :self, :dot
    end
  end
end
```

The generated snippet finds all `defs` node with name `up` and delete the `self` and `.` keywords.

##### Complicated Case

From rails 2 to rails 3, I want to change activerecord code from `update_all(conditions, values)` to `where(conditions).update(values)`.

I fill in inputs as

```ruby
Post.update_all({ title: 'old title' }, { title: 'new title' })
```

and

```ruby
Article.update_all({ name: 'old name' }, { name: 'new name' })
```

and outputs as

```ruby
Post.where(title: 'old title').update_all(title: 'new title')
```

and

```ruby
Article.where(name: 'old name').update_all(name: 'new name')
```

it will generate the snippet as

```ruby
{% raw %}
Synvert::Rewriter.execute do
  within_files '**/*.rb' do
    with_node type: 'send', message: 'update_all', arguments: { size: 2, first: { type: 'hash' }, second: { type: 'hash' } } do
      replace_with '{{receiver}}.where({{arguments.first.strip_curly_braces}}).update_all({{arguments.second.strip_curly_braces}})'
    end
  end
end
{% endraw %}
```

It finds any `send` node with message `update_all` and 2 `hash` node arguments, and replace the code with `where(first_argument).update_all(second_argument)`.
