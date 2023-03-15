---
layout: default
title: Migrate JQuery Part 1
date: 2023-03-03
categories: javascript
permalink: /:categories/:title/index.html
---

[JQuery](https://github.com/jquery/jquery) was one of the most popular web framework in the past and is still under active development. However, newer versions of jQuery deprecate some of its APIs.

To help developers address this issue, [JQuery Migrate](https://github.com/jquery/jquery-migrate) is a plugin that warns about deprecated APIs and lists them on this page. In this tutorial, I will select a few of the deprecated APIs and demonstrate how to use Synvert to automatically migrate your jQuery code.

### The first one is

> [parseJSON] JQMIGRATE: jQuery.parseJSON is deprecated; use JSON.parse
>
> Cause: The jQuery.parseJSON method in recent jQuery is identical to the native JSON.parse. As of jQuery 3.0 jQuery.parseJSON is deprecated.
>
> Solution: Replace any use of jQuery.parseJSON with JSON.parse.

To get started with Synvert, open VSCode and activate the Synvert Extension. Select the language as `javascript` and click "Show Generate Snippet Form." Set the input as `jQuery.parseJSON(data)` and the output as `JSON.parse(data)`. Finally, click the "Generate Snippet" button. This will generate the following snippet:

```javascript
new Synvert.Rewriter("group", "name", () => {
  withinFiles("**/*.js", () => {
    withNode({ nodeType: "CallExpression", expression: { nodeType: "PropertyAccessExpression", expression: "jQuery", name: "parseJSON" }, arguments: { 0: "data", length: 1 } }, () => {
      replace("expression", { with: "JSON.parse" });
    });
  });
});
```

This is a simple and straightforward snippet that searches for the call `jQuery.parseJSON` with one argument, `data`, and replaces the expression with `JSON.parse`. To make a few changes to the snippet, we can remove the rule that `argument.0` is `data`, allow the expression to be both `jQuery` and `$` by using the `in` operator. If you would like to replace JavaScript code in HTML files as well, you can change the file pattern to `**/*.{js,html}`. The updated snippet is as follows:

```javascript
new Synvert.Rewriter("group", "name", () => {
  withinFiles("**/*.{js,html}", () => {
    withNode({ nodeType: "CallExpression", expression: { nodeType: "PropertyAccessExpression", expression: { in: ["$", "jQuery"] }, name: "parseJSON" }, arguments: {  length: 1 } }, () => {
      replace("expression", { with: "JSON.parse" });
    });
  });
});
```

With the updated snippet, we can now search for instances of `$.parseJSON` in our project and replace them with `JSON.parse`.

![JQuery Migrate 1]({{ site.baseurl }}/img/jquery-migrate-1.png)

Other warnings to look out for include `jQuery.isArray`, `jQuery.unique` and `jQuery.expr.filters`.

### The next one is

> [ready-event] JQMIGRATE: 'ready' event is deprecated
>
> Cause: Using one of jQuery's API methods to bind a "ready" event, e.g. $( document ).on( "ready", fn ), will cause the function to be called when the document is ready, but only if it is attached before the browser fires its own DOMContentLoaded event. That makes it unreliable for many uses, particularly ones where jQuery or its plugins are loaded asynchronously after page load.
>
> Solution: Replace any use of $( document ).on( "ready", fn ) with $( fn ). This approach works reliably even when the document is already loaded.

Let's generate a new snippet by setting the input as `$(document).ready(fn)` and the output as `$(fn)`. This will create the following updated snippet:

```javascript
{% raw %}new Synvert.Rewriter("group", "name", () => {
  withinFiles("**/*.{js,html}", () => {
    withNode({ nodeType: "CallExpression", expression: { nodeType: "PropertyAccessExpression", expression: { nodeType: "CallExpression", expression: "$", arguments: { 0: "document", length: 1 } }, name: "ready" }, arguments: { 0: "fn", length: 1 } }, () => {
      replace("expression", { with: "{{expression.expression.expression}}" });
    });
  });
});{% endraw %}
```

We can apply the same changes to this snippet by removing the rule that `arguments.0` is `fn`, and allowing the expression to be both `jQuery` and `$` by using the `in` operator. The updated snippet is as follows:

```javascript
{% raw %}new Synvert.Rewriter("group", "name", () => {
  withinFiles("**/*.{js,html}", () => {
    withNode({ nodeType: "CallExpression", expression: { nodeType: "PropertyAccessExpression", expression: { nodeType: "CallExpression", expression: { in: ["$", "jQuery"] }, arguments: { 0: "document", length: 1 } }, name: "ready" }, arguments: { length: 1 } }, () => {
      replace("expression", { with: "{{expression.expression.expression}}" });
    });
  });
});{% endraw %}
```

With the updated snippet, we can now search for instances of `$(document).ready(fn)` in our project and replace them with `$(fn)`.

![JQuery Migrate 2]({{ site.baseurl }}/img/jquery-migrate-2.png)

That concludes this tutorial. In the next tutorial, I'll dive into some complex use cases, such as transforming `jQuery.fn.hover(fn1, fn2)` to `jQuery.fn.on("mouseenter", fn1).on("mouseleave", fn2)`. See you then!
