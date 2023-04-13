---
layout: default
title: Upgrade rails 4.2 to 5.0 Part 1
date: 2023-03-31
categories: ruby
permalink: /:categories/:title/index.html
---

[Rails](https://rubyonrails.org/) is one of the most popular web application frameworks, rails team releases a new version every year. In this tutorial series, I will demonstrate how to use Synvert to automatically upgrade your Rails application from 4.2 to 5.0.

### The first one is versioned migrations.

When you run the `db:migrate` task in rails 5.0, you will see the following warning:

>  Directly inheriting from ActiveRecord::Migration is deprecated. Please specify the Rails release the migration was written for:

So we need to change all migrations to inherit from `ActiveRecord::Migration[4.2]` instead of `ActiveRecord::Migration`.

To get started with Synvert, open VSCode and activate the Synvert Extension. Select the language as `ruby` and click "Show Generate Snippet Form".

Set the File Pattern as `db/migrate/*.rb`

Set the Gem Version as `activerecord >= 5.0`

Set the Input as

```ruby
class CreatePosts < ActiveRecord::Migration
end
```

and Output as

```ruby
class CreatePosts < ActiveRecord::Migration[4.2]
end
```

Finally, click the "Generate Snippet" button. This will generate the following snippet:

```ruby
Synvert::Rewriter.new 'group', 'name' do
  if_gem 'activerecord', '>= 5.0'
  within_files 'db/migrate/*.rb' do
    with_node node_type: 'class', name: 'CreatePosts', parent_class: 'ActiveRecord::Migration' do
      replace :parent_class, with: '{{parent_class}}[4.2]'
    end
  end
end
```

This is a simple and straightforward snippet that searches for the `class` node whose `name` is `CreatePosts` and `parent_class` is `ActiveRecord::Migration`, and replaces the `parent_class` with `{% raw %}{{parent_class}}[4.2]{% endraw %}`. To make it works with all migrations, we just need to remove the rule that `name` is `CreatePosts`. So the updated snippet is as follows:

```ruby
{% raw %}Synvert::Rewriter.new 'group', 'name' do
  if_gem 'activerecord', '>= 5.0'
  within_files 'db/migrate/*.rb' do
    with_node node_type: 'class', parent_class: 'ActiveRecord::Migration' do
      replace :parent_class, with: '{{parent_class}}[4.2]'
    end
  end
end{% endraw %}
```

Now we can search in our project

![Upgrade rails 4.2 to 5.0 1]({{ site.baseurl }}/img/upgrade-rails-4-2-to-5-0-1.png)

And replace them with `ActiveRecord::Migration[4.2]`.

### The next one is ApplicationRecord

> Active Record Models Now Inherit from ApplicationRecord by Default

It requires us to make two changes:

1. add a new file `app/models/application_record.rb`.

2. change all models to inherit from `ApplicationRecord` instead of `ActiveRecord::Base`.

Open the VSCode Synvert Extension. Select the language as `ruby` and click "Show Generate Snippet Form".

Set the File Pattern as `app/models/**/*.rb`

Set the Gem Version as `activerecord >= 5.0`

Set the Input as

```ruby
class Post < ActiveRecord::Base
end
```

and Output as

```ruby
class Post < ApplicationRecord
end
```

Click the "Generate Snippet" button, then it will generate the following snippet:

```ruby
Synvert::Rewriter.new 'group', 'name' do
  if_gem 'activerecord', '>= 5.0'
  within_files 'app/models/**/*.rb' do
    with_node node_type: 'class', name: 'Post', parent_class: 'ActiveRecord::Base' do
      replace :parent_class, with: 'ApplicationRecord'
    end
  end
end
```

It searches for the `class` node whose `name` is `Post` and `parent_class` is `ActiveRecord::Base`, then replaces the `parent_class` with `ApplicationRecord`. To make it works with all models, we just need to remove the rule that `name` is `Post`.

The updated snippet is as follows:

```ruby
Synvert::Rewriter.new 'group', 'name' do
  if_gem 'activerecord', '>= 5.0'
  within_files 'app/models/**/*.rb' do
    with_node node_type: 'class', parent_class: 'ActiveRecord::Base' do
      replace :parent_class, with: 'ApplicationRecord'
    end
  end
end
```

Now we can search in our project.

![Upgrade rails 4.2 to 5.0 2]({{ site.baseurl }}/img/upgrade-rails-4-2-to-5-0-2.png)

And replace them with `ApplicationRecord`.

To add the `app/models/application_record.rb` file, we can use the `add_file` api to let synvert create the file automatically.

```ruby
add_file 'app/models/application_record.rb', <<~EOS
  class ApplicationRecord < ActiveRecord::Base
    self.abstract_class = true
  end
EOS
```

We can do the same thing for `ApplicationMailer` and `ApplicationJob`.

That concludes this tutorial. In the next tutorial, I'll show you more cases when upgrading rails from 4.2 to 5.0. See you then!
