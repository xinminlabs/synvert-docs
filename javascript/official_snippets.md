---
layout: javascript
title: Official Snippets
---

### javascript

<details markdown='1'>

<summary>convert-commonjs-to-esm</summary>


    Prefer using the JavaScript module format over the legacy CommonJS module format
  

</details>

<details markdown='1'>

<summary>forbid-use-strict</summary>

remove 'use strcit' if does not exist

</details>

<details markdown='1'>

<summary>no-unused-imports</summary>

do not allow unused imports

</details>

<details markdown='1'>

<summary>no-unused-require</summary>

do not allow unused require

</details>

<details markdown='1'>

<summary>no-useless-constructor</summary>



</details>

<details markdown='1'>

<summary>object-property-value-shorthand</summary>


    const someObject = {
      cat: cat,
      dog: dog,
      bird: bird
    }

    =>

    const someObject = {
      cat,
      dog,
      bird
    }
  

</details>

<details markdown='1'>

<summary>prefer-bind-operator</summary>


    let x = this.foo.bind(this);
    =>
    let x = ::this.foo;
  

</details>

<details markdown='1'>

<summary>prefer-class-properties</summary>


    class Button extends Component {
      constructor(props) {
        super(props);
        this.state = { clicked: false };
        this.handleClick = this.handleClick.bind(this);
      }

      handleClick() {
        this.setState({ clicked: true });
      }
    }
    =>
    class Button extends Component {
      constructor(props) {
        super(props);
        this.state = { clicked: false };
      }

      handleClick = () => {
        this.setState({ clicked: true });
      }
    }
  

</details>

<details markdown='1'>

<summary>prefer-import-export</summary>


    convert require/exports to import/export

    const fs = require('fs')
    const { Node } = require('acorn')

    module.exports = Rewriter
    module.exports = { Rewriter, Configuration }

    =>

    import fs from 'fs'
    import { Node } from 'acorn'

    export default Rewriter
    export { Rewriter, Configuration }
  

</details>

<details markdown='1'>

<summary>prefer-object-has-own</summary>


    After V8 release v9.3

    Object.prototype.hasOwnProperty.call({ prop: 42 }, 'prop')
    =>
    Object.hasOwn({ prop: 42 }, 'prop')
  

</details>

<details markdown='1'>

<summary>prefer-string-trim-start-end</summary>


    const foo1 = bar.trimLeft();
    const foo2 = bar.trimRight();
    =>
    const foo1 = bar.trimStart();
    const foo2 = bar.trimEnd();
  

</details>

<details markdown='1'>

<summary>trailing-comma</summary>


    const object = {
      hello: 'hello',
      allo: 'allo',
      hola: 'hola'
    };

    const array = [
      'hello',
      'allo',
      'hola'
    ];
    =>
    const object = {
      hello: 'hello',
      allo: 'allo',
      hola: 'hola',
    };

    const array = [
      'hello',
      'allo',
      'hola',
    ];
  

</details>

<details markdown='1'>

<summary>unquote-properties</summary>


    var x = { 'quotedProp': 1 };
    =>
    var x = { quotedProp: 1 };
  

</details>

<details markdown='1'>

<summary>use-strict</summary>

insert 'use strcit' if does not exist

</details>

### jquery

<details markdown='1'>

<summary>deprecate-ajax-success-error-and-complete</summary>


    $.ajax({
      url: 'URL',
      type: 'POST',
      data: yourData,
      datatype: 'json',
      success: function (data) {
        successFunction(data);
      },
      error: function (jqXHR, textStatus, errorThrown) { errorFunction(); }
    });

    =>

    $.ajax({
      url: 'URL',
      type: 'POST',
      data: yourData,
      datatype: 'json',
    })
    .done(function (data) {
      successFunction(data);
    })
    .fail(function (jqXHR, textStatus, errorThrown) { errorFunction(); });
  

</details>

<details markdown='1'>

