---
layout: default
title: "Launch of upgradecode.io: Simplify Your Code Upgrades!"
date: 2024-05-12
categories: ruby
permalink: /:categories/launch-of-upgradecode-io-simplify-your-code-upgrades/index.html
---

We’re thrilled to announce the launch of [upgradecode.io](https://upgradecode.io), a cutting-edge platform designed to streamline and simplify the process of upgrading your projects. Our platform offers automated tools to analyze your code, identify necessary updates, and provide actionable recommendations and patches. Whether you’re upgrading Ruby, Rails, or JavaScript projects, upgradecode.io makes your transition smoother with detailed insights and guided updates. Start enhancing your projects today at upgradecode.io and keep your applications up-to-date with ease!

I recently decided to upgrade an older project of mine, railsbp, which was using Ruby 2.3 and Rails 4.2. My goal was to bring it up to Ruby 3.2 and Rails 6.1, and I used upgradecode.io to facilitate this process.

### Initial Setup

Initially, upgradecode.io does not automatically update Ruby and gem versions in the Gemfile—that’s something you need to handle manually. I started by creating a new branch `features/upgrade-ruby-to-3-2-and-rails-to-6-1` and manually updated Ruby to 3.2 and Rails to 6.1 in the Gemfile.

### Creating and Connecting the Project

Next, I created a new project on upgradecode.io and connected it to the git repository. The project page gave me the option to analyze the project, select versions, and choose either official snippets or input custom snippets for the upgrade.

### Selecting Versions and Analyzing the Codebase

I selected the branch `features/upgrade-ruby-to-3-2-and-rails-to-6-1` and specified that I was upgrading from Ruby 2.3 to 3.2 and from Rails 4.2 to 6.1. I also opted to modernize the RSpec syntax from version 3.5 and checked the option to analyze gem dependencies in Gemfile.lock. This feature extends to JavaScript as well; for instance, I indicated upgrading jQuery from version 1.9 to 3.5. Clicking the "Process" button started the analysis.
![Launch of upgradeocde.io image 15]({{ site.baseurl }}/img/launch-of-upgradecode-io-15.png)

### Reviewing and Applying Changes

The analysis took a few minutes, depending on the size of the codebase. Here’s what happened next:

* **jQuery Changes**: Upgradecode.io recommends using `on('click', fn)` instead of `click(fn)`. This update aligns with more consistent and modern jQuery syntax. To implement this change, I can click the "Send Pull Request" button to apply this change to GitHub, allowing the CI to run the tests and merge the PR.
![Launch of upgradeocde.io image 1]({{ site.baseurl }}/img/launch-of-upgradecode-io-1.png)

* **Rails Syntax Upgrades**: Upgradecode.io provided several Rails-specific syntax updates:

  * `rails/add_active_record_migration_rails_version`: Introduced in Rails 5.0, this update adds a default Rails version, `[4.2]`, to new migrations.
![Launch of upgradeocde.io image 2]({{ site.baseurl }}/img/launch-of-upgradecode-io-2.png)
  * `rails/add_application_job`: Also from Rails 5.0, this creates a new base class `ApplicationJob`, allowing other job classes to inherit from `ApplicationJob` instead of `ActiveJob::Base`.
![Launch of upgradeocde.io image 3]({{ site.baseurl }}/img/launch-of-upgradecode-io-3.png)
  * `rails/add_application_mailer`: Adds a base class `ApplicationMailer` for mailers.
![Launch of upgradeocde.io image 4]({{ site.baseurl }}/img/launch-of-upgradecode-io-4.png)
  * `rails/add_application_record`: Establishes `ApplicationRecord` as a base class for all models instead of directly inheriting from `ActiveRecord::Base`.
![Launch of upgradeocde.io image 5]({{ site.baseurl }}/img/launch-of-upgradecode-io-5.png)
  * `rails/convert_configs_6_0_to_6_1`: Updates application configuration files to set `config.load_defaults` to `6.1`.
![Launch of upgradeocde.io image 6]({{ site.baseurl }}/img/launch-of-upgradecode-io-6.png)
  * `rails/convert_env_to_request_env`: Replaces the use of `env` with `request.env` in controllers.
![Launch of upgradeocde.io image 7]({{ site.baseurl }}/img/launch-of-upgradecode-io-7.png)
  * `rails/convert_render_text_to_render_plain`: Changes `render text:` to `render plain:` to align with Rails 5.1+ standards.
![Launch of upgradeocde.io image 8]({{ site.baseurl }}/img/launch-of-upgradecode-io-8.png)
  * `rails/convert_test_request_methods_4_2_to_5_0`: Updates test request methods to use keyword arguments for `params`, `headers`, `session`, and `flash`, aligning with Rails 5.0 changes.
![Launch of upgradeocde.io image 9]({{ site.baseurl }}/img/launch-of-upgradecode-io-9.png)
  * `rails/convert_update_attributes_to_update`: Replaces deprecated `update_attributes` with `update`, simplifying ActiveRecord model updates.
![Launch of upgradeocde.io image 10]({{ site.baseurl }}/img/launch-of-upgradecode-io-10.png)

* **Ruby Syntax Enhancements**: The following changes were suggested for the Ruby code:

  * `ruby/deprecate_file_exists`: Since `File.exists?` is removed in Ruby 3.2, it is replaced with `File.exist?`.
![Launch of upgradeocde.io image 12]({{ site.baseurl }}/img/launch-of-upgradecode-io-12.png)
  * `ruby/shorthand_hash_syntax`: Introduced with Ruby 3.1, this suggestion applies the shorthand syntax for hash keys that are symbols.
![Launch of upgradeocde.io image 13]({{ site.baseurl }}/img/launch-of-upgradecode-io-13.png)

* **Modernize RSpec Syntax**:

  * `rspec/explicit_spec_type`: This snippet adds `type: :model` to model specs and `type: :controller` to controller specs, making the spec type explicit.
![Launch of upgradeocde.io image 11]({{ site.baseurl }}/img/launch-of-upgradecode-io-11.png)

I want to show you a feature that allows you to selectively apply changes. For example, if you don't want to apply certain changes, you can simply uncheck them. In this instance, I unchecked `config.infer_spec_type_from_file_location!` and clicked "Send Pull Request" button. As a result, upgradecode.io will created a PR without this change.

Railsbp is a small project, so there aren't many code changes. However, upgradecode.io provides numerous snippets that can be applied to larger projects, making it easier to upgrade your codebase.

### Handling Dependency Issues

Since I opted to check gems, upgradecode.io also analyzed the code within gems to identify potential compatibility issues. For example:

* The `hashie` gem version 5.0.0 uses deprecated `Fixnum` and `Bignum` in its source code.
* The `high_voltage` gem version 3.0.0 still uses `File.exists?` which is removed.
![Launch of upgradeocde.io image 14]({{ site.baseurl }}/img/launch-of-upgradecode-io-14.png)

These insights are crucial as they indicate a need for an update or a fork of the gem.

### Conclusion

Upgradecode.io not only provided a comprehensive analysis and actionable suggestions but also seamlessly integrated these changes with GitHub, facilitating easy reviews and merges. Whether it’s upgrading Ruby, Rails, or JavaScript codebase, upgradecode.io proves to be an indispensable tool for developers seeking to modernize their applications efficiently.
