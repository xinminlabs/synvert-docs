---
layout: ruby
title: Official Snippets
---

### bullet

<details markdown='1'>

<summary>rename_whitelist_to_safelist</summary>

It renames bullet whitelist to safelist.

```ruby
Bullet.add_whitelist(type: :n_plus_one_query, class_name: 'Klass', association: :department)
Bullet.delete_whitelist(type: :n_plus_one_query, class_name: 'Klass', association: :team)
Bullet.get_whitelist_associations(:n_plus_one_query, 'Klass')
Bullet.reset_whitelist
Bullet.clear_whitelist
```

=>

```ruby
Bullet.add_safelist(type: :n_plus_one_query, class_name: 'Klass', association: :department)
Bullet.delete_safelist(type: :n_plus_one_query, class_name: 'Klass', association: :team)
Bullet.get_safelist_associations(:n_plus_one_query, 'Klass')
Bullet.reset_safelist
Bullet.clear_safelist
```


</details>

### debug_me

<details markdown='1'>

<summary>remove_debug_me_calls</summary>

It removes `debug_me` calls.

debug_me  A tool to print the labeled value of variables.
          |__ http://github.com/MadBomber/debug_me


</details>

### default

<details markdown='1'>

<summary>check_syntax</summary>

Just used to check if there is a syntax error.

</details>

### factory_bot

<details markdown='1'>

<summary>convert_factory_girl_to_factory_bot</summary>

It converts FactoryGirl to FactoryBot

```ruby
require 'factory_girl'
require 'factory_girl_rails'
```

=>

```ruby
require 'factory_bot'
require 'factory_bot_rails'
```

```ruby
RSpec.configure do |config|
  config.include FactoryGirl::Syntax::Methods
end
```

=>

```ruby
RSpec.configure do |config|
  config.include FactoryBot::Syntax::Methods
end
```

```ruby
FactoryGirl.define do
  factory :user do
    email { Faker::Internet.email }
    username Faker::Name.first_name.downcase
    password "Sample:1"
    password_confirmation "Sample:1"
  end
end
```

=>

```ruby
FactoryBot.define do
  factory :user do
    email { Faker::Internet.email }
    username Faker::Name.first_name.downcase
    password "Sample:1"
    password_confirmation "Sample:1"
  end
end
```

```ruby
FactoryGirl.create(:user)
FactoryGirl.build(:user)
```

=>

```ruby
FactoryBot.create(:user)
FactoryBot.build(:user)
```


</details>

<details markdown='1'>

<summary>deprecate_static_value</summary>

It deprecates factory_bot static value

```ruby
FactoryBot.define do
  factory :post do
    user
    association :user
    title "Something"
    comments_count 0
    tag Tag::MAGIC
    recent_statuses []
    status([:draft, :published].sample)
    published_at 1.day.from_now
    created_at(1.day.ago)
    updated_at Time.current
    update_times [Time.current]
    meta_tags(foo: Time.current)
    other_tags({ foo: Time.current })
    options color: :blue
    trait :old do
      published_at 1.week.ago
    end
  end
end
```

=>

```ruby
FactoryBot.define do
  factory :post do
    user
    association :user
    title { "Something" }
    comments_count { 0 }
    tag { Tag::MAGIC }
    recent_statuses { [] }
    status { [:draft, :published].sample }
    published_at { 1.day.from_now }
    created_at { 1.day.ago }
    updated_at { Time.current }
    update_times { [Time.current] }
    meta_tags { { foo: Time.current } }
    other_tags { { foo: Time.current } }
    options { { color: :blue } }
    trait :old do
      published_at { 1.week.ago }
    end
  end
end
```


</details>

<details markdown='1'>

<summary>use_short_syntax</summary>

Uses FactoryBot short syntax.

1. it adds FactoryBot::Syntax::Methods module to RSpec, Test::Unit, Cucumber, Spainach, MiniTest, MiniTest::Spec, minitest-rails.

```ruby
# rspec
RSpec.configure do |config|
  config.include FactoryBot::Syntax::Methods
end

# Test::Unit
class Test::Unit::TestCase
  include FactoryBot::Syntax::Methods
end

# Cucumber
World(FactoryBot::Syntax::Methods)

# Spinach
class Spinach::FeatureSteps
  include FactoryBot::Syntax::Methods
end

# MiniTest
class MiniTest::Unit::TestCase
  include FactoryBot::Syntax::Methods
end

# MiniTest::Spec
class MiniTest::Spec
  include FactoryBot::Syntax::Methods
end

# minitest-rails
class MiniTest::Rails::ActiveSupport::TestCase
  include FactoryBot::Syntax::Methods
end
```

2. it converts to short syntax.

```ruby
FactoryBot.create(...)
FactoryBot.build(...)
FactoryBot.attributes_for(...)
FactoryBot.build_stubbed(...)
FactoryBot.create_list(...)
FactoryBot.build_list(...)
FactoryBot.create_pair(...)
FactoryBot.build_pair(...)
```

=>

```ruby
create(...)
build(...)
attributes_for(...)
build_stubbed(...)
create_list(...)
build_list(...)
create_pair(...)
build_pair(...)
```


</details>

<details markdown='1'>

<summary>use_string_as_class_name</summary>

It uses string as class name

```ruby
FactoryBot.define do
  factory :admin, class: User do
    name { 'Admin' }
  end
end
```

=>

```ruby
FactoryBot.define do
  factory :admin, class: 'User' do
    name { 'Admin' }
  end
end
```


</details>

### factory_girl

<details markdown='1'>

<summary>fix_2_0_deprecations</summary>

It fixes factory girl 2.0 deprecations

```ruby
Factory.sequence :login do |n|
  "new_user_#{n}"
end
Factory.define :user do |user|
  user.admin true
  user.login { Factory.next(:login) }
  user.sequence(:email) { |n| "user#{n}@gmail.com" }
  user.after_create { |instance| create_list(:post, 5, user: instance) }
end
```

=>

```ruby
FactoryGirl.define do
  sequence :user do |n|
    "new_user_#{n}"
  end
  factory :user do |user|
    admin true
    login { generate(:login) }
    sequence(:email) { |n| "user#{n}@gmail.com" }
    after(:create) { |instance| create_list(:post, 5, user: instance) }
  end
end
```

```ruby
Factory(:user)
Factory.next(:email)
Factory.stub(:comment)
Factory.create(:user)
Factory.build(:use)
Factory.attributes_for(:user)
```

=>

```ruby
create(:user)
generate(:email)
build_stubbed(:comment)
create(:user)
build(:user)
attributes_for(:user)
```


</details>

<details markdown='1'>

<summary>use_new_syntax</summary>

It uses factory_girl new syntax.

</details>

<details markdown='1'>

<summary>use_short_syntax</summary>

Uses FactoryGirl short syntax.

1. it adds FactoryGirl::Syntax::Methods module to RSpec, Test::Unit, Cucumber, Spainach, MiniTest, MiniTest::Spec, minitest-rails.

```ruby
# rspec
RSpec.configure do |config|
  config.include FactoryGirl::Syntax::Methods
end

# Test::Unit
class Test::Unit::TestCase
  include FactoryGirl::Syntax::Methods
end

# Cucumber
World(FactoryGirl::Syntax::Methods)

# Spinach
class Spinach::FeatureSteps
  include FactoryGirl::Syntax::Methods
end

# MiniTest
class MiniTest::Unit::TestCase
  include FactoryGirl::Syntax::Methods
end

# MiniTest::Spec
class MiniTest::Spec
  include FactoryGirl::Syntax::Methods
end

# minitest-rails
class MiniTest::Rails::ActiveSupport::TestCase
  include FactoryGirl::Syntax::Methods
end
```

