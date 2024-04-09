---
layout: default
title: Migrate JQuery Part 3
date: 2023-03-17
categories: javascript
permalink: /:categories/:title/index.html
---

Welcome to the final installment of our serial jQuery migration tutorials! I will guide you through the process of writing and testing your own Synvert snippet.

The migration warning we are going to address is:

> [jqXHR-methods] JQMIGRATE: jQXHR.success is deprecated and removed
>
> [jqXHR-methods] JQMIGRATE: jQXHR.error is deprecated and removed
>
> [jqXHR-methods] JQMIGRATE: jQXHR.complete is deprecated and removed
>
> Cause: The .success(), .error(), and .complete() methods of the jQXHR object returned from jQuery.ajax() have been deprecated since jQuery 1.8 and were removed in jQuery 3.0.
>
> Solution: Replace the use of these methods with the standard Deferred methods: .success() becomes .done(), .error() becomes .fail(), and .complete() becomes .always().

I'm going to make a bit more complex changes from

```javascript
$.ajax({
  url: 'URL',
  type: 'POST',
  data: yourData,
  datatype: 'json',
  success: function (data) {
    successFunction(data);
  },
  error: function (jqXHR, textStatus, errorThrown) { errorFunction(); },
  complete: function () {
    completeFunction();
  }
});
```

to

```javascript
$.ajax({
  url: 'URL',
  type: 'POST',
  data: yourData,
  datatype: 'json',
})
.done(function (data) {
  successFunction(data);
})
.fail(function (jqXHR, textStatus, errorThrown) { errorFunction(); })
.always(function () {
  completeFunction();
});
```

Synvert is not capable of automatically generating a snippet for this particular complexity, which means that we will need to craft the snippet manually.

Let's navigate to the synvert-snippets-javascript repository, if you don't have it yet, you can clone it from [github](https://github.com/synvert-hq/synvert-snippets-javascript)

```bash
cd synvert-snippets-javascript
```

It provides some utilities to test the snippet. First, we can run

```bash
synvert-javascript -g jquery/deprecate-jqxhr-success-error-and-complete
```

to generate a template snippet in `lib/jquery/deprecate-jqxhr-success-error-and-complete.js`

```javascript
new Synvert.Rewriter("jquery", "deprecate-jqxhr-success-error-and-complete", () => {
  description(`
    convert foo to bar
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, function () {
    findNode(`.Identifier[escapedText=foo]`, () => {
      replaceWith("bar");
    });
  });
});
```

and test code in `test/jquery/deprecate-jqxhr-success-error-and-complete.spec.js`

```javascript
const snippet = "jquery/deprecate-jqxhr-success-error-and-complete";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  const input = `
    foo
  `;
  const output = `
    bar
  `;

  assertConvert({
    input,
    output,
    snippet,
  });
});
```

In my experience, I have found that incorporating test-driven development when building a snippet can be highly effective. Let's run the test command.

```bash
npm run watch:test test/jquery/deprecate-jqxhr-success-error-and-complete.spec.js
```

It continuously monitors both the snippet code and test code, which means that whenever changes are made to the code, it will automatically rerun the test.

To begin constructing our snippet, let's add the first test case. This initial case involves replacing the `success` function with the `.done` method.

```javascript
const snippet = "jquery/deprecate-jqxhr-success-error-and-complete";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  describe("replace success to .done", () => {
    const input = `
      $.ajax({
        url: 'URL',
        type: 'POST',
        data: yourData,
        datatype: 'json',
        success: function (data) {
          successFunction(data);
        }
      });
    `;
    const output = `
      $.ajax({
        url: 'URL',
        type: 'POST',
        data: yourData,
        datatype: 'json',
      })
      .done(function (data) {
        successFunction(data);
      });
    `;

    assertConvert({
      input,
      output,
      snippet,
    });
  });
});
```

The test has failed.

```diff
- Expected  - 3
+ Received  + 3

@@ -2,10 +2,10 @@
        $.ajax({
          url: 'URL',
          type: 'POST',
          data: yourData,
          datatype: 'json',
-       })
-       .done(function (data) {
+         success: function (data) {
-         successFunction(data);
+           successFunction(data);
+         }
        });
