---
layout: page
title: GUI
---

If you don't want to use the command line, we also provide the GUI app.
It can show and run the official snippets, and it can help you to create your own snippets.

### Download

[Mac OS](https://download-synvert.xinminlabs.com/download/latest/osx)

[Windows x64](https://download-synvert.xinminlabs.com/download/latest/windows_64), it's not signed and Microsoft SmartScreen will block it.

### Screenshot

* Snippet Show
![GUI Snippet Show Screenshot]({{ site.baseurl }}/img/gui_snippet_show_screenshot.png)

* Snippet New
![GUI Snippet New Single Screenshot]({{ site.baseurl }}/img//gui_snippet_new_single_screenshot.png)
![GUI Snippet New Multi First Screenshot]({{ site.baseurl }}/img//gui_snippet_new_multi_first_screenshot.png)
![GUI Snippet New Multi Second Screenshot]({{ site.baseurl }}/img//gui_snippet_new_multi_second_screenshot.png)

* Code Diff
![GUI Snippet Diff Screenshot]({{ site.baseurl }}/img//gui_snippet_diff_screenshot.png)

### How to write inputs/outputs?

You can write input and output code to ask synvert to write the snippet for you.

Let me show you some examples:

#### Simple Case

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

#### Complicated Case

From rails 2 to rails 3, I want to change activerecord code from `update_all(conditions, values)` to `where(conditions).update(values)`.

I fill in input as

```ruby
Post.update_all({ title: 'old title' }, { title: 'new title' })
```

and output as

```ruby
Post.where(title: 'old title').update_all(title: 'new title')
```

it will generate the snippet as

```ruby
Synvert::Rewriter.execute do
  within_files '**/*.rb' do
    with_node type: 'send', receiver: 'Post', message: 'update_all', arguments: { size: 2, first: { type: 'hash', title_value: "'old title'" }, second: { type: 'hash', title_value: "'new title'" } } do
      replace :receiver, with: "{{receiver}}.where(title: 'old title')"
      replace :arguments, with: "title: 'new title'"
    end
  end
end
```

The generated snippet finds the exact code `Post.updated_all({ title: 'old title' }, { title: 'new test'})` and replace it with `Post.where(title: 'old title').update_all(title: 'new title')`, but this is not what I expected.

So I add one more input and output to make the snippet better.

input

```ruby
Article.update_all({ name: 'old name' }, { name: 'new name' })
```

output

```ruby
Article.where(name: 'old name').update_all(name: 'new name')
```

As you can see, I type different receiver (Post and Article) and different arguments, so the generated snippet is as follows

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