2. it converts to short syntax.

```ruby
FactoryGirl.create(...)
FactoryGirl.build(...)
FactoryGirl.attributes_for(...)
FactoryGirl.build_stubbed(...)
FactoryGirl.create_list(...)
FactoryGirl.build_list(...)
FactoryGirl.create_pair(...)
FactoryGirl.build_pair(...)
```

=>

```ruby
create(...)
build(...)
attributes_for(...)
build_stubbed(...)
create_list(...)
build_list(...)
create_pair(...)
build_pair(...)
```


</details>

### minitest

<details markdown='1'>

<summary>assert_empty</summary>

Use `assert_empty` if expecting object to be empty.

```ruby
assert(object.empty?)
```

=>

```ruby
assert_empty(object)
```


</details>

<details markdown='1'>

<summary>assert_equal_arguments_order</summary>

`assert_equal` should always have expected value as first argument because if the assertion fails the error message would say expected "rubocop-minitest" received "rubocop" not the other way around.

```ruby
assert_equal(actual, "rubocop-minitest")
```

=>

```ruby
assert_equal("rubocop-minitest", actual)
```


</details>

<details markdown='1'>

<summary>assert_includes</summary>

Use `assert_includes` to assert if the object is included in the collection.

```ruby
assert(collection.include?(object))
```

=>

```ruby
assert_includes(collection, object)
```


</details>

<details markdown='1'>

<summary>assert_instance_of</summary>

Prefer `assert_instance_of(class, object)` over `assert(object.instance_of?(class))`.

```ruby
assert('rubocop-minitest'.instance_of?(String))
```

=>

```ruby
assert_instance_of(String, 'rubocop-minitest')
```


</details>

<details markdown='1'>

<summary>assert_kind_of</summary>

Prefer `assert_kind_of(class, object)` over `assert(object.kind_of?(class))`.

```ruby
assert('rubocop-minitest'.kind_of?(String))
```

=>

```ruby
assert_kind_of(String, 'rubocop-minitest')
```


</details>

<details markdown='1'>

<summary>assert_match</summary>

Use `assert_match` if expecting matcher regex to match actual object.

```ruby
assert(pattern.match?(object))
```

=>

```ruby
assert_match(pattern, object)
```


</details>

<details markdown='1'>

<summary>assert_nil</summary>

Use `assert_nil` if expecting `nil`.

```ruby
assert_equal(nil, actual)
```

=>

```ruby
assert_nil(actual)
```


</details>

<details markdown='1'>

<summary>assert_operator</summary>

Use `assert_operator` if comparing expected and actual object using operator.

```ruby
assert(expected < actual)
```

=>

```ruby
assert_operator(expected, :<, actual)
```


</details>

<details markdown='1'>

<summary>assert_path_exists</summary>

Use `assert_path_exists` if expecting path to exist.

```ruby
assert(File.exist?(path))
```

=>

```ruby
assert_path_exists(path)
```


</details>

<details markdown='1'>

<summary>assert_predicate</summary>

Use `assert_predicate` if expecting to test the predicate on the expected object and on applying predicate returns true. The benefit of using the `assert_predicate` over the `assert` or `assert_equal` is the user friendly error message when assertion fails.

```ruby
assert expected.zero?
assert_equal 0, expected
```

=>

```ruby
assert_predicate expected, :zero?
assert_predicate expected, :zero?
```


</details>

<details markdown='1'>

<summary>assert_respond_to</summary>

Use `assert_respond_to` if expecting object to respond to a method.

```ruby
assert(object.respond_to?(some_method))
```

=>

```ruby
assert_respond_to(object, some_method)
```


</details>

<details markdown='1'>

<summary>assert_silent</summary>

Use `assert_silent` to assert that nothing was written to stdout and stderr.

```ruby
assert_output('', '') { puts object.do_something }
```

=>

```ruby
assert_silent { puts object.do_something }
```


</details>

<details markdown='1'>

<summary>assert_truthy</summary>

Use `assert` if expecting truthy value.

```ruby
assert_equal(true, actual)
```

=>

```ruby
assert(actual)
```


</details>

<details markdown='1'>

<summary>better_syntax</summary>

It converts rspec code to better syntax, it calls all minitest sub snippets.

</details>

<details markdown='1'>

<summary>hooks_super</summary>

If using a module containing `setup` or `teardown` methods, be sure to call `super` in the test class `setup` or `teardown`.

```ruby
class TestMeme < Minitest::Test
  include MyHelper

  def setup
    do_something
  end

  def teardown
    clean_something
  end
end
```

=>

```ruby
class TestMeme < Minitest::Test
  include MyHelper

  def setup
    super
    do_something
  end

  def teardown
    clean_something
    super
  end
end
```


</details>

<details markdown='1'>

<summary>refute_empty</summary>

Use `refute_empty` if expecting object to be not empty.

```ruby
refute(object.empty?)
assert(!object.empty?)
```

=>

```ruby
refute_empty(object)
refute_empty(object)
```


</details>

<details markdown='1'>

<summary>refute_equal</summary>

Use `refute_equal`` if expected and actual should not be same.

```ruby
assert("rubocop-minitest" != actual)
assert(!"rubocop-minitest" == actual)
```

=>

```ruby
refute_equal("rubocop-minitest", actual)
refute_equal("rubocop-minitest", actual)
```


</details>

<details markdown='1'>

<summary>refute_false</summary>

Use `refute` if expecting false.

```ruby
assert_equal(false, actual)
assert(!something)
```

=>

```ruby
refute(actual)
refute(something)
```


</details>

<details markdown='1'>

<summary>refute_includes</summary>

Use `refute_includes` if the object is not included in the collection.

```ruby
refute(collection.include?(object))
assert(!collection.include?(object))
```

=>

```ruby
refute_includes(collection, object)
refute_includes(collection, object)
```


</details>

<details markdown='1'>

<summary>refute_instance_of</summary>

Prefer `refute_instance_of(class, object)` over `refute(object.instance_of?(class))`.

```ruby
assert(!'rubocop-minitest'.instance_of?(String))
refute('rubocop-minitest'.instance_of?(String))
```

=>

```ruby
refute_instance_of(String, 'rubocop-minitest')
refute_instance_of(String, 'rubocop-minitest')
```


</details>

<details markdown='1'>

<summary>refute_kind_of</summary>

Prefer `refute_kind_of(class, object)` over `refute(object.kind_of?(class))`.

```ruby
assert(!'rubocop-minitest'.kind_of?(String))
refute('rubocop-minitest'.kind_of?(String))

