---
layout: default
title: Upgrade rails 4.2 to 5.0 Part 3
date: 2023-04-14
categories: ruby
permalink: /:categories/:title/index.html
---

Welcome to the final installment of our serial upgrading rails 4.2 to 5.0 tutorials. I will guide you through the process of writing and testing your own Synvert snippet.

### Rails 5 has added three alias after_create_commit, after_update_commit and after_destroy_commit

Before Rails 5:

```ruby
after_commit :add_to_index_later, on: :create, if: :can_add?
after_commit :update_in_index_later, on: :update
after_commit :remove_from_index_later, on: :destroy
```

After Rails 5:

```ruby
after_create_commit :add_to_index_later, if: :can_add?
after_update_commit :update_in_index_later
after_destroy_commit :remove_from_index_later
```

It's cleaner. Let's write a snippet to upgrade the code.

First, nagivate to the synvert-snippet-ruby repository, if you don't have it yet, you can clone it from [github](https://github.com/xinminlabs/synvert-snippets-ruby)

```bash
cd synvert-snippets-ruby
```

It provides some utilities to test the snippet. We can run

```bash
synvert-ruby -g rails/use_after_commit_alias
```

to generate a template snippet in `lib/rails/use_after_commit_alias.rb`

```ruby
# frozen_string_literal: true

Synvert::Rewriter.new 'rails', 'use_after_commit_alias' do
  description <<~EOS
    It converts Foo to Bar

    ```ruby
    Foo
    ```

    =>

    ```ruby
    Bar
    ```
  EOS

  within_files '**/*.rb' do
    with_node type: 'const', to_source: 'Foo' do
      replace_with 'Bar'
    end
  end
end
```

and test code in `spec/rails/use_after_commit_alias_spec.rb`

```ruby
# frozen_string_literal: true

require 'spec_helper'

RSpec.describe 'Convert Foo to Bar' do
  let(:rewriter_name) { 'rails/use_after_commit_alias' }
  let(:fake_file_path) { 'foobar.rb' }
  let(:test_content) { 'Foo' }
  let(:test_rewritten_content) { 'Bar' }

  include_examples 'convertable'
end
```

In my experience, I have found that incorporating test-driven development when building a snippet can be highly effective. Let's run the test command.

```bash
bundle exec guard
```

It continuously monitors both the snippet code and test code, which means that whenever changes are made to the code, it will automatically rerun the test.

To begin constructing our snippet, let's update the case.

```ruby
# frozen_string_literal: true

require 'spec_helper'

RSpec.describe 'Convert Foo to Bar' do
  let(:rewriter_name) { 'rails/use_after_commit_alias' }
  let(:fake_file_path) { 'app/models/post.rb' }
  let(:test_content) { <<~EOS }
    class Post < ApplicationRecord
      after_commit :add_to_index_later, on: :create, if: :can_add?
      after_commit :update_in_index_later, on: :update
      after_commit :remove_from_index_later, on: :destroy
    end
  EOS

  let(:test_rewritten_content) { <<~EOS }
    class Post < ApplicationRecord
      after_create_commit :add_to_index_later, if: :can_add?
      after_update_commit :update_in_index_later
      after_destroy_commit :remove_from_index_later
    end
  EOS

  include_examples 'convertable'
end
```

The test has failed.

```diff
@@ -1,6 +1,6 @@
class Post < ApplicationRecord
-  after_create_commit :add_to_index_later, if: :can_add?
-  after_update_commit :update_in_index_later
-  after_destroy_commit :remove_from_index_later
+  after_commit :add_to_index_later, on: :create, if: :can_add?
+  after_commit :update_in_index_later, on: :update
+  after_commit :remove_from_index_later, on: :destroy
end
```

To resolve the test failure, we can take advantage of the VSCode Synvert extension. It allows us to quickly and easily locate the node that needs to be replaced, and generate a corresponding snippet.