```

To resolve the test failure, we can take advantage of the VSCode Synvert extension. It allows us to quickly and easily locate the node that needs to be replaced, and generate a corresponding snippet. To use this feature, we simply need to paste the input code and leave the output section blank. From there, we can click the "Generate Snippet" button and allow the tool to generate the appropriate snippet for us.

```javascript
new Synvert.Rewriter("group", "name", () => {
  withinFiles("**/*.js", () => {
    withNode({ nodeType: "CallExpression", expression: { nodeType: "PropertyAccessExpression", expression: "$", name: "ajax" }, arguments: { 0: { nodeType: "ObjectLiteralExpression", properties: { 0: { nodeType: "PropertyAssignment", name: "url", initializer: { nodeType: "StringLiteral", text: "URL" }, questionToken: undefined }, 1: { nodeType: "PropertyAssignment", name: "type", initializer: { nodeType: "StringLiteral", text: "POST" }, questionToken: undefined }, 2: { nodeType: "PropertyAssignment", name: "data", initializer: "yourData", questionToken: undefined }, 3: { nodeType: "PropertyAssignment", name: "datatype", initializer: { nodeType: "StringLiteral", text: "json" }, questionToken: undefined }, 4: { nodeType: "PropertyAssignment", name: "success", initializer: { nodeType: "FunctionExpression", modifiers: undefined, name: undefined, typeParameters: undefined, parameters: { 0: { nodeType: "Parameter", name: "data", initializer: undefined, type: undefined, dotDotDotToken: undefined, questionToken: undefined }, length: 1 }, type: undefined, body: { nodeType: "Block", statements: { 0: { nodeType: "ExpressionStatement", expression: { nodeType: "CallExpression", expression: "successFunction", arguments: { 0: "data", length: 1 } } }, length: 1 } }, asteriskToken: undefined }, questionToken: undefined }, length: 5 } }, length: 1 } }, () => {
      remove();
    });
  });
});
```

We can copy the `withNode` portion of the snippet and paste it into the appropriate section of the file. Additionally, we can format the code to make it readable.

```javascript
new Synvert.Rewriter(
  "jquery",
  "deprecate-jqxhr-success-error-and-complete",
  () => {
    description("deprecate jqxhr success, error and complete methods.");

    configure({ parser: Synvert.Parser.TYPESCRIPT });

    withinFiles(Synvert.ALL_FILES, function () {
      withNode(
        {
          nodeType: "CallExpression",
          expression: {
            nodeType: "PropertyAccessExpression",
            expression: "$",
            name: "ajax",
          },
          arguments: {
            0: {
              nodeType: "ObjectLiteralExpression",
              properties: {
                0: {
                  nodeType: "PropertyAssignment",
                  name: "url",
                  initializer: { nodeType: "StringLiteral", text: "URL" },
                  questionToken: undefined,
                },
                1: {
                  nodeType: "PropertyAssignment",
                  name: "type",
                  initializer: { nodeType: "StringLiteral", text: "POST" },
                  questionToken: undefined,
                },
                2: {
                  nodeType: "PropertyAssignment",
                  name: "data",
                  initializer: "yourData",
                  questionToken: undefined,
                },
                3: {
                  nodeType: "PropertyAssignment",
                  name: "datatype",
                  initializer: { nodeType: "StringLiteral", text: "json" },
                  questionToken: undefined,
                },
                4: {
                  nodeType: "PropertyAssignment",
                  name: "success",
                  initializer: {
                    nodeType: "FunctionExpression",
                    modifiers: undefined,
                    name: undefined,
                    typeParameters: undefined,
                    parameters: {
                      0: {
                        nodeType: "Parameter",
                        name: "data",
                        initializer: undefined,
                        type: undefined,
                        dotDotDotToken: undefined,
                        questionToken: undefined,
                      },
                      length: 1,
                    },
                    type: undefined,
                    body: {
                      nodeType: "Block",
                      statements: {
                        0: {
                          nodeType: "ExpressionStatement",
                          expression: {
                            nodeType: "CallExpression",
                            expression: "successFunction",
                            arguments: { 0: "data", length: 1 },
                          },
                        },
                        length: 1,
                      },
                    },
                    asteriskToken: undefined,
                  },
                  questionToken: undefined,
                },
                length: 5,
              },
            },
            length: 1,
          },
        },
        () => {
          replaceWith("bar");
        }
      );
    });
  }
);
```

As we work to resolve the test failure, our primary objective is to check whether a `success` property exists. If it does, we need to remove it and replace it with a `.done` method. To achieve this, we will need to modify the `replaceWith` action in the snippet file and implement the following changes.

```javascript
let functionNode;
withNode({
  nodeType: "PropertyAssignment",
  name: "success",
}, () => {
  functionNode = this.currentNode;
  remove();
});
if (functionNode) {
  insert(`\n.done(${functionNode.initializer.getText()})`);
}
```

Let's check the test result.

```diff
- Expected  - 3
+ Received  + 3