```

=>

```ruby
refute_kind_of(String, 'rubocop-minitest')
refute_kind_of(String, 'rubocop-minitest')
```


</details>

<details markdown='1'>

<summary>refute_match</summary>

Use `refute_match` if expecting matcher regex to not match actual object.

```ruby
assert(!pattern.match?(object))
refute(pattern.match?(object))
```

=>

```ruby
refute_match(pattern, object)
refute_match(pattern, object)
```


</details>

<details markdown='1'>

<summary>refute_nil</summary>

Use `refute_nil` if not expecting `nil`.

```ruby
assert(!actual.nil?)
refute(actual.nil?)
```

=>

```ruby
refute_nil(actual)
refute_nil(actual)
```


</details>

<details markdown='1'>

<summary>refute_operator</summary>

Use `refute_operator` if expecting expected object is not binary operator of the actual object. Assertion passes if the expected object is not binary operator(example: greater than) the actual object.

```ruby
refute(expected > actual)
assert(!(expected > actual))
```

=>

```ruby
refute_operator(expected, :>, actual)
refute_operator(expected, :>, actual)
```


</details>

<details markdown='1'>

<summary>refute_path_exists</summary>

Use `refute_path_exists` if expecting path to not exist.

```ruby
assert(!File.exist?(path))
refute(File.exist?(path))
```

=>

```ruby
refute_path_exists(path)
refute_path_exists(path)
```


</details>

<details markdown='1'>

<summary>refute_predicate</summary>

Use `refute_predicate` if expecting to test the predicate on the expected object and on applying predicate returns false.

```ruby
assert(!expected.zero?)
refute(expected.zero?)
```

=>

```ruby
refute_predicate(expected, :zero?)
refute_predicate(expected, :zero?)
```


</details>

<details markdown='1'>

<summary>refute_respond_to</summary>

Use `refute_respond_to` if expecting object to not respond to a method.

```ruby
assert(!object.respond_to?(some_method))
refute(object.respond_to?(some_method))
```

=>

```ruby
refute_respond_to(object, some_method)
refute_respond_to(object, some_method)
```


</details>

### rails

<details markdown='1'>

<summary>add_active_record_migration_rails_version</summary>

It adds default ActiveRecord::Migration rails version.

```ruby
class CreateUsers < ActiveRecord::Migration
end
```

=>

```ruby
class CreateUsers < ActiveRecord::Migration[4.2]
end
```


</details>

<details markdown='1'>

<summary>add_application_job</summary>

It adds ApplicationJob

1. it adds app/models/application_job.rb file.

2. it replaces ActiveJob::Base with ApplicationJob in job files.

```ruby
class PostJob < ActiveJob::Base
end
```

=>

```ruby
class PostJob < ApplicationJob
end
```


</details>

<details markdown='1'>

<summary>add_application_mailer</summary>

It adds ApplicationMailer

1. it adds app/mailers/application_mailer.rb file.

2. it replaces ActionMailer::Base with ApplicationMailer in mailer files.

```ruby
class UserMailer < ActionMailer::Base
end
```

=>

```ruby
class UserMailer < ApplicationMailer
end
```


</details>

<details markdown='1'>

<summary>add_application_record</summary>

It adds ApplicationRecord

1. it adds app/models/application_record.rb file.
2. it replaces ActiveRecord::Base with ApplicationRecord in model files.

```ruby
class Post < ActiveRecord::Base
end
```

=>

```ruby
class Post < ApplicationRecord
end
```


</details>

<details markdown='1'>

<summary>convert_active_record_dirty_5_0_to_5_1</summary>

It converts ActiveRecord::Dirty 5.0 to 5.1

```ruby
class Post < ActiveRecord::Base
  before_create :call_before_create
  before_update :call_before_update, if: :title_changed?
  before_save :call_before_save, if: -> { status_changed? || summary_changed? }
  after_create :call_after_create
  after_update :call_after_update, if: :title_changed?
  after_save :call_after_save, if: -> { status_changed? || summary_changed? }

  def call_before_create
    if title_changed?
      changes
    end
  end

  def call_after_create
    if title_changed?
      changes
    end
  end
end
```

=>

```ruby
class Post < ActiveRecord::Base
  before_create :call_before_create
  before_update :call_before_update, if: :will_save_change_to_title?
  before_save :call_before_save, if: -> { will_save_change_to_status? || will_save_change_to_summary? }
  after_create :call_after_create
  after_update :call_after_update, if: :saved_change_to_title?
  after_save :call_after_save, if: -> { saved_change_to_status? || saved_change_to_summary? }

  def call_before_create
    if will_save_change_to_title?
      changes_to_save
    end
  end

  def call_after_create
    if saved_change_to_title?
      saved_changes
    end
  end
end
```


</details>

<details markdown='1'>

<summary>convert_after_commit</summary>

It converts active_record after_commit.

```ruby
after_commit :add_to_index_later, on: :create
after_commit :update_in_index_later, on: :update
after_commit :remove_from_index_later, on: :destroy
```
=>

```ruby
after_create_commit :add_to_index_later
after_update_commit :update_in_index_later
after_detroy_commit :remove_from_index_later
```


</details>

<details markdown='1'>

<summary>convert_controller_filter_to_action</summary>

It renames before_filter callbacks to before_action

```ruby
class PostsController < ApplicationController
  skip_filter :authorize
  before_filter :load_post
  after_filter :track_post
  around_filter :log_post
end
```

=>

```ruby
class PostsController < ApplicationController
  skip_action_callback :authorize
  before_action :load_post
  after_action :track_post
  around_action :log_post
end
```


</details>

<details markdown='1'>

<summary>convert_dynamic_finders</summary>

It converts rails dynamic finders to arel syntax.

```ruby
find_all_by_...
find_by_...
find_last_by_...
scoped_by_...
find_or_initialize_by_...
find_or_create_by_...
```

=>

```ruby
where(...)
where(...).first
where(...).last
where(...)
find_or_initialize_by(...)
find_or_create_by(...)
```


</details>

<details markdown='1'>

<summary>convert_env_to_request_env</summary>

It replaces env with request.env in controller files.

```ruby
env["omniauth.auth"]
```

=>

```ruby
request.env["omniauth.auth"]
```


</details>

<details markdown='1'>

<summary>convert_head_response</summary>

It replaces render head response in controller files.

```ruby
render nothing: true
render nothing: true, status: :created

head status: 406
head location: '/foo'
```

=>

```ruby
head :ok
head :created

head 406
head :ok, location: '/foo'
```


</details>

<details markdown='1'>

<summary>convert_mailers_2_3_to_3_0</summary>

It converts rails mailers from 2.3 to 3.0.

```ruby
class Notifier < ActionMailer::Base
  def signup_notification(recipient)
    recipients      recipient.email_address_with_name
    subject         "New account information"
    from            "system@example.com"
    sent_on         Time.now
    content_type    "multipart/alternative"
    body            :account => recipient
  end
end
```

=>

```ruby
class Notifier < ActionMailer::Base
  def signup_notification(recipient)
    @account = recipient
    mail(:to => recipient.email_address_with_name, :subject => "New account information", :from => "system@example.com", :date => Time.now)
  end
end
```

```ruby
Notifier.deliver_signup_notification(recipient)
```

=>

```ruby
Notifier.signup_notification(recipient).deliver
```

```ruby
message = Notifier.create_signup_notification(recipient)
Notifier.deliver(message)
```

=>

```ruby
message = Notifier.signup_notification(recipient)
message.deliver
```


</details>

<details markdown='1'>

<summary>convert_model_errors_add</summary>

It converts to activerecord `errors.add`.

```ruby
errors[:base] = "author not present"
self.errors[:base] = "author not present"
```

=>

```ruby
errors.add(:base, "author not present")
self.errors.add(:base, "author not present")
```


</details>

<details markdown='1'>

<summary>convert_model_lambda_scope</summary>

It converts activerecord scope to lambda scope.

```ruby
class Post < ActiveRecord::Base
  scope :active, where(active: true)
  scope :published, Proc.new { where(published: true) }
  scope :by_user, proc { |user_id| where(user_id: user_id) }
  default_scope order("updated_at DESC")
  default_scope { order("created_at DESC") }
