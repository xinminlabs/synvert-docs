---
layout: default
title: Use synvert to remove unused imports
date: 2023-04-28
categories: javascript
permalink: /:categories/:title/index.html
---

When we work on javascript or typescript projects, we use the `import` statement to bring in modules. However, we often forget to delete the `import` statement when we no longer need it. In this tutorial, I will explain how you can use Synvert to automatically remove any unused `import` statements.

Let's start by going to the synvert-snippets-javascript repository.

```bash
cd synvert-snipepts-javascript
```

Then generate a new snippet.

```bash
synvert-javascript -g javascript/remove-unused-imports
```

And run the test command

```bash
npm run watch:test test/javascript/remove-unused-imports.spec.js
```

We should add a test case for default import as the first step.

```javascript
describe("default import", () => {
  const input = `
    import foo from "foo";
    import bar from "bar";

    foo();
  `;
  const output = `
    import foo from "foo";

    foo();
  `;

  assertConvert({
    input,
    output,
    snippet,
  });
});
```

The code includes two imports, one for `foo` and one for `bar`. However, we only used `foo`, not `bar`. Therefore, we should remove the `bar` import.

The test has failed as expected.

```diff
- Expected  - 1
+ Received  + 2

-       import foo from "foo";
+       import foo from "foo";
+       import bar from "bar";

        foo();
```

Before we address the test failure, let's take a look at the AST node. To do this, we can visit the [Synvert Playground](https://playground.synvert.net/), select the "Generate AST" tab, copy and paste the input code, and click the "Generate AST" button. This will display the corresponding AST nodes, with the parser set to typescript by default.

The `ImportDeclaration` node type includes an `ImportClause` which represents the default import, and its name is an `Identifier` node. Similarly, when we use the variable, it is also represented as an `Identifier` node.

To solve the problem, we can find all `Identifier` nodes in the code. If the count of `Identifier` nodes is greater than or equal to 2, it means that the import is used in the code. However, if the count is 1, it means that the import is not used, so we can remove the import node.

```javascript
new Synvert.Rewriter("javascript", "remove-unused-imports", () => {
  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, function () {
    const used = {};
    findNode(".Identifier", () => {
      const name = this.currentNode.escapedText;
      used[name] = (used[name] || 0) + 1;
    });
    const unusedNames = [];
    Object.keys(used).forEach((name) => {
      if (used[name] === 1) {
        unusedNames.push(name);
      }
    });

    findNode({ nodeType: "ImportDeclaration", importClause: { name: { in: unusedNames } } }, () => {
      remove();
    });
  });
});
```

Great, the test is passed.

Next, let's add a test case for named import.

```javascript
describe("named import", () => {
  const input = `
    import { foo, bar } from "foobar";

    foo();
  `;
  const output = `
    import { foo } from "foobar";

    foo();
  `;

  assertConvert({
    input,
    output,
    snippet,
  });
});
```

The test has failed once again.

```diff
- Expected  - 1
+ Received  + 1

-       import { foo } from "foobar";
+       import { foo, bar } from "foobar";

        foo();
```

We can still copy the input code to the Synvert Playground and generate a snippet to view the AST nodes. To identify the named import, we need to find `ImportSpecifier` nodes and remove the ones that are not being used.

```javascript
findNode(`.ImportDeclaration .ImportClause .NamedImports .ImportSpecifier[name IN (${unusedNames.join(' ')})]`, () => {
  remove();
});
```

The test has passed now. However, let's consider a scenario where all named imports are unused. We should add another test case to handle this.

```javascript
describe("all named imports are unused", () => {
  const input = `
    import foobar from "foobar";
    import { foo, bar } from "foobar";

    foobar();
  `;
  const output = `
    import foobar from "foobar";

    foobar();
  `;

  assertConvert({
    input,
    output,
    snippet,
  });
});
```

The test has failed with the following error message:

```diff
- Expected  - 1
+ Received  + 2

-       import foobar from "foobar";
+       import foobar from "foobar";
+       import  from "foobar";

        foobar();
```

