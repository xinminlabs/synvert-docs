---
layout: ruby
title: Docs
---

## Terms

### Snippet

Snippet is a piece of code to define what code need to convert and how
to convert the code.

### Rewriter

Rewriter is the top level namespace in a snippet.

One rewriter checks if the dependency version matches.

One rewriter contains one or many instances.

### Instance

Instance is an execution unit, it finds specified ast nodes, checks
if the nodes match some conditions, then add, replace or remove code.

One instance can contains any scopes or conditions.

### Scope

Scope just likes its name, different scope points to different
current node.

One scope defines some rules, it finds new nodes and changes
current node to matching node.

### Condition

Condition is used to check if the node matches the rules, condition
won't change the node scope.

### Action

Action does some real action, e.g. insert / replace / delete code.

## Rules

synvert compares ast nodes with key / value pairs, each ast node has
multiple attributes, e.g. `receiver`, `message` and `arguments`, it
matches only when all of key / value pairs match.

```ruby
type: 'send', message: :include, arguments: ['FactoryGirl::Syntax::Methods']
```

synvert does comparison based on the value type

1. if value is a symbol, then compares ast node value as symbol, e.g.
   `message: :include`
2. if value is a string, then compares ast node original source code,
   e.g. `name: 'Synvert::Application'`
3. if value is a regexp, then compares ast node original source code,
   e.g. `message: /find_all_by_/`
4. if value is an array, then compares each ast node, e.g. `arguments:
   ['FactoryGirl::Syntax::Methods']`
5. if value is nil, then check if ast node is nil, e.g. `arguments:
   [nil]`
6. if value is true or false, then check if ast node is :true or :false,
   e.g. `arguments: [false]`
7. if value is ast, then compare ast node directly, e.g. `to_ast:
   Parser::CurrentRuby.parse("self.class.serialized_attributes")`

it can compare nested key / value pairs, like

```ruby
# matches config.activerecord.identity_map = ...
type: 'send', receiver: { type: 'send', receiver: { type: 'send', message: 'config' }, message: 'active_record' }, message: 'identity_map='
```

## Source code to ast node

### command line

```
$ ruby-parse -e 'RSpec.configure do |config|; include EmailSpec::Helpers; include EmailSpec::Matchers; end'

(block
  (send
    (const nil :RSpec) :configure)
  (args
    (arg :config))
  (begin
    (send nil :include
      (const
        (const nil :EmailSpec) :Helpers))
    (send nil :include
      (const
        (const nil :EmailSpec) :Matchers))))
```

### ruby code

```ruby
require 'parser/current'

code = <<~EOS
  RSepc.configure do |config|
    include EmailSpec::Helpers
    include EmailSpec::Matchers
  end
EOS

Parser::CurrentRuby.parse code

# (block
#   (send
#     (const nil :RSpec) :configure)
#   (args
#     (arg :config))
#   (begin
#     (send nil :include
#       (const
#         (const nil :EmailSpec) :Helpers))
#     (send nil :include
#       (const
#         (const nil :EmailSpec) :Matchers))))
```

## AST node attributes

AST node is just an array, by default, it has only 2 attributes,
the first element is `type`, the others are `children`.

```ruby
node = Parser::CurrentRuby.parse "user = User.new"
# (lvasgn :user
#   (send
#     (const nil :User) :new))

node.type
# => :lvasgn

node.children
# [:user, (send (const nil :User) :new))
```

synvert adds many additional attributes.

### :send node

`receiver`, `message` and `arguments` attributes for :send node.

```ruby
node = Parser::CurrentRuby.parse "User.find 1"
# (send
#   (const nil :User) :find
#     (int 1))

node.receiver
# => (const nil :user)

node.message
# => :find

node.arguments
# [(int 1)]
```

### :class node

`name`, `parent_class` and `body` for :class node.

```ruby
node = Parser::CurrentRuby.parse "class Admin < User; end"
# (class
#   (const nil :Admin)
#     (const nil :User) nil)

node.name
# (const nil :Admin)

node.parent_class
# (const nil :User)

node.body

# nil
```

### :module node

`name` and `body` for :module node.

```ruby
node = Parser::CurrentRuby.parse "module Helper; end"
# (module
#   (const nil :Helper) nil)

node.name
# (const nil Helper)

node.body
# nil
```