end
```

=>

```ruby
class Post < ActiveRecord::Base
  scope :active, -> { where(active: true) }
  scope :published, -> { where(published: true) }
  scope :by_user, ->(user_id) { where(user_id: user_id) }
  default_scope -> { order("updated_at DESC") }
  default_scope -> { order("created_at DESC") }
end
```


</details>

<details markdown='1'>

<summary>convert_models_2_3_to_3_0</summary>

It converts rails models from 2.3 to 3.0.

```ruby
named_scope :active, :conditions => {:active => true}, :order => "created_at desc"
named_scope :my_active, lambda { |user| {:conditions => ["user_id = ? and active = ?", user.id, true], :order => "created_at desc"} }
```

=>

```ruby
scope :active, where(:active => true).order("created_at desc")
scope :my_active, lambda { |user| where("user_id = ? and active = ?", user.id, true).order("created_at desc") }
```

```ruby
default_scope :order => "id DESC"
```

=>

```ruby
default_scope order("id DESC")
```

```ruby
Post.find(:all, :limit => 2)
Post.find(:all)
Post.find(:first)
Post.find(:last, :conditions => {:title => "test"})
Post.first(:conditions => {:title => "test"})
Post.all(:joins => :comments)
```

=>

```ruby
Post.limit(2)
Post.all
Post.first
Post.where(:title => "test").last
Post.where(:title => "test").first
Post.joins(:comments)
```

```ruby
Post.find_in_batches(:conditions => {:title => "test"}, :batch_size => 100) do |posts|
end
Post.find_in_batches(:conditions => {:title => "test"}) do |posts|
end
```

=>

```ruby
Post.where(:title => "test").find_each(:batch_size => 100) do |post|
end
Post.where(:title => "test").find_each do |post|
end
```

```ruby
with_scope(:find => {:conditions => {:active => true}}) { Post.first }
with_exclusive_scope(:find => {:limit =>1}) { Post.last }
```

=>

```ruby
with_scope(where(:active => true)) { Post.first }
with_exclusive_scope(limit(1)) { Post.last }
```

```ruby
Client.count("age", :conditions => {:active => true})
Client.average("orders_count", :conditions => {:active => true})
Client.min("age", :conditions => {:active => true})
Client.max("age", :conditions => {:active => true})
Client.sum("orders_count", :conditions => {:active => true})
```

=>

```ruby
Client.where(:active => true).count("age")
Client.where(:active => true).average("orders_count")
Client.where(:active => true).min("age")
Client.where(:active => true).max("age")
Client.where(:active => true).sum("orders_count")
```

```ruby
self.errors.on(:email).present?
```

=>

```ruby
self.errors[:email].present?
```

```ruby
self.errors.add_to_base("error message")
```

=>

```ruby
self.errors.add(:base, "error message")
```

```ruby
self.save(false)
```

=>

```ruby
self.save(:validate => false)
```

```ruby
Post.update_all({:title => "title"}, {:title => "test"})
Post.update_all("title = 'title'", "title = 'test'")
Post.update_all("title = 'title'", ["title = ?", title])
Post.update_all({:title => "title"}, {:title => "test"}, {:limit => 2})
```

=>

```ruby
Post.where(:title => "test").update_all(:title => "title")
Post.where("title = 'test'").update_all("title = 'title'")
Post.where(["title = ?", title]).update_all("title = 'title'")
Post.where(:title => "test").limit(2).update_all(:title => "title")
```

```ruby
Post.delete_all("title = 'test'")
Post.delete_all(["title = ?", title])
```

=>

```ruby
Post.where("title = 'test'").delete_all
Post.where(["title = ?", title]).delete_all
```

```ruby
Post.destroy_all("title = 'test'")
Post.destroy_all(["title = ?", title])
```

=>

```ruby
Post.where("title = 'test'").destroy_all
Post.where(["title = ?", title]).destroy_all
```


</details>

<details markdown='1'>

<summary>convert_rails_env</summary>

It converts RAILS_ENV to Rails.env.

```ruby
RAILS_ENV
"#{RAILS_ENV}"
RAILS_ENV == 'development'
'development' == RAILS_ENV
RAILS_ENV != 'development'
'development' != RAILS_ENV
```

=>

```ruby
Rails.env
"#{Rails.env}"
Rails.env.development?
Rails.env.development?
!Rails.env.development?
!Rails.env.development?
```


</details>

<details markdown='1'>

<summary>convert_rails_logger</summary>

It converts RAILS_DEFAULT_LOGGER to Rails.logger.

```ruby
RAILS_DEFAULT_LOGGER
```

=>

```ruby
Rails.logger
```


</details>

<details markdown='1'>

<summary>convert_rails_root</summary>

It converts RAILS_ROOT to Rails.root.

```ruby
RAILS_ROOT
File.join(RAILS_ROOT, 'config/database.yml')
RAILS_ROOT + 'config/database.yml'
"#{RAILS_ROOT}/config/database.yml"
File.exists?(Rails.root.join('config/database.yml'))
```

=>

```ruby
Rails.root
Rails.root.join('config/database.yml')
Rails.root.join('config/database.yml')
Rails.root.join('config/database.yml')
Rails.root.join('config/database.yml').exist?
```


</details>

<details markdown='1'>

<summary>convert_rails_test_request_methods_4_2_to_5_0</summary>

It converts rails test request methods from 4.2 to 5.0

functional test:

```ruby
get :show, { id: user.id, format: :json }, { admin: user.admin? }, { notice: 'Welcome' }
```

=>

```ruby
get :show, params: { id: user.id }, session: { admin: user.admin? }, flash: { notice: 'Welcome' }, as: :json
```

integration test:

```ruby
get '/posts/1', user_id: user.id, { 'HTTP_AUTHORIZATION' => 'fake' }
```

=>

```ruby
get '/posts/1', params: { user_id: user.id }, headers: { 'HTTP_AUTHORIZATION' => 'fake' }
```


</details>

<details markdown='1'>

<summary>convert_render_text_to_render_plain</summary>

It convert `render :text` to `render :plain`

```ruby
render text: 'OK'
```

=>

```ruby
render plain: 'OK'
```


</details>

<details markdown='1'>

<summary>convert_routes_2_3_to_3_0</summary>

It converts rails routes from 2.3 to 3.0.

```ruby
map.root :controller => "home", :action => :index
```

=>

```ruby
root :to => "home#index"
```

```ruby
map.connect "/:controller/:action/:id"
```

=>

```ruby
match "/:controller(/:action(/:id))(.:format)"
```

```ruby
map.admin_signup "/admin_signup", :controller => "admin_signup", :action => "new", :method => "post"
```

=>

```ruby
post "/admin_signup", :to => "admin_signup#new", :as => "admin_signup"
```

```ruby
map.with_options :controller => "manage" do |manage|
  manage.manage_index "manage_index", :action => "index"
  manage.manage_intro "manage_intro", :action => "intro"
end
```

=>

```ruby
manage.manage_index "manage_index", :to => "index#manage"
manage.manage_intro "manage_intro", :to => "intro#manage"
```

```ruby
map.namespace :admin do |admin|
  admin.resources :users
end
```

=>

```ruby
namespace :admin do
  resources :users
end
```

```ruby
map.resources :posts, :collection => { :generate_pdf => :get }, :member => {:activate => :post} do |posts|
  posts.resources :comments
end
```

=>

```ruby
resources :posts do
  collection do
    get :generate_pdf
  end
  member do
    post :activate
  end
  resources :comments
