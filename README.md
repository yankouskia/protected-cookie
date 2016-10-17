[![CircleCI](https://circleci.com/gh/yankouskia/protected-cookie.svg?style=shield)](https://circleci.com/gh/yankouskia/protected-cookie)

# Express protected cookie middleware
Middleware for express to protect cookie making it HttpOnly.
Also this Middleware adds flag to check for presence of this property (NOT HttpOnly).

``` sh
npm install protected-cookie --save
```


``` js
'use strict'

var express = require('express');
var protectedCookie = require('protected-cookie');

app = express();
app.use(protectedCookie('check', '__'));
...
```

### Tests

``` sh
npm install protected-cookie --save
```


### Use case
You want to implement authorization and store `auth_token` in cookie.
But if it will not be HttpOnly, your client side can be subjected to XSS.
In other way you want to check if cookie is set on client side.
##### Solution - use this middleware. Server checks your cookie and validate it for each request. But on client side you will have access to check your cookie is set or not.

### API options

``` js
  protectedCookie(flag, delimiter);
```

 - `flag`: `String` *optional* wich set flag to cookie name with '_' delimiter, which can be changed (if cookie name is `token`, then existance flag name will be `token_exists` which is `true` or `false`)
 - `delimiter` - `String` *optional* delimiter between `cookie name` and `flag`

### Methods
Middleware add methods `protectedCookie` and `clearProtectedCookie` for using instead of `cookie` and `clearCookie` with the same parameters. You can check it here [Express api](http://expressjs.com/ru/api.html). But when you set some cookie in this way, method `protectedCookie` adds this cookie with HttpOnly option for inaccessibility by javascript and also adds existance flag of this cookie with HttpOnly set to `false` for access.

### Example
If you set cookie by this way
``` js
  function(req, res, next) {
    ...
    res.protectedCookie('auth_token', 'value');
    ...
  }
```

You will get next result in cookie
```
  auth_token = 'value', // which is HttpOnly
  auth_token_exists = true // which is NOT HttpOnly for access on client side
```
Method `clearProtectedCookie` clears both `auth_token` and `auth_token_exists` keys from cookie.