### :def node

`name`, `arguments` and `body` for :def node.

```ruby
code = <<~EOS
  def full_name(first_name, last_name)
    first_name + " " + last_name
  end
EOS
node = Parser::CurrentRuby.parse code
# (def :full_name
#   (args
#     (arg :first_name)
#     (arg :last_name))
#   (send
#     (send
#       (lvar :first_name) :+
#       (str " ")) :+
#     (lvar :last_name)))

node.name
# :full_name

node.arguments
# (args (arg :first_name) (arg :last_name))

node.body
# (send (send (lvar :first_name) :+ (str " ")) :+ (lvar :last_name))
```

### :defs node

`name`, `arguments` and `body` for :defs node.

```ruby
code = <<~EOS
  def self.active
    where(active: true)
  end
EOS
node = Parser::CurrentRuby.parse code
# (defs
#   (self) :active
#   (args)
#   (send nil :where
#     (hash
#       (pair
#         (sym :active)
#         (true)))))

node.name
# :active

node.arguments
# (args)

node.body
# (send nil :where (hash (pair (sym :active) (true))))
```

### :block node

`caller`, `arguments` and `body` for :block node.

```ruby
code = <<~EOS
  RSpec.configure do |config|
    config.order = 'random'
  end
EOS
node = Parser::CurrentRuby.parse code
# (block
#   (send
#     (const nil :RSpec) :configure)
#   (args
#     (arg :config))
#   (send
#     (lvar :config) :order=
#     (str "random")))

node.caller
# (send (const nil :RSpec) :configure)

node.arguments
# (args (arg :config))

node.body
# (send (lvar :config) :order= (str "random"))
```

### :lvar node

`name` for :lvar node.

```ruby
node = Parser::CurrentRuby.parse("foo = 'bar'\nfoo").children.last
# (lvar :foo)

node.name
# :foo
```

### :ivar node

`name` for :ivar node.

```ruby
node = Parser::CurrentRuby.parse("@foo = 'bar'\n@foo").children.last
# (ivar :@foo)

node.name
# :@foo
```

### :cvar node

`name` for :cvar node.

```ruby
node = Parser::CurrentRuby.parse("@@foo = 'bar'\n@@foo").children.last
# (cvar :@@foo)

node.name
# :@@foo
```

### :lasgn node

`left_value` and `right_value` for :lasgn node.

```ruby
node = Parser::CurrentRuby.parse('a = 1')
# s(:lvasgn, :a, s(:int, 1))

node.left_value
# :a

node.right_value
# s(:int, 1)
```

### :iasgn node

`left_value` and `right_value` for :iasgn node.

```ruby
node = Parser::CurrentRuby.parse('@a = 1')
# s(:ivasgn, :@a, s(:int, 1))

node.left_value
# :@a

node.right_value
# s(:int, 1)
```

### :casgn node

`left_value` and `right_value` for :casgn node.

```ruby
node = Parser::CurrentRuby.parse('@@a = 1')
# s(:cvasgn, :@@a, s(:int, 1))

node.left_value
# :@@a

node.right_value
# s(:int, 1)
```

### :masgn node

`left_value` and `right_value` for :masgn node.

```ruby
node = Parser::CurrentRuby.parse('a, b = 1, 2')
# s(:masgn,
#   s(:mlhs,
#     s(:lvasgn, :a),
#     s(:lvasgn, :b)),
#   s(:array,
#     s(:int, 1),
#     s(:int, 2)))

node.left_value
# s(:mlhs,
#   s(:lvasgn, :a),
#   s(:lvasgn, :b)),

node.right_value
# s(:array,
#   s(:int, 1),
#   s(:int, 2)))
```

### :or_asgn node

`left_value` and `right_value` for :or_asgn node.

```ruby
node = Parser::CurrentRuby.parse('a ||= 1')
# s(:or_asgn,
#   s(:lvasgn, :a),
#   s(:int, 1))

node.left_value
# :a

node.right_value
# (:int, 1)
```

### :defined? node

`arguments` for :defined? node.

```ruby
node = Parser::CurrentRuby.parse "defined?(User)"
# (defined?
#   (const nil :User))

node.arguments
# [(const nil :User)]
```