end
```


</details>

<details markdown='1'>

<summary>convert_to_response_parsed_body</summary>

It converts `JSON.parse(@response.body)` to `@response.parsed_body`.


</details>

<details markdown='1'>

<summary>convert_update_attributes_to_update</summary>

It converts `.update_attributes` to `.update`

```ruby
user.update_attributes(title: 'new')
user.update_attributes!(title: 'new')
```

=>

```ruby
user.update(title: 'new')
user.update!(title: 'new')
```


</details>

<details markdown='1'>

<summary>convert_views_2_3_to_3_0</summary>

1. remove `h` helper, rails 3 uses it by default.

```erb
<%= h user.login %>
```

=>

```erb
<%= user.login %>
```

2. use erb expression instead of erb statement for view helpers.

```erb
<% form_for post do |f| %>
<% end %>
```

=>

```erb
<%= form_for post do |f| %>
<% end %>
```


</details>

<details markdown='1'>

<summary>fix_4_0_deprecations</summary>

It fixes rails 4.0 deprecations.

```ruby
ActiveRecord::Fixtures
ActiveRecord::TestCase
ActionController::Integration
ActionController::IntegrationTest
ActionController::PerformanceTest
ActionController::AbstractRequest
ActionController::Request
ActionController::AbstractResponse
ActionController::Response
ActionController::Routing
```

=>

```ruby
ActiveRecord::FixtureSet
ActiveSupport::TestCase
ActionDispatch::Integration
ActionDispatch::IntegrationTest
ActionDispatch::PerformanceTest
ActionDispatch::Request
ActionDispatch::Request
ActionDispatch::Response
ActionDispatch::Response
ActionDispatch::Routing
```


</details>

<details markdown='1'>

<summary>fix_controller_3_2_deprecations</summary>

It fixes rails 3.2 controller deprecations.

```ruby
ActionController::UnknownAction
```

=>

```ruby
AbstractController::ActionNotFound
```

```ruby
ActionController::DoubleRenderError
```

=>

```ruby
AbstractController::DoubleRenderError
```


</details>

<details markdown='1'>

<summary>fix_model_3_2_deprecations</summary>

It fixes rails 3.2 model deprecations.

```ruby
set_table_name "project"
```

=>

```ruby
self.table_name = "project"
```

```ruby
set_inheritance_column = "type"
```

=>

```ruby
self.inheritance_column = "type"
```

```ruby
set_sequence_name = "seq"
```

=>

```ruby
self.sequence_name = "seq"
```

```ruby
set_primary_key = "id"
```

=>

```ruby
self.primary_key = "id"
```

```ruby
set_locking_column = "lock"
```

=>

```ruby
self.locking_column = "lock"
```


</details>

<details markdown='1'>

<summary>redirect_with_flash</summary>

  Fold flash setting into redirect_to.

  ```ruby
  flash[:notice] = "huzzah"
  redirect_to root_path
  ```

  =>

  ```ruby
  redirect_to root_path, notice: "huzzah"
  ```

  and

  ```ruby
  flash[:error] = "booo"
  redirect_to root_path
  ```

  =>

  ```ruby
  redirect_to root_path, flash: {error: "huzzah"}
  ```


</details>

<details markdown='1'>

<summary>strong_parameters</summary>

It uses string_parameters to replace `attr_accessible`.

1. it removes active_record configurations.

```ruby
config.active_record.whitelist_attributes = ...
config.active_record.mass_assignment_sanitizer = ...
```

2. it removes `attr_accessible` and `attr_protected` code in models.

3. it adds xxx_params in controllers

```ruby
def xxx_params
  params.require(:xxx).permit(...)
end
```

4. it replaces params[:xxx] with xxx_params.

```ruby
params[:xxx] => xxx_params
```


</details>

<details markdown='1'>

<summary>upgrade_2_3_to_3_0</summary>

It converts rails from 2.3 to 3.0.

</details>

<details markdown='1'>

<summary>upgrade_3_0_to_3_1</summary>

It upgrade rails from 3.0 to 3.1.

1. it enables asset pipeline.

```ruby
config.assets.enabled = true
config.assets.version = '1.0'
```

2. it removes `config.action_view.debug_rjs` in config/environments/development.rb

3. it adds asset pipeline configs in config/environments/development.rb

```ruby
# Do not compress assets
config.assets.compress = false

# Expands the lines which load the assets
config.assets.debug = true
```

4. it adds asset pipeline configs in config/environments/production.rb

```ruby
# Compress JavaScripts and CSS
config.assets.compress = true

# Don't fallback to assets pipeline if a precompiled asset is missed
config.assets.compile = false

# Generate digests for assets URLs
config.assets.digest = true
```

5. it adds asset pipeline configs in config/environments/test.rb

```ruby
# Configure static asset server for tests with Cache-Control for performance
config.serve_static_assets = true
config.static_cache_control = "public, max-age=3600"
```

6. it creates config/environments/wrap_parameters.rb.

7. it replaces session_store in config/initializers/session_store.rb

```ruby
Application.session_store :cookie_store, key: '_xxx-session'
```

8. Migrations now use instance methods rather than class methods

```ruby
def self.up
end

def self.down
end
```

=>

```ruby
def up
end

def down
end
```


</details>

<details markdown='1'>

<summary>upgrade_3_1_to_3_2</summary>

It upgrades rails from 3.1 to 3.2.

1. it inserts new configs in config/environments/development.rb.

```ruby
config.active_record.mass_assignment_sanitizer = :strict
config.active_record.auto_explain_threshold_in_seconds = 0.5
```

2. it inserts new configs in config/environments/test.rb.

```ruby
config.active_record.mass_assignment_sanitizer = :strict
```


</details>

<details markdown='1'>

<summary>upgrade_3_2_to_4_0</summary>

It upgrades rails from 3.2 to 4.0.

1. it removes assets group in config/application.rb.

```ruby
if defined?(Bundler)
  Bundler.require(*Rails.groups(:assets => %w(development test)))
