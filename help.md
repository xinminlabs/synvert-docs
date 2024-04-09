---
layout: default
title: Help
---

## Table of Contents

- [Table of Contents](#table-of-contents)
- [](#)
- [How to write inputs / outputs](#how-to-write-inputs--outputs)

##

## How to write inputs / outputs

* Write only one statement

```javascript
// bad
const inputs = [
  `
    $.isArray(foobar)
    throw Error()
  `
]
const outputs = [
  `
    Array.isArray(foobar)
    throw new Error()
  `
]

// good
const inputs = [
  "$.isArray(foobar);"
]
const outputs = [
  "Array.isArray(foobar);"
]
```

* Write same node type

```javascript
// bad
const inputs = [
  "$.isArray(foobar)",
  "throw Error()",
]
const outputs = [
  "Array.isArray(foobar)",
  "throw new Error()",
]

// good
const inputs = [
  "$.isArray(foobar)",
  "$.isArray(array)",
]
const outputs = [
  "Array.isArray(foobar)",
  "Array.isArray(array)",
]
```

* Write as small as possible

```javascript
// bad
const inputs = [
  `
    class PasswordField extends React.Component {
      render() {
        return <Field name="password" type="password" />
      }
    }
  `
]
const outputs = [
  `
    class PasswordField extends React.Component {
      render() {
        return <Field name="password" type="password" autoComplete="current-password" />
      }
    }
  `
]

// good
const inputs = ['<Field name="password" type="password" />']
const outputs = ['<Field name="password" type="password" autoComplete="current-password" />']
```
