---
layout: default
title: Use Rex/Racc to build Node Query Language (Part 1)
date: 2023-09-22
categories: ruby
permalink: /:categories/:title/index.html
---

## Introduction to Rex and Racc

Lex and Yacc are classic tools in the world of compiler construction. Lex, short for "lexical analyzer generator", helps in breaking down the input code into smaller units called tokens, while Yacc, or "yet another compiler compiler", assists in parsing and analyzing the syntax of the code. These tools have been fundamental in building compilers, interpreters, and other language processing tools.

In the Ruby programming language, we have counterparts to Lex and Yacc called Rex and Racc, respectively. Rex and Racc are Ruby-based lexical analyzer and parser generator tools that bring the power of Lex and Yacc to the Ruby ecosystem. They allow Ruby developers to perform lexical analysis and parsing tasks with ease.

## Why Rex and Racc

We are developing [Synvert](https://synvert.net), a tool for writing ruby code to transform ruby code using Abstract Syntax Tree (AST). Among its features is the ability to query matching nodes within AST.

Initially, we simply iterated through the AST and compared node values. However, we recognized the need for a more powerful querying mechanism. This led us to create a node query language, inspired by CSS, as an example: `.class[name!=ApplicationRecord][parent_class=ActiveRecord::Base]` to query all class nodes whose name is not ApplicationRecord and parent class is ActiveRecord::Base. We implemented this feature using Rex and Racc, which proved to be a perfect fit for building this node query language.

Now we have built [node-query-ruby](https://github.com/synvert-hq/node-query-ruby), which is a ruby implementation of node query language. In the upcoming episodes, we'll be sharing our knowledge on how to build this node query language.

## Set up Rex and Racc

In this episode, we will set up a "hello world" example using Rex and Racc. This example will parse the input string `hello world` and return an array `['hello', 'world']`.

### Build a new gem

Let's create a new gem called `node-query` using bundler. Follow these steps:

1. Generate the gem structure:

```bash
$ bundle gem node-query
```

{:start="2"}
2. Navigate to the newly created `node-query` directory:

```bash
$ cd node-query
```

{:start="3"}
3. Remove the existing spec file:

```bash
$ rm spec/node/query_spec.rb
```

{:start="4"}
4. Next, make sure to update the `TODO`s in the `node-query.gemspec`

### Set up Rex

1. Begin by adding the `oedipus_lex` gem:

```ruby
$ bundle add oedipus_lex
```

{:start="2"}
2. Define lexer rules in `lib/node/query/lexer.rex`:

```ruby
class NodeQueryLexer
rules
# [:state]    pattern    [actions]
             /\s+/
             /\w+/      { [:TEXT, text] }
end
```

In this section, you can define multiple rules, each composed by three parts:

* An optional state (as a `:symbol`), a predicate method, or nothing.
* A regular expression.
* An action, an action block, or nothing.

Here, we've defined two rules:

* The first rule doesn't specify a state, matches one or more spaces, and takes no action.
* The second rule also lacks a state, matches one or more word characters, and returns a `:TEXT` token with the matched text.

We'll be presenting additional examples featuring various states and actions in the upcoming sections.

{:start="3"}
1. Define a rake task to generate the lexer:

```ruby
Rake.application.rake_require "oedipus_lex"

file "lib/node/query/lexer.rex.rb" => "lib/node/query/lexer.rex"
task :lexer => "lib/node/query/lexer.rex.rb"
```

This rake task internally defines a rule to generate `lexer.rex.rb` from `lexer.rex` in `oedipus_lex`.

{:start="4"}
4. Execute the rake task:

```bash
$ rake lexer
```

This generates a `lexer.rex.rb` file, defining a `NodeQueryLexer` class and provides two methods.

* `parse`: To parse input string.
* `next_token`: To retrieve the next token.

{:start="5"}
5. Next, add a test file named `spec/node/query/lexer_spec.rb`:

```ruby
require 'spec_helper'

RSpec.describe NodeQueryLexer do
  it 'generates hello and world tokens' do
    lexer = described_class.new
    lexer.parse('hello world')
    tokens = []
    while token = lexer.next_token
      tokens << token
    end
    expect(tokens).to eq [
      [:TEXT, 'hello'],
      [:TEXT, 'world']
    ]
  end
end
```

This asserts that the lexer parses the input string `hello world` and returns two tokens: `[:TEXT, 'hello']` and `[:TEXT, 'world']`.

{:start="6"}
6. Run the test

```bash
$ rspec spec/node/query/lexer_spec.rb
```

You'll encounter a test failure with the following error:

```bash
NameError:
  uninitialized constant NodeQueryLexer
# ./spec/node/query/lexer_spec.rb:3:in `<top (required)>'
```

This occurs because we haven't yet required `lexer.rex`. To fix this, add the following line to `lib/node/query.rb`:

```ruby
require_relative "query/lexer.rex"
```

Now, rerun the test, you'll encounter another failure:

```bash
1) NodeQueryLexer generates hello world token
NameError:
  undefined local variable or method `do_parse' for #<NodeQueryLexer:0x000000010ad662c0 @ss=#<StringScanner 0/11 @ "hello...">, @state=nil>
# ./lib/node/query/lexer.rex.rb:69:in `parse'
# ./spec/node/query/lexer_spec.rb:6:in `block (2 levels) in <top (required)>'
```

To resolve this, we can add an empty `do_parse` method to the `lexer.rex` `inner` option:

```ruby
class NodeQueryLexer
rules
# [:state]    pattern    [actions]
              /\s+/
              /\w+/      { [:TEXT, text] }

inner
  def do_parse; end
end
```

{:start="7"}
1. Rerun the rake task:

```ruby
$ rake lexer
```

It will insert the empty `do_parse` method into `lexer.rex.rb`.

{:start="8"}
8. Rerun the test:

```ruby
$ rspec spec/node/query/lexer_spec.rb
```

It should pass successfully.

### Set up Racc

1. Begin by adding the `racc` gem:

```ruby
$ bundle add racc
```

{:start="2"}
2. Define parser rule in `lib/node/query/parser.y`:

```ruby
class NodeQueryParser
options no_result_var

# Declare the token types used by the parser.
token TEXT

# Define the production rules for the grammar.
rule
  # Define the non-terminal symbol 'words' in the grammar.
  words
  : word words { [val[0], val[1]].flatten }
  | word { [val[0]] }

  # Define the non-terminal symbol 'word' in the grammar.
  word
  : TEXT { val[0] }
end
```

The `NodeQueryParser` class defines the grammar for the parser. It contains two parts:

* The `words` rule defines the non-terminal symbol `words` in the grammar. It has two productions: `word words` and `word`. The `word words` production returns an array of the first and second elements of the `val` array. The `word` production returns an array of the first element of the `val` array.
* The `word` rule defines the non-terminal symbol `word` in the grammar. It has one production: `TEXT`. This production returns the first element of the `val` array.

{:start="3"}
1. Define a rake task to generate the parser:

```ruby
file "lib/node/query/parser.racc.rb" => "lib/node/query/parser.y"
task :parser => "lib/node/query/parser.racc.rb"

rule '.racc.rb' => '.y' do |t|
  cmd = "bundle exec racc -l -v -o #{t.name} #{t.source}"
  sh cmd
end
```

This rake task explicitly defines a rule to generate `parser.racc.rb` from `parser.y`.

{:start="4"}
4. Execute the rake task:

```bash
$ rake parser
```

This generates a `parser.racc.rb` file, which defines a `NodeQueryParser` class and provides a single method.

* `parse`: To parse input strings.

{:start="5"}
5. Now, let's add a test file named `spec/node/query/parser_spec.rb`:

```ruby
require 'spec_helper'

RSpec.describe NodeQueryParser do
  it 'parses hello world string' do
    parser = described_class.new
    result = parser.parse('hello world')
    expect(result).to eq ['hello', 'world']
  end
end
```

This asserts that the parser parses the input string `hello world` and returns an array `['hello', 'world']`.

{:start="6"}
6. Run the test:

```bash
$ rspec spec/node/query/parser_spec.rb
```

You'll encounter a test failure:

```bash
NameError:
  uninitialized constant NodeQueryParser
# ./spec/node/query/parser_spec.rb:3:in `<top (required)>'
```

This occurs because we haven't yet required `parser.racc`. To fix this, add the following line to `lib/node/query.rb`:

```ruby
require_relative "query/parser.racc"
```

Now rerun the test, You'll encounter another failure:

```bash
1) NodeQueryLexer generates hello world token
NoMethodError:
 undefined method `parse' for #<NodeQueryParser:0x00000001131b47e8>
# ./spec/node/query/parser_spec.rb:6:in `block (2 levels) in <top (required)>'
```

To resolve this, let's add `parse` and `next_token` methods to `parser.y` in the `---- inner` option:

```ruby
class NodeQueryParser
options no_result_var