end
```

=>

```ruby
Bundler.require(:default, Rails.env)
```

2. it removes `config.active_record.identity_map = true` from config files.
   it removes `config.active_record.auto_explain_threshold_in_seconds = 0.5` from config files.

3. it changes `config.assets.compress = ...` to `config.assets.js_compressor = ...`

4. it removes `include_root_in_json` from config/initializers/wrap_parameters.rb.

5. it inserts secret_key_base to config/initializers/secret_token.rb.

```ruby
Application.config.secret_key_base = '...'
```

6. it removes `config.action_dispatch.best_standards_support = ...` from config files.

7. it inserts `config.eager_load = true` in config/environments/production.rb.

8. it inserts `config.eager_load = false` in config/environments/development.rb.

9. it inserts `config.eager_load = false` in config/environments/test.rb.

10. it removes any code using `ActionDispatch::BestStandardsSupport` in config files.

11. it replaces `ActionController::Base.page_cache_extension = ...` with `ActionController::Base.default_static_extension = ...` in config files.

12. it removes `Rack::Utils.escape` in config/routes.rb.

```ruby
Rack::Utils.escape('こんにちは') => 'こんにちは'
```

13. it replaces match in config/routes.rb.

```ruby
match "/" => "root#index"
```

=>

```ruby
get "/" => "root#index"
```

14. it replaces instance method serialized_attributes with class method.

```ruby
self.serialized_attributes
```

=>

```ruby
self.class.serialized_attributes
```

15. it replaces `dependent: :restrict` to `dependent: :restrict_with_exception`.

16. it removes `config.whiny_nils = true`.

17. it replaces

```ruby
link_to 'delete', post_path(post), confirm: 'Are you sure to delete post?'
```

=>

```ruby
link_to 'delete', post_path(post), data: { confirm: 'Are you sure to delete post?' }
```


</details>

<details markdown='1'>

<summary>upgrade_4_0_to_4_1</summary>

It upgrades rails from 4.0 to 4.1.

1. config/secrets.yml
    Create a secrets.yml file in your config folder
    Copy the existing secret_key_base from the secret_token.rb initializer to secrets.yml under the production section.
    Remove the secret_token.rb initializer

2. remove `ActiveRecord::Migration.check_pending!` in test/test_helper.rb, and add `require 'test_help'`

3. add config/initializers/cookies_serializer.rb

4. replace `MultiJson.dump` with `obj.to_json`, replace `MultiJson.load` with `JSON.parse(str)`

5. warn return within inline callback blocks `before_save { return false }`


</details>

<details markdown='1'>

<summary>upgrade_4_1_to_4_2</summary>

It upgrades rails from 4.1 to 4.2

1. it replaces `config.serve_static_assets = ...` with `config.serve_static_files = ...` in config files.

2. it inserts `config.active_record.raise_in_transactional_callbacks = true` in config/application.rb


</details>

<details markdown='1'>

<summary>upgrade_4_2_to_5_0</summary>

It upgrades rails 4.2 to 5.0

1. it replaces `config.static_cache_control = ...` with `config.public_file_server.headers = ...` in config files.

2. it replaces `config.serve_static_files = ...` with `config.public_file_server.enabled = ...` in config files.

3. it replaces `middleware.use "Foo::Bar"` with `middleware.use Foo::Bar` in config files.

4. it replaces `MissingSourceFile` with `LoadError`.

5. it adds config/initializers/new_framework_defaults.rb.

6. it removes `raise_in_transactional_callbacks=` in config/application.rb.


</details>

<details markdown='1'>

<summary>upgrade_5_0_to_5_1</summary>

It upgrades rails 5.0 to 5.1.

1. it replaces `HashWithIndifferentAccess` with `ActiveSupport::HashWithIndifferentAccess`.

2. it replaces `Rails.application.config.secrets[:smtp_settings]["address"]` with
   `Rails.application.config.secrets[:smtp_settings][:address]`


</details>

<details markdown='1'>

<summary>upgrade_5_1_to_5_2</summary>

It upgrades rails 5.1 to 5.2

1. it replaces `dalli_store` with `mem_cache_store`


</details>

<details markdown='1'>

<summary>upgrade_5_2_to_6_0</summary>

    It upgrades rails 5.2 to 6.0


</details>

<details markdown='1'>

<summary>use_migrations_instance_methods</summary>

It uses instance methods rather than class methods in migrations.

```ruby
def self.up
end

def self.down
end
```

=>

```ruby
def up
end

def down
end
```


</details>

### rspec

<details markdown='1'>

<summary>be_close_to_be_within</summary>

It converts rspec be_close matcher to be_within matcher.

```ruby
expect(1.0 / 3.0).to be_close(0.333, 0.001)
```

=>

```ruby
expect(1.0 / 3.0).to be_within(0.001).of(0.333)
```


</details>

<details markdown='1'>

<summary>block_to_expect</summary>

It converts rspec block to expect.

```ruby
lambda { do_something }.should raise_error
proc { do_something }.should raise_error
-> { do_something }.should raise_error
```

=>

```ruby
expect { do_something }.to raise_error
expect { do_something }.to raise_error
expect { do_something }.to raise_error
```


</details>

<details markdown='1'>

<summary>boolean_matcher</summary>

It converts rspec boolean matcher.

```ruby
be_true
be_false
```

=>

```ruby
be_truthy
be_falsey
```


</details>

<details markdown='1'>

<summary>collection_matcher</summary>

It converts rspec collection matcher.

```ruby
expect(collection).to have(3).items
expect(collection).to have_exactly(3).items
expect(collection).to have_at_least(3).items
expect(collection).to have_at_most(3).items

expect(team).to have(3).players
```

=>

```ruby
expect(collection.size).to eq(3)
expect(collection.size).to eq(3)
expect(collection.size).to be >= 3
expect(collection.size).to be <= 3

expect(team.players.size).to eq 3
```


</details>

<details markdown='1'>

<summary>custom_matcher_new_syntax</summary>

It uses RSpec::Matchers new syntax.

```ruby
RSpec::Matchers.define :be_awesome do
  match_for_should { }
  match_for_should_not { }
  failure_message_for_should { }
  failure_message_for_should_not { }
end
```

=>

```ruby
RSpec::Matchers.define :be_awesome do
  match { }
  match_when_negated { }
  failure_message { }
  failure_message_when_negated { }
end
```


</details>

<details markdown='1'>

<summary>explicit_spec_type</summary>

It explicits spec type.

```ruby
RSpec.configure do |rspec|
end
```

=>

```ruby
RSpec.configure do |rspec|
  rspec.infer_spec_type_from_file_location!
end
```

```ruby
describe SomeModel do
end
```

=>

```ruby
describe SomeModel, :type => :model do
end
```


</details>

<details markdown='1'>

<summary>its_to_it</summary>

It converts rspec its to it.

```ruby
describe 'example' do
  subject { { foo: 1, bar: 2 } }
  its(:size) { should == 2 }
  its([:foo]) { should == 1 }
  its('keys.first') { should == :foo }
end
```

=>

```ruby
describe 'example' do
  subject { { foo: 1, bar: 2 } }

  describe '#size' do
    subject { super().size }
    it { should == 2 }
  end

  describe '[:foo]' do
    subject { super()[:foo] }
    it { should == 1 }
  end

  describe '#keys' do
    subject { super().keys }
    describe '#first' do
      subject { super().first }
      it { should == :foo }
    end
  end
end
```


</details>

<details markdown='1'>

<summary>message_expectation</summary>

It convert rspec message expectation.

```ruby
obj.should_receive(:message)
Klass.any_instance.should_receive(:message)

expect(obj).to receive(:message).and_return { 1 }

expect(obj).to receive(:message).and_return
```

=>

```ruby
expect(obj).to receive(:message)
expect_any_instance_of(Klass).to receive(:message)

expect(obj).to receive(:message) { 1 }

expect(obj).to receive(:message)
```


</details>

<details markdown='1'>

<summary>method_stub</summary>

It converts rspec method stub.

```ruby
obj.stub!(:message)
obj.unstub!(:message)

obj.stub(:message).any_number_of_times
obj.stub(:message).at_least(0)

obj.stub(:message)
Klass.any_instance.stub(:message)

obj.stub_chain(:foo, :bar, :baz)

obj.stub(:foo => 1, :bar => 2)

allow(obj).to receive(:message).and_return { 1 }

allow(obj).to receive(:message).and_return
```

=>

```ruby
obj.stub(:message)
obj.unstub(:message)

allow(obj).to receive(:message)
allow(obj).to receive(:message)

allow(obj).to receive(:message)
allow_any_instance_of(Klass).to receive(:message)

allow(obj).to receive_message_chain(:foo, :bar, :baz)

allow(obj).to receive_messages(:foo => 1, :bar => 2)

allow(obj).to receive(:message) { 1 }

