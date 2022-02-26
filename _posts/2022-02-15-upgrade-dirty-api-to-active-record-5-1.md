---
layout: ruby
title: Use synvert to upgrade Dirty API to ActiveRecord 5.1
date: 2022-02-15
categories: ruby
---

> **TL;DR** you can run `synvert-ruby -r rails/convert_active_record_dirty_5_0_to_5_1 <project_path>`
> to upgrade active_record dirty api.

Rails 5.1 introduced a new ActiveRecord dirty API, we need to use some longer but less ambiguity methods.

|---|---|---|
|| before callbacks | after callbacks |
| \<attribute\>_changed? | will_save_change_to_\<attribute\>? | saved_change_to_\<attribute\>? |
| \<attribute\>_change | \<attribute\>_change_to_be_saved | saved_change_to_\<attribute\> |
| \<attribute\>_was | \<attribute\>_in_database | \<attribute\>_before_last_save |
| changes | changes_to_save | saved_changes |
| changed? | has_changes_to_save? | saved_changes? |
| changed | changed_attribute_names_to_save | saved_changes.keys |
| changed_attributes | attributes_in_database | saved_changes.transform_values(&:first) |

As you can see, the dirty apis start to use different method names for before and after callbacks,
it's hard to use simple text find and replace, so I use `synvert-ruby` to make the conversions.

### Use the synvert snippet

The snippet name is `rails/convert_active_record_dirty_5_0_to_5_1`, so you can run the following command to automatically convert the dirty api.

```bash
$ synvert-ruby -r rails/convert_active_record_dirty_5_0_to_5_1 <project_path>
```

Here are a small part of the long git diff.

```diff
   before_save do
-    edit if title_changed? || content_changed?
+    edit if will_save_change_to_title? || will_save_change_to_content?
   end

   after_save do
-    self.just_ended = (ended? && ended_at_changed?)
+    self.just_ended = (ended? && saved_change_to_ended_at?)
   end

-  after_update :send_email, :if => :email_changed?
+  after_update :send_email, :if => :saved_change_to_email?

-  tag_changes = node.changes['tag']
+  tag_changes = node.saved_changes['tag']
```

### Write the synvert snippet

So how did I write the snippet?

First, I defined the files to match, rails model and observer files.

```ruby
within_files Synvert::RAILS_MODEL_FILES + Synvert::RAILS_OBSERVER_FILES do
  ...
end
```

1\. let's try to convert `<attribute>_changed?` to `saved_change_to_<attribute>` for `after_save` callback in `if`/`unless` parameter.

```ruby
# after_save :invalidate_cache, if: -> { title_changed? || summary_chagned? }
with_node type: 'send', receiver: nil, message: 'after_save' do
  with_node type: 'hash' do
    with_node type: 'sym', to_value: /(\w+)_changed\?$/ do
      if node.to_value =~ /(\w+)_changed\?$/ # match regexp again to get the last match
        replace_with ":saved_change_to_#{Regexp.last_match(1)}?"
      end
    end
  end
end
```

It uses `with_node` to match the after_save callback first, then `hash` parameters, then `sym` value to match `<attribute>_changed?`, and replace the symbol with `:saved_change_to_<attribute>`

2\. match all after callbacks

```ruby
after_callback_names = %i[after_create after_update after_save after_commit after_create_commit after_update_commit after_save_commit]
with_node type: 'send', receiver: nil, message: { in: after_callback_names } do
end
```

3\. do the conversion in `after_save` block.

```ruby
# before_save do
#   if status_chagned?
#   end
# end
with_node type: 'block',
          caller: { type: 'send', receiver: nil,
          message: { in: after_callback_names } } do
  with_node type: 'send', message: /(\w+)_changed\?$/ do
    if node.to_value =~ /(\w+)_changed\?$/ # match regexp again to get the last match
      replace_with ":saved_change_to_#{Regexp.last_match(1)}?"
    end
  end
end
```

4\. do the conversion in `after_save` method.

```ruby
# def after_save
#   if status_chagned?
#   end
# end
with_node type: 'def', name: { in: after_callback_names } do
  with_node type: 'send', message: /(\w+)_changed\?$/ do
    if node.to_value =~ /(\w+)_changed\?$/ # match regexp again to get the last match
      replace_with ":saved_change_to_#{Regexp.last_match(1)}?"
    end
  end
end
```

5\. do the conversion in `after_save` custom callback method.

```ruby
# after_save :invalidate_cache
# def invalidate_cache
#   if status_chagned?
#   end
# end
custom_callback_names = []

with_node type: 'send',
          receiver: nil,
          message: { in: after_callback_names },
          arguments: { size: { gt: 0 }, first: { type: 'sym' }} do
  custom_callback_names << node.arguments[0].to_value
end

with_node type: 'def', name: { in: custom_callback_names } do
  with_node type: 'send', message: /(\w+)_changed\?$/ do
  if node.to_value =~ /(\w+)_changed\?$/ # match regexp again to get the last match
    replace_with ":saved_change_to_#{Regexp.last_match(1)}?"
  end
end
```

It finds all custom callback methods first, then find `<attribute>_changed?` in those custom methods.

6\. match all after callbacks api changes

```ruby
after_callback_changes = {
  /(\w+)_changed\?$/ => 'saved_change_to_{{attribute}}?',
  /(\w+)_change$/ => 'saved_change_to_{{attribute}}',
  /(\w+)_was$/ => '{{attribute}}_before_last_save',
  'changes' => 'saved_changes',
  'changed?' => 'saved_changes?',
  'changed' => 'saved_changes.keys',
  'changed_attributes' => 'saved_changes.transform_values(&:first)'
}

after_callback_changes.each do |before_name, after_name|
  with_node type: 'send', message: before_name do
    if before_name.is_a?(Regexp)
      if node.message.to_s =~ before_name # match regexp again to get the last match
        replace :message, with: after_name.sub('{{attribute}}', Regexp.last_match(1))
      end
    else
      replace :message, with: after_name
    end
  end
end
```

7\. what about before callbacks? That's easy, just abstract the above conversions and reuse for before callbacks

```ruby
before_callback_changes = {
  /(\w+)_changed\?$/ => 'will_save_change_to_{{attribute}}?',
  /(\w+)_change$/ => '{{attribute}}_change_to_be_saved',
  /(\w+)_was$/ => '{{attribute}}_in_database',
  'changes' => 'changes_to_save',
  'changed?' => 'has_changes_to_save?',
  'changed' => 'changed_attribute_names_to_save',
  'changed_attributes' => 'attributes_in_database'
}

before_callback_names = %i[before_create before_update before_save]

helper_method :find_callbacks_and_convert do |callback_names, callback_changes|
  ...
end

within_files Synvert::RAILS_MODEL_FILES + Synvert::RAILS_OBSERVER_FILES do
  find_callbacks_and_convert(before_callback_names, before_callback_changes)
  find_callbacks_and_convert(after_callback_names, after_callback_changes)
end
```

There are some other edge cases that I didn't cover here, e.g. if user defined a method `password_changed?`, I won't convert it to `saved_change_to_password?` or `will_save_change_to_password?`. To get the full snippet code, please check it out [here](https://github.com/xinminlabs/synvert-snippets-ruby/blob/master/lib/rails/convert_active_record_dirty_5_0_to_5_1.rb).