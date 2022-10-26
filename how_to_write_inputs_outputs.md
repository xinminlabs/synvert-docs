---
layout: default
title: How to write inputs / outputs
---

* Write only one statement

```javascript
// bad
const inputs = [
  "$.isArray(foobar); throw Error();"
]
const outputs = [
  "Array.isArray(foobar); throw new Error();"
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