Open the VSCode Synvert Extension. Select the language as `ruby` and click "Show Generate Snippet Form".

Set the File Pattern as `app/models/**/*.rb`

Set the Gem Version as `activerecord >= 5.0`

Set the Input as `after_commit :add_to_index_later, on: :create, if: :can_add?`

Set the Output as `after_create_commit :add_to_index_later, if: :can_add?`

Click the "Generate Snippet" button, then it will generate the following snippet:

```ruby
{% raw %}Synvert::Rewriter.new 'group', 'name' do
  if_gem 'activerecord', '>= 5.0'
  within_files 'app/models/**/*.rb' do
    with_node node_type: 'send', receiver: nil, message: 'after_commit', arguments: { size: 2, '0': :add_to_index_later, '1': { node_type: 'hash', on_value: :create, if_value: :can_add? } } do
      replace "arguments.1", with: 'if: {{arguments.1.if_source}}'
      replace :message, with: 'after_create_commit'
    end
  end
end{% endraw %}
```

We can copy the snippet to `lib/rails/use_after_commit_alias.rb` and make some changes.

We don't care about the value of the first argument, so we can remove the `arguments.0` rule.

Second argument must be a hash node, it must have `on` key and its value should be one of the `:create`, `:update` and `:destroy`, so we can say `on_value: { in: [:create, :update, :destroy] }`. We don't care if it has `if` key, so we can remove the `if_value` rule.

Instead of replace 'arguments.1', we can use `delete 'argunments.1.on_pair', and_comma: true` to delete the `on` key.

Then replace the message with  `{% raw %}after_{{arguments.1.on_value}}_commit{% endraw %}`.

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

The test has passed.

Let's try the snippet in our project. We can simply copy and paste it into the VSCode Synvert extension, then click the "Search" button.

![Upgrade rails 4.2 to 5.0 5]({{ site.baseurl }}/img/upgrade-rails-4-2-to-5-0-5.png)

And replace them all.

### Use keywords arguments in HTTP request methods

Before Rails 5:

```ruby
def test_show
  get user_path, { id: user.id }, { admin: user.admin? }, { notice: 'Welcome' }
  asssert_response :success
end
```

After Rails 5:

```ruby
def test_show
  get user_path, params: { id: user.id }, session: { admin: user.admin? }, flash: { notice: 'Welcome' }
  asssert_response :success
end
```

This makes it easier to understand what arguments are being passed.

Let's generate a new snippet.

```bash
synvert-ruby -g rails/use_keywords_arguments_in_http_request_methods
```

And add first test case

```ruby
context 'get request' do
  let(:rewriter_name) { 'rails/use_keywords_arguments_in_http_request_methods' }
  let(:fake_file_path) { 'spec/controllers/users_controller_spec.rb' }
  let(:test_content) { <<~EOS }
    def test_show
      get user_path, { id: user.id }, { admin: user.admin? }, { notice: 'Welcome' }
      asssert_response :success
    end
  EOS
  let(:test_rewritten_content) { <<~EOS }
    def test_show
      get user_path, params: { id: user.id }, session: { admin: user.admin? }, flash: { notice: 'Welcome' }
      asssert_response :success
    end
  EOS

  include_examples 'convertable'
end
```

The test has failed.

```diff
@@ -1,5 +1,5 @@
 def test_show
-  get user_path, params: { id: user.id }, session: { admin: user.admin? }, flash: { notice: 'Welcome' }
+  get user_path, { id: user.id }, { admin: user.admin? }, { notice: 'Welcome' }
   asssert_response :success
 end
```

Let's use the VSCode Synvert extension,

Set the File Pattern as `spec/controllers/**/*_spec.rb`

Set the Gem Version as `actionpack >= 5.0`

Set the Input as `get user_path, { id: user.id }, { admin: user.admin? }, { notice: 'Welcome' }`

Set the Output as `get user_path, params: { id: user.id }, session: { admin: user.admin? }, flash: { notice: 'Welcome' }`

