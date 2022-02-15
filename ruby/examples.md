---
layout: ruby
title: Examples
---

<ul>
    {% assign ruby_posts = site.posts | where_exp: "post", "post.categories[0] == 'ruby'" %}
    {% for post in ruby_posts %}
        <li><a href="{{ post.url | relative_url }}">{{post.title}}</a></li>
    {% endfor %}
</ul>