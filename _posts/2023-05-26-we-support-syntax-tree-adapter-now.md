---
layout: default
title: We support syntax_tree adapter now
date: 2023-05-26
categories: ruby
permalink: /:categories/:title/index.html
---

Synvert is a tool that helps you rewrite Ruby code automatically. It uses parser gem as the default Ruby adapter to parse and manipulate the code. Parser gem is a popular one and is used by tools like reek and rubocop. However, it has some limitations that make it hard to work with some features of Ruby, such as:

1\. It does not support comments by default. You have to use a separate method `parse_with_comments` to get the comments, and they are not attached to the code AST nodes.

```ruby
Parser::CurrentRuby.parse_with_comments(<<~EOS)
  # frozen_string_literal: true
  'hello world'
EOS
# => [s(:str, "hello world"), [#<Parser::Source::Comment (string):1:1 "# frozen_string_literal: true">]]
```

2\. It does not have token and location information for dot and parentheses. You cannot tell if a method call has parentheses or not.

```ruby
Parser::CurrentRuby.parse('FactoryBot.create(:user)')
# => s(:send, s(:const, nil, :FactoryBot), :create, s(:sym, :user))
```

We found a better alternative: syntax_tree gem. It is built on top of Ruby’s built-in parser Ripper, and it can solve the above problems. It also has some advantages over parser gem, such as:

1\. It supports comments by default. You can query and mutate the comments along with the code AST nodes using NQL (Node Query Language).

```ruby
SyntaxTree.parse(<<~EOS)
  # frozen_string_literal: true
  'hello world'
EOS
# => (statements ((comment "# frozen_string_literal: true"), (string_literal ((tstring_content "hello world")))))
```

2\. It has token and location information for dot and parentheses. You can access dot location through the operator of a call node.

```ruby
node = SyntaxTree.parse('FactoryBot.create(:user)')
# => (program (statements ((call (var_ref (const "FactoryBot")) (period ".") (ident "create") (arg_paren (args ((symbol_literal (ident "user")))))))))

node.statements.body.first.operator.location
# => #<SyntaxTree::Location:0x0000000111ded750 @end_char=11, @end_column=11, @end_line=1, @start_char=10, @start_column=10, @start_line=1>
```

Using syntax_tree gem, we can create a new snippet ruby/frozen_string_comment that inserts `# frozen_string_literal: true` at the beginning of every Ruby file that does not have it.

```ruby
# frozen_string_literal: true

Synvert::Rewriter.new 'ruby', 'frozen_string_literal_comment' do
  configure(parser: Synvert::SYNTAX_TREE_PARSER)

  within_files Synvert::ALL_RUBY_FILES do
    find_node ":not_has(> .Comment[value='# frozen_string_literal: true'])" do
      insert "# frozen_string_literal: true\n\n", at: 'beginning'
    end
  end
end
```

This snippet uses NQL to query Comment nodes directly, and inserts the comment if it does not exist.

However, syntax_tree gem also has some drawbacks, such as:

1\. It generates different AST nodes for a method call with parentheses and without parentheses. This can be confusing and inconsistent.

```ruby
SyntaxTree.parse('FactoryBot.create(:user)')
# => (program (statements ((call (var_ref (const "FactoryBot")) (period ".") (ident "create") (arg_paren (args ((symbol_literal (ident "user")))))))))

SyntaxTree.parse('FactoryBot.create :user')
# => (program (statements ((command_call (var_ref (const "FactoryBot")) (period ".") (ident "create") (args ((symbol_literal (ident "user"))))))))
```

2\. It is tedious to query AST nodes. To query the first argument of `FactoryBot.create(:user)` call, the NQL has to be `.Call[arguments.arguments.parts.first=:user]`.

We are still using parser gem by default, and use syntax_tree gem for some special cases.

If you want to try syntax_tree with Synvert, you just need to add `configure(parser: Synvert::SYNTAX_TREE_PARSER)` to your snippet.