<summary>deprecate-andself</summary>


    JQMIGRATE: jQuery.fn.andSelf() is deprecated and removed, use jQuery.fn.addBack()
    Cause: The .andSelf() method has been renamed to .addBack() as of jQuery 1.9 to better reflect its purpose of adding back the previous set of results. The old alias was removed in jQuery 3.0.

    Solution: Replace any use of .andSelf() with .addBack().
  

</details>

<details markdown='1'>

<summary>deprecate-bind-and-delegate</summary>


    JQMIGRATE: jQuery.fn.bind() is deprecated
    JQMIGRATE: jQuery.fn.unbind() is deprecated
    JQMIGRATE: jQuery.fn.delegate() is deprecated
    JQMIGRATE: jQuery.fn.undelegate() is deprecated
    Cause:: These event binding methods have been deprecated in favor of the .on() and .off() methods which can handle both delegated and direct event binding. Although the older methods are still present in jQuery 3.0, they may be removed as early as the next major-version update.

    Solution: Change the method call to use .on() or .off(), the documentation for the old methods include specific instructions. In general, the .bind() and .unbind() methods can be renamed directly to .on() and .off() respectively since the argument orders are identical.
  

</details>

<details markdown='1'>

<summary>deprecate-error</summary>


    JQMIGRATE: jQuery.fn.error() is deprecated
    Cause: The $().error() method was used to attach an "error" event to an element but has been removed in 1.9 to reduce confusion with the $.error() method which is unrelated and has not been deprecated. It also serves to discourage the temptation to use $(window).error() which does not work because window.onerror does not follow standard event handler conventions. The $().error() method was removed in jQuery 3.0.

    Solution: Change any use of $().error(fn) to $().on("error", fn).
  

</details>

<details markdown='1'>

<summary>deprecate-event-shorthand</summary>


    jQuery.fn.click() event shorthand is deprecated.

    Cause: The .on() and .trigger() methods can set an event handler or generate an event for any event type, and should be used instead of the shortcut methods. This message also applies to the other event shorthands, including: blur, focus, focusin, focusout, resize, scroll, dblclick, mousedown, mouseup, mousemove, mouseover, mouseout, mouseenter, mouseleave, change, select, submit, keydown, keypress, keyup, and contextmenu.
  

</details>

<details markdown='1'>

<summary>deprecate-hover</summary>


    JQMIGRATE: jQuery.fn.hover() is deprecated
    Cause: The .hover() method is a shorthand for the use of the mouseover/mouseout events. It is often a poor user interface choice because it does not allow for any small amounts of delay between when the mouse enters or exits an area and when the event fires. This can make it quite difficult to use with UI widgets such as drop-down menus. For more information on the problems of hovering, see the hoverIntent plugin.

    Solution: Review uses of .hover() to determine if they are appropriate, and consider use of plugins such as hoverIntent as an alternative. The direct replacement for .hover(fn1, fn2), is .on("mouseenter", fn1).on("mouseleave", fn2).
  

</details>

<details markdown='1'>

<summary>deprecate-isarray</summary>


    JQMIGRATE: jQuery.isArray is deprecated; use Array.isArray
    Cause: Older versions of JavaScript made it difficult to determine if a particular object was a true Array, so jQuery provided a cross-browser function to do the work. The browsers supported by jQuery 3.0 all provide a standard method for this purpose.

    Solution: Replace any calls to jQuery.isArray with Array.isArray.
  

</details>

<details markdown='1'>

<summary>deprecate-jqxhr-success-error-and-complete</summary>


    JQMIGRATE: jQXHR.success is deprecated and removed
    JQMIGRATE: jQXHR.error is deprecated and removed
    JQMIGRATE: jQXHR.complete is deprecated and removed
    Cause: The .success(), .error(), and .complete() methods of the jQXHR object returned from jQuery.ajax() have been deprecated since jQuery 1.8 and were removed in jQuery 3.0.

    Solution: Replace the use of these methods with the standard Deferred methods: .success() becomes .done(), .error() becomes .fail(), and .complete() becomes .always().
  

</details>

<details markdown='1'>

