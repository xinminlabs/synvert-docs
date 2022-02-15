---
layout: javascript
title: Examples
---

<ul>
    {% assign javascript_posts = site.posts | where_exp: "post", "post.categories[0] == 'javascript'" %}
    {% for post in javascript_posts %}
        <li><a href="{{ post.url | relative_url }}">{{post.title}}</a></li>
    {% endfor %}
</ul>