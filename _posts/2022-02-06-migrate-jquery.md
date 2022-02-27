---
layout: javascript
title: Use synvert to migrate jQuery
date: 2022-02-06
categories: javascript
permalink: /:categories/:title
---

> **TL;DR** you can run `synvert-javascript --run jquery/migrate --path <project_path>`
> to migrate jquery to 3.x syntax.

jQuery 3 introduced some API changes and deprecations, most of them are straightforward but tedious,
it's a good time to use `synvert-javascript`.

I followed the list in [jquery-migrate warnings](https://github.com/jquery/jquery-migrate/blob/main/warnings.md)
to write some [synvert snippets](https://github.com/xinminlabs/synvert-snippets-javascript/tree/master/lib/jquery)
to fix jquery 3 upgrade warnings.

### Use the synvert snippet

The overall snippet is `jquery/migrate`, it includes many small snippets, e.g. `jquery/deprecate-event-shorthand`,
so you can run the following command to automatically convert the jqeury code.

```bash
$ synvert-javascript --run jquery/migrate --path <project_path>
```

Here are a small part of the long git diff.

```diff
-$(document).ready(function() {
+$(function() {

-  jQuery('a.setup_link').click(function(){
+  jQuery('a.setup_link').on('click', function(){

-  $('button[data-id=' + id + ']').first().click();
+  $('button[data-id=' + id + ']').first().trigger('click');

-  $(window).load(function() {
+  $(window).on('load', function() {

     $.ajax({
       url: get_attr($(this), 'href'),
       dataType: 'html',
-      success: function(html) {
-        $('#utc-graph-'+$(this).data('full_date')).html(html);
-      }
+    })
+    .done(function(html) {
+      $('#utc-graph-'+$(this).data('full_date')).html(html);
     });
```

### Write the synvert snippet

Let me show you an example how I write the snippet, here is one of the jquery warnings.

> jQuery.fn.click() event shorthand is deprecated.
>
> Cause: The .on() and .trigger() methods can set an event handler or generate an event for any event type, and should be used instead of the shortcut methods. This message also applies to the other event shorthands, including: blur, focus, focusin, focusout, resize, scroll, dblclick, mousedown, mouseup, mousemove, mouseover, mouseout, mouseenter, mouseleave, change, select, submit, keydown, keypress, keyup, and contextmenu.

I need to convert the code

```javascript
$(element).click(function(e) { ... });
```

to

```javascript
$(element).on('click', function(e) { ... });
```

The AST node for the deprecated code is as follows

```
{
  "type": "CallExpression",
  "callee": {
    "type": "MemberExpression",
    "object": {
      "type": "CallExpression",
      "callee": { "type": "Identifier", "name": "$" },
      "arguments": [
        { "type": "Identifier", "name": "element" }
      ],
      "optional": false
    },
    "property": { "type": "Identifier", "name": "click" },
    "computed": false,
    "optional": false
  },
  "arguments": [
    {
      "type": "FunctionExpression",
      "id": null,
      "expression": false,
      "generator": false,
      "async": false,
      "params": [
        { "type": "Identifier", "name": "e" }
      ],
      "body": { ... }
    }
  ],
  "optional": false
}
```

The first thing to do is to find the matching AST node.

```javascript
withNode(
  {
    type: "CallExpression",
    callee: { type: "MemberExpression", object: /^\$/, property: 'click' },
    arguments: { length: 1, first: { type: "FunctionExpression" } }
  },
  () => {}
);
```

It finds the code starts with `$` and calls property `click`, and only one argument is a function.
It uses regexp to match the starting `$` so that it can match some complex code like
`$this.find('#child').click(function() {})`

Then I can do some conversions.

1\. replace `.click` with `.on`.

```javascript
replace('callee.property', { with: 'on' });
```

2\. insert code `'click', ` to the beginning of the first argument.

```javascript
insert("'click', ", { to: 'arguments.0', at: 'beginning' });
```

For now, it already works, cool, but I can make it better.

1\. to match both `$` and `jQuery`

```javascript
{ object: { in: [/^\$/, /^jQuery/] } }
```

2\. to match both function and arrow function

```javascript
{ type: { in: ["FunctionExpression", "ArrowFunctionExpression"] } }
```

3\. to match all events

```javascript
const eventShorthandNames = ['click', 'blur', 'focus', 'focusin', 'focusout', 'resize', 'scroll', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave', 'change', 'select', 'submit', 'keydown', 'keypress', 'keyup', 'contextmenu'];

{ property: { in: eventShorthandNames } }
```

and insert `callee.property` instead of hardcoded `click`

```javascript
{% raw %}insert("'{{callee.property}}', ", { to: 'arguments.0', at: 'beginning' });{% endraw %}
```

So the completed snippet is as follows

```javascript
{% raw %}withNode(
  {
    type: "CallExpression",
    callee: { type: "MemberExpression", object: { in: [/^\$/, /^jQuery/] }, property: { in: eventShorthandNames } },
    arguments: { length: 1, first: { type: { in: ["FunctionExpression", "ArrowFunctionExpression"] } } }
  },
  () => {
    replace('callee.property', { with: 'on' });
    insert("'{{callee.property}}', ", { to: 'arguments.0', at: 'beginning' });
  }
);{% endraw %}
```

There is one more thing, I also need to convert the code

```javascript
$(element).click();
```

to

```javascript
$(element).trigger('click');
```

Again, I need to find the matching AST node first.

```javascript
withNode(
  {
    type: "CallExpression",
    callee: { type: "MemberExpression", object: { in: [/^\$/, /^jQuery/] }, property: { in: eventShorthandNames } },
    arguments: { length: 0 }
  },
  () => {}
);
```

Then replace `callee.property` and `arguments`

```javascript
{% raw %}replace(['callee.property', 'arguments'], { with: "trigger('{{callee.property}}')" });{% endraw %}
```

To get the full snippet code, please check it out [here](https://github.com/xinminlabs/synvert-snippets-javascript/blob/master/lib/jquery/deprecate-event-shorthand.js)

I named the snippet `jquery/deprecate-event-shorthand`, so I can run the command

```bash
$ synvert-javascript --run jquery/deprecate-event-shorthand --path <project_path>
```

to just fix all event shorthand jquery code.

This is just one example, you can check out more jquery snippets [here](https://github.com/xinminlabs/synvert-snippets-javascript/tree/master/lib/jquery).