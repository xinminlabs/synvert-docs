---
layout: default
title: Use synvert without writing any code at all
date: 2023-05-05
categories: ruby
permalink: /:categories/:title/index.html
---

On March 2nd, 2023, I read a tip in Ruby Weekly.

> !value.nil? is a lot faster than value != nil

![Use synvert without writing any code at all 1]({{ site.baseurl }}/img/use-synvert-without-writing-any-code-at-all-1.png)

It's nearly 5 times faster, so I want to update my code base accordingly.

I open the Synvert app, copy the code from the tip and paste them into inputs and expected outputs.

Then I click the "Generate Snippet" button, and Synvert generates a snippet for me.

![Use synvert without writing any code at all 2]({{ site.baseurl }}/img/use-synvert-without-writing-any-code-at-all-2.png)

After reviewing the snippet, I click the "Search" button, and Synvert finds all occurrences of `value != nil` in my code base.

I can selectively apply the changes or click "Replace All" button to apply them all at once.

![Use synvert without writing any code at all 3]({{ site.baseurl }}/img/use-synvert-without-writing-any-code-at-all-3.png)

I can run `git diff` to view all changes in my code base.

![Use synvert without writing any code at all 4]({{ site.baseurl }}/img/use-synvert-without-writing-any-code-at-all-4.png)