Click the "Generate Snippet" button, then it will generate the following snippet:

```ruby
{% raw %}Synvert::Rewriter.new 'group', 'name' do
  within_files 'spec/controllers/**/*_spec.rb' do
    with_node node_type: 'send', receiver: nil, message: 'get', arguments: { size: 4, '0': { node_type: 'send', receiver: nil, message: 'user_path', arguments: { size: 0 } }, '1': { node_type: 'hash', id_value: { node_type: 'send', receiver: { node_type: 'send', receiver: nil, message: 'user', arguments: { size: 0 } }, message: 'id', arguments: { size: 0 } } }, '2': { node_type: 'hash', admin_value: { node_type: 'send', receiver: { node_type: 'send', receiver: nil, message: 'user', arguments: { size: 0 } }, message: 'admin?', arguments: { size: 0 } } }, '3': { node_type: 'hash', notice_value: "'Welcome'" } } do
      replace :arguments, with: '{{arguments.0}}, params: {{arguments.1}}, session: {{arguments.2}}, flash: {{arguments.3}}'
    end
  end
end{% endraw %}
```

It doesn't matter what the arguments are, just leave `arguments.size` rule.

```ruby
{% raw %}Synvert::Rewriter.new 'rails', 'use_keywords_arguments_in_http_request_methods' do
  if_gem 'actionpack', '>= 5.0'
  within_files 'spec/controllers/**/*_spec.rb' do
    with_node node_type: 'send', receiver: nil, message: 'get', arguments: { size: 4 } do
      replace :arguments, with: '{{arguments.0}}, params: {{arguments.1}}, session: {{arguments.2}}, flash: {{arguments.3}}'
    end
  end
end{% endraw %}
```

The test has passed. Let's add a new test case which doesn't have `flash` argument.

```ruby
context 'get request without flash' do
  let(:rewriter_name) { 'rails/use_keywords_arguments_in_http_request_methods' }
  let(:fake_file_path) { 'spec/controllers/users_controller_spec.rb' }
  let(:test_content) { <<~EOS }
    def test_show
      get user_path, { id: user.id }, { admin: user.admin? }
      asssert_response :success
    end
  EOS
  let(:test_rewritten_content) { <<~EOS }
    def test_show
      get user_path, params: { id: user.id }, session: { admin: user.admin? }
      asssert_response :success
    end
  EOS

  include_examples 'convertable'
end
```

It failed again. We can simply add a new `with_node` to handle 3 arguments case.

```ruby
{% raw %}Synvert::Rewriter.new 'rails', 'use_keywords_arguments_in_http_request_methods' do
  if_gem 'actionpack', '>= 5.0'
  within_files 'spec/controllers/**/*_spec.rb' do
    with_node node_type: 'send', receiver: nil, message: 'get', arguments: { size: 4 } do
      replace :arguments, with: '{{arguments.0}}, params: {{arguments.1}}, session: {{arguments.2}}, flash: {{arguments.3}}'
    end
    with_node node_type: 'send', receiver: nil, message: 'get', arguments: { size: 3 } do
      replace :arguments, with: '{{arguments.0}}, params: {{arguments.1}}, session: {{arguments.2}}'
    end
  end
end{% endraw %}
```

The tests are passed now. Let's add a new test case which doesn't have `session` argument.

```ruby
context 'get request without session' do
  let(:rewriter_name) { 'rails/use_keywords_arguments_in_http_request_methods' }
  let(:fake_file_path) { 'spec/controllers/users_controller_spec.rb' }
  let(:test_content) { <<~EOS }
    def test_show
      get user_path, { id: user.id }
      asssert_response :success
    end
  EOS
  let(:test_rewritten_content) { <<~EOS }
    def test_show
      get user_path, params: { id: user.id }
      asssert_response :success
    end
  EOS

  include_examples 'convertable'
end
```

