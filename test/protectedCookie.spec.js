var assert = require('assert');
var protectedCookie = require('..');
var sinon = require('sinon');

describe('protectedCookieMiddleware', function() {
  var req,
    res,
    next,
    protectedCookieMiddleware,
    protectedCookieMiddlewareWithFlag,
    token,
    flag,
    tokenExistance,
    options,
    tokenValue;

  beforeEach(() => {
    req = {};
    res = {};
    next = sinon.spy();
    flag = 'check';
    protectedCookieMiddleware = protectedCookie();
    protectedCookieMiddlewareWithFlag = protectedCookie(flag);
    token = 'token';
    tokenValue = 'ok';
    tokenExistance = 'token_exists';
    options = { foo: 'bar' };
  });

  describe('should initialize methods', function() {
    it('should add protectedCookie and clearProtectedCookie methods and call next()', function() {

      protectedCookieMiddleware(req, res, next);

      assert(typeof res.protectedCookie, 'function');
      assert(typeof res.clearProtectedCookie, 'function');
      assert(next.calledOnce, true);
    });
  });

  describe('protectedCookie()', function() {
    it('should set cookie and existance flag on protectedCookie()', function() {

      res.cookie = sinon.spy();
      protectedCookieMiddleware(req, res, next);
      res.protectedCookie(token, tokenValue);

      assert(res.cookie.calledTwice, true);
      assert(res.cookie.calledWithMatch(token, tokenValue, { httpOnly: true }));
      assert(res.cookie.calledWithMatch(tokenExistance, true, { httpOnly: false }));
    });

    it('should set cookie and existance flag on protectedCookie() with custom flag', function() {

      res.cookie = sinon.spy();
      protectedCookieMiddlewareWithFlag(req, res, next);
      res.protectedCookie(token, tokenValue);

      assert(res.cookie.calledTwice, true);
      assert(res.cookie.calledWithMatch(token, tokenValue, { httpOnly: true }));
      assert(res.cookie.calledWithMatch(token + '_' + flag, true, { httpOnly: false }));
    });

    it('should throw error if res.cookie is not defined', function() {

      protectedCookieMiddleware(req, res, next);

      assert.throws(res.protectedCookie.bind(null, token, tokenValue), Error);
    });
  });

  describe('clearProtectedCookie()', function() {
    it('should clear cookie and existance flag on clearProtectedCookie()', function() {

      res.clearCookie = sinon.spy();
      protectedCookieMiddleware(req, res, next);
      res.clearProtectedCookie(token, options);

      assert(res.clearCookie.calledTwice, true);
      assert(res.clearCookie.calledWithMatch(token, options), true);
      assert(res.clearCookie.calledWithMatch(tokenExistance, options), true);
    });

    it('should clear cookie and existance flag on clearProtectedCookie() with custom flag', function() {

      res.clearCookie = sinon.spy();
      protectedCookieMiddlewareWithFlag(req, res, next);
      res.clearProtectedCookie(token, options);

      assert(res.clearCookie.calledTwice, true);
      assert(res.clearCookie.calledWithMatch(token, options), true);
      assert(res.clearCookie.calledWithMatch(token + '_' + flag, options), true);
    });

    it('should throw error if res.clearCookie is not defined', function() {

      protectedCookieMiddleware(req, res, next);

      assert.throws(res.clearProtectedCookie.bind(null, token, tokenValue), Error);
    });
  });
});
