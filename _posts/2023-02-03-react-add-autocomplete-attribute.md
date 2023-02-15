---
layout: default
title: Use synvert to add autocomplete attribute to jsx project
date: 2023-02-03
categories: javascript
permalink: /:categories/:title/index.html
---

<iframe width="560" height="315" src="https://www.youtube.com/embed/-9xj7J1oVHo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

The HTML `autocomplete` attribute lets web developers specify what if any permission the user agent has to provide automated assistance in filling out form field values, as well as guidance to the browser as to the type of information expected in the field. See more [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete).

I get a task to add autocomplete to an existing react project. In this react project, we have some react code that looks like this:

```jsx
<Field name="email" type="email" />
<Field name="password" type="password" />
<Field name="new_password" type="password" />
```

We want to add autocomplete attribute to the field elements, so the code will become:

```jsx
<Field name="email" type="email" autoComplete="email" />
<Field name="password" type="password" autoComplete="current-password" />
<Field name="new_password" type="password" autoComplete="new-password" />
```

It's time to use Synvert to automatically convert the code. First, I open the Synvert app, set file pattern as `**/*.jsx`, the input as `<Field name="email" type="email" />` and output as `<Field name="email" type="email" autoComplete="email" />`, then click the "Generate Snippet" button, it will generate the snippet as follows:

```javascript
const Synvert = require("synvert-core");

new Synvert.Rewriter("group", "name", () => {
  withinFiles("**/*.jsx", () => {
    findNode(`.JsxSelfClosingElement
      [tagName=Field]
      [attributes=.JsxAttributes
        [properties.length=2]
        [properties.0=.JsxAttribute[name=name][initializer=.StringLiteral[text=email]]]
        [properties.1=.JsxAttribute[name=type][initializer=.StringLiteral[text=email]]]
      ]`, () => {
      insert(' autoComplete="email"', { to: "attributes.properties.-1", at: "end" });
    });
  });
});
```

As you can see, it finds a `Field` element who has 2 properties, the first property's name is `name ` and value is `email`, the second property's name is `type` and value is `email`, then insert `autoComplete="email"` to the end of the last property. But obviously, this is not what we expect.

We want to find a `Field` element, no matter how many properties it has, so remove `[properties.length=2]`.

As long as it has a property whose name is `name` and value is `email`, no matter its position, so replace `.0=` with `includes`.

Same to the type property, replace `.1=` with `includes`.

Then the snippet becomes:

```javascript
const Synvert = require("synvert-core");

new Synvert.Rewriter("group", "name", () => {
  withinFiles("**/*.jsx", () => {
    findNode(`.JsxSelfClosingElement
      [tagName=Field]
      [attributes=.JsxAttributes
        [properties includes .JsxAttribute[name=name][initializer=.StringLiteral[text=email]]]
        [properties includes .JsxAttribute[name=type][initializer=.StringLiteral[text=email]]]
      ]`, () => {
      insert(' autoComplete="email"', { to: "attributes.properties.-1", at: "end" });
    });
  });
});
```

Now we can search in the project, it finds the the email Field, and inserts `autoComplete="email"`, then we can click "replace" icon to add the autocomplete attribute.

![Add autocompete attribute 1]({{ site.baseurl }}/img/react-add-autocomplete-attribute-1.png)

Okay, we have added the autocomplete attribute, what about we do search again?

Oh, that's bad, it finds that field again and tries to add the duplicated autocomplete attribute.

![Add autocompete attribute 2]({{ site.baseurl }}/img/react-add-autocomplete-attribute-2.png)

Let's fix it, we need to add a filter that it does not have a property whose name is `autoComplete`, then the snippet becomes:

```javascript
const Synvert = require("synvert-core");

new Synvert.Rewriter("group", "name", () => {
  withinFiles("**/*.jsx", () => {
    findNode(`.JsxSelfClosingElement
      [tagName=Field]
      [attributes=.JsxAttributes
        [properties not includes .JsxAttribute[name=autoComplete]]
        [properties includes .JsxAttribute[name=name][initializer=.StringLiteral[text=email]]]
        [properties includes .JsxAttribute[name=type][initializer=.StringLiteral[text=email]]]
      ]`, () => {
      insert(' autoComplete="email"', { to: "attributes.properties.-1", at: "end" });
    });
  });
});
```

Then we click "Search" button, no file is affected by the snippet, cool.

So far the snippet works well for `email` field, let's add `autoComplte` to support password fields.

Synvert snippet is a javascript code, so we just need to make the `email` to be a variable. So the new snippet becomes:

```javascript
const Synvert = require("synvert-core");

new Synvert.Rewriter("group", "name", () => {
  const PATTERNS = [
    { name: "email", type: "email", autoComplete: "email" },
    { name: "password", type: "password", autoComplete: "current-password" },
    { name: "new_password", type: "password", autoComplete: "new-password" },
  ];
  withinFiles("**/*.jsx", () => {
    for (const pattern of PATTERNS) {
      findNode(`.JsxSelfClosingElement
        [tagName=Field]
        [attributes=.JsxAttributes
          [properties not includes .JsxAttribute[name=autoComplete]]
          [properties includes .JsxAttribute[name=name][initializer=.StringLiteral[text=${pattern.name}]]]
          [properties includes .JsxAttribute[name=type][initializer=.StringLiteral[text=${pattern.type}]]]
        ]`, () => {
        insert(` autoComplete="${pattern.autoComplete}"`, { to: "attributes.properties.-1", at: "end" });
      });
    }
  });
});
```

Then we click "Search" button, it finds the password fields.

![Add autocompete attribute 3]({{ site.baseurl }}/img/react-add-autocomplete-attribute-3.png)

We can add `autoComplete` attributes to these fields by clicking the "Replace All" button.

If you want to support more field types, just add more patterns to the `PATTERNS` array. e.g.

```javascript
  const PATTERNS = [
    { name: "email", type: "email", autoComplete: "email" },
    { name: "password", type: "password", autoComplete: "current-password" },
    { name: "new_password", type: "password", autoComplete: "new-password" },
    { name: "cvv", type: "text", autoComplete: "off" },
  ];
```

The official snippet is [here](https://github.com/xinminlabs/synvert-snippets-javascript/blob/main/lib/react/add-autocomplete-attribute.js), it takes care of input tag and use `insertAfter` for multi-lines Field.