@@ -3,9 +3,9 @@
    url: 'URL',
    type: 'POST',
    data: yourData,
    datatype: 'json',
  })
-       .done(function (data) {
+ .done(function (data) {
-         successFunction(data);
+           successFunction(data);
-       });
+         });
```

We can observe that the snippet has successfully removed the `success` property and replaced it with a `.done` method. However, the code's indentation is not correct.

Let's fix it by using `this.mutationAdapter` and `indent`.

```javascript
const methodIndent = this.mutationAdapter.getIndent(this.currentNode);
let functionNode;
withNode({
  nodeType: "PropertyAssignment",
  name: "success",
}, () => {
  functionNode = this.currentNode;
  remove();
});
if (functionNode) {
  insert(
    indent(`\n.done(${this.mutationAdapter.getSource(functionNode.initializer, { fixIndent: true })})`, methodIndent)
  );
}
```

With the test now successfully passing, we can move on to further refining our snippet. Specifically, we can eliminate any unnecessary object properties check in the `withinNode` section of the code and use `in` operator to support both `$` and `jQuery` keywords.

```javascript
new Synvert.Rewriter(
  "jquery",
  "deprecate-jqxhr-success-error-and-complete",
  () => {
    description("deprecate jqxhr success, error and complete methods.");

    configure({ parser: Synvert.Parser.TYPESCRIPT });

    withinFiles(Synvert.ALL_FILES, function () {
      withNode(
        {
          nodeType: "CallExpression",
          expression: {
            nodeType: "PropertyAccessExpression",
            expression: { in: ["$", "jQuery"] },
            name: "ajax",
          },
          arguments: {
            0: {
              nodeType: "ObjectLiteralExpression",
            },
            length: 1,
          },
        },
        () => {
          const methodIndent = this.mutationAdapter.getIndent(this.currentNode);
          let functionNode;
          withNode({
            nodeType: "PropertyAssignment",
            name: "success",
          }, () => {
            functionNode = this.currentNode;
            remove();
          });
          if (functionNode) {
            insert(
              indent(`\n.done(${this.mutationAdapter.getSource(functionNode.initializer, { fixIndent: true })})`, methodIndent)
            );
          }
        }
      );
    });
  }
);
```

Let's add a new test case. This time, we will focus on replacing the `error` function with a `.fail` method.

```javascript
describe("replace error to .fail", () => {
  const input = `
    $.ajax({
      url: 'URL',
      type: 'POST',
      data: yourData,
      datatype: 'json',
      error: function (jqXHR, textStatus, errorThrown) { errorFunction(); }
    });
  `;
  const output = `
    $.ajax({
      url: 'URL',
      type: 'POST',
      data: yourData,
      datatype: 'json',
    })
    .fail(function (jqXHR, textStatus, errorThrown) { errorFunction(); });
  `;

  assertConvert({
    input,
    output,
    snippet,
  });
});
```

The test failed again.

```diff
- Expected  - 2
+ Received  + 2

