---
layout: ruby
title: Rules
---

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

## AST node method

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

If you want to get more, please read [here][1].

[1]: https://github.com/xinminlabs/synvert-core-ruby/blob/master/lib/synvert/core/node_ext.rb