Tests failed again. We can simply add a new `with_node` to handle 2 arguments case.

```ruby
{% raw %}Synvert::Rewriter.new 'rails', 'use_keywords_arguments_in_http_request_methods' do
  if_gem 'actionpack', '>= 5.0'
  within_files 'spec/controllers/**/*_spec.rb' do
    with_node node_type: 'send', receiver: nil, message: 'get', arguments: { size: 4 } do
      replace :arguments, with: '{{arguments.0}}, params: {{arguments.1}}, session: {{arguments.2}}, flash: {{arguments.3}}'
    end
    with_node node_type: 'send', receiver: nil, message: 'get', arguments: { size: 3 } do
      replace :arguments, with: '{{arguments.0}}, params: {{arguments.1}}, session: {{arguments.2}}'
    end
    with_node node_type: 'send', receiver: nil, message: 'get', arguments: { size: 2 } do
      replace :arguments, with: '{{arguments.0}}, params: {{arguments.1}}'
    end
  end
end{% endraw %}
```

Once again, our test cases have passed successfully. So far we have handled all the cases of get request, let's do a simple refactor, `with_node` just checks `arguments.size` is greater than 1, then we use case when to call different `replace` methods.

```ruby
{% raw %}Synvert::Rewriter.new 'rails', 'use_keywords_arguments_in_http_request_methods' do
  if_gem 'actionpack', '>= 5.0'
  within_files 'spec/controllers/**/*_spec.rb' do
    with_node node_type: 'send', receiver: nil, message: 'get', arguments: { size: { gt: 1 } } do
      case current_node.arguments.size
      when 4
        replace :arguments, with: '{{arguments.0}}, params: {{arguments.1}}, session: {{arguments.2}}, flash: {{arguments.3}}'
      when 3
        replace :arguments, with: '{{arguments.0}}, params: {{arguments.1}}, session: {{arguments.2}}'
      when 2
        replace :arguments, with: '{{arguments.0}}, params: {{arguments.1}}'
      end
    end
  end
end{% endraw %}
```

Our tests are still passed. Let's add a new test case to use `post` request.

```ruby
context 'post request' do
  let(:rewriter_name) { 'rails/use_keywords_arguments_in_http_request_methods' }
  let(:fake_file_path) { 'spec/controllers/users_controller_spec.rb' }
  let(:test_content) { <<~EOS }
    def test_create
      post users_path, { name: 'user' }, { admin: true }
      asssert_response :success
    end
  EOS
  let(:test_rewritten_content) { <<~EOS }
    def test_create
      post users_path, params: { name: 'user' }, session: { admin: true }
      asssert_response :success
    end
  EOS

  include_examples 'convertable'
end
```

The test has failed, but it can be simply fixed by using `in` operator to find `message`.

```ruby
{% raw %}Synvert::Rewriter.new 'rails', 'use_keywords_arguments_in_http_request_methods' do
  if_gem 'actionpack', '>= 5.0'
  within_files 'spec/controllers/**/*_spec.rb' do
    with_node node_type: 'send', receiver: nil, message: { in: %w[get post delete patch put] }, arguments: { size: { gt: 1 } } do
      case current_node.arguments.size
      when 4
        replace :arguments, with: '{{arguments.0}}, params: {{arguments.1}}, session: {{arguments.2}}, flash: {{arguments.3}}'
      when 3
        replace :arguments, with: '{{arguments.0}}, params: {{arguments.1}}, session: {{arguments.2}}'
      when 2
        replace :arguments, with: '{{arguments.0}}, params: {{arguments.1}}'
      end
    end
  end
end{% endraw %}
```

Now we can use the updated snippet to search in our project.

![Upgrade rails 4.2 to 5.0 6]({{ site.baseurl }}/img/upgrade-rails-4-2-to-5-0-6.png)

And replace them all.

That's all. I hope you found it informative and helpful. If you have any questions or feedback, please don't hesitate to leave a comment below.
