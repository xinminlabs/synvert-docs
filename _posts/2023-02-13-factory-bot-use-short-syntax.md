---
layout: default
title: Use synvert to use factory_bot short syntax
date: 2023-02-13
categories: ruby
permalink: /:categories/:title/index.html
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/7TrKQWUcArU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

It's a long time since FactoryBot or FactoryGirl introduced short syntax, but it is still a good example to show how to use Synvert to refactor code.

The original syntax of FactoryBot is:

```ruby
FactoryBot.create(:user)
FactoryBot.build(:user)
FactoryBot.build_stubbed(:user)
```

The short syntax is:

```ruby
create(:user)
build(:user)
build_stubbed(:user)
```

First, I open the Synvert application, select language as `ruby`, set input as `FactoryBot.create(:user)` and output as `create(:user)`, then click "Generate Snippet" button, it will generate the snippet as follows:

```ruby
Synvert::Rewriter.new 'group', 'name' do
  within_files '**/*.rb' do
    find_node '.send[receiver=FactoryBot][message=create][arguments.size=1][arguments.0=:user]' do
      delete :receiver, :dot
    end
  end
end
```

It finds `send` node with receiver `FactoryBot`, message `create` and only one argument `user`, then it deletes the receiver and dot. But actually we don't care about the argument, there are 2 ways,

1. we can simply remove the argument statement,
2. or we can add more input / output, add `FactoryBot.create(:admin, is_admin: true)` as input and `create(:admin, is_admin: true)` as output, then generate the snippet again.

Now the snippet is as follows:

```ruby
Synvert::Rewriter.new 'group', 'name' do
  within_files '**/*.rb' do
    find_node '.send[receiver=FactoryBot][message=create]' do
      delete :receiver, :dot
    end
  end
end
```

It finds the `FactoryBot.create` code without caring about the argument, now we can search the code in the project.

![factory_bot use short syntax 1]({{ site.baseurl }}/img/factory-bot-user-short-syntax-1.png)

Cool, it finds all `FactoryBot.create` and tries to delete the `FactoryBot.`, now we can make the changes by clicking the "replace" icon.

It works for `FactoryBot.create` now, what about `FactoryBot.build`, `FactoryBot.build_stubbed` and other FactoryBot methods? We can use `in` operator to match multiple methods, let's change the snippet as follows:

```ruby
Synvert::Rewriter.new 'group', 'name' do
  within_files '**/*.rb' do
    find_node '.send[receiver=FactoryBot][message in (create build build_stubbed attributes_for create_list build_list)]' do
      delete :receiver, :dot
    end
  end
end
```

Let's we search again.

![factory_bot use short syntax 2]({{ site.baseurl }}/img/factory-bot-user-short-syntax-2.png)

Now it works for all FactoryBot methods, and we can replace them all.

The official snippet is [here](https://github.com/xinminlabs/synvert-snippets-ruby/blob/main/lib/factory_bot/use_short_syntax.rb), it also inserts `include FactoryBot::Syntax::Methods` statement.