### hash node

`keys`, `values` for :hash node.

```ruby
node = Parser::CurrentRuby.parse "{first_name: 'richard', last_name: 'huang'}"
# (hash
#   (pair
#     (sym :first_name)
#     (str "richard"))
#   (pair
#     (sym :last_name)
#     (str "huang")))

node.keys
# [(sym :first_name), (sym :last_name)]

node.values
# [(str "richard"), (str "huang")]
```

### pair node

`key` and `value` for :pair node.

```ruby
node = Parser::CurrentRuby.parse("{first_name: 'richard', last_name: 'huang'}").children.first
# (pair
#   (sym :first_name)
#   (str "richard"))

node.key
# (sym :first_name)

node.value
# (str "richard")
```

## AST node methods

### strip_curly_braces

strip curly braces

```ruby
node = parse("{ foo: 'bar' }")
node.strip_curly_braces
# foo: 'bar'
```

### wrap_curly_braces

wrap curly braces

```ruby
node = parse("test(foo: 'bar')").arguments.first
node.wrap_curly_braces
# { foo: 'bar' }
```

### to_single_quote

converts double quote to single quote.

```ruby
node = parse('"foobar"')
node.to_single_quote
# 'foobar'
```

### to_symbol

convert string to symbol.

```ruby
node = parse("'foobar'")
node.to_symbol
# :foobar
```

### to_lambda_literal

convert lambda node to lambda literal.

```ruby
node = Parser::CurrentRuby.parse "lambda { foobar }"
# s(:block,
#   s(:send, nil, :lambda),
#   s(:args),
#   s(:send, nil, :foobar))
node.to_lambda_literal
# -> { foobar }
```

### has_key?(key)

check if :hash node contains key.

```ruby
node = Parser::CurrentRuby.parse "{first_name: 'richard', last_name: 'huang'}"
# (hash
#   (pair
#     (sym :first_name)
#     (str "richard"))
#   (pair
#     (sym :last_name)
#     (str "huang")))

node.has_key? :first_name
# true

node.has_key? :full_name
# false
```

### hash_value(key)

fetch value for specified hash key.

```ruby
node = Parser::CurrentRuby.parse "{first_name: 'richard', last_name: 'huang'}"
# (hash
#   (pair
#     (sym :first_name)
#     (str "richard"))
#   (pair
#     (sym :last_name)
#     (str "huang")))

node.hash_value :first_name
# (str "richard")
```

### to_source

return exactly source code for an ast node.

```ruby
node = Parser::CurrentRuby.parse "{first_name: 'richard', last_name: 'huang'}"
node.to_source
# {first_name: 'richard', last_name: 'huang'}
```

### to_value

returns exactly value for an ast node.

```ruby
node = Parser::CurrentRuby.parse "{first_name: 'richard', last_name: 'huang'}"
node.hash_value(:first_name).to_value
# "richard"
```

## AST node operator

### any

Any child node matches.

```ruby
node = Parser::CurrentRuby.parse "config.middleware.swap ActionDispatch::ShowExceptions, Lifo::ShowExceptions"
# (send
#   (send
#     (send nil :config) :middleware) :swap
#   (const
#     (const nil :ActionDispatch) :ShowExceptions)
#   (const
#     (const nil :Lifo) :ShowExceptions))
```

matches

```ruby
type: 'send', arguments: { any: 'Lifo::ShowExceptions' }
```

### any_value

Node value matches any value but nil.

```ruby
node = Parser::CurrentRuby.parse "render nothing: true, status: :creatd"
# s(:send, nil, :render,
#   s(:hash,
#     s(:pair,
#       s(:sym, :nothing),
#       s(:true)),
#     s(:pair,
#       s(:sym, :status),
#       s(:sym, :creatd))))
```

matches

```ruby
type: 'hash', nothing_value: 'true', status_value: any_value
```

### not

```ruby
node = Parser::CurrentRuby.parse "obj.should matcher"
# (send
#   (send nil :obj) :should
#   (send nil :matcher))
```

matches

```ruby
type: 'send', receiver: { not: nil }, message: 'should'
```

### in