@@ -2,8 +2,8 @@
        $.ajax({
          url: 'URL',
          type: 'POST',
          data: yourData,
          datatype: 'json',
-       })
-       .fail(function (jqXHR, textStatus, errorThrown) { errorFunction(); });
+         error: function (jqXHR, textStatus, errorThrown) { errorFunction(); }
+       });
```

Fortunately, addressing this new test case is relatively straightforward. We can create an array containing the values `["success", "done"]` and `["error", "fail"]`, and then iterate through them. This will enable us to easily replace instances of `success` with `done`, as well as `error` with `fail`.

```javascript
const methodIndent = this.mutationAdapter.getIndent(this.currentNode);
for (const [oldName, newName] of [["success", "done"], ["error", "fail"]]) {
  let functionNode;
  withNode({
    nodeType: "PropertyAssignment",
    name: oldName,
  }, () => {
    functionNode = this.currentNode;
    remove();
  });
  if (functionNode) {
    insert(
      indent(`\n.${newName}(${this.mutationAdapter.getSource(functionNode.initializer, { fixIndent: true })})`, methodIndent)
    );
  }
}
```

Once again, our test case has passed successfully.

We will add another test case, this time, we will focus on replacing the `complete` function with a `.always` method.

```javascript
describe("replace complete with .always", () => {
  const input = `
    $.ajax({
      url: 'URL',
      type: 'POST',
      data: yourData,
      datatype: 'json',
      complete: function () {
        completeFunction();
      }
    });
  `;
  const output = `
    $.ajax({
      url: 'URL',
      type: 'POST',
      data: yourData,
      datatype: 'json',
    })
    .always(function () {
      completeFunction();
    });
  `;

  assertConvert({
    input,
    output,
    snippet,
  });
});
```

We have encountered a failure with our latest test case. However, the fix is relatively straightforward - we just need to modify the array to include `["complete", "always"]` as well. With this fix in place, we  should see it pass successfully.

To further enhance the functionality of our snippet, we can add a new test case to replace all instances of the `success`, `error`, and `complete` functions at once.

```javascript
describe("replace all", () => {
  const input = `
    $.ajax({
      url: 'URL',
      type: 'POST',
      data: yourData,
      datatype: 'json',
      success: function (data) {
        successFunction(data);
      },
      error: function (jqXHR, textStatus, errorThrown) { errorFunction(); },
      complete: function () {
        completeFunction();
      }
    });
  `;
  const output = `
    $.ajax({
      url: 'URL',
      type: 'POST',
      data: yourData,
      datatype: 'json',
    })
    .done(function (data) {
      successFunction(data);
    })
    .fail(function (jqXHR, textStatus, errorThrown) { errorFunction(); })
    .always(function () {
      completeFunction();
    });
  `;

  assertConvert({
    input,
    output,
    snippet,
  });
});
```

```javascript

```diff
- Expected  - 4
+ Received  + 0

@@ -3,13 +3,9 @@
    url: 'URL',
    type: 'POST',
    data: yourData,
    datatype: 'json',
  })
-     .done(function (data) {
-       successFunction(data);
-     })
-     .fail(function (jqXHR, textStatus, errorThrown) { errorFunction(); })
  .always(function () {
    completeFunction();
  });
```

It may seem strange that only `complete` to `.always` replacement was made, this is due to the default behavior of the node-mutation library, which only inserts the last code modification at a particular position. To resolve this, we can modify the behavior of the node-mutation library by setting the `Synvert.Strategy.ALLOW_INSERT_AT_SAME_POSITION` strategy. By doing so, we can enable the library to insert multiple code modifications at the same position, and ensure that our snippet performs all of the necessary replacements as expected.

```javascript
configure({ parser: Synvert.Parser.TYPESCRIPT, strategy: Synvert.Strategy.ALLOW_INSERT_AT_SAME_POSITION });
```

Great job, the test has passed.

We have achieved our goal of replacing `success`, `error`, and `complete` functions with their respective jQuery methods. Here's the final version of the snippet:

```javascript
new Synvert.Rewriter(
  "jquery",
  "deprecate-jqxhr-success-error-and-complete",
  () => {
    description("deprecate jqxhr success, error and complete methods.");

    configure({ parser: Synvert.Parser.TYPESCRIPT, strategy: Synvert.Strategy.ALLOW_INSERT_AT_SAME_POSITION });

    withinFiles(Synvert.ALL_FILES, function () {
      withNode(
        {
          nodeType: "CallExpression",
          expression: {
            nodeType: "PropertyAccessExpression",
            expression: { in: ["$", "jQuery"] },
            name: "ajax",
          },
          arguments: {
            0: { nodeType: "ObjectLiteralExpression" },
            length: 1,
          },
        },
        () => {
          const methodIndent = this.mutationAdapter.getIndent(this.currentNode);
          for (const [oldName, newName] of [["success", "done"], ["error", "fail"], ["complete", "always"]]) {
            let functionNode;
            withNode({
              nodeType: "PropertyAssignment",
              name: oldName,
            }, () => {
              functionNode = this.currentNode;
              remove();
            });
            if (functionNode) {
              insert(
                indent(`\n.${newName}(${this.mutationAdapter.getSource(functionNode.initializer, { fixIndent: true })})`, methodIndent)
              );
            }
          }
        }
      );
    });
  }
);
```

Let's try the snippet in our project. We can simply copy and paste it into the VSCode Synvert extension, then click the "Search" button.

![JQuery Migrate 6]({{ site.baseurl }}/img/jquery-migrate-6.png)

Then we can replace the deprecated functions with their respective jQuery methods by simply clicking "Replace" icon.

That's all. I hope you found it informative and helpful. If you have any questions or feedback, please don't hesitate to leave a comment below.