allow(obj).to receive(:message)
```


</details>

<details markdown='1'>

<summary>negative_error_expectation</summary>

It converts rspec negative error expectation.

```ruby
expect { do_something }.not_to raise_error(SomeErrorClass)
expect { do_something }.not_to raise_error('message')
expect { do_something }.not_to raise_error(SomeErrorClass, 'message')
```

=>

```ruby
expect { do_something }.not_to raise_error
expect { do_something }.not_to raise_error
expect { do_something }.not_to raise_error
```


</details>

<details markdown='1'>

<summary>new_config_options</summary>

It converts rspec configuration options.

1. it removes `config.treat_symbols_as_metadata_keys_with_true_values = true`

2. it converts

```ruby
RSpec.configure do |c|
  c.backtrace_clean_patterns
  c.backtrace_clean_patterns = [/lib/something/]
  c.color_enabled = true

  c.out
  c.out = File.open('output.txt', 'w')
  c.output
  c.output = File.open('output.txt', 'w')

  c.backtrace_cleaner
  c.color?(output)
  c.filename_pattern
  c.filename_pattern = '**/*_test.rb'
  c.warnings
end
```

=>

```ruby
RSpec.configure do |c|
  c.backtrace_exclusion_patterns
  c.backtrace_exclusion_patterns = [/lib/something/]
  c.color = true

  c.output_stream
  c.output_stream = File.open('output.txt', 'w')
  c.output_stream
  c.output_stream = File.open('output.txt', 'w')

  c.backtrace_formatter
  c.color_enabled?(output)
  c.pattern
  c.pattern = '**/*_test.rb'
  c.warnings?
end
```


</details>

<details markdown='1'>

<summary>new_hook_scope</summary>

It converts new hook scope.

```ruby
before(:each) { do_something }
before(:all) { do_something }
```

=>

```ruby
before(:example) { do_something }
before(:context) { do_something }
```


</details>

<details markdown='1'>

<summary>one_liner_expectation</summary>

It convers rspec one liner expectation.

```ruby
it { should matcher }
it { should_not matcher }

it { should have(3).items }

it { should have_at_least(3).players }
```

=>

```ruby
it { is_expected.to matcher }
it { is_expected.not_to matcher }

it 'has 3 items' do
  expect(subject.size).to eq(3)
end

it 'has at least 3 players' do
  expect(subject.players.size).to be >= 3
end
```


</details>

<details markdown='1'>

<summary>pending_to_skip</summary>

It converts rspec pending to skip.

```ruby
it 'is skipped', :pending => true do
  do_something_possibly_fail
end

pending 'is skipped' do
  do_something_possibly_fail
end

it 'is skipped' do
  pending
  do_something_possibly_fail
end

it 'is run and expected to fail' do
  pending do
    do_something_surely_fail
  end
end
```

=>

```ruby
it 'is skipped', :skip => true do
  do_something_possibly_fail
end

skip 'is skipped' do
  do_something_possibly_fail
end

it 'is skipped' do
  skip
  do_something_possibly_fail
end

it 'is run and expected to fail' do
  skip
  do_something_surely_fail
end
```


</details>

<details markdown='1'>

<summary>remove_monkey_patches</summary>

It removes monkey patching of the top level methods like describe

```ruby
RSpec.configure do |rspec|
end
```

=>

```ruby
RSpec.configure do |rspec|
  rspec.expose_dsl_globally = false
end
```

```ruby
describe 'top-level example group' do
  describe 'nested example group' do
  end
end
```

=>

```ruby
RSpec.describe 'top-level example group' do
  describe 'nested example group' do
  end
end
```


</details>

<details markdown='1'>

<summary>should_to_expect</summary>

It converts rspec should to expect.

```ruby
obj.should matcher
obj.should_not matcher

1.should == 1
1.should < 1
Integer.should === 1

'string'.should =~ /^str/
[1, 2, 3].should =~ [2, 1, 3]
```

=>

```ruby
expect(obj).to matcher
expect(obj).not_to matcher

expect(1).to eq 1
expect(1).to be < 2
expect(Integer).to be === 1

expect('string').to match /^str/
expect([1, 2, 3]).to match_array [2, 1, 3]
```


</details>

<details markdown='1'>

<summary>stub_and_mock_to_double</summary>

It converts stub and mock to double.

```ruby
stub('something')
mock('something')
```

=>

```ruby
double('something')
double('something')
```


</details>

<details markdown='1'>

<summary>use_new_syntax</summary>

It converts rspec code to new syntax, it calls all rspec sub snippets.

</details>

### ruby

<details markdown='1'>

<summary>block_to_yield</summary>

It converts block to yield.

```ruby
def slow(&block)
  block.call
end
```

=>

```ruby
def slow
  yield
end
```


</details>

<details markdown='1'>

<summary>deprecate_big_decimal_new</summary>

It converts BigDecimal.new to BigDecimal

```ruby
BigDecimal.new('1.1')
```

=>

```ruby
BigDecimal('1.1')
```


</details>

<details markdown='1'>

<summary>fast_syntax</summary>

Use ruby fast syntax.

Reference: https://speakerdeck.com/sferik/writing-fast-ruby


</details>

<details markdown='1'>

<summary>gsub_to_tr</summary>

It converts `String#gsub` to `String#tr`

```ruby
'slug from title'.gsub(' ', '_')
```

=>

```ruby
'slug from title'.tr(' ', '_')
```


</details>

<details markdown='1'>

<summary>hash_short_syntax</summary>

Use ruby 3.1 hash short syntax.

```ruby
some_method(a: a, b: b, c: c, d: d + 4)
```

=>

```ruby
some_method(a:, b:, c:, d: d + 4)
```


</details>

<details markdown='1'>

<summary>hash_value_shorthand</summary>

Values in Hash literals and keyword arguments can be omitted.

```ruby
{x: x, y: y}

foo(x: x, y: y)
```

=>

```ruby
{x:, y:}

foo(x:, y:)
```


</details>

<details markdown='1'>

<summary>kernel_open_to_uri_open</summary>

It converts `Kernel#open` to `URI.open`

```ruby
open('http://test.com')
```

=>

```ruby
URI.open('http://test.com')
```


</details>

<details markdown='1'>

<summary>keys_each_to_each_key</summary>

It convert `Hash#keys.each` to `Hash#each_key`

```ruby
params.keys.each {}
```

=>

```ruby
params.each_key {}
```


</details>

<details markdown='1'>

<summary>map_and_flatten_to_flat_map</summary>

It converts `map` and `flatten` to `flat_map`

```ruby
enum.map do
  # do something
end.flatten
```

=>

```ruby
enum.flat_map do
  # do something
end
```


</details>

<details markdown='1'>

<summary>merge_to_square_brackets</summary>

It converts `Hash#merge` and `Hash#merge!` methods to `Hash#[]=`

```ruby
enum.inject({}) do |h, e|
  h.merge(e => e)
end
```

=>

```ruby
enum.inject({}) do |h, e|
  h[e] = e
  h
end
```

```ruby
enum.inject({}) { |h, e| h.merge!(e => e) }
```

=>

```ruby
enum.inject({}) { |h, e| h[e] = e; h }
```

```ruby
enum.each_with_object({}) do |e, h|
  h.merge!(e => e)
end
```

=>

```ruby
enum.each_with_object({}) do |e, h|
  h[e] = e
end
```


</details>

<details markdown='1'>

<summary>nested_class_definition</summary>

It converts compact class definition to nested class definition.

```ruby
class Foo::Bar < Base
  def test; end
end
```

=>

```ruby
module Foo
  class Bar < Base
    def test; end
  end
end
```


</details>

<details markdown='1'>

<summary>new_1_9_hash_syntax</summary>