<summary>deprecate-load-unload</summary>


    JQMIGRATE: jQuery.fn.load() is deprecated
    JQMIGRATE: jQuery.fn.unload() is deprecated
    Cause: The .load() and .unload() event methods attach a "load" and "unload" event, respectively, to an element. They were deprecated in 1.9 and removed in 3.0 to reduce confusion with the AJAX-related .load() method that loads HTML fragments and which has not been deprecated. Note that these two methods are used almost exclusively with a jQuery collection consisting of only the window element. Also note that attaching an "unload" or "beforeunload" event on a window via any means can impact performance on some browsers because it disables the document cache (bfcache). For that reason we strongly advise against it.

    Solution: Change any use of $().load(fn) to $().on("load", fn) and $().unload(fn) to $().on("unload", fn).
  

</details>

<details markdown='1'>

<summary>deprecate-parsejson</summary>


    JQMIGRATE: jQuery.parseJSON is deprecated; use JSON.parse
    Cause: The jQuery.parseJSON method in recent jQuery is identical to the native JSON.parse. As of jQuery 3.0 jQuery.parseJSON is deprecated.

    Solution: Replace any use of jQuery.parseJSON with JSON.parse.
  

</details>

<details markdown='1'>

<summary>deprecate-ready-event</summary>


    JQMIGRATE: 'ready' event is deprecated
    Cause: Using one of jQuery's API methods to bind a "ready" event, e.g. $( document ).on( "ready", fn ), will cause the function to be called when the document is ready, but only if it is attached before the browser fires its own DOMContentLoaded event. That makes it unreliable for many uses, particularly ones where jQuery or its plugins are loaded asynchronously after page load.

    Solution: Replace any use of $( document ).on( "ready", fn ) with $( fn ). This approach works reliably even when the document is already loaded.
  

</details>

<details markdown='1'>

<summary>deprecate-removeattr-boolean-properties</summary>


    JQMIGRATE: jQuery.fn.removeAttr no longer sets boolean properties
    Cause: Prior to jQuery 3.0, using .removeAttr() on a boolean attribute such as checked, selected, or readonly would also set the corresponding named property to false. This behavior was required for ancient versions of Internet Explorer but is not correct for modern browsers because the attribute represents the initial value and the property represents the current (dynamic) value.

    Solution: It is almost always a mistake to use .removeAttr( "checked" ) on a DOM element. The only time it might be useful is if the DOM is later going to be serialized back to an HTML string. In all other cases, .prop( "checked", false ) should be used instead.
  

</details>

<details markdown='1'>

<summary>deprecate-size</summary>


    JQMIGRATE: jQuery.fn.size() is deprecated and removed; use the .length property
    Cause: The .size() method returns the number of elements in the current jQuery object, but duplicates the more-efficient .length property which provides the same functionality. As of jQuery 1.9 the .length property is the preferred way to retrieve this value. jQuery 3.0 no longer contains the .size() method.

    Solution: Replace any use of .size() with .length.
  

</details>

<details markdown='1'>

<summary>deprecate-unique</summary>


    JQMIGRATE: jQuery.unique is deprecated; use jQuery.uniqueSort
    Cause: The fact that jQuery.unique sorted its results in DOM order was surprising to many who did not read the documentation carefully. As of jQuery 3.0 this function is being renamed to make it clear.

    Solution: Replace all uses of jQuery.unique with jQuery.uniqueSort which is the same function with a better name.
  

</details>

<details markdown='1'>

<summary>migrate</summary>


    migrate jquery.
  

</details>

<details markdown='1'>

<summary>prop-boolean-properties</summary>


    $this.attr('checked', 'checked');
    =>
    $this.prop('checked', true);

    $this.attr('disabled', true);
    =>
    $this.prop('disabled', true);

    $this.attr('readonly', false);
    =>
    $this.prop('readonly', false);

    $this.removeAttr('selected');
    =>
    $this.prop('selected', false);
  

</details>

<details markdown='1'>

