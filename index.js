'use strict';

module.exports = function protectedCookieMiddleware(flag, delimiter) {
  flag = flag || 'exists';
  delimiter = delimiter || '_';

  return function protectedCookie(req, res, next) {
    if(res.protectedCookie && res.clearProtectedCookie) {
      next();
    }

    res.protectedCookie = function(name, value, options) {
      if(!res.cookie) {
        throw new Error('Cookie is not available');
      }
      res.cookie(name, value, Object.assign({}, options, { httpOnly: true }));
      res.cookie(name + delimiter + flag, true, Object.assign({}, options, { httpOnly: false }));
    };

    res.clearProtectedCookie = function(name, options) {
      if(!res.clearCookie) {
        throw new Error('Cookie is not available');
      }
      res.clearCookie(name, options);
      res.clearCookie(name + delimiter + flag, options);
    };

    next();
  };
};