# Declare the token types used by the parser.
token TEXT

# Define the production rules for the grammar.
rule
  # Define the non-terminal symbol 'words' in the grammar.
  words
  : word words { [val[0], val[1]].flatten }
  | word { [val[0]] }

  # Define the non-terminal symbol 'word' in the grammar.
  word
  : TEXT { val[0] }
end

---- inner
  def initialize
    # Initialize an instance of the lexer to tokenize input strings.
    @lexer = NodeQueryLexer.new
  end

  def parse(string)
    # Parse the input string using the lexer and the grammar rules
    @lexer.parse(string)
    do_parse
  end

  def next_token
    # Get the next token from the lexer.
    @lexer.next_token
  end
```

The `next_token` delegates to the lexer's `next_token` method, while the `parse` method delegates to the lexer's `parse` method and subsequently invokes the `do_parse` method to handle the grammers rule parsing.

{:start="7"}
1. Rerun the rake task:

```ruby
$ rake parser
```

It will insert the `parse` and `next_token` methods into `parser.racc.rb`.

{:start="8"}
8. Rererun the test:

```ruby
$ rspec spec/node/query/parser_spec.rb
```

It should pass successfully.

### Integrate with test

To streamline the testing process, we'll set up the lexer and parser rake tasks to run before executing the tests.

```ruby
task generate: [:lexer, :parser]
task spec: :generate
```

With this configuration, the generate task will ensure that both the lexer and parser tasks are executed, and the spec task will depend on the generate task, ensuring a smooth test execution workflow.

```bash
$ rake spec
```

This concludes the setup process for Rex and Racc. In the next episode, we'll start building a node query language using Rex and Racc.
