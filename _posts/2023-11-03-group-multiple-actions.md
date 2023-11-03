---
layout: default
title: Group multiple actions
date: 2023-11-03
categories: ruby
permalink: /:categories/:title/index.html
---

In the episode [upgrade rails 4.2 to 5.0 part 3](https://synvert.substack.com/p/use-synvert-to-upgrade-rails-4-2-to-5-0-part-3), we convert the usage of `after_commit` with `on: :create` to `after_create_commit` using the following Synvert snippet:

```ruby
{% raw %}Synvert::Rewriter.new 'rails', 'use_after_commit_alias' do
  if_gem 'activerecord', '>= 5.0'
  within_files 'app/models/**/*.rb' do
    with_node node_type: 'send', receiver: nil, message: 'after_commit',
              arguments: { size: 2, '1': { node_type: 'hash', on_value: { in: %i[create update destroy] } } } do
      delete 'arguments.1.on_pair', and_comma: true
      replace :message, with: 'after_{{arguments.1.on_value}}_commit'
    end
  end
end{% endraw %}
```

When you search in the VSCode Synvert extension, you will see two actions.

![Upgrade rails 4.2 to 5.0 5]({{ site.baseurl }}/img/upgrade-rails-4-2-to-5-0-5.png)

The first action is to replace `after_commit` with `after_create_commit`, and the second action is to delete `on: :create`. Performing these actions one after the other can be cumbersome and may lead to mistakes.

To simplify this process, we introduced a new `group` DSL. This `group` groups multiple actions into a single group, allowing you to execute them in one click. Here's how the modified snippet looks:

```ruby
{% raw %}Synvert::Rewriter.new 'rails', 'use_after_commit_alias' do
  if_gem 'activerecord', '>= 5.0'
  within_files 'app/models/**/*.rb' do
    with_node node_type: 'send', receiver: nil, message: 'after_commit',
              arguments: { size: 2, '1': { node_type: 'hash', on_value: { in: %i[create update destroy] } } } do
      group do
        delete 'arguments.1.on_pair', and_comma: true
        replace :message, with: 'after_{{arguments.1.on_value}}_commit'
      end
    end
  end
end{% endraw %}
```

With this modification, you can now apply both the replace and delete actions with a single click, making the process more efficient.

The grouping functionality also applies to JavaScript snippets. For instance, consider the following snippet that converts the usage of `<div className="container"></div>` to `<Container></Container>`:

```javascript
{% raw %}new Synvert.Rewriter("group", "name", () => {
  configure({ parser: Synvert.Parser.TYPESCRIPT });
  withinFiles("**/*.jsx", () => {
    withNode({ nodeType: "JsxElement", openingElement: { nodeType: "JsxOpeningElement", tagName: "div", attributes: { nodeType: "JsxAttributes", properties: { 0: { nodeType: "JsxAttribute", name: "className", initializer: { nodeType: "StringLiteral", text: "container" } }, length: 1 } } }, closingElement: { nodeType: "JsxClosingElement", tagName: "div" } }, () => {
      replace("closingElement", { with: "</Container>" });
      replace("openingElement", { with: "<Container>" });
    });
  });
});{% endraw %}
```

The search results include two actions: one for replacing closing element `</div>` with `</Container>` and the other for replacing opening element `<div className="container">` with `<Container>`.

To simplify and group these two actions, you can use the `group` function:

```javascript
{% raw %}new Synvert.Rewriter("group", "name", () => {
  configure({ parser: Synvert.Parser.TYPESCRIPT });
  withinFiles("**/*.jsx", () => {
    withNode({ nodeType: "JsxElement", openingElement: { nodeType: "JsxOpeningElement", tagName: "div", attributes: { nodeType: "JsxAttributes", properties: { 0: { nodeType: "JsxAttribute", name: "className", initializer: { nodeType: "StringLiteral", text: "container" } }, length: 1 } } }, closingElement: { nodeType: "JsxClosingElement", tagName: "div" } }, () => {
      group(() => {
        replace("closingElement", { with: "</Container>" });
        replace("openingElement", { with: "<Container>" });
      });
    });
  });
});{% endraw %}
```

With this modification, you can now apply both the replace actions with a single click.
