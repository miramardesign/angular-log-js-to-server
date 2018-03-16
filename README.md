# Angular Frontend logger log to server
Log frontend js errors to server 

Sends js error messages to the server endpoint at /api/log in order to 
debug user errors. 

Gif preview:

![Blow it up!](https://i.imgur.com/2uR07V7.gif)

## Installation

Install with bower (or download/clone).

```shell
bower install log-to-server-angular --save
```

Import the required files to your html.

```html
<script src="/bower_components/log-to-server-angular/dist/log-to-server.angular.js"></script>
```

## Usage

```javascript

var app = angular.module('angularApp', [
    'logToServer'
]);

```
See examples/index.html and examples/ready.js for more options.

## Options
---

Options can be passed via data attributes or JavaScript. For data attributes, append the option name to `data-`, as in `data-source=""`.

If you are using jQuery in your application, note that camel case attributes such as `data-minLength`
 should be formatted as `data-min-length`.
 
|Name|Type|Default|Description|
|--- |--- |--- |--- |
|apiUrl|string| `/api/log`, 
|REQUIRED, the url end point to point to send the error report.

```

dependencies: jQuery, Angular 1.x


