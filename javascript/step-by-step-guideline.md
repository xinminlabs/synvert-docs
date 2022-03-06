---
layout: javascript
title: Step by Step Guideline
---

Here is a guideline that shows you how to write a snippet to rewrite JSX html tags.

The source code mentioned in this guideline can be found on github gist.

Snippet code: [https://gist.github.com/flyerhzm/19136af12ef27335fe5e64093aee8f6f](https://gist.github.com/flyerhzm/19136af12ef27335fe5e64093aee8f6f)

Test code: [https://gist.github.com/flyerhzm/90977c87b2d52f01953b71093bf9022d](https://gist.github.com/flyerhzm/90977c87b2d52f01953b71093bf9022d)

## Requirement

We want to convert

```jsx
<div className="container-fluid">   ...   </div>
```

to

```jsx
<Container fluid>  ... </Container>
```

## Preparation

### 1. Clone synvert-snippets-javascript repo

```bash
$ git clone git@github.com:xinminlabs/synvert-snippets-javascript.git
$ cd synvert-snippets-javascript
```

Actually, you don’t need to clone the repo, but it makes test and debug the snippet code much easier.

### 2. Generate a template snippet

```bash
$ npx -p synvert synvert-javascript -g react/html-elements-to-react-bootstrap-components
```

If you've already installed the npm package synvert, you can simply run

```bash
$ synvert-javascript -g react/html-elements-to-react-bootstrap-components
```

It will generate a snippet file `lib/react/html-elements-to-react-bootstrap-components.js`  and a test file `test/react/html-elements-to-react-bootstrap-components.spec.js`

### 3. Start test

```bash
$ npm install
$ npm run test_watch
```

It runs the test for the new snippet and you’ll see it’s passed now.

## Write the snippet

### 1. Write test code

Change the test code in `test/react/html-elements-to-react-bootstrap-components.spec.js`

```javascript
const input = `
  <div className="container-fluid">
    <div />
  </div>
`

const output = `
  <Container fluid>
    <div />
  </Container>
`

assertConvert({
  input,
  output,
  snippet,
  path: "code.jsx",
});
```

You just need to set the `input` and `output` code, then assert snippet will do the conversion.

Be sure to set `path` as a `jsx` file path so that it can parse the JSX tags.

Now you’ll see a test failure, next we should update the snippet code to pass the test.

### 2. Check the AST nodes

Before doing find and replace, I usually check the AST nodes first. Let’s change the code in `lib/react/html-elements-to-react-bootstrap-components.js`

```javascript
const util = require('util');

new Synvert.Rewriter("react", "html-elements-to-react-bootstrap-components", () => {
  description("convert html elements to react bootstrap components");

  withinFiles(Synvert.ALL_FILES, function () {
    console.log(util.inspect(this.currentNode, { showHidden: false, depth: null, colors: true }));
  });
});
```

Synvert will parse the source code and save it to `this.currentNode`, we just need to print it, then we’ll see the AST nodes as follows

```
Node {
  type: 'Program',
  loc: SourceLocation {
    start: Position { line: 2, column: 4 },
    end: Position { line: 4, column: 10 },
  },
  body: [
    Node {
      type: 'ExpressionStatement',
      loc: SourceLocation {
        start: Position { line: 2, column: 4 },
        end: Position { line: 4, column: 10 },
      },
      expression: Node {
        type: 'JSXElement',
        loc: SourceLocation {
          start: Position { line: 2, column: 4 },
          end: Position { line: 4, column: 10 }
        },
        openingElement: Node {
          type: 'JSXOpeningElement',
          loc: SourceLocation {
            start: Position { line: 2, column: 4 },
            end: Position { line: 2, column: 37 }
          },
          attributes: [
            Node {
              type: 'JSXAttribute',
              loc: SourceLocation {
                start: Position { line: 2, column: 9 },
                end: Position { line: 2, column: 36 }
              },
              name: Node {
                type: 'JSXIdentifier',
                loc: SourceLocation {
                  start: Position { line: 2, column: 9 },
                  end: Position { line: 2, column: 18 }
                },
                name: 'className'
              },
              value: Node {
                type: 'Literal',
                loc: SourceLocation {
                  start: Position { line: 2, column: 19 },
                  end: Position { line: 2, column: 36 }
                },
                value: 'container-fluid',
                raw: '"container-fluid"'
              }
            }
          ],
          name: Node {
            type: 'JSXIdentifier',
            loc: SourceLocation {
              start: Position { line: 2, column: 5 },
              end: Position { line: 2, column: 8 }
            },
            name: 'div'
          },
          selfClosing: false
        },
        closingElement: Node {
          type: 'JSXClosingElement',
          loc: SourceLocation {
            start: Position { line: 4, column: 4 },
            end: Position { line: 4, column: 10 }
          },
          name: Node {
            type: 'JSXIdentifier',
            loc: SourceLocation {
              start: Position { line: 4, column: 6 },
              end: Position { line: 4, column: 9 }
            },
            name: 'div'
          }
        },
        children: [
          Node {
            type: 'JSXText',
            loc: SourceLocation {
              start: Position { line: 2, column: 37 },
              end: Position { line: 3, column: 6 }
            },
            value: '\n      ',
            raw: '\n      '
          },
          Node {
            type: 'JSXElement',
            loc: SourceLocation {
              start: Position { line: 3, column: 6 },
              end: Position { line: 3, column: 13 }
            },
            openingElement: Node {
              type: 'JSXOpeningElement',
              loc: SourceLocation {
                start: Position { line: 3, column: 6 },
                end: Position { line: 3, column: 13 }
              },
              attributes: [],
              name: Node {
                type: 'JSXIdentifier',
                loc: SourceLocation {
                  start: Position { line: 3, column: 7 },
                  end: Position { line: 3, column: 10 }
                },
                name: 'div'
              },
              selfClosing: true
            },
            closingElement: null,
            children: []
          },
          Node {
            type: 'JSXText',
            loc: SourceLocation {
              start: Position { line: 3, column: 13 },
              end: Position { line: 4, column: 4 }
            },
            value: '\n    ',
            raw: '\n    '
          }
        ]
      }
    }
  ],
  sourceType: 'module'
}
```

It omitted `start`, `end`, and `source` values

### 3. Write snippet code

We now get the whole AST nodes, we should find the div JSXElement, check if its className is container-fluid, then remove the className property, replace element name with Container and add fluid property

```javascript
withinFiles(Synvert.ALL_FILES, function () {
  withNode({ type: "JSXElement", openingElement: { name: { name: "div" } } }, () => {
    let matched = false;
    gotoNode("openingElement", () => {
      withNode({ type: "JSXAttribute", name: { name: "className" }, value: { value: "container-fluid" } }, () => {
        matched = true;
        remove();
      });
    });
    if (matched) {
      replace('openingElement.name', { with: 'Container' });
      insert(' fluid', { to: 'openingElement.name' });
      replace('closingElement.name', { with: 'Container' });
    }
  });
});
```

I didn’t replace the whole element here, instead, I made 4 small conversions, the principle is to change the code as small part as possible so that you won’t change unnecessary code, like semicolon, single quote, and double code.

Now the test is passed.

### 4. A complex case

The snippet can handle the case that className is exact container-fluid, but what if className contains other value? Let’s add a new test case.

```javascript
{% raw %}describe("complex", () => {
  const input = `
    <div className="container-fluid container-pagination" style={{ display: 'none' }}>
      <div />
    </div>
  `

  const output = `
    <Container fluid className="container-pagination" style={{ display: 'none' }}>
      <div />
    </Container>
  `

  assertConvert({
    input,
    output,
    snippet,
    path: "code.jsx",
  });
});{% endraw %}
```

It’s failed again.

Then we can change the snippet code

```javascript
withNode({ type: "JSXAttribute", name: { name: "className" }, value: { value: /container-fluid/ } }, function () {
  if (this.currentNode.value.value === "container-fluid") {
    remove();
  } else {
    const value = this.currentNode.value.value;
    replace('value', { with: `"${value.replace('container-fluid ', '').replace(' container-fluid', '')}"` });
  }
});
```

It checks if the value of className is exact container-fluid, it removes the whole property, otherwise, just remove the container-fluid value from the className.

Then it’s passed again.

### 5. import Container

We have changed the div element to Container component, the last thing we should do in the snippet is to import Container.

The test code should be

```javascript
{% raw %}const input = `
  import React from 'react';

  <div className="container-fluid container-pagination" style={{ display: 'none' }}>
    <div />
  </div>
`

const output = `
  import React from 'react';
  import { Container } from 'react-bootstrap';

  <Container fluid className="container-pagination" style={{ display: 'none' }}>
    <div />
  </Container>
`{% endraw %}
```

The snippet code should be

```javascript
withinFiles(Synvert.ALL_FILES, function () {
  let needImport = false
  withNode({ type: "JSXElement", openingElement: { name: { name: "div" } } }, () => {
    ...
    if (matched) {
      needImport = true;
    }
  });
  if (needImport) {
    withNode({ type: "ImportDeclaration", source: { value: 'react' } }, function () {
      insert("\nimport { Container } from 'react-bootstrap';", { at: 'end' });
    });
  }
});
```

## Run the snippet

We’ve already written the snippet and made tests passed, it’s time to use the snippet to change your repo’s code

```bash
$ npx -p synvert synvert-javascript --run react/html-elements-to-react-bootstrap-components --load ~/Sites/xinminlabs/synvert-snippets-javascript/lib/react/html-elements-to-react-bootstrap-components.js --enableEcmaFeaturesJsx --path ~/Sites/xinminlabs/awesomecode.io/app/javascript
```

If you have installed the synvert npm, you can also use it with a remote snippet.

```bash
$ synvert-javascript --run react/html-elements-to-react-bootstrap-components --load https://gist.githubusercontent.com/flyerhzm/19136af12ef27335fe5e64093aee8f6f/raw/78acebe47cc4e7130d62454b93ace6ea4832e276/html-elements-to-react-bootstrap-components.js --enableEcmaFeaturesJsx --path ~/Sites/xinminlabs/awesomecode.io/app/javascript
```