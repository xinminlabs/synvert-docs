---
layout: default
title: How to write a snippet
---

## Table of Contents

- [Table of Contents](#table-of-contents)
- [I'm familiar with ast nodes and synvert DSLs](#im-familiar-with-ast-nodes-and-synvert-dsls)
- [I'm not familiar](#im-not-familiar)
  - [Javascript example](#javascript-example)
  - [Ruby Example](#ruby-example)
- [Contact Us](#contact-us)

## I'm familiar with ast nodes and synvert DSLs

Then you can write your own snippet easily and fast.

## I'm not familiar

Don't worry, we provides a way to generate snippet for most simple cases.

On Synvert VSCode extension, Synvert GUI and Synvert Web, you can input some original code and expected code,
then ask synvert to generate a snippet for you.

Let's show you some examples:

### Javascript example

If you want to convert javascript code from `string.match(/unicorn/)` to `/unicorn/.test(string)`,

you can add input code `string.match(/unicorn/)`

and output code `/unicorn/.test(string)`,

then synvert will generate the following snippet

```javascript
const Synvert = require("synvert-core");

new Synvert.Rewriter("group", "name", () => {
  configure({ parser: "typescript" });
  withinFiles('**/*.js', () => {
    findNode(`.CallExpression[expression=.PropertyAccessExpression[expression=string][name=match]][arguments.0=.RegularExpressionLiteral[text=/unicorn/]][arguments.length=1]`, () => {
      {% raw %}replaceWith("{{arguments.0}}.test({{expression.expression}})");{% endraw %}
    });
  });
});
```

It works, but it can just find exact `string.match(/unicorn/)`, it can't find code like `"foobar".match(/foobar/)`,
you need to add more input and output code.

Let's add additional input code `"foobar".match(/foobar/)`

and output code `/foobar/.test("foobar")`,

then synvert will generate the new snippet

```javascript
const Synvert = require("synvert-core");

new Synvert.Rewriter("group", "name", () => {
  configure({ parser: "typescript" });
  withinFiles('**/*.js', () => {
    findNode(`.CallExpression[expression=.PropertyAccessExpression[name=match]][arguments.0=.RegularExpressionLiteral][arguments.length=1]`, () => {
      {% raw %}replaceWith("{{arguments.0}}.test({{expression.expression}})");{% endraw %}
    });
  });
});
```

It matches any `CallExpression` code that the name of expression is `match` and the first argument is a regular expression,
ignores if the expression of expression is an identifier and if the text of regular expression is `unicorn`,
then it replaces the code with `{% raw %}{{arguments.0}}.test({{expression.expression}}){% endraw %}`.

### Ruby Example

From rails 2 to rails 3, we want to convert the activerecord code from `update_all(conditions, values)` to `where(conditions).update(values)`.

So you can add input code `Post.update_all({ title: 'old title' }, { title: 'new title' })`

and output code `Post.where(title: 'old title').update_all(title: 'new title')`,

then synvert will generate the following snippet

```ruby
Synvert::Rewriter.new 'group', 'name' do
  within_files '**/*.rb' do
    with_node type: 'send', receiver: 'Post', message: 'update_all', arguments: { size: 2, first: { type: 'hash', title_value: "'old title'" }, second: { type: 'hash', title_value: "'new title'" } } do
      {% raw %}replace :receiver, with: "{{receiver}}.where(title: 'old title')"{% endraw %}
      replace :arguments, with: "title: 'new title'"
    end
  end
end
```

It works, but it can just find exact `Post.update_all({ title: 'old title' }, { title: 'new title' })`,
it can't find code like `Article.update_all({ name: 'old name' }, { name: 'new name' })`,
you need to add more input and output code.

Let's add additional input code `Article.update_all({ name: 'old name' }, { name: 'new name' })`

and output code `Article.where(name: 'old name').update_all(name: 'new name')`,

then synvert will generate the new snippet

```ruby
Synvert::Rewriter.new 'group', 'name' do
  within_files '**/*.rb' do
    with_node type: 'send', message: 'update_all', arguments: { size: 2, first: { type: 'hash' }, second: { type: 'hash' } } do
      {% raw %}replace_with '{{receiver}}.where({{arguments.first.strip_curly_braces}}).update_all({{arguments.second.strip_curly_braces}})'{% endraw %}
    end
  end
end
```

It matches any `send` node with message `update_all` and two `hash` arguments, and replace the code with `where(first_argument).update_all(second_argument)`.

## Contact Us

Feel free to contact us about anything. We love receiving feedback from users!

[support@synvert.net](mailto:support@synvert.net)

Or you can post an issue on [github](https://github.com/xinminlabs/synvert/issues){:target="_blank"}.