Use ruby 1.9 new hash syntax.

```ruby
{ :foo => 'bar' }
```

=>

```ruby
{ foo: 'bar' }
```


</details>

<details markdown='1'>

<summary>new_2_2_hash_syntax</summary>

Use ruby 2.2 new hash syntax.

```ruby
{ :foo => 'bar' }
{ :'foo-x' => 'bar' }
{ :"foo-#{suffix}" 'bar' }
```

=>

```ruby
{ foo: 'bar' }
{ 'foo-x': 'bar' }
{ "foo-#{suffix}": 'bar' }
```


</details>

<details markdown='1'>

<summary>new_lambda_syntax</summary>

Use ruby new lambda syntax

```ruby
lambda { # do some thing }
```

=>

```ruby
-> { # do some thing }
```


</details>

<details markdown='1'>

<summary>new_safe_navigation_operator</summary>

Use ruby new safe navigation operator.

```ruby
u.try!(:profile).try(:thumbnails).try(:large, 100, format: 'jpg')
```

=>

```ruby
u&.profile&.thumbnails&.large(100, format: 'jpg')
```


</details>

<details markdown='1'>

<summary>numbered parameters</summary>

It uses numbered parameters.

```ruby
squared_numbers = (1...10).map { |num| num ** 2 }

city_populations.each { |city, population| puts "Population of #{city} is #{population}" }
```

=>

```ruby
squared_numbers = (1...10).map { _1 ** 2 }

city_populations.each { puts "Population of #{_1} is #{_2}" }
```


</details>

<details markdown='1'>

<summary>parallel_assignment_to_sequential_assignment</summary>

It converts parallel assignment to sequential assignment.

```ruby
a, b = 1, 2
```

=>

```ruby
a = 1
b = 2
```


</details>

<details markdown='1'>

<summary>prefer_dig</summary>

It prefers Hash#dig

```ruby
params[one] && params[one][two] && params[one][two][three]
```

=>

```ruby
params.dig(one, two, three)
```


</details>

<details markdown='1'>

<summary>remove_debug_code</summary>

It removes `puts` and `p` calls.


</details>

<details markdown='1'>

<summary>use_symbol_to_proc</summary>

It uses &: (short for symbol to proc)

```ruby
(1..100).each { |i| i.to_s }
(1..100).map { |i| i.to_s }
```

=>

```ruby
(1..100).each(&:to_s)
(1..100).map(&:to_s)
```


</details>

### shoulda

<details markdown='1'>

<summary>fix_1_5_deprecations</summary>

It fixes shoulda 1.5 deprecations.

models:

```ruby
should validate_format_of(:email).with('user@example.com')
```

=>

```ruby
should allow_value('user@example.com').for(:email)
```

controllers:

```ruby
should assign_to(:user)

should assign_to(:user) { @user }

should respond_with_content_type "application/json"
```

=>

```ruby
should "assigns user" do
  assert_not_nil assigns(:user)
end

should "assigns user" do
  assert_equal @user, assigns(:user)
end

should "responds with application/json" do
  assert_equal "application/json", response.content_type
end
```


</details>

<details markdown='1'>

<summary>fix_2_6_deprecations</summary>

It fixes shoulda 2.6 deprecations.

```ruby
should ensure_inclusion_of(:age).in_range(0..100)
should ensure_exclusion_of(:age).in_range(0..100)
```

=>

```ruby
should validate_inclusion_of(:age).in_range(0..100)
should validate_exclusion_of(:age).in_range(0..100)
```


</details>

<details markdown='1'>

<summary>use_matcher_syntax</summary>

It converts shoulda macros to matcher syntax.

models:

```ruby
should_belongs_to :user
should_have_one :category
should_have_many :comments
should_have_and_belong_to_many :tags

should_validate_presence_of :title, :body

should_validate_uniqueness_of :name, :message => 'O NOES! SOMEONE STOELED YER NAME!'
should_validate_numericality_of :age
should_validate_acceptance_of :eula

should_ensure_length_in_range :password, (6..20)
should_ensure_length_is :ssn, 9
should_ensure_value_in_range :age, (0..100)

should_allow_values_for :isbn, 'isbn 1 2345 6789 0', 'ISBN 1-2345-6789-0'
should_not_allow_values_for :isbn, "bad1", "bad 2"

should_allow_mass_assignment_of :first_name, :last_name
should_not_allow_mass_assignment_of :password, :admin_flag

should_have_readonly_attributes :password, :admin_flag
```

=>

```ruby
should belong_to(:user)
should have_one(:category)
should have_many(:comments)
should have_and_belong_to_many(:tags)

should validate_presence_of(:title)
should validate_presence_of(:body)

should validate_uniqueness_of(:name).with_message('O NOES! SOMEONE STOELED YER NAME!')
should validate_numericality_of(:age)
should validate_acceptance_of(:eula)

should ensure_length_of(:password).is_at_least(6).is_at_most(20)
should ensure_length_of(:ssn).is_equal_to(9)
should ensure_inclusion_of(:age).in_range(0..100)

should allow_value('isbn 1 2345 6789 0').for(:isbn)
should allow_value('isbn 1-2345-6789-0').for(:isbn)
should_not allow_value("bad1").for(:isbn)
should_not allow_value("bad2").for(:isbn)

should allow_mass_assignment_of(:first_name)
should allow_mass_assignment_of(:last_name)
should_not allow_mass_assignment_of(:password)
should_not allow_mass_assignment_of(:admin_flag)

should have_readonly_attributes(:password)
should have_readonly_attributes(:admin_flag)
```

controllers:

```ruby
should_set_the_flash_to "Thank you for placing this order."
should_not_set_the_flash

should_filter_params :password, :ssn

should_assign_to :user, :posts

should_assign_to :user, :class => User
should_assign_to(:user) { @user }

should_not_assign_to :user, :posts

should_set_session(:user_id) { @user.id }

should_respond_with :success

should_respond_with_content_type :rss

should_render_template :new

should_render_with_layout "special"

should_render_without_layout

should_route :get, "/posts", :controller => :posts, :action => :index

should_redirect_to("the user profile") { user_url(@user) }
```

=>

```ruby
should set_the_flash.to("Thank you for placing this order.")
should_not set_the_flash

should filter_param(:password)
should filter_param(:ssn)

should assign_to(:user)
should assign_to(:posts)

should assign_to(:user).with_kind_of(User)
should assign_to(:user).with(@user)

should_not assign_to(:user)
should_not assign_to(:posts)

should set_session(:user_id).to(@user.id)

should respond_with(:success)

should respond_with_content_type(:rss)

should render_template(:new)

should render_with_layout("special")

should_not render_layout

should route(:get, "/posts").to(:controller => :posts, :action => :index)

should redirect_to("the user profile") { user_url(@user) }
```


</details>

<details markdown='1'>

<summary>use_new_syntax</summary>

It uses shoulda new syntax and fix deprecations.

</details>

### will_paginate

<details markdown='1'>

<summary>use_new_syntax</summary>

It uses will_paginate new syntax.

```ruby
Post.paginate(:conditions => {:active => true}, :order => "created_at DESC", :per_page => 10, :page => 1)

Post.paginated_each(:conditions => {:active => true}, :order => "created_at DESC", :per_page => 10) do |post|
end
```

=>

```ruby
Post.where(:active => true).order("created_at DESC").paginate(:per_page => 10, :page => 1)

Post.where(:active => true).order("created_at DESC").find_each(:batch_size => 10) do |post|
end
```


</details>
