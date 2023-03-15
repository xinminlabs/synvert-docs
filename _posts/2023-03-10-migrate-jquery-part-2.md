---
layout: default
title: Migrate JQuery Part 2
date: 2023-03-10
categories: javascript
permalink: /:categories/:title/index.html
---

In our previous tutorial, we learned how to use Synvert to migrate jQuery code for simple cases. In this tutorial, we'll take things a step further and dive into more complex use cases.

The first one is

> [pre-on-methods] JQMIGRATE: jQuery.fn.hover() is deprecated
>
> Cause: The .hover() method is a shorthand for the use of the mouseover/mouseout events. It is often a poor user interface choice because it does not allow for any small amounts of delay between when the mouse enters or exits an area and when the event fires. This can make it quite difficult to use with UI widgets such as drop-down menus. For more information on the problems of hovering, see the hoverIntent plugin.
>
> Solution: Review uses of .hover() to determine if they are appropriate, and consider use of plugins such as hoverIntent as an alternative. The direct replacement for .hover(fn1, fn2), is .on("mouseenter", fn1).on("mouseleave", fn2).

Let's generate a new snippet in Synvert by setting the input as `$this.hover(fn1, fn2)` and the output as `$this.on("mouseenter", fn1).on("mouseleave", fn2)`. This will create the following snippet:

```javascript
{% raw %}new Synvert.Rewriter("group", "name", () => {
  withinFiles("**/*.js", () => {
    withNode({ nodeType: "CallExpression", expression: { nodeType: "PropertyAccessExpression", expression: "$this", name: "hover" }, arguments: { 0: "fn1", 1: "fn2", length: 2 } }, () => {
      replace("arguments.0", { with: '"mouseleave"' });
      replace("expression", { with: '{{expression.expression}}.on("mouseenter", {{arguments.0}}).on' });
    });
  });
});{% endraw %}
```

It finds the expected input code, and replaces first argument with `mouseleave` and then replaces the expression with `{% raw %}{{expression.expression}}.on("mouseenter", {{arguments.0}}).on{% endraw %}`, this looks a bit weird, but you see the "Next >" link, it means Synvert generates more than one snippets, let's check the next snippet:

```javascript
{% raw %}new Synvert.Rewriter("group", "name", () => {
  withinFiles("**/*.js", () => {
    withNode({ nodeType: "CallExpression", expression: { nodeType: "PropertyAccessExpression", expression: "$this", name: "hover" }, arguments: { 0: "fn1", 1: "fn2", length: 2 } }, () => {
      replaceWith('{{expression.expression}}.on("mouseenter", {{arguments.0}}).on("mouseleave", {{arguments.1}})');
    });
  });
});{% endraw %}
```

It replaces the whole code with `{% raw %}{{expression.expression}}.on("mouseenter", {{arguments.0}}).on("mouseleave", {{arguments.1}}){% endraw %}`, this snippet is much more straightforward and easier to understand. I'll use this snippet as a base one.

We can limit the number of arguments to be two since they can be either a function, an arrow function, or a function variable. Regarding the expression of the call expression, we can assume that it starts with `$` or `jQuery`, which allows us to use a regular expression to match them. This way, we can cover expressions like `$this`, `jQuery(this)`, or `$(this).parents("form")`.

```javascript
{% raw %}new Synvert.Rewriter("group", "name", () => {
  withinFiles("**/*.{js,html}", () => {
    withNode({ nodeType: "CallExpression", expression: { nodeType: "PropertyAccessExpression", expression: /^(jQuery|\$)/, name: "hover" }, arguments: { length: 2 } }, () => {
      replaceWith('{{expression.expression}}.on("mouseenter", {{arguments.0}}).on("mouseleave", {{arguments.1}})');
    });
  });
});{% endraw %}
```

With the updated snippet, we can now search for instances of `$.fn.hover` in our project and replace them with `.on("mouseenter", fn1).on("mouseleave", fn2)`.

![JQuery Migrate 3]({{ site.baseurl }}/img/jquery-migrate-3.png)

The next one is:

> [shorthand-deprecated-v3] JQMIGRATE: jQuery.fn.click() event shorthand is deprecated
>
> Cause: The .on() and .trigger() methods can set an event handler or generate an event for any event type, and should be used instead of the shortcut methods. This message also applies to the other event shorthands, including: blur, focus, focusin, focusout, resize, scroll, dblclick, mousedown, mouseup, mousemove, mouseover, mouseout, mouseenter, mouseleave, change, select, submit, keydown, keypress, keyup, and contextmenu.
>
> Solution: Instead of .click(fn) use .on("click", fn). Instead of .click() use .trigger("click").

Let's generate a new snippet by setting the input as `$this.click(fn)` and the output as `$this.on("click", fn)`. This will create the following updated snippet:

```javascript
{% raw %}new Synvert.Rewriter("group", "name", () => {
  withinFiles("**/*.{js,html}", () => {
    withNode({ nodeType: "CallExpression", expression: { nodeType: "PropertyAccessExpression", expression: "$this", name: "click" }, arguments: { 0: "fn", length: 1 } }, () => {
      replaceWith('{{expression.expression}}.on("click", {{arguments.0}})');
    });
  });
});{% endraw %}
```

Similar to the previous one,

Firstly, we can remove the restriction on the `arguments.0`.

Secondly, we can match the expression of the call expression using `/^(jQuery|\$)/` regular expression to allow it to start with `$` or `jQuery`.

Finally, we can change the name of the call expression to match all events using `{ in: ["click", "submit", "change", "select"] }` and replace `"click"` with `{% raw %}"{{expression.name}}{% endraw %}"` in the `replaceWith` statement.

The updated snippet is as follows:

```javascript
{% raw %}new Synvert.Rewriter("group", "name", () => {
  withinFiles("**/*.{js,html}", () => {
    withNode({ nodeType: "CallExpression", expression: { nodeType: "PropertyAccessExpression", expression: /^(jQuery|\$)/, name: { in: ["click", "submit", "change", "select"] } }, arguments: { length: 1 } }, () => {
      replaceWith('{{expression.expression}}.on("{{expression.name}}", {{arguments.0}})');
    });
  });
});{% endraw %}
```

With the updated snippet, we can now search for instances of `$.fn.click(fn)` in our project and replace them with `$.fn.on("click", fn)`.

![JQuery Migrate 4]({{ site.baseurl }}/img/jquery-migrate-4.png)

The synvert syntax is likely familiar to you by now, and we can use it to modify the snippet to support changing from `$.fn.click()` to `$.fn.trigger("click")`:

```javascript
{% raw %}new Synvert.Rewriter("group", "name", () => {
  withinFiles("**/*.{js,html}", () => {
    withNode({ nodeType: "CallExpression", expression: { nodeType: "PropertyAccessExpression", expression: /^(jQuery|\$)/, name: { in: ["click", "submit"] } }, arguments: { length: 0 } }, () => {
      replaceWith('{{expression.expression}}.trigger("{{expression.name}}")');
    });
  });
});{% endraw %}
```

With the updated snippet, we can now search for instances of `$.fn.click()` in our project and replace them with `$.fn.trigger("click")`.

![JQuery Migrate 5]({{ site.baseurl }}/img/jquery-migrate-5.png)

In the upcoming tutorial, we will explore a more complex use case, and I will guide you through the process of writing and testing snippets in code. Stay tuned!
