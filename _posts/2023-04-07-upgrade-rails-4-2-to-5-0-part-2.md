---
layout: default
title: Upgrade rails 4.2 to 5.0 Part 2
date: 2023-03-24
categories: ruby
permalink: /:categories/:title/index.html
---

In our previous tutorial, we learned how to use Synvert to upgrade rails 4.2 to 5.0 for some simple cases. In this tutorial, we'll take things a step further and dive into more complex use cases.

### The first one is ActiveModel::Errors#[]= is deprecated.

When you set the errors in model like `errors[:base] = 'foobar'` in rails 5.0, you will see the following warning:

> ActiveModel::Errors#[]= is deprecated and will be removed in Rails 5.1.
>
> Use model.errors.add(:#{attribute}, #{error.inspect}) instead.

So we need to replace them with `errors.add(:base, 'foobar')`.

To get started with Synvert, open VSCode and activate the Synvert Extension. Select the language as `ruby` and click "Show Generate Snippet Form".

Set the File Pattern as `app/models/**/*.rb`

Set the Gem Version as `activerecord >= 5.0`

Set the Input as `errors[:name] = 'must be present'` and Output as `errors.add(:name, 'must be present')`

Finally, click the "Generate Snippet" button. This will generate the following snippet:

```ruby
{% raw %}Synvert::Rewriter.new 'group', 'name' do
  within_files 'app/models/**/*.rb' do
    with_node node_type: 'send', receiver: { node_type: 'send', receiver: nil, message: 'errors', arguments: { size: 0 } }, message: '[]=', arguments: { size: 2, '0': :name, '1': "'must be present'" } do
      replace_with '{{receiver}}.add({{arguments.0}}, {{arguments.1}})'
    end
  end
end{% endraw %}
```

It searches for the `send` node whose `receiver` is also a `send` node, `receiver`'s `message` is `errors`, `message` is `[]=`, and it has 2 arguments, the first one is `:name`, the second is `'must be present'`, then replaces it with `{% raw %}{{receiver}}.add({{arguments.0}}), {{arguments.1}}){% endraw %}`.

As I shown in the previous tutorial, we can remove the rule `argument.0` and `arguments.1` to make it works with all cases. Here I'll show you another way.

Let's add a new input `errors[:email] = 'must be unique'` and output `errors.add(:email, 'must be unique')`. Then click the "Generate Snippet" button again. It will generate the following snippet:

```ruby
{% raw %}Synvert::Rewriter.new 'group', 'name' do
  within_files 'app/models/**/*.rb' do
    with_node node_type: 'send', receiver: { node_type: 'send', receiver: nil, message: 'errors', arguments: { size: 0 } }, message: '[]=', arguments: { size: 2 } do
      replace_with '{{receiver}}.add({{arguments.0}}, {{arguments.1}})'
    end
  end
end{% endraw %}
```

As we set the different values in `arguments.0` and `arguments.1`, the new generated snippet will ignore them.

Now we can search in our project

![Upgrade rails 4.2 to 5.0 3]({{ site.baseurl }}/img/upgrade-rails-4-2-to-5-0-3.png)

And replace them all.

### The next one is head response

If you use `render nothing: true` in rails 5.0, you will see the following warning:

> :nothing option is deprecated and will be removed in Rails 5.1. Use head method to respond with empty response body.

There are two cases:

1. if you use `render nothing: true` without set `status` option, you can just replace it with `head :ok`.

2. if you set `status` option, `render nothing: true, status: :created`, you can replace it with `head :created`.

Open the VSCode Synvert Extension. Select the language as `ruby` and click "Show Generate Snippet Form".

Set the File Pattern as `app/controllers/**/*.rb`

Set the Gem Version as `actionpack >= 5.0`

Set the Input as `render nothing: true` and Output as `head :ok`

Click the "Generate Snippet" button, then it will generate the following snippet:

```ruby
Synvert::Rewriter.new 'group', 'name' do
  within_files 'app/controllers/**/*.rb' do
    with_node node_type: 'send', receiver: nil, message: 'render', arguments: { size: 1, '0': { node_type: 'hash', nothing_value: true } } do
      replace :arguments, with: ':ok'
      replace :message, with: 'head'
    end
  end
end
```

It searches for the `send` node whose `message` is `render`, and first argument is `hash` whose `nothing_value` is `true`, then replaces the `message` with `head` and replaces the `arguments` with `:ok`.

Let's try another case. Set the Input as `render nothing: true, status: :created` and Output as `head :created`. Click the "Generate Snippet" button again. It will generate the following snippet:

```ruby
{% raw %}Synvert::Rewriter.new 'group', 'name' do
  within_files 'app/controllers/**/*.rb' do
    with_node node_type: 'send', receiver: nil, message: 'render', arguments: { size: 1, '0': { node_type: 'hash', nothing_value: true, status_value: :created } } do
      replace :arguments, with: '{{arguments.0.status_source}}'
      replace :message, with: 'head'
    end
  end
end{% endraw %}
```

The new snippet is similar to the previous one, but it has a new rule `status_value`, and it will replace the `arguments` with `{% raw %}{{arguments.0.status_source}}{% endraw %}`. To make it work for all status, we can change the `:created` to `{ not: nil }`.

We can handle the two cases in one snippet, it just needs to check if the `status_value`, if it is `nil`, we replace the `arguments` with `:ok`, otherwise we replace the `arguments` with `{% raw %}{{arguments.0.status_source}}{% endraw %}`.

The updated snippet is as follows:

```ruby
{% raw %}Synvert::Rewriter.new 'group', 'name' do
  within_files 'app/controllers/**/*.rb' do
    with_node node_type: 'send', receiver: nil, message: 'render', arguments: { size: 1, '0': { node_type: 'hash', nothing_value: true } } do
      replace :message, with: 'head'
      goto_node 'arguments.0' do
        with_node node_type: 'hash', status_value: nil do
          replace_with ':ok'
        end
        with_node node_type: 'hash', status_value: { not: nil } do
          replace_with '{{status_source}}'
        end
      end
    end
  end
end{% endraw %}
```

Now we can search in our project.

![Upgrade rails 4.2 to 5.0 4]({{ site.baseurl }}/img/upgrade-rails-4-2-to-5-0-4.png)

And replace them all.

That concludes this tutorial. I'll show you more cases in the next tutorial. See you then!
