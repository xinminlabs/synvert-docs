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
    - [Attributes](#attributes)
  - [Query Nodes](#query-nodes)
    - [Node Query Language](#node-query-language)
    - [Node Rules](#node-rules)
  - [Evaluated Value](#evaluated-value)

## Install CLI

First, instal synvert gem locally:

```
$ gem install synvert
```

Second, sync the official snippets: (this is optional, synvert is completely working with remote snippets)

```
$ synvert-ruby --sync
```

## Use CLI

You can rewrite your code by running a snippet

```
$ synvert-ruby --run rspec/use_new_syntax
```

Specify the repository path

```
$ synvert-ruby --run rspec/use_new_syntax ~/Sites/xinminlabs/awesomecode.io
```

Run a snippet from remote url

```
$ synvert-ruby --run https://raw.githubusercontent.com/xinminlabs/synvert-snippets-ruby/master/lib/rspec/use_new_syntax.rb ~/Sites/xinminlabs/awesomecode.io
```

Run a snippet from local file path

```
$ synvert-ruby --run ~/.synvert-ruby/lib/rspec/use_new_syntax.rb ~/Sites/xinminlabs/awesomecode.io
```

Skip paths

```
$ synvert-ruby --run rspec/use_new_syntax --skip-paths vendor/ ~/Sites/xinminlabs/awesomecode.io
```

Only paths

```
$ synvert-ruby --run rspec/use_new_syntax --only-paths app/models/ ~/Sites/xinminlabs/awesomecode.io
```

Show processing files when running a snippet.

```
$ synvert-ruby --run rspec/use_new_syntax --show-run-process ~/Sites/xinminlabs/synvert-core-ruby
```

## Synvert Snippet

The following is a typical synvert snippet:

```ruby
{% raw %}Synvert::Rewriter.new 'rails', 'convert_head_response' do
  if_gem 'actionpack', '>= 5.0'

  within_file Synvert::RAILS_CONTROLLER_FILES do
    # render nothing: true
    # =>
    # head :ok
    find_node '.send[receiver=nil][message=render][arguments.size=1]
                [arguments.0=.hash[nothing_value=true][status_value=nil]]' do
      replace :message, with: 'head'
      replace :arguments, with: ':ok'
    end
    # render nothing: true, status: :created
    # =>
    # head :created
    find_node '.send[receiver=nil][message=render][arguments.size=1]
                [arguments.0=.hash[nothing_value=true][status_value!=nil]]' do
      replace_with '{{message}} {{arguments.0.status_source}}'
    end
  end
end{% endraw %}
```

The snippet only works when `actionpack` gem is greater than or equal to 5.0, it finds all rails controller files,
for each controller file, it finds the `render nothing: true` code and replace with `head` code.

### APIs

[synvert-core](https://github.com/xinminlabs/synvert-core-ruby) provides a set of APIs to query and mutate code based on AST nodes.

#### General APIs

* [description](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter.html#description-instance_method) - describe what the snippet does

```ruby
description 'describe what the snippet does'
```

* [if_ruby](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter.html#if_ruby-instance_method) - check if ruby version is greater than or equal to the specified ruby version

```ruby
if_ruby '3.0.0'
```

* [if_gem](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter.html#if_gem-instance_method) - compare version of specified gem

```ruby
if_gem 'rails', '~> 6.0.0'
```

* [within_files](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter.html#within_files-instance_method) - find specified files

```ruby
within_files 'spec/**/*_spec.rb' do
end
```

* [within_file](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter.html#within_file-instance_method) - alias to within_files

```ruby
within_file 'spec/spec_helper.rb' do
end
```

* [add_file](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter.html#add_file-instance_method) - add a new file

```ruby
add_file 'app/models/application_record.rb', <<~EOS
  class ApplicationRecord < ActiveRecord::Base
    self.abstract_class = true
  end
EOS
```

* [remove_file](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter.html#remove_file-instance_method) - remove a file

```ruby
remove_file 'config/initializers/secret_token.rb'
```

* [add_snippet](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter.html#add_snippet-instance_method) - call another rewriter

```ruby
add_snippet 'minitest', 'assert_empty'
add_snippet 'minitest/assert_instance_of'
add_snippet '/Users/flyerhzm/.synvert-ruby/lib/minitest/assert_match.rb'
add_snippet 'https://github.com/xinminlabs/synvert-snippets-ruby/blob/main/lib/minitest/assert_silent.rb'
```

* [helper_method](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter.html#helper_method-instance_method) - define a helper method

```ruby
helper_method :extract_controller_action_name do |hash_node|
  controller_name = hash_node.hash_value(:controller).to_value
  action_name = hash_node.hash_value(:action).to_value
  "#{controller_name}##{action_name}"
end

within_file Synvert::RAILS_ROUTE_FILES do
  within_node type: 'send', receiver: 'map', message: 'connect' do
    # ...
    controller_action_name = extract_controller_action_name(hash_node)
    # ...
  end
end
```

* [redo_until_no_change](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter.html#redo_until_no_change-instance_method) - run the snippet until no change

#### Scope APIs

You can use scope apis to find the matching nodes or move to the specified node.

* [within_node](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter/Instance.html#within_node-instance_method) - recursively find matching ast nodes

```ruby
# head status: 406
with_node type: 'send', receiver: nil, message: 'head', arguments: { size: 1, '0': { type: 'hash' } } do
end
```

* [with_node](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter/Instance.html#with_node-instance_method) - alias to within_node
* [find_node](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter/Instance.html#find_node-instance_method) - alias to within_node

```ruby
# head status: 406
find_node '.send[receiver=nil][message=head][arguments.size=1][arguments.0=.hash]]' do
end
```

* [goto_node](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter/Instance.html#goto_node-instance_method) - go to a child node

```ruby
# head status: 406
with_node type: 'send', receiver: nil, message: 'head', arguments: { size: 1, '0': { type: 'hash' } } do
  goto_node 'arguments.0' do
  end
end
```

#### Condition APIs

You can use condition apis to check if the current node matches the rules.

* [if_exist_node](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter/Instance.html#if_exist_node-instance_method) - check if matching node exist in the child nodes

```ruby
# Klass.any_instance.should_receive(:message)
with_node type: 'send', message: 'should_receive' do
  if_exist_node type: 'send', message: 'any_instance' do
  end
end
```

* [unless_exist_node](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter/Instance.html#unless_exist_node-instance_method) - check if matching node doesn't exist in the child nodes

```ruby
# obj.should_receive(:message)
with_node type: 'send', message: 'should_receive' do
  unless_exist_node type: 'send', message: 'any_instance' do
  end
end
```

* [if_only_exist_node](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter/Instance.html#if_only_exist_node-instance_method) - check if current node has only one child node and the child node matches

```ruby
# it { should matcher }
with_node type: 'block', caller: { message: 'it' } do
  if_only_exist_node type: 'send', receiver: nil, message: 'should' do
  end
end
```

#### Action APIs

You can use action apis to rewrite the source code.

* [append](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter/Instance.html#append-instance_method) - append the code to the bottom of current node body

```ruby
# def teardown
#   clean_something
# end
# =>
# def teardown
#   clean_something
#   super
# end
find_node '.class[parent_class=Minitest::Test] .def[name=teardown]:not_has(> .super)' do
  append 'super'
end
```

* [prepend](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter/Instance.html#prepend-instance_method) - prepend the code to the bottom of current node body

```ruby
# def setup
#   do_something
# end
# =>
# def setup
#   super
#   do_something
# end
find_node '.class[parent_class=Minitest::Test] .def[name=setup]:not_has(> .super)' do
  prepend 'super'
end
```

* [insert](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter/Instance.html#insert-instance_method) - insert code
  * option `at`, `beginning` or `end` (default), insert code at the beginning or end of the current node
  * option `to`, insert code to the child node of the current node
  * option `add_comma`, `true` or `false` (default), add extra comma

```ruby
# open('http://test.com')
# =>
# URI.open('http://test.com')
find_node '.send[receiver=nil][message=open]' do
  insert 'URI.', at: 'beginning'
end
```

```ruby
# user.name
# =>
# user&.name
find_node '.send[receiver=user][message=name]' do
  insert '&', to: 'receiver'
end
```

```ruby
# test(foo)
# =>
# test(foo, bar)
find_node '.send[message=test][arguments.size=1][arguments.first=foo]' do
  insert 'bar', to: 'arguments.0', and_comma: true
end
```

* [insert_after](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter/Instance.html#insert_after-instance_method) - insert the code next to the current node
  * option `add_comma`, `true` or `false` (default), add extra comma

```ruby
{% raw %}# Synvert::Application.config.secret_token = "0447aa931d42918bfb934750bb78257088fb671186b5d1b6f9fddf126fc8a14d34f1d045cefab3900751c3da121a8dd929aec9bafe975f1cabb48232b4002e4e"
# =>
# Synvert::Application.config.secret_token = "0447aa931d42918bfb934750bb78257088fb671186b5d1b6f9fddf126fc8a14d34f1d045cefab3900751c3da121a8dd929aec9bafe975f1cabb48232b4002e4e"
# Synvert::Application.config.secret_key_base = "bf4f3f46924ecd9adcb6515681c78144545bba454420973a274d7021ff946b8ef043a95ca1a15a9d1b75f9fbdf85d1a3afaf22f4e3c2f3f78e24a0a188b581df"
with_node type: 'send', message: 'secret_token=' do
  insert_after "{{receiver}}.secret_key_base = \"#{SecureRandom.hex(64)}\""
end{% endraw %}
```

* [insert_before](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter/Instance.html#insert_before-instance_method) - insert the code previous to the current node
  * option `add_comma`, `true` or `false` (default), add extra comma

```ruby
{% raw %}# Synvert::Application.config.secret_token = "0447aa931d42918bfb934750bb78257088fb671186b5d1b6f9fddf126fc8a14d34f1d045cefab3900751c3da121a8dd929aec9bafe975f1cabb48232b4002e4e"
# =>
# Synvert::Application.config.secret_key_base = "bf4f3f46924ecd9adcb6515681c78144545bba454420973a274d7021ff946b8ef043a95ca1a15a9d1b75f9fbdf85d1a3afaf22f4e3c2f3f78e24a0a188b581df"
# Synvert::Application.config.secret_token = "0447aa931d42918bfb934750bb78257088fb671186b5d1b6f9fddf126fc8a14d34f1d045cefab3900751c3da121a8dd929aec9bafe975f1cabb48232b4002e4e"
with_node type: 'send', message: 'secret_token=' do
  insert_before "{{receiver}}.secret_key_base = \"#{SecureRandom.hex(64)}\""
end{% endraw %}
```

* [replace](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter/Instance.html#replace-instance_method) - replace the code of specified child nodes

```ruby
# Post.paginated_each do |post|
# end
# =>
# Post.find_each do |post|
# end
find_node '.send[message=paginated_each][arguments.size=0]' do
  replace :message, with: 'find_each'
end
```

```ruby
{% raw %}# expect(1.0 / 3.0).to be_close(0.333, 0.001)
# =>
# expect(1.0 / 3.0).to be_within(0.001).of(0.333)
with_node type: 'send', message: 'to', arguments: { first: { type: 'send', message: 'be_close' } } do
  replace :arguments, with: "be_within({{arguments.first.arguments.last}}).of({{arguments.first.arguments.first}})"
end{% endraw %}
```

* [delete](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter/Instance.html#delete-instance_method) - delete the code in the specified child nodes
  * *selectors, selector names of child node.
  * option `add_comma`, `true` or `false` (default), delete extra comma

```ruby
# FactoryBot.create(...)
# FactoryBot.build(...)
# =>
# create(...)
# build(...)
find_node '.send[receiver=FactoryBot][message IN (create build)]' do
  delete :receiver, :dot
end
```

* [remove](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter/Instance.html#remove-instance_method) - remove the whole code of current node.
  * option `add_comma`, `true` or `false` (default), delete extra comma

```ruby
# removes puts and p methods
find_node '.send[receiver=nil][message IN (puts p)]' do
  remove
end
```

* [wrap](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter/Instance.html#wrap-instance_method) - wrap the current node with code

```ruby
# class Bar < Base
# end
# =>
# module Foo
#   class Bar < Base
#   end
# end
find_node '.class[name=Bar]' do
  wrap with: 'module Foo'
end
```

* [replace_with](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter/Instance.html#replace_with-instance_method) - replace the whole code of current node

```ruby
{% raw %}# errors[:base] = "author not present"
# =>
# errors.add(:base, "author not present")
with_node type: 'send', receiver: 'errors', message: '[]=' do
  replace_with 'errors.add({{arguments.first}}, {{arguments.last}})'
end{% endraw %}
```

* [warn](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter/Instance.html#warn-instance_method) - warn message

* [replace_erb_stmt_with_expr](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter/Instance.html#replace_erb_stmt_with_expr-instance_method) - replace erb stmt code to expr code

```ruby
# <% form_for post do |f| %>
# <% end %>
# =>
# <%= form_for post do |f| %>
# <% end %>
with_node type: 'block', caller: { type: 'send', receiver: nil, message: { in: %w[form_for form_tag] } } do
  replace_erb_stmt_with_expr
end
```

* [noop](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter/Instance.html#noop-instance_method) - no operation

#### Attributes

* [file_path](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter/Instance.html#file_path-instance_method) - current file path
* [node](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter/Instance.html#node-instance_method) - current ast node
* [mutation_adapter](https://xinminlabs.github.io/synvert-core-ruby/Synvert/Core/Rewriter/Instance.html#mutation_adapter-instance_method) - [mutation adapter](https://xinminlabs.github.io/node-mutation-ruby/NodeMutation/Adapter.html) to get some helper methods

### Query Nodes

Synvert uses [node_query](https://rubygems.org/gems/node_query) gem to query nodes, so that you can use NQL (node query language) or node rules to query AST nodes.

#### Node Query Language

##### nql matches node type

```
.class
```

It matches class node

##### nql matches attribute

```
.class[name=User]
```

It matches class node whose name is User

##### nql matches nested attribute

```
.class[parent_class.name=Base]
```

It matches class node whose parent class name is Base

##### nql matches evaluated value

```
{% raw %}.ivasgn[left_value="@{{right_value}}"]{% endraw %}
```

It matches ivasgn node whose left value equals '@' plus the evaluated value of right value.

##### nql matches nested selector

```
.def[body.0=.ivasgn]
```

It matches def node whose first child node is an ivasgn node.

##### nql matches method result

```
.def[arguments.size=2]
```

It matches def node whose arguments size is 2.

##### nql matches operators

```
.class[name=User]
```

Value of name is equal to User

```
.class[name^=User]
```

Value of name starts with User

```
.class[name$=User]
```

Value of name ends with User

```
.class[name*=User]
```

Value of name contains User

```
.def[arguments.size!=2]
```

Size of arguments is not equal to 2

```
.def[arguments.size>=2]
```

Size of arguments is greater than or equal to 2

```
.def[arguments.size>2]
```

Size of arguments is greater than 2

```
.def[arguments.size<=2]
```

Size of arguments is less than or equal to 2

```
.def[arguments.size<2]
```

Size of arguments is less than 2

```
.class[name IN (User Account)]
```

Value of name is either User or Account

```
.class[name NOT IN (User Account)]
```

Value of name is neither User nor Account

```
.def[arguments INCLUDES id]
```

Value of arguments includes id

```
.def[arguments NOT INCLUDES id]
```

Value of arguments not includes id

```
.class[name=~/User/]
```

Value of name matches User

```
.class[name!~/User/]
```

Value of name does not match User

```
.class[name IN (/User/ /Account/)]
```

Value of name matches either /User/ or /Account/

##### nql matches array node attribute

```
.def[arguments=(id name)]
```

It matches def node whose arguments are id and name.

##### nql matches * in attribute key

```
.def[arguments.*.name IN (id name)]
```

It matches def node whose arguments are either id or name.

##### nql matches multiple selectors

###### Descendant combinator

```
.class .send
```

It matches send node whose ansestor is class node.

###### Child combinator

```
.def > .send
```

It matches send node whose parent is def node.

###### Adjacent sibling combinator

```
.send[left_value=@id] + .send
```

It matches send node only if it is immediately follows the send node whose left value is @id.

###### General sibling combinator

```
.send[left_value=@id] ~ .send
```

It matches send node only if it is follows the send node whose left value is @id.

##### nql matches goto scope

```
.def body .send
```

It matches send node who is in the body of def node.

##### nql matches :has and :not_has pseudo selector

```
.class:has(.def[name=initialize])
```

It matches class node who has an initialize def node.

```
.class:not_has(.def[name=initialize])
```

It matches class node who does not have an initialize def node.

##### nql matches :first-child and :last-child pseudo selector

```
.def:first-child
```

It matches the first def node.

```
.def:last-child
```

It matches the last def node.

##### nql matches multiple expressions

```
.ivasgn[left_value=@id], .ivasgn[left_value=@name]
```

It matches ivasgn node whose left value is either @id or @name.

#### Node Rules

##### rules matches node type

```
{ node_type: 'class' }
```

It matches class node

##### rules matches attribute

```
{ node_type: 'def', name: 'initialize' }
```

It matches def node whose name is initialize

```
{ node_type: 'def', arguments: { "0": 1, "1": "Murphy" } }
```

It matches def node whose arguments are 1 and Murphy.

##### rules matches nested attribute

```
{ node_type: 'class', parent_class: { name: 'Base' } }
```

It matches class node whose parent class name is Base

##### rules matches evaluated value

```
{% raw %}{ node_type: 'ivasgn', left_value: '@{{right_value}}' }{% endraw %}
```

It matches ivasgn node whose left value equals '@' plus the evaluated value of right value.

##### rules matches nested selector

```
{ node_type: 'def', body: { "0": { node_type: 'ivasgn' } } }
```

It matches def node whose first child node is an ivasgn node.

##### rules matches method result

```
{ node_type: 'def', arguments: { size: 2 } }
```

It matches def node whose arguments size is 2.

##### rules matches operators

```
{ node_type: 'class', name: 'User' }
```

Value of name is equal to User

```
{ node_type: 'def', arguments: { size { not: 2 } }
```

Size of arguments is not equal to 2

```
{ node_type: 'def', arguments: { size { gte: 2 } }
```

Size of arguments is greater than or equal to 2

```
{ node_type: 'def', arguments: { size { gt: 2 } }
```

Size of arguments is greater than 2

```
{ node_type: 'def', arguments: { size { lte: 2 } }
```

Size of arguments is less than or equal to 2

```
{ node_type: 'def', arguments: { size { lt: 2 } }
```

Size of arguments is less than 2

```
{ node_type: 'class', name: { in: ['User', 'Account'] } }
```

Value of name is either User or Account

```
{ node_type: 'class', name: { not_in: ['User', 'Account'] } }
```

Value of name is neither User nor Account

```
{ node_type: 'def', arguments: { includes: 'id' } }
```

Value of arguments includes id

```
{ node_type: 'def', arguments: { not_includes: 'id' } }
```

Value of arguments not includes id

```
{ node_type: 'class', name: /User/ }
```

Value of name matches User

```
{ node_type: 'class', name: { not: /User/ } }
```

Value of name does not match User

```
{ node_type: 'class', name: { in: [/User/, /Account/] } }
```

Value of name matches either /User/ or /Account/

##### rules matches array nodes attribute

```
{ node_type: 'def', arguments: ['id', 'name'] }
```

It matches def node whose arguments are id and name.

### Evaluated Value

Evaluated value uses syntax `{%raw%}{{ ... }}{%endraw%}` to fetch child node or value, e.g.

```ruby
{% raw %}# assert_equal(actual, "rubocop-minitest")
# =>
# assert_equal("rubocop-minitest", actual)
replace :arguments, with: '{{arguments.1}}, {{arguments.first}}'{% endraw %}
```

```ruby
{% raw %}# { class: User }
# =>
# { class: 'User' }
replace 'class_value', with: "'{{class_source}}'"{% endraw %}
```