<summary>quote-attribute-selector-with-number-sign</summary>


    JQMIGRATE: Attribute selector with '#' must be quoted
    JQMIGRATE: Attribute selector with '#' was not fixed
    Cause: Selectors such as a[href=#main] are not valid CSS syntax because the value contains special characters that are not quoted. Until jQuery 1.11.3/2.1.4 this was accepted, but the behavior is non-standard and was never documented. In later versions this selector throws an error. In some cases with complex selectors, Migrate may not attempt a repair. In those cases a fatal error will be logged on the console and you will need to fix the selector manually.

    Solution: Put quotes around any attribute values that have special characters, e.g. a[href="#main"]. The warning message contains the selector that caused the problem, use that to find the selector in the source files.
  

</details>

<details markdown='1'>

<summary>use-camelcased-data-name</summary>


    JQMIGRATE: jQuery.data() always sets/gets camelCased names
    Cause: The page is attempting to set or get a jQuery data item using kebab case, e.g. my-data, when a my-data item has been set directly on the jQuery data object. jQuery 3.0 always exclusively uses camel case, e.g., myData, when it accesses data items via the .data() API and does not find kebab case data in that object.

    Solution: Either 1) Always use the .data() API to set or get data items, 2) Always use camelCase names when also setting properties directly on jQuery's data object, or 3) Always set properties directly on the data object without using the API call to set or get data by name. Never mix direct access to the data object and API calls with kebab case names.
  

</details>

<details markdown='1'>

<summary>use-expr-pseudos</summary>


    JQMIGRATE: jQuery.expr[':'] is deprecated; use jQuery.expr.pseudos
    JQMIGRATE: jQuery.expr.filters is deprecated; use jQuery.expr.pseudos
    Cause: The standard way to add new custom selectors through jQuery is jQuery.expr.pseudos. These two other aliases are deprecated, although they still work as of jQuery 3.0.

    Solution: Rename any of the older usage to jQuery.expr.pseudos. The functionality is identical.
  

</details>

### react

<details markdown='1'>

<summary>import-named-component</summary>


    import React from 'react'

    class Button extends React.Component {
    }
    =>
    import React, { Component } from 'react'

    class Button extends Component {
    }
  

</details>

<details markdown='1'>

<summary>import-prop-types</summary>


    import React, { Component, PropTypes } from 'react'
    =>
    import React, { Component } from 'react'
    import PropTypes from 'prop-types'
  

</details>

<details markdown='1'>

<summary>prefer-class-properties</summary>


    class Button extends Component {
      constructor(props) {
        super(props);
        this.state = { clicked: false };
        this.handleClick = this.handleClick.bind(this);
      }

      handleClick() {
        this.setState({ clicked: true });
      }

      render() {
        return <button onClick={this.handleClick}>Click Me!</button>;
      }
    }
    =>
    class Button extends Component {
      state = { clicked: false };

      handleClick = () => {
        this.setState({ clicked: true });
      }

      render() {
        return <button onClick={this.handleClick}>Click Me!</button>;
      }
    }
  

</details>

<details markdown='1'>

<summary>remove-unused-react-imports</summary>


    import React from 'react';

    function App() {
      return <h1>Hello World</h1>;
    }

    =>

    function App() {
      return <h1>Hello World</h1>;
    }
  

</details>

<details markdown='1'>

<summary>short-syntax-fragment</summary>


    import React, { Component, Fragment } from 'react'

    class Button extends Component {
      render() {
        return (
          <Fragment>
          </Fragment>
        )
      }
    }
    =>
    import React, { Component } from 'react'

    class Button extends Component {
      render() {
        return (
          <>
          </>
        )
      }
    }
  

</details>

<details markdown='1'>

<summary>transfer-class-components-to-functions</summary>

transfer react class components to functions

</details>

<details markdown='1'>

<summary>upgrade-to-18</summary>


    Upgrade react to 18.

    const container = document.getElementById('root');
    ReactDOM.render(<App />, container);
    =>
    const container = document.getElementById('root');
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
  

</details>
