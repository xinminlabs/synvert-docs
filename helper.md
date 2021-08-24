---
layout: page
title: Helper
---

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

Synvert also requires `active_support/core_ext/object`, so you can use
lots of helper methods introduced in `active_support/core_ext/object`.

Check out helper source code [here][1]

[1]: https://github.com/xinminlabs/synvert-core-ruby/blob/master/lib/synvert/core/rewriter/helper.rb
