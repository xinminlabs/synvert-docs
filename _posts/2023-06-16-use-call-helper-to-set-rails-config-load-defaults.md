---
layout: default
title: Use call_helper to set rails config.load_defaults
date: 2023-06-16
categories: ruby
permalink: /:categories/:title/index.html
---

In Rails, `config.load_defaults` loads default configuration values for a target version and all versions prior. For example, `config.load_defaults` 6.0 will load defaults for all versions up to and including version 6.0. So every time we upgrade rails version, we need to change `config.load_defaults` to the new version.

Let's use synvert to set the `config.load_defaults`. For example, we want to set `config.load_defaults` to 6.0, we can write the following snippet:

```ruby
within_file 'config/application.rb' do
  with_node node_type: 'class', name: 'Application' do
    exists = false
    with_node node_type: 'send', receiver: 'config', message: 'load_defaults', arguments: { size: 1 } do
      exists = true
      replace_with "config.load_defaults 6.0"
    end
    unless exists
      prepend "config.load_defaults 6.0"
    end
  end
end
```

First, the snippet searches for the file `config/application.rb`. Once found, it looks for `class Application` within that file. After locating the class, it searches for the code containing `config.load_defaults` and replaces it with `config.load_defaults 6.0` if it exists. In cases where `config.load_defaults` is not found, it adds `config.load_defaults 6.0` at the beginning of the class.

While it works, it becomes cumbersome when we need to upgrade rails to version 6.1 and 7.0. In such cases, we would have to manually copy and paste the snippet and modify 6.0 to 6.1 and 7.0.

To overcome this duplication issue, we introduced the concept of Helper. By doing so, we can extract the above snippet into a reusable Helper:

```ruby
Synvert::Helper.new 'rails/set_load_defaults' do |options|
  rails_version = options[:rails_version]

  within_file 'config/application.rb' do
    with_node node_type: 'class', name: 'Application' do
      exists = false
      with_node node_type: 'send', receiver: 'config', message: 'load_defaults', arguments: { size: 1 } do
        exists = true
        replace_with "config.load_defaults #{rails_version}"
      end
      unless exists
        prepend "config.load_defaults #{rails_version}"
      end
    end
  end
end
```

This snippet defines a Helper called `rails/set_load_defaults`. This Helper takes an option called `rails_version` as input.

To utilize this Helper, we can use the `call_helper` API to execute the Helper and provide `rails_version` option as a parameter:

```ruby
Synvert::Rewriter.new 'rails', 'upgrade_5_2_to_6_0' do
  call_helper 'rails/set_load_defaults', rails_version: '6.0'
end
```

It sets `config.load_defaults` to 6.0.

```ruby
Synvert::Rewriter.new 'rails', 'upgrade_6_0_to_6_1' do
  call_helper 'rails/set_load_defaults', rails_version: '6.1'
end
```

It sets `config.load_defaults` to 6.1.

Helpers are extremely beneficial as they enable us to extract commonly used code from different snippets. This means that instead of repeating the same code across different snippets, we can place it in a Helper and reuse it wherever needed. This approach enhances code reusability and helps in keeping the codebase concise and organized.
