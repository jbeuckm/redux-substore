'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _most = require('most');

var most = _interopRequireWildcard(_most);

var _reduxMost = require('redux-most');

var _es6Promisify = require('es6-promisify');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Substore = function () {
  function Substore(_ref) {
    var _this2 = this;

    var prefix = _ref.prefix,
        promiseFunctionFactory = _ref.promiseFunctionFactory,
        promiseFunction = _ref.promiseFunction,
        callbackFunction = _ref.callbackFunction,
        initialState = _ref.initialState,
        responseMap = _ref.responseMap,
        actionMeta = _ref.actionMeta;

    _classCallCheck(this, Substore);

    this.requestAction = function (payload) {
      return {
        type: _this2.ACTION_TYPE.REQUEST,
        meta: _this2.actionMeta.requestAction,
        payload: payload
      };
    };

    this.failureAction = function (error) {
      return {
        type: _this2.ACTION_TYPE.FAILURE,
        meta: _this2.actionMeta.failureAction,
        payload: error,
        error: true
      };
    };

    this.successAction = function (payload) {
      return {
        type: _this2.ACTION_TYPE.SUCCESS,
        meta: _this2.actionMeta.successAction,
        payload: payload
      };
    };

    this.clearAction = function () {
      return { type: _this2.ACTION_TYPE.CLEAR, meta: _this2.actionMeta.clearAction };
    };

    this.reducer = function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this2.initialState;
      var _ref2 = arguments[1];
      var type = _ref2.type,
          payload = _ref2.payload;

      switch (type) {
        case _this2.ACTION_TYPE.REQUEST:
          return _extends({}, state, { isLoading: true, error: null });

        case _this2.ACTION_TYPE.FAILURE:
          return _extends({}, _this2.responseMap(null), { isLoading: false, error: payload });

        case _this2.ACTION_TYPE.SUCCESS:
          return _extends({}, state, {
            isLoading: false,
            error: false
          }, _this2.responseMap(payload));

        case _this2.ACTION_TYPE.CLEAR:
          return _extends({}, _this2.initialState);

        default:
          return state;
      }
    };

    this.epic = function (action$, store) {
      var _this = _this2;

      var requestFunction = void 0;

      if (_this2.promiseFunctionFactory) {
        requestFunction = _this2.promiseFunctionFactory(store);
      } else {
        requestFunction = _this2.promiseFunction || (0, _es6Promisify.promisify)(_this2.callbackFunction);
      }

      return action$.thru((0, _reduxMost.select)(_this2.ACTION_TYPE.REQUEST)).flatMap(function (_ref3) {
        var payload = _ref3.payload;

        return most.fromPromise(requestFunction.apply(_this, payload ? [payload] : null)).flatMap(function (response) {
          return most.of(_this.successAction(response));
        }).recoverWith(function (error) {
          return most.of(_this.failureAction(error));
        });
      });
    };

    this.prefix = prefix;
    this.promiseFunctionFactory = promiseFunctionFactory;
    this.promiseFunction = promiseFunction;
    this.callbackFunction = callbackFunction;
    this.responseMap = responseMap || function (response) {
      return { data: response };
    };
    this.actionMeta = actionMeta || {};

    try {
      this.initialState = _extends({}, this.responseMap(null), {
        isLoading: false,
        error: null
      });
    } catch (error) {
      var header = 'Substore[' + this.prefix + ']:';
      throw header + ' responseMap() must return an initial state when the argument is null.';
    }
  }

  _createClass(Substore, [{
    key: 'ACTION_TYPE',
    get: function get() {
      return {
        REQUEST: this.prefix + 'REQUEST',
        CLEAR: this.prefix + 'CLEAR',
        FAILURE: this.prefix + 'REQUEST_FAILURE',
        SUCCESS: this.prefix + 'REQUEST_SUCCESS'
      };
    }
  }]);

  return Substore;
}();

exports.default = Substore;