The code removed all named imports but left an empty import node. We should remove the entire import node if all named imports are unused.

It is not straightforward to use NQL or rules to find if all named imports are unused. However, we can use plain JavaScript code to achieve this.

```javascript
findNode({ nodeType: "ImportDeclaration" }, () => {
  if (this.currentNode.importClause.name) {
    const defaultImportName = this.currentNode.importClause.name.escapedText;
    if (unusedNames.includes(defaultImportName)) {
      remove();
    }
  } else if (this.currentNode.importClause.namedBindings) {
    const namedImportNames = this.currentNode.importClause.namedBindings.elements.map((element) => element.name.escapedText);
    if (namedImportNames.every((name) => unusedNames.includes(name))) {
      remove();
    } else {
      findNode({ nodeType: "ImportSpecifier", name: { in: unusedNames } }, () => {
        remove();
      });
    }
  }
});
```

If there is a default import, remove the whole import node.
If there are named import names, remove the whole import node if all named imports are unused. Otherwise, only remove the unused named imports.

Cool, the tests have all passed now.

Next, let's add a test case for both default and named imports, but the default import is unused.

```javascript
describe("import both default and named import but default import is unused", () => {
  const input = `
    import foobar, { foo, bar } from "foobar";

    foo();
    bar();
  `;
  const output = `
    import { foo, bar } from "foobar";

    foo();
    bar();
  `;

  assertConvert({
    input,
    output,
    snippet,
  });
});
```

The test has failed with the following error message:

```diff
- Expected  - 2
+ Received  + 0

-
-       import { foo, bar } from "foobar";

        foo();
        bar();
```

If `importClause.name` exists, we need to check if `importClause.namedBindings` also exists. If it does, we can delete `importClause.name`. Otherwise, we should remove the entire import node.

```javascript
if (this.currentNode.importClause.name) {
  const defaultImportName = this.currentNode.importClause.name.escapedText;
  if (unusedNames.includes(defaultImportName)) {
    if (this.currentNode.importClause.namedBindings) {
      delete("importClause.name")
    } else {
      remove();
    }
  }
}
```

What if we have both default and named imports, but some or all of the named imports are unused?

```javascript
describe("both default and named import but one named imports are unused", () => {
  const input = `
    import foobar, { foo, bar } from "foobar";

    foobar();
    foo();
  `;
  const output = `
    import foobar, { foo } from "foobar";

    foobar();
    foo();
  `;

  assertConvert({
    input,
    output,
    snippet,
  });
});

describe("both default and named import but all named imports are unused", () => {
  const input = `
    import foobar, { foo, bar } from "foobar";

    foobar();
  `;
  const output = `
    import foobar from "foobar";

    foobar();
  `;

  assertConvert({
    input,
    output,
    snippet,
  });
});
```

The test has failed with the following error message:

```diff
- Expected  - 1
+ Received  + 1

-       import foobar, { foo } from "foobar";
+       import foobar, { foo, bar } from "foobar";

        foobar();
        foo();
```

```diff
- Expected  - 1
+ Received  + 1

-       import foobar from "foobar";
+       import foobar, { foo, bar } from "foobar";

        foobar();
```

In the scenario where the default import does not exist, we can use the same code to handle it as we would for named imports.

```javascript
gotoNode("importClause.namedBindings", () => {
  const namedImportNames = this.currentNode.elements.map((element) => element.name.escapedText);
  if (namedImportNames.every((name) => unusedNames.includes(name))) {
    remove();
  } else {
    findNode({ nodeType: "ImportSpecifier", name: { in: unusedNames } }, () => {
      remove();
    });
  }
});
```

The tests have passed.

Next, let's add a test case for namespace import.

```javascript
describe("namespace import", () => {
  const input = `
    import * as foo from "foo";
    import * as bar from "bar";

    foo();
  `;
  const output = `
    import * as foo from "foo";

    foo();
  `;

  assertConvert({
    input,
    output,
    snippet,
  });
});
```

The test has failed again.

