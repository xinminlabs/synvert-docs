---
layout: default
title: Synvert now supports the Prism parser
date: 2024-06-13
categories: ruby
permalink: /:categories/:title/index.html
---

Ruby 3.3 introduced a new standard library, [Prism](https://github.com/ruby/prism), a parser for the Ruby language. Prism is designed for portability, error tolerance, and maintainability.

I have integrated the Prism parser into Synvert using the Adapter pattern in the [node-query](https://github.com/synvert-hq/node-query-ruby) and [node-mutation](https://github.com/synvert-hq/node-mutation-ruby) gems. This involved implementing a Prism parser adapter, which was straightforward due to the flexible design of these gems.

The Prism adapter for node-query is available here: [https://github.com/synvert-hq/node-query-ruby/blob/main/lib/node_query/adapter/prism.rb](https://github.com/synvert-hq/node-query-ruby/blob/main/lib/node_query/adapter/prism.rb). It implements methods `is_node?`, `get_node_type`, `get_source`, `get_children`, `get_siblings`.

The Prism adapter for node-mutation can be found here: [https://github.com/synvert-hq/node-mutation-ruby/blob/main/lib/node_mutation/adapter/prism.rb](https://github.com/synvert-hq/node-mutation-ruby/blob/main/lib/node_mutation/adapter/prism.rb). This adapter includes methods `get_source`, `rewritten_source`, `file_source`, `child_node_range`, `get_start`, `get_end`, `get_start_loc`, `get_end_loc`.

In synvert-core, I simply added a `PRISM_PARSER` constant for parser configuration. When a snippet uses the `PRISM_PARSER`, it utilizes Prism to parse the source code and pass the AST nodes to node-query and node-mutation.

```ruby
Synvert::Rewriter.new 'group', 'name' do
  configure(parser: Synvert::PRISM_PARSER)
end
```

For example, the `ruby/map_and_flatten_to_flat_map` snippet is using the `PARSER_PARSER`, let's rewrite it to use the `PRISM_PARSER`. If you are unfamiliar with Prism AST nodes, you can use the [Synvert Playground](https://playground.synvert.net/ruby/generate-snippet) to generate snippets with the Prism parser.

```ruby
# frozen_string_literal: true

Synvert::Rewriter.new 'ruby', 'map_and_flatten_to_flat_map' do
  configure(parser: Synvert::PRISM_PARSER)

  within_files Synvert::ALL_RUBY_FILES + Synvert::ALL_RAKE_FILES do
    # enum.map do |item|
    #   # do something
    # end.flatten
    # =>
    # enum.flat_map do |item|
    #   # do something
    # end
    find_node '.call_node[receiver=.call_node[name=map][arguments=nil][block=.block_node]][name=flatten][arguments=nil]' do
      group do
        delete :call_operator, :name
        replace 'receiver.name', with: 'flat_map'
      end
    end
  end
end
```

Run the test command `bundle exec rspec spec/ruby/map_and_flatten_to_flat_map_spec.rb` to ensure the snippet functions as expected.