```ruby
node = Parser::CurrentRuby.parse "FactoryBot.create(:user)"
# s(:send,
#   s(:const, nil, :FactoryBot), :create,
#     s(:sym, :user))
```

matches

```ruby
type: 'send', receiver: 'FactoryBot', message: { in: [:create, :build] }
```

### not_in

```ruby
node = Parser::CurrentRuby.parse "FactoryBot.create(:user)"
# s(:send,
#   s(:const, nil, :FactoryBot), :create,
#     s(:sym, :user))
```

matches

```ruby
type: 'send', receiver: 'FactoryBot', message: { not_in: [:save, :update] }
```

If you want to get more, please read [here](https://github.com/xinminlabs/synvert-core-ruby/blob/master/lib/synvert/core/node_ext.rb).

## DSL

Synvert provides a simple dsl to define a snippet.

```ruby
Synvert::Rewriter.new "group_name", "snippet_name" do
  description "description"

  if_ruby ruby_version
  if_gem gem_name, gem_version

  within_file file_pattern do
    within_node rules do
      with_node rules do
        remove
      end
    end
  end

  within_files files_pattern do
    with_node rules do
      unless_exist_node rule do
        append code
      end
    end
  end
end
```

### description

Describe what the snippet does.

```ruby
description 'description of snippet'
```

### if\_ruby

Checks if current ruby version is greater than or equal to the
specified version.

```ruby
if_ruby '2.0.0'
```

### if\_gem

Checks the gem in `Gemfile.lock`, if gem version in `Gemfile.lock`
is less than, greater than or equal to the version in `if_gem`,
the snippet will be executed, otherwise, the snippet will be ignored.

```ruby
if_gem 'factory_girl', '= 2.0.0'
if_gem 'factory_girl', '~> 2.0.0'
if_gem 'factory_girl', '> 2.0.0'
if_gem 'factory_girl', '< 2.0.0'
if_gem 'factory_girl', '>= 2.0.0'
if_gem 'factory_girl', '<= 2.0.0'
```

### add\_file

Add a new file and write content.

```ruby
content = <<~EOS
  ActiveSupport.on_load(:action_controller) do
    wrap_parameters format: [:json]
  end
EOS
add_file 'config/initializers/wrap_parameters.rb', content
```

### remove\_file

Remove a file.

```ruby
remove_file 'config/initiliazers/secret_token.rb'
```

### within\_file / within\_files

Find files according to file pattern, the block will be executed
only for the matching files.

```ruby
within_file 'spec/spec_helper.rb' do
  # find nodes
  # check nodes
  # insert / replace / delete code
end
```

```ruby
within_files 'spec/**/*_spec.rb' do
  # find nodes
  # check nodes
  # insert / replace / delete code
end
```

### with\_node / within\_node

Find ast nodes according to the rules, the block will be executed for the matching nodes.

```ruby
with_node type: 'send', receiver: 'FactoryGirl', message: 'create' do
  # check nodes
  # insert / replace / delete code
end
```

```ruby
with_node type: 'block', 'caller.receiver': 'FactoryGirl', message: 'create' do
  # check nodes
  # insert / replace / delete code
end
```

### goto\_node

Go to the specified child code.

```ruby
with_node type: 'block' do
  goto_node :caller do
    # change code in block caller
  end
end
```

```ruby
with_node type: 'block' do
  goto_node 'caller.receiver' do
    # change code in block caller's receiver
  end
end
```

### if\_exist\_node

Check if the node matches rules exists, if matches, then executes the block.

```ruby
if_exist_node type: 'send', receiver: 'params', message: '[]' do
  # insert / replace / delete code
end
```

### unless\_exist\_node

Check if the node matches rules does not exist, if does not match, then executes the block.

```ruby
unless_exist_node type: 'send', message: 'include', arguments: ['FactoryGirl::Syntax::Methods'] do
  # insert / replace / delete code
end
```

### if\_only\_exist\_node

Check if the current node contains only one child node and the child node matches rules,
if matches, then executes the node.

```ruby
if_only_exist_node type: 'send', receiver: 'self', message: 'include_root_in_json=', arguments: [false] do
  # insert / replace / delete code
end
```

### append

Add the code at the bottom of the current node body.

```ruby
append 'config.eager_load = false'
```

### prepend

Add the code at the top of the current node body.

```ruby
prepend "include FactoryGirl::Syntax::Methods"
```

### insert

Insert the code at the beginning or end of the current or child node.

```ruby
insert 'URI.', at: 'beginning'
insert '.first', to: 'receiver', at: 'end'
```

### insert\_after

Add the code next to the current node.

```ruby
{% raw %}
secret = SecureRandom.hex(64)
insert_after "{{receiver}}.secret_key_base = '#{secret}'"
{% endraw %}
```

### replace\_with

Replace the current node with the code.

```ruby
{% raw %}
replace_with "create({{arguments}})"
{% endraw %}
```

### replace

Reaplce child node with the code.

```ruby
{% raw %}
replace :message, with: 'tr'
replace 'arguments.first', with: '{{arguments.first.to_symbol}}'
{% endraw %}
```

### remove

Remove the current node.

```ruby
remove
```

### delete

Delete the child nodes

```ruby
delete :dot, :mesage
delete 'arguments.first'
```

### wrap

Wrap the current node with a new code.

```ruby
wrap with: 'module ActiveSupport'
```

### replace\_erb\_stmt\_with\_expr

Replace erb statemet code with expression code.

```ruby
replace_erb_stmt_with_expr
```

### warn

Don't change any code, but will give a warning message.

```ruby
warn 'Using a return statement in an inline callback block causes a LocalJumpError to be raised when the callback is executed.'
```

### add\_snippet

Add other snippet, it's easy to reuse other snippets.

```ruby
add_snippet 'rails', 'convert_dynamic_finders'
```

### redo\_until\_no\_change

Rerun the snippet until no change affected.

```ruby
redo_until_no_change
```

### helper\_method

Add a method which is available in the current snippet.

```ruby
helper_method :method1 do |arg1, arg2|
  # do anything you want
end

method1(arg1, arg2)
```

### todo

List somethings the snippet should do, but not do yet.

```ruby
todo <<~EOS
  Rails 4.0 no longer supports loading plugins from vendor/plugins. You
  must replace any plugins by extracting them to gems and adding them to
  your Gemfile. If you choose not to make them gems, you can move them
  into, say, lib/my_plugin/* and add an appropriate initializer in
  config/initializers/my_plugin.rb.
EOS
```

## Helper

Synvert provides some global helper methods that you can use in any snippet.

### add\_receiver\_if\_necessary

It adds the receiver if original node contains receiver.

It's useful when you want to replace code but original code receiver can
be present or nil.

```ruby
with_node type: 'send', message: 'find', arguments: { size: 1, first: :all } do
  replace_with add_receiver_if_necessary("all")
end

# Post.find(:all) => Post.all
# find(:all) => all
```

### add\_arguments\_with\_parenthesis\_if\_necessary

It adds arguments with parenthesis if necessary.

If current_node doesn't have an argument, it returns `""`
If current_node has argument, it returns `"({{arguments}})"`

```ruby
with_node type: 'send', receiver: 'block', message: 'call' do
  replace_with "yield#{add_arguments_with_parenthesis_if_necessary}"
end

# block.call => yield
# block.call(foobar) => yield(foobar)
```

### add\_curly\_brackets\_if\_necessary

It adds curly brackets to code if necessary.

```ruby
add_curly_brackets_if_necessary("foo: 'bar'")
# => "{ foo: 'bar' }"

add_curly_brackets_if_necessary("{ foo: 'bar' }")
# => "{ foo: 'bar' }"
```

### strip\_brackets

It strips leading `{[(` and trailing `}])`

```ruby
strip_brackets "{foo: 'bar'}"
# => "foo: 'bar'

strip_brackets "['foo', 'bar']"
# => "'foo', 'bar'"

strip_brackets "(foo, bar)"
# => "foo, bar"
```

### reject_keys_from_hash

It rejects somes keys from hash

```ruby
hash_node = Parser::CurrentRuby.parse("{ key1: 'value1', key2: 'value2', key3: 'value3', key4: 'value4' }")
reject_keys_from_hash(hash_node, :key1, :key3)
# => "key2: 'value2', key4: 'value4'"
```

Synvert also requires `active_support/core_ext/object` and `active_support/core_ext_array`,
so you can use lots of activesupport helper methods.
