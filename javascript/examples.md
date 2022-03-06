---
layout: javascript
title: Examples
---

<ul>
    <li><a href="/javascript/step-by-step-guideline/">Step by Step Guideline</a></li>
    {% assign javascript_posts = site.posts | where_exp: "post", "post.categories[0] == 'javascript'" %}
    {% for post in javascript_posts %}
        <li><a href="{{ post.url | relative_url }}">{{post.title}}</a></li>
    {% endfor %}
</ul>