```diff
- Expected  - 1
+ Received  + 2

-       import * as foo from "foo";
+       import * as foo from "foo";
+       import * as bar from "bar";

        foo();
```

If you run the "Generate AST" tool on Synvert Playground, you will see that namespace imports are defined as the `name` property of the `NamedBindings` node.

```javascript
if (this.currentNode.importClause.namedBindings.name) {
  const namespaceImportName = this.currentNode.importClause.namedBindings.name.escapedText;
  if (unusedNames.includes(namespaceImportName)) {
    remove();
  }
} else {
  const namedImportNames = this.currentNode.importClause.namedBindings.elements.map((element) => element.name.escapedText);
  if (namedImportNames.every((name) => unusedNames.includes(name))) {
    remove();
  } else {
    findNode({ nodeType: "ImportSpecifier", name: { in: unusedNames } }, () => {
      remove();
    });
  }
}
```

Lastly, we need to test for scenarios where either the default import or the namespace import (or both) are unused.

```javascript
describe("both default and namespace import but default import is unused", () => {
  const input = `
    import foo, * as bar from "foobar";

    bar();
  `;
  const output = `
    import * as bar from "foobar";

    bar();
  `;

  assertConvert({
    input,
    output,
    snippet,
  });
});

describe("both default and namespace import but namespace import is unused", () => {
  const input = `
    import foo, * as bar from "foobar";

    foo();
  `;
  const output = `
    import foo from "foobar";

    foo();
  `;

  assertConvert({
    input,
    output,
    snippet,
  });
});
```

Only the last test has failed

```diff
-       import foo from "foobar";
+       import foo, * as bar from "foobar";

        foo();
```

In this case, we can use the same code as we did for handling scenarios where the default import does not exist.

```javascript
gotoNode("importClause.namedBindings", () => {
  if (this.currentNode.name) {
    const namespaceImportName = this.currentNode.name.escapedText;
    if (unusedNames.includes(namespaceImportName)) {
      remove();
    }
  } else {
    const namedImportNames = this.currentNode.elements.map((element) => element.name.escapedText);
    if (namedImportNames.every((name) => unusedNames.includes(name))) {
      remove();
    } else {
      findNode({ nodeType: "ImportSpecifier", name: { in: unusedNames } }, () => {
        remove();
      });
    }
  }
});
```

After fixing the last test, all our tests have passed. However, I have some good news for you: I have already created a helper function to remove unused imports, which is located in `helpers/remove-imports`. Therefore, instead of writing a lot of code, we can simply call this helper function.

```javascript
new Synvert.Rewriter("javascript", "remove-unused-imports", () => {
  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, function () {
    const used = {};
    findNode(".Identifier", () => {
      const name = this.currentNode.escapedText;
      used[name] = (used[name] || 0) + 1;
    });
    const unusedNames = [];
    Object.keys(used).forEach((name) => {
      if (used[name] === 1) {
        unusedNames.push(name);
      }
    });

    callHelper("helpers/remove-imports", { importNames: unusedNames });
  });
});
```

As we use file mock in the test case, we need to set the helpers in the `assertConvert` method call.

```javascript
 assertConvert({
   input,
   output,
   snippet,
   helpers: ["helpers/remove-imports"],
 });
```

Great news! All the tests have passed successfully.

To check the code snippet in our React project, simply copy and paste it into the VSCode Synvert Extension. Once pasted, click the "Search" button and the extension will locate any unused imports.

![Remove Unused Imports 1]({{ site.baseurl }}/img/remove-unused-imports-1.png)

Hold on, there's a problem. We're still using a React version that's lower than 18, which means we can't remove the React import just yet. We need to modify the code snippet accordingly.

```javascript
delete used.React;
```

After making the necessary changes, we will need to perform another search using the VSCode Synvert Extension. This time, it will identify all unused imports except for React.

![Remove Unused Imports 2]({{ site.baseurl }}/img/remove-unused-imports-2.png)

Once we have identified and confirmed the unused imports, we can remove them quickly and easily by clicking the "Replace All" button.

That's all for today. See you next time!
