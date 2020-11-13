/**
  * legions-micro-service v0.0.5
  * (c) 2020 duanguang
  * @license MIT
  */
var legionsMicroservice = (function (exports) {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global_1 =
	  // eslint-disable-next-line no-undef
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func
	  Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
	var f$1 = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;

	var objectPropertyIsEnumerable = {
		f: f$1
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split;

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// `ToPrimitive` abstract operation
	// https://tc39.github.io/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document$1 = global_1.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
	var f$2 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$2
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  } return it;
	};

	var nativeDefineProperty = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty
	var f$3 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty = {
		f: f$3
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var setGlobal = function (key, value) {
	  try {
	    createNonEnumerableProperty(global_1, key, value);
	  } catch (error) {
	    global_1[key] = value;
	  } return value;
	};

	var SHARED = '__core-js_shared__';
	var store = global_1[SHARED] || setGlobal(SHARED, {});

	var sharedStore = store;

	var functionToString = Function.toString;

	// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
	if (typeof sharedStore.inspectSource != 'function') {
	  sharedStore.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap$1 = global_1.WeakMap;

	var nativeWeakMap = typeof WeakMap$1 === 'function' && /native code/.test(inspectSource(WeakMap$1));

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.6.5',
	  mode:  'global',
	  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
	});
	});

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys = {};

	var WeakMap$2 = global_1.WeakMap;
	var set, get, has$1;

	var enforce = function (it) {
	  return has$1(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (nativeWeakMap) {
	  var store$1 = new WeakMap$2();
	  var wmget = store$1.get;
	  var wmhas = store$1.has;
	  var wmset = store$1.set;
	  set = function (it, metadata) {
	    wmset.call(store$1, it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return wmget.call(store$1, it) || {};
	  };
	  has$1 = function (it) {
	    return wmhas.call(store$1, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;
	  set = function (it, metadata) {
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return has(it, STATE) ? it[STATE] : {};
	  };
	  has$1 = function (it) {
	    return has(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has$1,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var redefine = createCommonjsModule(function (module) {
	var getInternalState = internalState.get;
	var enforceInternalState = internalState.enforce;
	var TEMPLATE = String(String).split('String');

	(module.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  if (typeof value == 'function') {
	    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
	    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
	  }
	  if (O === global_1) {
	    if (simple) O[key] = value;
	    else setGlobal(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }
	  if (simple) O[key] = value;
	  else createNonEnumerableProperty(O, key, value);
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
	});
	});

	var path = global_1;

	var aFunction = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
	    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var ceil = Math.ceil;
	var floor = Math.floor;

	// `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger
	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	};

	var min = Math.min;

	// `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength
	var toLength = function (argument) {
	  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var indexOf = arrayIncludes.indexOf;


	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~indexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];

	var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	var f$4 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
		f: f$4
	};

	var f$5 = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f$5
	};

	// all object keys, includes non-enumerable and symbols
	var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : typeof detection == 'function' ? fails(detection)
	    : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';

	var isForced_1 = isForced;

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = global_1;
	  } else if (STATIC) {
	    target = global_1[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global_1[TARGET] || {}).prototype;
	  }
	  if (target) for (key in source) {
	    sourceProperty = source[key];
	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];
	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contained in target
	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty === typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    }
	    // add a flag to not completely full polyfills
	    if (options.sham || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    }
	    // extend global
	    redefine(target, key, sourceProperty, options);
	  }
	};

	var aFunction$1 = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  } return it;
	};

	// optional / simple context binding
	var functionBindContext = function (fn, that, length) {
	  aFunction$1(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 0: return function () {
	      return fn.call(that);
	    };
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	// `ToObject` abstract operation
	// https://tc39.github.io/ecma262/#sec-toobject
	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	// `IsArray` abstract operation
	// https://tc39.github.io/ecma262/#sec-isarray
	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var useSymbolAsUid = nativeSymbol
	  // eslint-disable-next-line no-undef
	  && !Symbol.sham
	  // eslint-disable-next-line no-undef
	  && typeof Symbol.iterator == 'symbol';

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$1 = global_1.Symbol;
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!has(WellKnownSymbolsStore, name)) {
	    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];
	    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	  } return WellKnownSymbolsStore[name];
	};

	var SPECIES = wellKnownSymbol('species');

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate = function (originalArray, length) {
	  var C;
	  if (isArray(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
	    else if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var push = [].push;

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
	var createMethod$1 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject($this);
	    var self = indexedObject(O);
	    var boundFunction = functionBindContext(callbackfn, that, 3);
	    var length = toLength(self.length);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate;
	    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
	    var value, result;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	          case 3: return true;              // some
	          case 5: return value;             // find
	          case 6: return index;             // findIndex
	          case 2: push.call(target, value); // filter
	        } else if (IS_EVERY) return false;  // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$1(0),
	  // `Array.prototype.map` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.map
	  map: createMethod$1(1),
	  // `Array.prototype.filter` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
	  filter: createMethod$1(2),
	  // `Array.prototype.some` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.some
	  some: createMethod$1(3),
	  // `Array.prototype.every` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.every
	  every: createMethod$1(4),
	  // `Array.prototype.find` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.find
	  find: createMethod$1(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$1(6)
	};

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process = global_1.process;
	var versions = process && process.versions;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  version = match[0] + match[1];
	} else if (engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = match[1];
	  }
	}

	var engineV8Version = version && +version;

	var SPECIES$1 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$1] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var defineProperty = Object.defineProperty;
	var cache = {};

	var thrower = function (it) { throw it; };

	var arrayMethodUsesToLength = function (METHOD_NAME, options) {
	  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
	  if (!options) options = {};
	  var method = [][METHOD_NAME];
	  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
	  var argument0 = has(options, 0) ? options[0] : thrower;
	  var argument1 = has(options, 1) ? options[1] : undefined;

	  return cache[METHOD_NAME] = !!method && !fails(function () {
	    if (ACCESSORS && !descriptors) return true;
	    var O = { length: -1 };

	    if (ACCESSORS) defineProperty(O, 1, { enumerable: true, get: thrower });
	    else O[1] = 1;

	    method.call(O, argument0, argument1);
	  });
	};

	var $filter = arrayIteration.filter;



	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');
	// Edge 14- issue
	var USES_TO_LENGTH = arrayMethodUsesToLength('filter');

	// `Array.prototype.filter` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.filter
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal
	    method.call(null, argument || function () { throw 1; }, 1);
	  });
	};

	var $forEach = arrayIteration.forEach;



	var STRICT_METHOD = arrayMethodIsStrict('forEach');
	var USES_TO_LENGTH$1 = arrayMethodUsesToLength('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	var arrayForEach = (!STRICT_METHOD || !USES_TO_LENGTH$1) ? function forEach(callbackfn /* , thisArg */) {
	  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	} : [].forEach;

	// `Array.prototype.forEach` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	_export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
	  forEach: arrayForEach
	});

	var $indexOf = arrayIncludes.indexOf;



	var nativeIndexOf = [].indexOf;

	var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
	var STRICT_METHOD$1 = arrayMethodIsStrict('indexOf');
	var USES_TO_LENGTH$2 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

	// `Array.prototype.indexOf` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	_export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD$1 || !USES_TO_LENGTH$2 }, {
	  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
	    return NEGATIVE_ZERO
	      // convert -0 to +0
	      ? nativeIndexOf.apply(this, arguments) || 0
	      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// `Array.isArray` method
	// https://tc39.github.io/ecma262/#sec-array.isarray
	_export({ target: 'Array', stat: true }, {
	  isArray: isArray
	});

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	// `Object.defineProperties` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperties
	var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
	  return O;
	};

	var html = getBuiltIn('document', 'documentElement');

	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO = sharedKey('IE_PROTO');

	var EmptyConstructor = function () { /* empty */ };

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	};

	// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak
	  return temp;
	};

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe);
	  // https://github.com/zloirock/core-js/issues/475
	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	};

	// Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug
	var activeXDocument;
	var NullProtoObject = function () {
	  try {
	    /* global ActiveXObject */
	    activeXDocument = document.domain && new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO] = true;

	// `Object.create` method
	// https://tc39.github.io/ecma262/#sec-object.create
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : objectDefineProperties(result, Properties);
	};

	var UNSCOPABLES = wellKnownSymbol('unscopables');
	var ArrayPrototype = Array.prototype;

	// Array.prototype[@@unscopables]
	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	if (ArrayPrototype[UNSCOPABLES] == undefined) {
	  objectDefineProperty.f(ArrayPrototype, UNSCOPABLES, {
	    configurable: true,
	    value: objectCreate(null)
	  });
	}

	// add a key to Array.prototype[@@unscopables]
	var addToUnscopables = function (key) {
	  ArrayPrototype[UNSCOPABLES][key] = true;
	};

	var iterators = {};

	var correctPrototypeGetter = !fails(function () {
	  function F() { /* empty */ }
	  F.prototype.constructor = null;
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var IE_PROTO$1 = sharedKey('IE_PROTO');
	var ObjectPrototype = Object.prototype;

	// `Object.getPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.getprototypeof
	var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
	  O = toObject(O);
	  if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectPrototype : null;
	};

	var ITERATOR = wellKnownSymbol('iterator');
	var BUGGY_SAFARI_ITERATORS = false;

	var returnThis = function () { return this; };

	// `%IteratorPrototype%` object
	// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
	var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

	if ([].keys) {
	  arrayIterator = [].keys();
	  // Safari 8 has buggy iterators w/o `next`
	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
	  else {
	    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
	  }
	}

	if (IteratorPrototype == undefined) IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	if ( !has(IteratorPrototype, ITERATOR)) {
	  createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
	};

	var defineProperty$1 = objectDefineProperty.f;



	var TO_STRING_TAG = wellKnownSymbol('toStringTag');

	var setToStringTag = function (it, TAG, STATIC) {
	  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
	    defineProperty$1(it, TO_STRING_TAG, { configurable: true, value: TAG });
	  }
	};

	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





	var returnThis$1 = function () { return this; };

	var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
	  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
	  iterators[TO_STRING_TAG] = returnThis$1;
	  return IteratorConstructor;
	};

	var aPossiblePrototype = function (it) {
	  if (!isObject(it) && it !== null) {
	    throw TypeError("Can't set " + String(it) + ' as a prototype');
	  } return it;
	};

	// `Object.setPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;
	  try {
	    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
	    setter.call(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) { /* empty */ }
	  return function setPrototypeOf(O, proto) {
	    anObject(O);
	    aPossiblePrototype(proto);
	    if (CORRECT_SETTER) setter.call(O, proto);
	    else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
	var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR$1 = wellKnownSymbol('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';

	var returnThis$2 = function () { return this; };

	var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  createIteratorConstructor(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
	    switch (KIND) {
	      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
	      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
	      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
	    } return function () { return new IteratorConstructor(this); };
	  };

	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR$1]
	    || IterablePrototype['@@iterator']
	    || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY;

	  // fix native
	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
	    if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
	      if ( objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
	        if (objectSetPrototypeOf) {
	          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
	        } else if (typeof CurrentIteratorPrototype[ITERATOR$1] != 'function') {
	          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$1, returnThis$2);
	        }
	      }
	      // Set @@toStringTag to native iterators
	      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
	    }
	  }

	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
	    INCORRECT_VALUES_NAME = true;
	    defaultIterator = function values() { return nativeIterator.call(this); };
	  }

	  // define iterator
	  if ( IterablePrototype[ITERATOR$1] !== defaultIterator) {
	    createNonEnumerableProperty(IterablePrototype, ITERATOR$1, defaultIterator);
	  }
	  iterators[NAME] = defaultIterator;

	  // export additional methods
	  if (DEFAULT) {
	    methods = {
	      values: getIterationMethod(VALUES),
	      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
	      entries: getIterationMethod(ENTRIES)
	    };
	    if (FORCED) for (KEY in methods) {
	      if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        redefine(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
	  }

	  return methods;
	};

	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState = internalState.set;
	var getInternalState = internalState.getterFor(ARRAY_ITERATOR);

	// `Array.prototype.entries` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.entries
	// `Array.prototype.keys` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.keys
	// `Array.prototype.values` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.values
	// `Array.prototype[@@iterator]` method
	// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
	// `CreateArrayIterator` internal method
	// https://tc39.github.io/ecma262/#sec-createarrayiterator
	var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
	  setInternalState(this, {
	    type: ARRAY_ITERATOR,
	    target: toIndexedObject(iterated), // target
	    index: 0,                          // next index
	    kind: kind                         // kind
	  });
	// `%ArrayIteratorPrototype%.next` method
	// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
	}, function () {
	  var state = getInternalState(this);
	  var target = state.target;
	  var kind = state.kind;
	  var index = state.index++;
	  if (!target || index >= target.length) {
	    state.target = undefined;
	    return { value: undefined, done: true };
	  }
	  if (kind == 'keys') return { value: index, done: false };
	  if (kind == 'values') return { value: target[index], done: false };
	  return { value: [index, target[index]], done: false };
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values%
	// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
	// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
	iterators.Arguments = iterators.Array;

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

	var $some = arrayIteration.some;



	var STRICT_METHOD$2 = arrayMethodIsStrict('some');
	var USES_TO_LENGTH$3 = arrayMethodUsesToLength('some');

	// `Array.prototype.some` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.some
	_export({ target: 'Array', proto: true, forced: !STRICT_METHOD$2 || !USES_TO_LENGTH$3 }, {
	  some: function some(callbackfn /* , thisArg */) {
	    return $some(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var DatePrototype = Date.prototype;
	var INVALID_DATE = 'Invalid Date';
	var TO_STRING = 'toString';
	var nativeDateToString = DatePrototype[TO_STRING];
	var getTime = DatePrototype.getTime;

	// `Date.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-date.prototype.tostring
	if (new Date(NaN) + '' != INVALID_DATE) {
	  redefine(DatePrototype, TO_STRING, function toString() {
	    var value = getTime.call(this);
	    // eslint-disable-next-line no-self-compare
	    return value === value ? nativeDateToString.call(this) : INVALID_DATE;
	  });
	}

	var defineProperty$2 = objectDefineProperty.f;

	var FunctionPrototype = Function.prototype;
	var FunctionPrototypeToString = FunctionPrototype.toString;
	var nameRE = /^\s*function ([^ (]*)/;
	var NAME = 'name';

	// Function instances `.name` property
	// https://tc39.github.io/ecma262/#sec-function-instances-name
	if (descriptors && !(NAME in FunctionPrototype)) {
	  defineProperty$2(FunctionPrototype, NAME, {
	    configurable: true,
	    get: function () {
	      try {
	        return FunctionPrototypeToString.call(this).match(nameRE)[1];
	      } catch (error) {
	        return '';
	      }
	    }
	  });
	}

	var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
	var test = {};

	test[TO_STRING_TAG$1] = 'z';

	var toStringTagSupport = String(test) === '[object z]';

	var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');
	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) { /* empty */ }
	};

	// getting tag from ES6+ `Object.prototype.toString`
	var classof = toStringTagSupport ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$2)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw(O)
	    // ES3 arguments fallback
	    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
	};

	// `Object.prototype.toString` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	var objectToString = toStringTagSupport ? {}.toString : function toString() {
	  return '[object ' + classof(this) + ']';
	};

	// `Object.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	if (!toStringTagSupport) {
	  redefine(Object.prototype, 'toString', objectToString, { unsafe: true });
	}

	var nativePromiseConstructor = global_1.Promise;

	var redefineAll = function (target, src, options) {
	  for (var key in src) redefine(target, key, src[key], options);
	  return target;
	};

	var SPECIES$2 = wellKnownSymbol('species');

	var setSpecies = function (CONSTRUCTOR_NAME) {
	  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
	  var defineProperty = objectDefineProperty.f;

	  if (descriptors && Constructor && !Constructor[SPECIES$2]) {
	    defineProperty(Constructor, SPECIES$2, {
	      configurable: true,
	      get: function () { return this; }
	    });
	  }
	};

	var anInstance = function (it, Constructor, name) {
	  if (!(it instanceof Constructor)) {
	    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
	  } return it;
	};

	var ITERATOR$2 = wellKnownSymbol('iterator');
	var ArrayPrototype$1 = Array.prototype;

	// check on default Array iterator
	var isArrayIteratorMethod = function (it) {
	  return it !== undefined && (iterators.Array === it || ArrayPrototype$1[ITERATOR$2] === it);
	};

	var ITERATOR$3 = wellKnownSymbol('iterator');

	var getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR$3]
	    || it['@@iterator']
	    || iterators[classof(it)];
	};

	// call something on iterator step with safe closing on error
	var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch (error) {
	    var returnMethod = iterator['return'];
	    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
	    throw error;
	  }
	};

	var iterate_1 = createCommonjsModule(function (module) {
	var Result = function (stopped, result) {
	  this.stopped = stopped;
	  this.result = result;
	};

	var iterate = module.exports = function (iterable, fn, that, AS_ENTRIES, IS_ITERATOR) {
	  var boundFunction = functionBindContext(fn, that, AS_ENTRIES ? 2 : 1);
	  var iterator, iterFn, index, length, result, next, step;

	  if (IS_ITERATOR) {
	    iterator = iterable;
	  } else {
	    iterFn = getIteratorMethod(iterable);
	    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
	    // optimisation for array iterators
	    if (isArrayIteratorMethod(iterFn)) {
	      for (index = 0, length = toLength(iterable.length); length > index; index++) {
	        result = AS_ENTRIES
	          ? boundFunction(anObject(step = iterable[index])[0], step[1])
	          : boundFunction(iterable[index]);
	        if (result && result instanceof Result) return result;
	      } return new Result(false);
	    }
	    iterator = iterFn.call(iterable);
	  }

	  next = iterator.next;
	  while (!(step = next.call(iterator)).done) {
	    result = callWithSafeIterationClosing(iterator, boundFunction, step.value, AS_ENTRIES);
	    if (typeof result == 'object' && result && result instanceof Result) return result;
	  } return new Result(false);
	};

	iterate.stop = function (result) {
	  return new Result(true, result);
	};
	});

	var ITERATOR$4 = wellKnownSymbol('iterator');
	var SAFE_CLOSING = false;

	try {
	  var called = 0;
	  var iteratorWithReturn = {
	    next: function () {
	      return { done: !!called++ };
	    },
	    'return': function () {
	      SAFE_CLOSING = true;
	    }
	  };
	  iteratorWithReturn[ITERATOR$4] = function () {
	    return this;
	  };
	  // eslint-disable-next-line no-throw-literal
	  Array.from(iteratorWithReturn, function () { throw 2; });
	} catch (error) { /* empty */ }

	var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
	  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
	  var ITERATION_SUPPORT = false;
	  try {
	    var object = {};
	    object[ITERATOR$4] = function () {
	      return {
	        next: function () {
	          return { done: ITERATION_SUPPORT = true };
	        }
	      };
	    };
	    exec(object);
	  } catch (error) { /* empty */ }
	  return ITERATION_SUPPORT;
	};

	var SPECIES$3 = wellKnownSymbol('species');

	// `SpeciesConstructor` abstract operation
	// https://tc39.github.io/ecma262/#sec-speciesconstructor
	var speciesConstructor = function (O, defaultConstructor) {
	  var C = anObject(O).constructor;
	  var S;
	  return C === undefined || (S = anObject(C)[SPECIES$3]) == undefined ? defaultConstructor : aFunction$1(S);
	};

	var engineIsIos = /(iphone|ipod|ipad).*applewebkit/i.test(engineUserAgent);

	var location$1 = global_1.location;
	var set$1 = global_1.setImmediate;
	var clear = global_1.clearImmediate;
	var process$1 = global_1.process;
	var MessageChannel = global_1.MessageChannel;
	var Dispatch = global_1.Dispatch;
	var counter = 0;
	var queue = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var defer, channel, port;

	var run = function (id) {
	  // eslint-disable-next-line no-prototype-builtins
	  if (queue.hasOwnProperty(id)) {
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};

	var runner = function (id) {
	  return function () {
	    run(id);
	  };
	};

	var listener = function (event) {
	  run(event.data);
	};

	var post = function (id) {
	  // old engines have not location.origin
	  global_1.postMessage(id + '', location$1.protocol + '//' + location$1.host);
	};

	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!set$1 || !clear) {
	  set$1 = function setImmediate(fn) {
	    var args = [];
	    var i = 1;
	    while (arguments.length > i) args.push(arguments[i++]);
	    queue[++counter] = function () {
	      // eslint-disable-next-line no-new-func
	      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clear = function clearImmediate(id) {
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if (classofRaw(process$1) == 'process') {
	    defer = function (id) {
	      process$1.nextTick(runner(id));
	    };
	  // Sphere (JS game engine) Dispatch API
	  } else if (Dispatch && Dispatch.now) {
	    defer = function (id) {
	      Dispatch.now(runner(id));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  // except iOS - https://github.com/zloirock/core-js/issues/624
	  } else if (MessageChannel && !engineIsIos) {
	    channel = new MessageChannel();
	    port = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = functionBindContext(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (
	    global_1.addEventListener &&
	    typeof postMessage == 'function' &&
	    !global_1.importScripts &&
	    !fails(post) &&
	    location$1.protocol !== 'file:'
	  ) {
	    defer = post;
	    global_1.addEventListener('message', listener, false);
	  // IE8-
	  } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
	    defer = function (id) {
	      html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
	        html.removeChild(this);
	        run(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function (id) {
	      setTimeout(runner(id), 0);
	    };
	  }
	}

	var task = {
	  set: set$1,
	  clear: clear
	};

	var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;

	var macrotask = task.set;


	var MutationObserver$1 = global_1.MutationObserver || global_1.WebKitMutationObserver;
	var process$2 = global_1.process;
	var Promise$1 = global_1.Promise;
	var IS_NODE = classofRaw(process$2) == 'process';
	// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
	var queueMicrotaskDescriptor = getOwnPropertyDescriptor$2(global_1, 'queueMicrotask');
	var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

	var flush, head, last, notify, toggle, node, promise, then;

	// modern engines have queueMicrotask method
	if (!queueMicrotask) {
	  flush = function () {
	    var parent, fn;
	    if (IS_NODE && (parent = process$2.domain)) parent.exit();
	    while (head) {
	      fn = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch (error) {
	        if (head) notify();
	        else last = undefined;
	        throw error;
	      }
	    } last = undefined;
	    if (parent) parent.enter();
	  };

	  // Node.js
	  if (IS_NODE) {
	    notify = function () {
	      process$2.nextTick(flush);
	    };
	  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
	  } else if (MutationObserver$1 && !engineIsIos) {
	    toggle = true;
	    node = document.createTextNode('');
	    new MutationObserver$1(flush).observe(node, { characterData: true });
	    notify = function () {
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if (Promise$1 && Promise$1.resolve) {
	    // Promise.resolve without an argument throws an error in LG WebOS 2
	    promise = Promise$1.resolve(undefined);
	    then = promise.then;
	    notify = function () {
	      then.call(promise, flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessag
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    notify = function () {
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask.call(global_1, flush);
	    };
	  }
	}

	var microtask = queueMicrotask || function (fn) {
	  var task = { fn: fn, next: undefined };
	  if (last) last.next = task;
	  if (!head) {
	    head = task;
	    notify();
	  } last = task;
	};

	var PromiseCapability = function (C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = aFunction$1(resolve);
	  this.reject = aFunction$1(reject);
	};

	// 25.4.1.5 NewPromiseCapability(C)
	var f$6 = function (C) {
	  return new PromiseCapability(C);
	};

	var newPromiseCapability = {
		f: f$6
	};

	var promiseResolve = function (C, x) {
	  anObject(C);
	  if (isObject(x) && x.constructor === C) return x;
	  var promiseCapability = newPromiseCapability.f(C);
	  var resolve = promiseCapability.resolve;
	  resolve(x);
	  return promiseCapability.promise;
	};

	var hostReportErrors = function (a, b) {
	  var console = global_1.console;
	  if (console && console.error) {
	    arguments.length === 1 ? console.error(a) : console.error(a, b);
	  }
	};

	var perform = function (exec) {
	  try {
	    return { error: false, value: exec() };
	  } catch (error) {
	    return { error: true, value: error };
	  }
	};

	var task$1 = task.set;










	var SPECIES$4 = wellKnownSymbol('species');
	var PROMISE = 'Promise';
	var getInternalState$1 = internalState.get;
	var setInternalState$1 = internalState.set;
	var getInternalPromiseState = internalState.getterFor(PROMISE);
	var PromiseConstructor = nativePromiseConstructor;
	var TypeError$1 = global_1.TypeError;
	var document$2 = global_1.document;
	var process$3 = global_1.process;
	var $fetch = getBuiltIn('fetch');
	var newPromiseCapability$1 = newPromiseCapability.f;
	var newGenericPromiseCapability = newPromiseCapability$1;
	var IS_NODE$1 = classofRaw(process$3) == 'process';
	var DISPATCH_EVENT = !!(document$2 && document$2.createEvent && global_1.dispatchEvent);
	var UNHANDLED_REJECTION = 'unhandledrejection';
	var REJECTION_HANDLED = 'rejectionhandled';
	var PENDING = 0;
	var FULFILLED = 1;
	var REJECTED = 2;
	var HANDLED = 1;
	var UNHANDLED = 2;
	var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

	var FORCED = isForced_1(PROMISE, function () {
	  var GLOBAL_CORE_JS_PROMISE = inspectSource(PromiseConstructor) !== String(PromiseConstructor);
	  if (!GLOBAL_CORE_JS_PROMISE) {
	    // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
	    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
	    // We can't detect it synchronously, so just check versions
	    if (engineV8Version === 66) return true;
	    // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	    if (!IS_NODE$1 && typeof PromiseRejectionEvent != 'function') return true;
	  }
	  // We can't use @@species feature detection in V8 since it causes
	  // deoptimization and performance degradation
	  // https://github.com/zloirock/core-js/issues/679
	  if (engineV8Version >= 51 && /native code/.test(PromiseConstructor)) return false;
	  // Detect correctness of subclassing with @@species support
	  var promise = PromiseConstructor.resolve(1);
	  var FakePromise = function (exec) {
	    exec(function () { /* empty */ }, function () { /* empty */ });
	  };
	  var constructor = promise.constructor = {};
	  constructor[SPECIES$4] = FakePromise;
	  return !(promise.then(function () { /* empty */ }) instanceof FakePromise);
	});

	var INCORRECT_ITERATION = FORCED || !checkCorrectnessOfIteration(function (iterable) {
	  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
	});

	// helpers
	var isThenable = function (it) {
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};

	var notify$1 = function (promise, state, isReject) {
	  if (state.notified) return;
	  state.notified = true;
	  var chain = state.reactions;
	  microtask(function () {
	    var value = state.value;
	    var ok = state.state == FULFILLED;
	    var index = 0;
	    // variable length - can't use forEach
	    while (chain.length > index) {
	      var reaction = chain[index++];
	      var handler = ok ? reaction.ok : reaction.fail;
	      var resolve = reaction.resolve;
	      var reject = reaction.reject;
	      var domain = reaction.domain;
	      var result, then, exited;
	      try {
	        if (handler) {
	          if (!ok) {
	            if (state.rejection === UNHANDLED) onHandleUnhandled(promise, state);
	            state.rejection = HANDLED;
	          }
	          if (handler === true) result = value;
	          else {
	            if (domain) domain.enter();
	            result = handler(value); // can throw
	            if (domain) {
	              domain.exit();
	              exited = true;
	            }
	          }
	          if (result === reaction.promise) {
	            reject(TypeError$1('Promise-chain cycle'));
	          } else if (then = isThenable(result)) {
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch (error) {
	        if (domain && !exited) domain.exit();
	        reject(error);
	      }
	    }
	    state.reactions = [];
	    state.notified = false;
	    if (isReject && !state.rejection) onUnhandled(promise, state);
	  });
	};

	var dispatchEvent = function (name, promise, reason) {
	  var event, handler;
	  if (DISPATCH_EVENT) {
	    event = document$2.createEvent('Event');
	    event.promise = promise;
	    event.reason = reason;
	    event.initEvent(name, false, true);
	    global_1.dispatchEvent(event);
	  } else event = { promise: promise, reason: reason };
	  if (handler = global_1['on' + name]) handler(event);
	  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
	};

	var onUnhandled = function (promise, state) {
	  task$1.call(global_1, function () {
	    var value = state.value;
	    var IS_UNHANDLED = isUnhandled(state);
	    var result;
	    if (IS_UNHANDLED) {
	      result = perform(function () {
	        if (IS_NODE$1) {
	          process$3.emit('unhandledRejection', value, promise);
	        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      state.rejection = IS_NODE$1 || isUnhandled(state) ? UNHANDLED : HANDLED;
	      if (result.error) throw result.value;
	    }
	  });
	};

	var isUnhandled = function (state) {
	  return state.rejection !== HANDLED && !state.parent;
	};

	var onHandleUnhandled = function (promise, state) {
	  task$1.call(global_1, function () {
	    if (IS_NODE$1) {
	      process$3.emit('rejectionHandled', promise);
	    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
	  });
	};

	var bind = function (fn, promise, state, unwrap) {
	  return function (value) {
	    fn(promise, state, value, unwrap);
	  };
	};

	var internalReject = function (promise, state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  state.value = value;
	  state.state = REJECTED;
	  notify$1(promise, state, true);
	};

	var internalResolve = function (promise, state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  try {
	    if (promise === value) throw TypeError$1("Promise can't be resolved itself");
	    var then = isThenable(value);
	    if (then) {
	      microtask(function () {
	        var wrapper = { done: false };
	        try {
	          then.call(value,
	            bind(internalResolve, promise, wrapper, state),
	            bind(internalReject, promise, wrapper, state)
	          );
	        } catch (error) {
	          internalReject(promise, wrapper, error, state);
	        }
	      });
	    } else {
	      state.value = value;
	      state.state = FULFILLED;
	      notify$1(promise, state, false);
	    }
	  } catch (error) {
	    internalReject(promise, { done: false }, error, state);
	  }
	};

	// constructor polyfill
	if (FORCED) {
	  // 25.4.3.1 Promise(executor)
	  PromiseConstructor = function Promise(executor) {
	    anInstance(this, PromiseConstructor, PROMISE);
	    aFunction$1(executor);
	    Internal.call(this);
	    var state = getInternalState$1(this);
	    try {
	      executor(bind(internalResolve, this, state), bind(internalReject, this, state));
	    } catch (error) {
	      internalReject(this, state, error);
	    }
	  };
	  // eslint-disable-next-line no-unused-vars
	  Internal = function Promise(executor) {
	    setInternalState$1(this, {
	      type: PROMISE,
	      done: false,
	      notified: false,
	      parent: false,
	      reactions: [],
	      rejection: false,
	      state: PENDING,
	      value: undefined
	    });
	  };
	  Internal.prototype = redefineAll(PromiseConstructor.prototype, {
	    // `Promise.prototype.then` method
	    // https://tc39.github.io/ecma262/#sec-promise.prototype.then
	    then: function then(onFulfilled, onRejected) {
	      var state = getInternalPromiseState(this);
	      var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
	      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail = typeof onRejected == 'function' && onRejected;
	      reaction.domain = IS_NODE$1 ? process$3.domain : undefined;
	      state.parent = true;
	      state.reactions.push(reaction);
	      if (state.state != PENDING) notify$1(this, state, false);
	      return reaction.promise;
	    },
	    // `Promise.prototype.catch` method
	    // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
	    'catch': function (onRejected) {
	      return this.then(undefined, onRejected);
	    }
	  });
	  OwnPromiseCapability = function () {
	    var promise = new Internal();
	    var state = getInternalState$1(promise);
	    this.promise = promise;
	    this.resolve = bind(internalResolve, promise, state);
	    this.reject = bind(internalReject, promise, state);
	  };
	  newPromiseCapability.f = newPromiseCapability$1 = function (C) {
	    return C === PromiseConstructor || C === PromiseWrapper
	      ? new OwnPromiseCapability(C)
	      : newGenericPromiseCapability(C);
	  };

	  if ( typeof nativePromiseConstructor == 'function') {
	    nativeThen = nativePromiseConstructor.prototype.then;

	    // wrap native Promise#then for native async functions
	    redefine(nativePromiseConstructor.prototype, 'then', function then(onFulfilled, onRejected) {
	      var that = this;
	      return new PromiseConstructor(function (resolve, reject) {
	        nativeThen.call(that, resolve, reject);
	      }).then(onFulfilled, onRejected);
	    // https://github.com/zloirock/core-js/issues/640
	    }, { unsafe: true });

	    // wrap fetch result
	    if (typeof $fetch == 'function') _export({ global: true, enumerable: true, forced: true }, {
	      // eslint-disable-next-line no-unused-vars
	      fetch: function fetch(input /* , init */) {
	        return promiseResolve(PromiseConstructor, $fetch.apply(global_1, arguments));
	      }
	    });
	  }
	}

	_export({ global: true, wrap: true, forced: FORCED }, {
	  Promise: PromiseConstructor
	});

	setToStringTag(PromiseConstructor, PROMISE, false);
	setSpecies(PROMISE);

	PromiseWrapper = getBuiltIn(PROMISE);

	// statics
	_export({ target: PROMISE, stat: true, forced: FORCED }, {
	  // `Promise.reject` method
	  // https://tc39.github.io/ecma262/#sec-promise.reject
	  reject: function reject(r) {
	    var capability = newPromiseCapability$1(this);
	    capability.reject.call(undefined, r);
	    return capability.promise;
	  }
	});

	_export({ target: PROMISE, stat: true, forced:  FORCED }, {
	  // `Promise.resolve` method
	  // https://tc39.github.io/ecma262/#sec-promise.resolve
	  resolve: function resolve(x) {
	    return promiseResolve( this, x);
	  }
	});

	_export({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
	  // `Promise.all` method
	  // https://tc39.github.io/ecma262/#sec-promise.all
	  all: function all(iterable) {
	    var C = this;
	    var capability = newPromiseCapability$1(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aFunction$1(C.resolve);
	      var values = [];
	      var counter = 0;
	      var remaining = 1;
	      iterate_1(iterable, function (promise) {
	        var index = counter++;
	        var alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        $promiseResolve.call(C, promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  },
	  // `Promise.race` method
	  // https://tc39.github.io/ecma262/#sec-promise.race
	  race: function race(iterable) {
	    var C = this;
	    var capability = newPromiseCapability$1(C);
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aFunction$1(C.resolve);
	      iterate_1(iterable, function (promise) {
	        $promiseResolve.call(C, promise).then(capability.resolve, reject);
	      });
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	// `RegExp.prototype.flags` getter implementation
	// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
	var regexpFlags = function () {
	  var that = anObject(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	var TO_STRING$1 = 'toString';
	var RegExpPrototype = RegExp.prototype;
	var nativeToString = RegExpPrototype[TO_STRING$1];

	var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
	// FF44- RegExp#toString has a wrong name
	var INCORRECT_NAME = nativeToString.name != TO_STRING$1;

	// `RegExp.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
	if (NOT_GENERIC || INCORRECT_NAME) {
	  redefine(RegExp.prototype, TO_STRING$1, function toString() {
	    var R = anObject(this);
	    var p = String(R.source);
	    var rf = R.flags;
	    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? regexpFlags.call(R) : rf);
	    return '/' + p + '/' + f;
	  }, { unsafe: true });
	}

	// `String.prototype.{ codePointAt, at }` methods implementation
	var createMethod$2 = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = String(requireObjectCoercible($this));
	    var position = toInteger(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = S.charCodeAt(position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size
	      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
	        ? CONVERT_TO_STRING ? S.charAt(position) : first
	        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$2(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$2(true)
	};

	var charAt = stringMultibyte.charAt;



	var STRING_ITERATOR = 'String Iterator';
	var setInternalState$2 = internalState.set;
	var getInternalState$2 = internalState.getterFor(STRING_ITERATOR);

	// `String.prototype[@@iterator]` method
	// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
	defineIterator(String, 'String', function (iterated) {
	  setInternalState$2(this, {
	    type: STRING_ITERATOR,
	    string: String(iterated),
	    index: 0
	  });
	// `%StringIteratorPrototype%.next` method
	// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
	}, function next() {
	  var state = getInternalState$2(this);
	  var string = state.string;
	  var index = state.index;
	  var point;
	  if (index >= string.length) return { value: undefined, done: true };
	  point = charAt(string, index);
	  state.index += point.length;
	  return { value: point, done: false };
	});

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	for (var COLLECTION_NAME in domIterables) {
	  var Collection = global_1[COLLECTION_NAME];
	  var CollectionPrototype = Collection && Collection.prototype;
	  // some Chrome versions have non-configurable methods on DOMTokenList
	  if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
	    createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
	  } catch (error) {
	    CollectionPrototype.forEach = arrayForEach;
	  }
	}

	var ITERATOR$5 = wellKnownSymbol('iterator');
	var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
	var ArrayValues = es_array_iterator.values;

	for (var COLLECTION_NAME$1 in domIterables) {
	  var Collection$1 = global_1[COLLECTION_NAME$1];
	  var CollectionPrototype$1 = Collection$1 && Collection$1.prototype;
	  if (CollectionPrototype$1) {
	    // some Chrome versions have non-configurable methods on DOMTokenList
	    if (CollectionPrototype$1[ITERATOR$5] !== ArrayValues) try {
	      createNonEnumerableProperty(CollectionPrototype$1, ITERATOR$5, ArrayValues);
	    } catch (error) {
	      CollectionPrototype$1[ITERATOR$5] = ArrayValues;
	    }
	    if (!CollectionPrototype$1[TO_STRING_TAG$3]) {
	      createNonEnumerableProperty(CollectionPrototype$1, TO_STRING_TAG$3, COLLECTION_NAME$1);
	    }
	    if (domIterables[COLLECTION_NAME$1]) for (var METHOD_NAME in es_array_iterator) {
	      // some Chrome versions have non-configurable methods on DOMTokenList
	      if (CollectionPrototype$1[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
	        createNonEnumerableProperty(CollectionPrototype$1, METHOD_NAME, es_array_iterator[METHOD_NAME]);
	      } catch (error) {
	        CollectionPrototype$1[METHOD_NAME] = es_array_iterator[METHOD_NAME];
	      }
	    }
	  }
	}

	/*! *****************************************************************************
	Copyright (c) Microsoft Corporation.

	Permission to use, copy, modify, and/or distribute this software for any
	purpose with or without fee is hereby granted.

	THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
	REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
	AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
	INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
	LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
	OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
	PERFORMANCE OF THIS SOFTWARE.
	***************************************************************************** */

	var __assign = function() {
	    __assign = Object.assign || function __assign(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};

	function __rest(s, e) {
	    var t = {};
	    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
	        t[p] = s[p];
	    if (s != null && typeof Object.getOwnPropertySymbols === "function")
	        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
	            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
	                t[p[i]] = s[p[i]];
	        }
	    return t;
	}

	function __awaiter(thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	}

	function __generator(thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	}

	function __read(o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
	}

	function __spread() {
	    for (var ar = [], i = 0; i < arguments.length; i++)
	        ar = ar.concat(__read(arguments[i]));
	    return ar;
	}

	function onloadScript(src, onLoad) {
	  if (src === void 0) {
	    src = '';
	  }

	  if (onLoad === void 0) {
	    onLoad = function onLoad() {};
	  }

	  if (src) {
	    var script = document.createElement('script');
	    script.src = src;
	    document.body.appendChild(script); //@ts-ignore

	    script.onload = script.onreadystatechange = function () {
	      //@ts-ignore
	      if (!this.readyState || /^(loaded|complete)$/.test(this.readyState)) {
	        onLoad && onLoad();
	      }
	    };
	  }
	}
	function isObject$1(value) {
	  return Object.prototype.toString.call(value) === '[object Object]';
	}

	var slice = [].slice;
	var MSIE = /MSIE .\./.test(engineUserAgent); // <- dirty ie9- check

	var wrap = function (scheduler) {
	  return function (handler, timeout /* , ...arguments */) {
	    var boundArgs = arguments.length > 2;
	    var args = boundArgs ? slice.call(arguments, 2) : undefined;
	    return scheduler(boundArgs ? function () {
	      // eslint-disable-next-line no-new-func
	      (typeof handler == 'function' ? handler : Function(handler)).apply(this, args);
	    } : handler, timeout);
	  };
	};

	// ie9- setTimeout & setInterval additional parameters fix
	// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
	_export({ global: true, bind: true, forced: MSIE }, {
	  // `setTimeout` method
	  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
	  setTimeout: wrap(global_1.setTimeout),
	  // `setInterval` method
	  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
	  setInterval: wrap(global_1.setInterval)
	});

	function checkBrowser() {
	  /**浏览器升级提示**/
	  var d = document.createElement('div');
	  d.innerHTML = '<style>.btn{display:inline-block;padding:6px 12px;margin-bottom:0;font-size:14px;font-weight:400;line-height:1.42857143;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-image:none;border:1px solid transparent;border-radius:4px;} a.btn {display: inline-block;background-color: #0885f2;color: #ffffff;line-height:16px;border: 1px solid #0885f2;outline: none;cursor: pointer;border-radius: 2px;cursor:pointer;} a.btn:hover {color:#fff;}</style> <div  id = "updateBrowseBoxVersion" style = "position: fixed;top: 0;left:0px;width: 100%;color: red;border-bottom: 1px solid #b1b4b9;padding-left: 10px;" class="update-browse-tips" > 您的浏览器版本过低，可能无法正常使用部分功能，请升级。推荐使用谷歌，火狐浏览器<a class="btn btn-update" target="_blank" href="http://browsehappy.osfipin.com/">立即升级</a></div > ';

	  var func = function func() {
	    var updateBrowseBoxVersion = document.getElementById('updateBrowseBoxVersion');

	    if (updateBrowseBoxVersion !== null) {
	      return;
	    }

	    var s = document.getElementsByTagName('body')[0];

	    if ('undefined' == typeof s) {
	      //@ts-ignore
	      setTimeout(f, 10);
	    } else {
	      s.insertBefore(d, s.firstChild);
	    }
	  };
	  /**IE10及其以下提示*/


	  if (!('WebSocket' in window && 2 === window.WebSocket.CLOSING) || window.navigator.userAgent.indexOf('MSIE') >= 1) {
	    /* if('continue' == window.sessionStorage.getItem('UPDATE_BROWSE_TIPS')) return;
	          let handlerContinue = "document.getElementById('updateBrowseBox').parentNode.removeChild(document.getElementById('updateBrowseBox'));window.sessionStorage.setItem('UPDATE_BROWSE_TIPS', 'continue')"; */
	    func();
	    return false;
	  }

	  return true;
	}

	var legionsImportHtmlEntry_umd = createCommonjsModule(function (module, exports) {
	/**
	  *  legions-import-html-entry v0.0.4
	  * (c) 2020 duanguang
	  * @license MIT
	  */
	(function (global, factory) {
	   factory(exports) ;
	}(commonjsGlobal, (function (exports) {
	  /**
	   * @author Kuitos
	   * @homepage https://github.com/kuitos/
	   * @since 2019-02-25
	   */
	  var isIE = navigator.userAgent.indexOf('Trident') !== -1;
	  var firstGlobalProp, secondGlobalProp, lastGlobalProp;
	  function getGlobalProp(global) {
	      var cnt = 0;
	      var lastProp;
	      var hasIframe = false;
	      for (var p in global) {
	          if (!global.hasOwnProperty(p) ||
	              (!isNaN(p) && p < global.length) ||
	              (isIE && global[p] && global[p].parent === window))
	              continue;
	          // 遍历 iframe，检查 window 上的属性值是否是 iframe，是则跳过后面的 first 和 second 判断
	          for (var i = 0; i < window.frames.length && !hasIframe; i++) {
	              var frame = window.frames[i];
	              if (frame === global[p]) {
	                  hasIframe = true;
	                  break;
	              }
	          }
	          if (!hasIframe &&
	              ((cnt === 0 && p !== firstGlobalProp) ||
	                  (cnt === 1 && p !== secondGlobalProp)))
	              return p;
	          cnt++;
	          lastProp = p;
	      }
	      if (lastProp !== lastGlobalProp)
	          return lastProp;
	  }
	  function noteGlobalProps(global) {
	      // alternatively Object.keys(global).pop()
	      // but this may be faster (pending benchmarks)
	      firstGlobalProp = secondGlobalProp = undefined;
	      for (var p in global) {
	          try {
	              if (!global.hasOwnProperty(p) ||
	                  (!isNaN(p) && p < global.length) ||
	                  (isIE && global[p] && global[p].parent === window))
	                  continue;
	              if (!firstGlobalProp)
	                  firstGlobalProp = p;
	              else if (!secondGlobalProp)
	                  secondGlobalProp = p;
	              lastGlobalProp = p;
	          }
	          catch (er) {
	              continue;
	          }
	      }
	      return lastGlobalProp;
	  }
	  function getInlineCode(match) {
	      var start = match.indexOf('>') + 1;
	      var end = match.lastIndexOf('<');
	      return match.substring(start, end);
	  }
	  function IEVersion() {
	      var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
	      var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; //判断是否IE<11浏览器
	      var isEdge = userAgent.indexOf('Edge') > -1 && !isIE; //判断是否IE的Edge浏览器
	      var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
	      if (isIE) {
	          var reIE = new RegExp('MSIE (\\d+\\.\\d+);');
	          reIE.test(userAgent);
	          var fIEVersion = parseFloat(RegExp['$1']);
	          if (fIEVersion == 7) {
	              return 7;
	          }
	          else if (fIEVersion == 8) {
	              return 8;
	          }
	          else if (fIEVersion == 9) {
	              return 9;
	          }
	          else if (fIEVersion == 10) {
	              return 10;
	          }
	          else {
	              return 6; //IE版本<=7
	          }
	      }
	      else if (isEdge) {
	          return 'edge'; //edge
	      }
	      else if (isIE11) {
	          return 11; //IE11
	      }
	      else {
	          return -1; //不是ie浏览器
	      }
	  }
	  function transHttpUrl(url, timestamp) {
	      var arr = url.split('?');
	      var version = timestamp ? '&version=' + timestamp + '' : '';
	      if (arr.length > 1) {
	          var _query = arr[1] + version;
	          if (arr.length > 2) {
	              var query = '?' + arr[2] + version;
	              return arr[0] + '?' + arr[1] + query;
	          }
	          return arr[0] + '?' + _query;
	      }
	      else {
	          var version = timestamp ? '?version=' + timestamp + '' : '';
	          var _query = url + version;
	          return _query;
	      }
	  }

	  var commonjsGlobal$1 = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};

	  function createCommonjsModule(fn, module) {
	  	return module = { exports: {} }, fn(module, module.exports), module.exports;
	  }

	  var check = function (it) {
	    return it && it.Math == Math && it;
	  };

	  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	  var global_1 =
	    // eslint-disable-next-line no-undef
	    check(typeof globalThis == 'object' && globalThis) ||
	    check(typeof window == 'object' && window) ||
	    check(typeof self == 'object' && self) ||
	    check(typeof commonjsGlobal$1 == 'object' && commonjsGlobal$1) ||
	    // eslint-disable-next-line no-new-func
	    Function('return this')();

	  var fails = function (exec) {
	    try {
	      return !!exec();
	    } catch (error) {
	      return true;
	    }
	  };

	  // Thank's IE8 for his funny defineProperty
	  var descriptors = !fails(function () {
	    return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	  });

	  var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	  // Nashorn ~ JDK8 bug
	  var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

	  // `Object.prototype.propertyIsEnumerable` method implementation
	  // https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
	  var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	    var descriptor = getOwnPropertyDescriptor(this, V);
	    return !!descriptor && descriptor.enumerable;
	  } : nativePropertyIsEnumerable;

	  var objectPropertyIsEnumerable = {
	  	f: f
	  };

	  var createPropertyDescriptor = function (bitmap, value) {
	    return {
	      enumerable: !(bitmap & 1),
	      configurable: !(bitmap & 2),
	      writable: !(bitmap & 4),
	      value: value
	    };
	  };

	  var toString = {}.toString;

	  var classofRaw = function (it) {
	    return toString.call(it).slice(8, -1);
	  };

	  var split = ''.split;

	  // fallback for non-array-like ES3 and non-enumerable old V8 strings
	  var indexedObject = fails(function () {
	    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	    // eslint-disable-next-line no-prototype-builtins
	    return !Object('z').propertyIsEnumerable(0);
	  }) ? function (it) {
	    return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	  } : Object;

	  // `RequireObjectCoercible` abstract operation
	  // https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	  var requireObjectCoercible = function (it) {
	    if (it == undefined) throw TypeError("Can't call method on " + it);
	    return it;
	  };

	  // toObject with fallback for non-array-like ES3 strings



	  var toIndexedObject = function (it) {
	    return indexedObject(requireObjectCoercible(it));
	  };

	  var isObject = function (it) {
	    return typeof it === 'object' ? it !== null : typeof it === 'function';
	  };

	  // `ToPrimitive` abstract operation
	  // https://tc39.github.io/ecma262/#sec-toprimitive
	  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
	  // and the second argument - flag - preferred type is a string
	  var toPrimitive = function (input, PREFERRED_STRING) {
	    if (!isObject(input)) return input;
	    var fn, val;
	    if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	    if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	    if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	    throw TypeError("Can't convert object to primitive value");
	  };

	  var hasOwnProperty = {}.hasOwnProperty;

	  var has = function (it, key) {
	    return hasOwnProperty.call(it, key);
	  };

	  var document = global_1.document;
	  // typeof document.createElement is 'object' in old IE
	  var EXISTS = isObject(document) && isObject(document.createElement);

	  var documentCreateElement = function (it) {
	    return EXISTS ? document.createElement(it) : {};
	  };

	  // Thank's IE8 for his funny defineProperty
	  var ie8DomDefine = !descriptors && !fails(function () {
	    return Object.defineProperty(documentCreateElement('div'), 'a', {
	      get: function () { return 7; }
	    }).a != 7;
	  });

	  var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	  // `Object.getOwnPropertyDescriptor` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
	  var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	    O = toIndexedObject(O);
	    P = toPrimitive(P, true);
	    if (ie8DomDefine) try {
	      return nativeGetOwnPropertyDescriptor(O, P);
	    } catch (error) { /* empty */ }
	    if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	  };

	  var objectGetOwnPropertyDescriptor = {
	  	f: f$1
	  };

	  var anObject = function (it) {
	    if (!isObject(it)) {
	      throw TypeError(String(it) + ' is not an object');
	    } return it;
	  };

	  var nativeDefineProperty = Object.defineProperty;

	  // `Object.defineProperty` method
	  // https://tc39.github.io/ecma262/#sec-object.defineproperty
	  var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	    anObject(O);
	    P = toPrimitive(P, true);
	    anObject(Attributes);
	    if (ie8DomDefine) try {
	      return nativeDefineProperty(O, P, Attributes);
	    } catch (error) { /* empty */ }
	    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	    if ('value' in Attributes) O[P] = Attributes.value;
	    return O;
	  };

	  var objectDefineProperty = {
	  	f: f$2
	  };

	  var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	    return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	  } : function (object, key, value) {
	    object[key] = value;
	    return object;
	  };

	  var setGlobal = function (key, value) {
	    try {
	      createNonEnumerableProperty(global_1, key, value);
	    } catch (error) {
	      global_1[key] = value;
	    } return value;
	  };

	  var SHARED = '__core-js_shared__';
	  var store = global_1[SHARED] || setGlobal(SHARED, {});

	  var sharedStore = store;

	  var functionToString = Function.toString;

	  // this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
	  if (typeof sharedStore.inspectSource != 'function') {
	    sharedStore.inspectSource = function (it) {
	      return functionToString.call(it);
	    };
	  }

	  var inspectSource = sharedStore.inspectSource;

	  var WeakMap = global_1.WeakMap;

	  var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

	  var shared = createCommonjsModule(function (module) {
	  (module.exports = function (key, value) {
	    return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	  })('versions', []).push({
	    version: '3.6.5',
	    mode:  'global',
	    copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
	  });
	  });

	  var id = 0;
	  var postfix = Math.random();

	  var uid = function (key) {
	    return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	  };

	  var keys = shared('keys');

	  var sharedKey = function (key) {
	    return keys[key] || (keys[key] = uid(key));
	  };

	  var hiddenKeys = {};

	  var WeakMap$1 = global_1.WeakMap;
	  var set, get, has$1;

	  var enforce = function (it) {
	    return has$1(it) ? get(it) : set(it, {});
	  };

	  var getterFor = function (TYPE) {
	    return function (it) {
	      var state;
	      if (!isObject(it) || (state = get(it)).type !== TYPE) {
	        throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	      } return state;
	    };
	  };

	  if (nativeWeakMap) {
	    var store$1 = new WeakMap$1();
	    var wmget = store$1.get;
	    var wmhas = store$1.has;
	    var wmset = store$1.set;
	    set = function (it, metadata) {
	      wmset.call(store$1, it, metadata);
	      return metadata;
	    };
	    get = function (it) {
	      return wmget.call(store$1, it) || {};
	    };
	    has$1 = function (it) {
	      return wmhas.call(store$1, it);
	    };
	  } else {
	    var STATE = sharedKey('state');
	    hiddenKeys[STATE] = true;
	    set = function (it, metadata) {
	      createNonEnumerableProperty(it, STATE, metadata);
	      return metadata;
	    };
	    get = function (it) {
	      return has(it, STATE) ? it[STATE] : {};
	    };
	    has$1 = function (it) {
	      return has(it, STATE);
	    };
	  }

	  var internalState = {
	    set: set,
	    get: get,
	    has: has$1,
	    enforce: enforce,
	    getterFor: getterFor
	  };

	  var redefine = createCommonjsModule(function (module) {
	  var getInternalState = internalState.get;
	  var enforceInternalState = internalState.enforce;
	  var TEMPLATE = String(String).split('String');

	  (module.exports = function (O, key, value, options) {
	    var unsafe = options ? !!options.unsafe : false;
	    var simple = options ? !!options.enumerable : false;
	    var noTargetGet = options ? !!options.noTargetGet : false;
	    if (typeof value == 'function') {
	      if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
	      enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
	    }
	    if (O === global_1) {
	      if (simple) O[key] = value;
	      else setGlobal(key, value);
	      return;
	    } else if (!unsafe) {
	      delete O[key];
	    } else if (!noTargetGet && O[key]) {
	      simple = true;
	    }
	    if (simple) O[key] = value;
	    else createNonEnumerableProperty(O, key, value);
	  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	  })(Function.prototype, 'toString', function toString() {
	    return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
	  });
	  });

	  var path = global_1;

	  var aFunction = function (variable) {
	    return typeof variable == 'function' ? variable : undefined;
	  };

	  var getBuiltIn = function (namespace, method) {
	    return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
	      : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	  };

	  var ceil = Math.ceil;
	  var floor = Math.floor;

	  // `ToInteger` abstract operation
	  // https://tc39.github.io/ecma262/#sec-tointeger
	  var toInteger = function (argument) {
	    return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	  };

	  var min = Math.min;

	  // `ToLength` abstract operation
	  // https://tc39.github.io/ecma262/#sec-tolength
	  var toLength = function (argument) {
	    return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	  };

	  var max = Math.max;
	  var min$1 = Math.min;

	  // Helper for a popular repeating case of the spec:
	  // Let integer be ? ToInteger(index).
	  // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	  var toAbsoluteIndex = function (index, length) {
	    var integer = toInteger(index);
	    return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	  };

	  // `Array.prototype.{ indexOf, includes }` methods implementation
	  var createMethod = function (IS_INCLUDES) {
	    return function ($this, el, fromIndex) {
	      var O = toIndexedObject($this);
	      var length = toLength(O.length);
	      var index = toAbsoluteIndex(fromIndex, length);
	      var value;
	      // Array#includes uses SameValueZero equality algorithm
	      // eslint-disable-next-line no-self-compare
	      if (IS_INCLUDES && el != el) while (length > index) {
	        value = O[index++];
	        // eslint-disable-next-line no-self-compare
	        if (value != value) return true;
	      // Array#indexOf ignores holes, Array#includes - not
	      } else for (;length > index; index++) {
	        if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	      } return !IS_INCLUDES && -1;
	    };
	  };

	  var arrayIncludes = {
	    // `Array.prototype.includes` method
	    // https://tc39.github.io/ecma262/#sec-array.prototype.includes
	    includes: createMethod(true),
	    // `Array.prototype.indexOf` method
	    // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	    indexOf: createMethod(false)
	  };

	  var indexOf = arrayIncludes.indexOf;


	  var objectKeysInternal = function (object, names) {
	    var O = toIndexedObject(object);
	    var i = 0;
	    var result = [];
	    var key;
	    for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
	    // Don't enum bug & hidden keys
	    while (names.length > i) if (has(O, key = names[i++])) {
	      ~indexOf(result, key) || result.push(key);
	    }
	    return result;
	  };

	  // IE8- don't enum bug keys
	  var enumBugKeys = [
	    'constructor',
	    'hasOwnProperty',
	    'isPrototypeOf',
	    'propertyIsEnumerable',
	    'toLocaleString',
	    'toString',
	    'valueOf'
	  ];

	  var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

	  // `Object.getOwnPropertyNames` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	  var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	    return objectKeysInternal(O, hiddenKeys$1);
	  };

	  var objectGetOwnPropertyNames = {
	  	f: f$3
	  };

	  var f$4 = Object.getOwnPropertySymbols;

	  var objectGetOwnPropertySymbols = {
	  	f: f$4
	  };

	  // all object keys, includes non-enumerable and symbols
	  var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	    var keys = objectGetOwnPropertyNames.f(anObject(it));
	    var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	    return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	  };

	  var copyConstructorProperties = function (target, source) {
	    var keys = ownKeys(source);
	    var defineProperty = objectDefineProperty.f;
	    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	    for (var i = 0; i < keys.length; i++) {
	      var key = keys[i];
	      if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	    }
	  };

	  var replacement = /#|\.prototype\./;

	  var isForced = function (feature, detection) {
	    var value = data[normalize(feature)];
	    return value == POLYFILL ? true
	      : value == NATIVE ? false
	      : typeof detection == 'function' ? fails(detection)
	      : !!detection;
	  };

	  var normalize = isForced.normalize = function (string) {
	    return String(string).replace(replacement, '.').toLowerCase();
	  };

	  var data = isForced.data = {};
	  var NATIVE = isForced.NATIVE = 'N';
	  var POLYFILL = isForced.POLYFILL = 'P';

	  var isForced_1 = isForced;

	  var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






	  /*
	    options.target      - name of the target object
	    options.global      - target is the global object
	    options.stat        - export as static methods of target
	    options.proto       - export as prototype methods of target
	    options.real        - real prototype method for the `pure` version
	    options.forced      - export even if the native feature is available
	    options.bind        - bind methods to the target, required for the `pure` version
	    options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	    options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	    options.sham        - add a flag to not completely full polyfills
	    options.enumerable  - export as enumerable property
	    options.noTargetGet - prevent calling a getter on target
	  */
	  var _export = function (options, source) {
	    var TARGET = options.target;
	    var GLOBAL = options.global;
	    var STATIC = options.stat;
	    var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	    if (GLOBAL) {
	      target = global_1;
	    } else if (STATIC) {
	      target = global_1[TARGET] || setGlobal(TARGET, {});
	    } else {
	      target = (global_1[TARGET] || {}).prototype;
	    }
	    if (target) for (key in source) {
	      sourceProperty = source[key];
	      if (options.noTargetGet) {
	        descriptor = getOwnPropertyDescriptor$1(target, key);
	        targetProperty = descriptor && descriptor.value;
	      } else targetProperty = target[key];
	      FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	      // contained in target
	      if (!FORCED && targetProperty !== undefined) {
	        if (typeof sourceProperty === typeof targetProperty) continue;
	        copyConstructorProperties(sourceProperty, targetProperty);
	      }
	      // add a flag to not completely full polyfills
	      if (options.sham || (targetProperty && targetProperty.sham)) {
	        createNonEnumerableProperty(sourceProperty, 'sham', true);
	      }
	      // extend global
	      redefine(target, key, sourceProperty, options);
	    }
	  };

	  var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	    // Chrome 38 Symbol has incorrect toString conversion
	    // eslint-disable-next-line no-undef
	    return !String(Symbol());
	  });

	  var useSymbolAsUid = nativeSymbol
	    // eslint-disable-next-line no-undef
	    && !Symbol.sham
	    // eslint-disable-next-line no-undef
	    && typeof Symbol.iterator == 'symbol';

	  var WellKnownSymbolsStore = shared('wks');
	  var Symbol$1 = global_1.Symbol;
	  var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	  var wellKnownSymbol = function (name) {
	    if (!has(WellKnownSymbolsStore, name)) {
	      if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];
	      else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	    } return WellKnownSymbolsStore[name];
	  };

	  var MATCH = wellKnownSymbol('match');

	  // `IsRegExp` abstract operation
	  // https://tc39.github.io/ecma262/#sec-isregexp
	  var isRegexp = function (it) {
	    var isRegExp;
	    return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
	  };

	  var notARegexp = function (it) {
	    if (isRegexp(it)) {
	      throw TypeError("The method doesn't accept regular expressions");
	    } return it;
	  };

	  var MATCH$1 = wellKnownSymbol('match');

	  var correctIsRegexpLogic = function (METHOD_NAME) {
	    var regexp = /./;
	    try {
	      '/./'[METHOD_NAME](regexp);
	    } catch (e) {
	      try {
	        regexp[MATCH$1] = false;
	        return '/./'[METHOD_NAME](regexp);
	      } catch (f) { /* empty */ }
	    } return false;
	  };

	  var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;






	  var nativeEndsWith = ''.endsWith;
	  var min$2 = Math.min;

	  var CORRECT_IS_REGEXP_LOGIC = correctIsRegexpLogic('endsWith');
	  // https://github.com/zloirock/core-js/pull/702
	  var MDN_POLYFILL_BUG =  !CORRECT_IS_REGEXP_LOGIC && !!function () {
	    var descriptor = getOwnPropertyDescriptor$2(String.prototype, 'endsWith');
	    return descriptor && !descriptor.writable;
	  }();

	  // `String.prototype.endsWith` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.endswith
	  _export({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
	    endsWith: function endsWith(searchString /* , endPosition = @length */) {
	      var that = String(requireObjectCoercible(this));
	      notARegexp(searchString);
	      var endPosition = arguments.length > 1 ? arguments[1] : undefined;
	      var len = toLength(that.length);
	      var end = endPosition === undefined ? len : min$2(toLength(endPosition), len);
	      var search = String(searchString);
	      return nativeEndsWith
	        ? nativeEndsWith.call(that, search, end)
	        : that.slice(end - search.length, end) === search;
	    }
	  });

	  /**
	   * @author Kuitos
	   * @homepage https://github.com/kuitos/
	   * @since 2018-09-03 15:04
	   */
	  var ALL_SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
	  var SCRIPT_TAG_REGEX = /<(script)\s+((?!type=('|')text\/ng-template\3).)*?>.*?<\/\1>/i;
	  var SCRIPT_SRC_REGEX = /.*\ssrc=('|")(\S+)\1.*/;
	  var SCRIPT_ENTRY_REGEX = /.*\sentry\s*.*/;
	  var SCRIPT_ASYNC_REGEX = /.*\sasync\s*.*/;
	  var LINK_TAG_REGEX = /<(link)\s+.*?>/gi;
	  var LINK_IGNORE_REGEX = /.*ignore\s*.*/;
	  var STYLE_TAG_REGEX = /<style[^>]*>[\s\S]*?<\/style>/gi;
	  var STYLE_TYPE_REGEX = /\s+rel=("|')stylesheet\1.*/;
	  var STYLE_HREF_REGEX = /.*\shref=('|")(\S+)\1.*/;
	  var STYLE_IGNORE_REGEX = /<style(\s+|\s+.+\s+)ignore(\s*|\s+.*)>/i;
	  var HTML_COMMENT_REGEX = /<!--([\s\S]*?)-->/g;
	  var SCRIPT_IGNORE_REGEX = /<script(\s+|\s+.+\s+)ignore(\s*|\s+.*)>/i;
	  function hasProtocol(url) {
	      return (url.startsWith('//') ||
	          url.startsWith('http://') ||
	          url.startsWith('https://'));
	  }
	  function getBaseDomain(url) {
	      var isIE = navigator.userAgent.indexOf('Trident') !== -1;
	      if (isIE) {
	          var reg = new RegExp('/' + '$');
	          return reg.test(url) ? url.substr(0, url.length - 1) : url;
	      }
	      return url.endsWith('/') ? url.substr(0, url.length - 1) : url;
	  }
	  var genLinkReplaceSymbol = function (linkHref) {
	      return '<!-- link ' + linkHref + ' replaced by import-html-entry -->';
	  };
	  /* export var genScriptReplaceSymbol = scriptSrc => `<!-- script ${scriptSrc} replaced by import-html-entry -->`;
	  export var inlineScriptReplaceSymbol = `<!-- inline scripts replaced by import-html-entry -->`; */
	  var genScriptReplaceSymbol = function (scriptSrc) {
	      return '<!-- script ' + scriptSrc + ' replaced by import-html-entry -->';
	  };
	  var inlineScriptReplaceSymbol = '<!-- inline scripts replaced by import-html-entry -->';
	  var genIgnoreAssetReplaceSymbol = function (url) {
	      return ('<!-- ignore asset ' + url || 'file' + ' replaced by import-html-entry -->');
	  };
	  /**
	   * parse the script link from the template
	   * TODO
	   *    1. collect stylesheets
	   *    2. use global eval to evaluate the inline scripts
	   *        see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function#Difference_between_Function_varructor_and_function_declaration
	   *        see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#Do_not_ever_use_eval!
	   * @param tpl
	   * @param domain
	   * @stripStyles whether to strip the css links
	   * @returns {{template: void | string | *, scripts: *[], entry: *}}
	   */
	  function processTpl(tpl, domain) {
	      var scripts = [];
	      var styles = [];
	      var entry = null;
	      var template = tpl
	          /*
	              remove html comment first
	              */
	          .replace(HTML_COMMENT_REGEX, '')
	          .replace(LINK_TAG_REGEX, function (match) {
	          /*
	                change the css link
	                */
	          var styleType = !!match.match(STYLE_TYPE_REGEX);
	          if (styleType) {
	              var styleHref = match.match(STYLE_HREF_REGEX);
	              var styleIgnore = match.match(LINK_IGNORE_REGEX);
	              if (styleHref) {
	                  var href = styleHref && styleHref[2];
	                  var newHref = href;
	                  if (href && !hasProtocol(href)) {
	                      // 处理一下使用相对路径的场景
	                      newHref =
	                          getBaseDomain(domain) +
	                              (href.startsWith('/') ? href : '/' + href + '');
	                  }
	                  if (styleIgnore) {
	                      return genIgnoreAssetReplaceSymbol(newHref);
	                  }
	                  styles.push(newHref);
	                  return genLinkReplaceSymbol(newHref);
	              }
	          }
	          /* var preloadOrPrefetchType = match.match(LINK_PRELOAD_OR_PREFETCH_REGEX) && match.match(LINK_HREF_REGEX);
	                if (preloadOrPrefetchType) {
	                    var [, , linkHref] = match.match(LINK_HREF_REGEX);
	                    return genLinkReplaceSymbol(linkHref, true);
	                } */
	          return match;
	      })
	          .replace(STYLE_TAG_REGEX, function (match) {
	          if (STYLE_IGNORE_REGEX.test(match)) {
	              return genIgnoreAssetReplaceSymbol('style file');
	          }
	          return match;
	      })
	          .replace(ALL_SCRIPT_REGEX, function (match) {
	          var scriptIgnore = match.match(SCRIPT_IGNORE_REGEX);
	          // in order to keep the exec order of all javascripts
	          // if it is a external script
	          if (SCRIPT_TAG_REGEX.test(match) && match.match(SCRIPT_SRC_REGEX)) {
	              /*
	                      collect scripts and replace the ref
	                      */
	              var matchedScriptEntry = match.match(SCRIPT_ENTRY_REGEX);
	              var matchedScriptSrcMatch = match.match(SCRIPT_SRC_REGEX);
	              var matchedScriptSrc = matchedScriptSrcMatch && matchedScriptSrcMatch[2];
	              if (entry && matchedScriptEntry) {
	                  throw new SyntaxError('You should not set multiply entry script!');
	              }
	              else {
	                  // append the domain while the script not have an protocol prefix
	                  if (matchedScriptSrc && !hasProtocol(matchedScriptSrc)) {
	                      matchedScriptSrc =
	                          getBaseDomain(domain) +
	                              (matchedScriptSrc.startsWith('/')
	                                  ? matchedScriptSrc
	                                  : '/' + matchedScriptSrc + '');
	                  }
	                  entry = entry || (matchedScriptEntry && matchedScriptSrc);
	              }
	              if (scriptIgnore) {
	                  return genIgnoreAssetReplaceSymbol(matchedScriptSrc || 'js file');
	              }
	              if (matchedScriptSrc) {
	                  var asyncScript = !!match.match(SCRIPT_ASYNC_REGEX);
	                  /* scripts.push(matchedScriptSrc); */
	                  scripts.push(asyncScript
	                      ? { async: true, src: matchedScriptSrc }
	                      : matchedScriptSrc);
	                  return genScriptReplaceSymbol(matchedScriptSrc);
	              }
	              return match;
	          }
	          else {
	              if (scriptIgnore) {
	                  return genIgnoreAssetReplaceSymbol('js file');
	              }
	              // if it is an inline script
	              var code = getInlineCode(match);
	              // remove script blocks when all of these lines are comments.
	              var isPureCommentBlock = code.split(/[\r\n]+/).every(function (line) {
	                  return !line.trim() || line.trim().startsWith('//');
	              });
	              if (!isPureCommentBlock) {
	                  scripts.push(match);
	              }
	              return inlineScriptReplaceSymbol;
	          }
	      });
	      scripts = scripts.filter(function (script) {
	          // filter empty script
	          return !!script;
	      });
	      return {
	          template: template,
	          scripts: scripts,
	          styles: styles,
	          // set the last script as entry if have not set
	          entry: entry || scripts[scripts.length - 1],
	      };
	  }

	  var global$1 =
	    (typeof globalThis !== 'undefined' && globalThis) ||
	    (typeof self !== 'undefined' && self) ||
	    (typeof global$1 !== 'undefined' && global$1);

	  var support = {
	    searchParams: 'URLSearchParams' in global$1,
	    iterable: 'Symbol' in global$1 && 'iterator' in Symbol,
	    blob:
	      'FileReader' in global$1 &&
	      'Blob' in global$1 &&
	      (function() {
	        try {
	          new Blob();
	          return true
	        } catch (e) {
	          return false
	        }
	      })(),
	    formData: 'FormData' in global$1,
	    arrayBuffer: 'ArrayBuffer' in global$1
	  };

	  function isDataView(obj) {
	    return obj && DataView.prototype.isPrototypeOf(obj)
	  }

	  if (support.arrayBuffer) {
	    var viewClasses = [
	      '[object Int8Array]',
	      '[object Uint8Array]',
	      '[object Uint8ClampedArray]',
	      '[object Int16Array]',
	      '[object Uint16Array]',
	      '[object Int32Array]',
	      '[object Uint32Array]',
	      '[object Float32Array]',
	      '[object Float64Array]'
	    ];

	    var isArrayBufferView =
	      ArrayBuffer.isView ||
	      function(obj) {
	        return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
	      };
	  }

	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name);
	    }
	    if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === '') {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }

	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value);
	    }
	    return value
	  }

	  // Build a destructive iterator for the value list
	  function iteratorFor(items) {
	    var iterator = {
	      next: function() {
	        var value = items.shift();
	        return {done: value === undefined, value: value}
	      }
	    };

	    if (support.iterable) {
	      iterator[Symbol.iterator] = function() {
	        return iterator
	      };
	    }

	    return iterator
	  }

	  function Headers(headers) {
	    this.map = {};

	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value);
	      }, this);
	    } else if (Array.isArray(headers)) {
	      headers.forEach(function(header) {
	        this.append(header[0], header[1]);
	      }, this);
	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name]);
	      }, this);
	    }
	  }

	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name);
	    value = normalizeValue(value);
	    var oldValue = this.map[name];
	    this.map[name] = oldValue ? oldValue + ', ' + value : value;
	  };

	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)];
	  };

	  Headers.prototype.get = function(name) {
	    name = normalizeName(name);
	    return this.has(name) ? this.map[name] : null
	  };

	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  };

	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = normalizeValue(value);
	  };

	  Headers.prototype.forEach = function(callback, thisArg) {
	    for (var name in this.map) {
	      if (this.map.hasOwnProperty(name)) {
	        callback.call(thisArg, this.map[name], name, this);
	      }
	    }
	  };

	  Headers.prototype.keys = function() {
	    var items = [];
	    this.forEach(function(value, name) {
	      items.push(name);
	    });
	    return iteratorFor(items)
	  };

	  Headers.prototype.values = function() {
	    var items = [];
	    this.forEach(function(value) {
	      items.push(value);
	    });
	    return iteratorFor(items)
	  };

	  Headers.prototype.entries = function() {
	    var items = [];
	    this.forEach(function(value, name) {
	      items.push([name, value]);
	    });
	    return iteratorFor(items)
	  };

	  if (support.iterable) {
	    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
	  }

	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true;
	  }

	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result);
	      };
	      reader.onerror = function() {
	        reject(reader.error);
	      };
	    })
	  }

	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader();
	    var promise = fileReaderReady(reader);
	    reader.readAsArrayBuffer(blob);
	    return promise
	  }

	  function readBlobAsText(blob) {
	    var reader = new FileReader();
	    var promise = fileReaderReady(reader);
	    reader.readAsText(blob);
	    return promise
	  }

	  function readArrayBufferAsText(buf) {
	    var view = new Uint8Array(buf);
	    var chars = new Array(view.length);

	    for (var i = 0; i < view.length; i++) {
	      chars[i] = String.fromCharCode(view[i]);
	    }
	    return chars.join('')
	  }

	  function bufferClone(buf) {
	    if (buf.slice) {
	      return buf.slice(0)
	    } else {
	      var view = new Uint8Array(buf.byteLength);
	      view.set(new Uint8Array(buf));
	      return view.buffer
	    }
	  }

	  function Body() {
	    this.bodyUsed = false;

	    this._initBody = function(body) {
	      /*
	        fetch-mock wraps the Response object in an ES6 Proxy to
	        provide useful test harness features such as flush. However, on
	        ES5 browsers without fetch or Proxy support pollyfills must be used;
	        the proxy-pollyfill is unable to proxy an attribute unless it exists
	        on the object before the Proxy is created. This change ensures
	        Response.bodyUsed exists on the instance, while maintaining the
	        semantic of setting Request.bodyUsed in the constructor before
	        _initBody is called.
	      */
	      this.bodyUsed = this.bodyUsed;
	      this._bodyInit = body;
	      if (!body) {
	        this._bodyText = '';
	      } else if (typeof body === 'string') {
	        this._bodyText = body;
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body;
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body;
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this._bodyText = body.toString();
	      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
	        this._bodyArrayBuffer = bufferClone(body.buffer);
	        // IE 10-11 can't handle a DataView body.
	        this._bodyInit = new Blob([this._bodyArrayBuffer]);
	      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
	        this._bodyArrayBuffer = bufferClone(body);
	      } else {
	        this._bodyText = body = Object.prototype.toString.call(body);
	      }

	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8');
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type);
	        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
	        }
	      }
	    };

	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this);
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyArrayBuffer) {
	          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      };

	      this.arrayBuffer = function() {
	        if (this._bodyArrayBuffer) {
	          var isConsumed = consumed(this);
	          if (isConsumed) {
	            return isConsumed
	          }
	          if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
	            return Promise.resolve(
	              this._bodyArrayBuffer.buffer.slice(
	                this._bodyArrayBuffer.byteOffset,
	                this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
	              )
	            )
	          } else {
	            return Promise.resolve(this._bodyArrayBuffer)
	          }
	        } else {
	          return this.blob().then(readBlobAsArrayBuffer)
	        }
	      };
	    }

	    this.text = function() {
	      var rejected = consumed(this);
	      if (rejected) {
	        return rejected
	      }

	      if (this._bodyBlob) {
	        return readBlobAsText(this._bodyBlob)
	      } else if (this._bodyArrayBuffer) {
	        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
	      } else if (this._bodyFormData) {
	        throw new Error('could not read FormData body as text')
	      } else {
	        return Promise.resolve(this._bodyText)
	      }
	    };

	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      };
	    }

	    this.json = function() {
	      return this.text().then(JSON.parse)
	    };

	    return this
	  }

	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase();
	    return methods.indexOf(upcased) > -1 ? upcased : method
	  }

	  function Request(input, options) {
	    if (!(this instanceof Request)) {
	      throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
	    }

	    options = options || {};
	    var body = options.body;

	    if (input instanceof Request) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url;
	      this.credentials = input.credentials;
	      if (!options.headers) {
	        this.headers = new Headers(input.headers);
	      }
	      this.method = input.method;
	      this.mode = input.mode;
	      this.signal = input.signal;
	      if (!body && input._bodyInit != null) {
	        body = input._bodyInit;
	        input.bodyUsed = true;
	      }
	    } else {
	      this.url = String(input);
	    }

	    this.credentials = options.credentials || this.credentials || 'same-origin';
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers);
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET');
	    this.mode = options.mode || this.mode || null;
	    this.signal = options.signal || this.signal;
	    this.referrer = null;

	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body);

	    if (this.method === 'GET' || this.method === 'HEAD') {
	      if (options.cache === 'no-store' || options.cache === 'no-cache') {
	        // Search for a '_' parameter in the query string
	        var reParamSearch = /([?&])_=[^&]*/;
	        if (reParamSearch.test(this.url)) {
	          // If it already exists then set the value with the current time
	          this.url = this.url.replace(reParamSearch, '$1_=' + new Date().getTime());
	        } else {
	          // Otherwise add a new '_' parameter to the end with the current time
	          var reQueryString = /\?/;
	          this.url += (reQueryString.test(this.url) ? '&' : '?') + '_=' + new Date().getTime();
	        }
	      }
	    }
	  }

	  Request.prototype.clone = function() {
	    return new Request(this, {body: this._bodyInit})
	  };

	  function decode(body) {
	    var form = new FormData();
	    body
	      .trim()
	      .split('&')
	      .forEach(function(bytes) {
	        if (bytes) {
	          var split = bytes.split('=');
	          var name = split.shift().replace(/\+/g, ' ');
	          var value = split.join('=').replace(/\+/g, ' ');
	          form.append(decodeURIComponent(name), decodeURIComponent(value));
	        }
	      });
	    return form
	  }

	  function parseHeaders(rawHeaders) {
	    var headers = new Headers();
	    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
	    // https://tools.ietf.org/html/rfc7230#section-3.2
	    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
	    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
	      var parts = line.split(':');
	      var key = parts.shift().trim();
	      if (key) {
	        var value = parts.join(':').trim();
	        headers.append(key, value);
	      }
	    });
	    return headers
	  }

	  Body.call(Request.prototype);

	  function Response(bodyInit, options) {
	    if (!(this instanceof Response)) {
	      throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
	    }
	    if (!options) {
	      options = {};
	    }

	    this.type = 'default';
	    this.status = options.status === undefined ? 200 : options.status;
	    this.ok = this.status >= 200 && this.status < 300;
	    this.statusText = 'statusText' in options ? options.statusText : '';
	    this.headers = new Headers(options.headers);
	    this.url = options.url || '';
	    this._initBody(bodyInit);
	  }

	  Body.call(Response.prototype);

	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  };

	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''});
	    response.type = 'error';
	    return response
	  };

	  var redirectStatuses = [301, 302, 303, 307, 308];

	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }

	    return new Response(null, {status: status, headers: {location: url}})
	  };

	  var DOMException = global$1.DOMException;
	  try {
	    new DOMException();
	  } catch (err) {
	    DOMException = function(message, name) {
	      this.message = message;
	      this.name = name;
	      var error = Error(message);
	      this.stack = error.stack;
	    };
	    DOMException.prototype = Object.create(Error.prototype);
	    DOMException.prototype.constructor = DOMException;
	  }

	  function fetch(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request = new Request(input, init);

	      if (request.signal && request.signal.aborted) {
	        return reject(new DOMException('Aborted', 'AbortError'))
	      }

	      var xhr = new XMLHttpRequest();

	      function abortXhr() {
	        xhr.abort();
	      }

	      xhr.onload = function() {
	        var options = {
	          status: xhr.status,
	          statusText: xhr.statusText,
	          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
	        };
	        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
	        var body = 'response' in xhr ? xhr.response : xhr.responseText;
	        setTimeout(function() {
	          resolve(new Response(body, options));
	        }, 0);
	      };

	      xhr.onerror = function() {
	        setTimeout(function() {
	          reject(new TypeError('Network request failed'));
	        }, 0);
	      };

	      xhr.ontimeout = function() {
	        setTimeout(function() {
	          reject(new TypeError('Network request failed'));
	        }, 0);
	      };

	      xhr.onabort = function() {
	        setTimeout(function() {
	          reject(new DOMException('Aborted', 'AbortError'));
	        }, 0);
	      };

	      function fixUrl(url) {
	        try {
	          return url === '' && global$1.location.href ? global$1.location.href : url
	        } catch (e) {
	          return url
	        }
	      }

	      xhr.open(request.method, fixUrl(request.url), true);

	      if (request.credentials === 'include') {
	        xhr.withCredentials = true;
	      } else if (request.credentials === 'omit') {
	        xhr.withCredentials = false;
	      }

	      if ('responseType' in xhr) {
	        if (support.blob) {
	          xhr.responseType = 'blob';
	        } else if (
	          support.arrayBuffer &&
	          request.headers.get('Content-Type') &&
	          request.headers.get('Content-Type').indexOf('application/octet-stream') !== -1
	        ) {
	          xhr.responseType = 'arraybuffer';
	        }
	      }

	      if (init && typeof init.headers === 'object' && !(init.headers instanceof Headers)) {
	        Object.getOwnPropertyNames(init.headers).forEach(function(name) {
	          xhr.setRequestHeader(name, normalizeValue(init.headers[name]));
	        });
	      } else {
	        request.headers.forEach(function(value, name) {
	          xhr.setRequestHeader(name, value);
	        });
	      }

	      if (request.signal) {
	        request.signal.addEventListener('abort', abortXhr);

	        xhr.onreadystatechange = function() {
	          // DONE (success or failure)
	          if (xhr.readyState === 4) {
	            request.signal.removeEventListener('abort', abortXhr);
	          }
	        };
	      }

	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
	    })
	  }

	  fetch.polyfill = true;

	  if (!global$1.fetch) {
	    global$1.fetch = fetch;
	    global$1.Headers = Headers;
	    global$1.Request = Request;
	    global$1.Response = Response;
	  }

	  var getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor.f;






	  var nativeStartsWith = ''.startsWith;
	  var min$3 = Math.min;

	  var CORRECT_IS_REGEXP_LOGIC$1 = correctIsRegexpLogic('startsWith');
	  // https://github.com/zloirock/core-js/pull/702
	  var MDN_POLYFILL_BUG$1 =  !CORRECT_IS_REGEXP_LOGIC$1 && !!function () {
	    var descriptor = getOwnPropertyDescriptor$3(String.prototype, 'startsWith');
	    return descriptor && !descriptor.writable;
	  }();

	  // `String.prototype.startsWith` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.startswith
	  _export({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG$1 && !CORRECT_IS_REGEXP_LOGIC$1 }, {
	    startsWith: function startsWith(searchString /* , position = 0 */) {
	      var that = String(requireObjectCoercible(this));
	      notARegexp(searchString);
	      var index = toLength(min$3(arguments.length > 1 ? arguments[1] : undefined, that.length));
	      var search = String(searchString);
	      return nativeStartsWith
	        ? nativeStartsWith.call(that, search, index)
	        : that.slice(index, index + search.length) === search;
	    }
	  });

	  var styleCache = {};
	  var scriptCache = {};
	  var excludeFilesCache = {}; // 排除在沙箱之外代码文件列表
	  var embedHTMLCache = {};
	  var isMergeCache = {};
	  function getDomain(url) {
	      try {
	          // URL 构造函数不支持使用 // 前缀的 url
	          var href = new URL(url.startsWith('//') ? '' + location.protocol + '' + url + '' : url);
	          return href.origin;
	      }
	      catch (e) {
	          return '';
	      }
	  }
	  function getExecutableScript(scriptText, proxy) {
	      /* window.proxy = proxy; */
	      var isIE = window.ActiveXObject || 'ActiveXObject' in window;
	      if (isIE) {
	          return (';(function(window, self){;' +
	              scriptText +
	              '\n}).bind(window.proxy)(window.proxy, window.proxy);');
	      }
	      // 通过这种方式获取全局 window，因为 script 也是在全局作用域下运行的，所以我们通过 window.proxy 绑定时也必须确保绑定到全局 window 上
	      // 否则在嵌套场景下， window.proxy 设置的是内层应用的 window，而代码其实是在全局作用域运行的，会导致闭包里的 window.proxy 取的是最外层的微应用的 proxy
	      var globalWindow = (0, eval)('window');
	      globalWindow.proxy = proxy;
	      /* return strictGlobal
	        ? ';(function(window, self){with(window){;' +
	            scriptText +
	            '\n}}).bind(window.proxy)(window.proxy, window.proxy);'
	        : ';(function(window, self){;' +
	            scriptText +
	            '\n}).bind(window.proxy)(window.proxy, window.proxy);'; */
	      return (';(function(window, self){with(window){;' +
	          scriptText +
	          '\n}}).bind(window.proxy)(window.proxy, window.proxy);');
	  }
	  /**
	   * convert external css link to inline style for performance optimization
	   * @param template
	   * @param styles
	   * @return embedHTML
	   */
	  function getEmbedHTML(template, styles) {
	      var embedHTML = template;
	      return getExternalStyleSheets(styles).then(function (styleSheets) {
	          embedHTML = styles.reduce(function (html, styleSrc, i) {
	              html = html.replace(genLinkReplaceSymbol(styleSrc), '<style>/* ' + styleSrc + ' */' + styleSheets[i] + '</style>');
	              return html;
	          }, embedHTML);
	          return embedHTML;
	      });
	  }
	  // for prefetch
	  function getExternalStyleSheets(styles) {
	      return Promise.all(styles.map(function (styleLink) {
	          if (styleLink.startsWith('<')) {
	              // if it is inline style
	              return getInlineCode(styleLink);
	          }
	          else {
	              // external styles
	              return (styleCache[styleLink] ||
	                  (styleCache[styleLink] = fetch(styleLink).then(function (response) {
	                      return response.text();
	                  })));
	          }
	      }));
	  }
	  // for prefetch
	  function getExternalScripts(scripts) {
	      return Promise.all(scripts.map(function (script) {
	          if (script.startsWith('<')) {
	              // if it is inline script
	              return getInlineCode(script);
	          }
	          else {
	              // external script
	              return (scriptCache[script] ||
	                  (scriptCache[script] = fetch(script).then(function (response) {
	                      return response.text().then(function (result) {
	                          return { scriptsText: result, scripts: script };
	                      });
	                  })));
	          }
	      }));
	  }
	  /**
	   *
	   *
	   * @param {*} entryMain 主JS脚本资源链接
	   * @param {*} scripts ['JS脚本资源']
	   * @param {*} [proxy=window]
	   * @param {*} keys 模块URL ，一般是指入口资源链接
	   * @returns
	   */
	  function execScripts(entryMain, scripts, proxy, keys) {
	      if (proxy === void 0) { proxy = window; }
	      return getExternalScripts(scripts).then(function (scriptsText) {
	          /* proxy = window; */ //entryMain 主JS脚本资源链接
	          window.proxy = proxy; //scriptsText=[{scripts:'JS资源URL',scriptsText:'JS资源代码字符‘}]
	          /* var geval = eval; */
	          var entry = [];
	          var strictGlobal = false;
	          var geval = function (inlineScript) {
	              var rawCode = inlineScript;
	              var code = getExecutableScript(rawCode, proxy);
	              (0, eval)(code);
	          };
	          function isExcludeFile(scriptSrc) {
	              if (excludeFilesCache[keys] && excludeFilesCache[keys].length) {
	                  for (var i = 0; i < excludeFilesCache[keys].length; i++) {
	                      if (scriptSrc.indexOf(excludeFilesCache[keys][i]) > -1) {
	                          return true;
	                      }
	                  }
	                  return false;
	              }
	              return false;
	          }
	          /**
	           * 收集全部html 里面全部JS字符串并进行合并
	           *
	           */
	          function collectInlineScript(scriptSrc, inlineScript, resolve) {
	              if (excludeFilesCache[keys] &&
	                  Object.prototype.toString.call(excludeFilesCache[keys]) ===
	                      '[object Array]' &&
	                  excludeFilesCache[keys].length) {
	                  for (var i = 0; i < excludeFilesCache[keys].length; i++) {
	                      if (scriptSrc.indexOf(excludeFilesCache[keys][i]) < 0) {
	                          entry.push(inlineScript);
	                      }
	                  }
	              }
	              else {
	                  entry.push(inlineScript);
	              }
	              noteGlobalProps(proxy);
	          }
	          function exec(scriptSrc, inlineScript, resolve) {
	              if (scriptSrc === entryMain) {
	                  noteGlobalProps();
	                  try {
	                      /* geval(';(function(window){;'+inlineScript+'\n}).bind(window.proxy)(window.proxy);'); */
	                      if (isExcludeFile(scriptSrc)) {
	                          /* geval(''+inlineScript+'\n'); */
	                      }
	                      else {
	                          /* geval(getExecutableScript(inlineScript, proxy)); */ // 躺平坑在启用
	                          geval('' + inlineScript + '\n');
	                          var exports = proxy[getGlobalProp(strictGlobal ? proxy : window)] || {};
	                          resolve(exports);
	                      }
	                  }
	                  catch (e) {
	                      console.error('error occurs while executing the entry ' + scriptSrc + '}');
	                      /* console.error(e); */
	                      throw e;
	                  }
	              }
	              else {
	                  if (typeof inlineScript === 'string') {
	                      try {
	                          if (isExcludeFile(scriptSrc)) {
	                              /* geval(''+inlineScript+'\n'); */
	                          }
	                          else {
	                              /*  geval(getExecutableScript(inlineScript, proxy)); */
	                              geval('' + inlineScript + '\n');
	                          }
	                          /* geval(';(function(window){;'+inlineScript+'\n}).bind(window.proxy)(window.proxy);'); */
	                      }
	                      catch (e) {
	                          console.error('error occurs while executing ' + scriptSrc + '');
	                          /* console.error(e); */
	                          throw e;
	                      }
	                  }
	              }
	          }
	          function collectExec(resolve) {
	              try {
	                  var isIE = window.ActiveXObject || 'ActiveXObject' in window;
	                  if (isIE) {
	                      if (IEVersion() < 11) {
	                          /* geval(getExecutableScript(entry.join(' '), proxy)); */
	                          /* geval(';(function(window){;'+entry.join(' ')+'\n}).bind(window.proxy)(window.proxy);'); */
	                          /* geval(';(function(window){;'+entry.join(' ')+'\n})(window.proxy);'); */
	                          geval(entry.join(' '));
	                      }
	                      else {
	                          /* geval(getExecutableScript(entry.join(' '),proxy)); */
	                          geval(entry.join(' '));
	                          /* geval(';(function(window){;'+entry.join(' ')+'\n}).bind(window.proxy)(window.proxy);'); */
	                      }
	                      /* var exports = proxy[getGlobalProp(proxy)] || {}; */
	                      resolve(strictGlobal ? proxy : window);
	                  }
	                  else {
	                      geval(entry.join(' '));
	                      /* geval(getExecutableScript(entry.join(' '), proxy)); */
	                      // geval(';(function(window){;'+entry.join(' ')+'\n})(window);');
	                      var exports = proxy[getGlobalProp(strictGlobal ? proxy : window)] || {};
	                      resolve(exports);
	                  }
	              }
	              catch (e) {
	                  console.error('error occurs while executing the entry ' + entry.join(' ') + '');
	                  console.error(e);
	              }
	          }
	          function schedule(i, resolvePromise) {
	              if (i < scripts.length) {
	                  var scriptSrc = scripts[i];
	                  var inlineScript = scriptsText[i]['scriptsText'];
	                  if (isMergeCache[keys]) {
	                      // 收集需要合并执行的js代码
	                      collectInlineScript(scriptSrc, inlineScript);
	                      schedule(i + 1, resolvePromise);
	                  }
	                  else {
	                      exec(scriptSrc, inlineScript, resolvePromise);
	                      if (!entryMain && i === scripts.length - 1) {
	                          resolvePromise();
	                      }
	                      else {
	                          schedule(i + 1, resolvePromise);
	                      }
	                  }
	              }
	              else {
	                  if (isMergeCache[keys]) {
	                      collectExec(resolvePromise);
	                  }
	              }
	          }
	          return new Promise(function (resolve) {
	              return schedule(0, resolve);
	          });
	      });
	  }
	  function importHTML(url, options) {
	      /* var getPublicPath = defaultGetPublicPath; */
	      if (options && typeof options === 'object') {
	          isMergeCache[url] = true;
	          if (options.excludeFiles !== undefined &&
	              Array.isArray(options.excludeFiles)) {
	              excludeFilesCache[url] = options.excludeFiles; // 排除在沙箱之外的js文件列表
	          }
	          if (options.isMerge !== undefined && typeof options.isMerge === 'boolean') {
	              isMergeCache[url] = options.isMerge;
	          }
	          /* getPublicPath = options.getPublicPath || options.getDomain || defaultGetPublicPath; */
	      }
	      return (embedHTMLCache[url] ||
	          /* (embedHTMLCache[url] = axios.get(url+'?version='+Date.parse(new Date().toString())+'') */
	          (embedHTMLCache[url] = fetch(transHttpUrl(url, Date.parse(new Date().toString())))
	              .then(function (response) {
	              return response.text();
	          })
	              .then(function (html) {
	              var assetPublicPath = getDomain(url) + '/';
	              var result = processTpl(html, getDomain(url));
	              var template = result.template;
	              var scripts = result.scripts;
	              var entry = result.entry;
	              var styles = result.styles;
	              var scriptList = {};
	              scriptList[url] = scripts;
	              return getEmbedHTML(template, styles).then(function (embedHTML) {
	                  return {
	                      template: embedHTML,
	                      assetPublicPath: assetPublicPath,
	                      getExternalScripts: function () {
	                          return getExternalScripts(scripts);
	                      },
	                      getExternalStyleSheets: function () {
	                          return getExternalStyleSheets(styles);
	                      },
	                      execScripts: function (proxy) {
	                          if (!scripts.length) {
	                              return Promise.resolve();
	                          }
	                          return execScripts(entry, scripts, proxy, url);
	                      },
	                      setExcludeFilesCache: function (entry, excludeFiles) {
	                          if (entry && typeof entry === 'string') {
	                              console.error('entry 入口文件不能为空');
	                              return;
	                          }
	                          if (excludeFiles &&
	                              Object.prototype.toString.call(excludeFiles) ===
	                                  '[object Array]') {
	                              excludeFilesCache[entry] = excludeFiles;
	                          }
	                      },
	                      getScripts: function () {
	                          return {
	                              scripts: scriptList,
	                              excludeFiles: excludeFilesCache,
	                          };
	                      },
	                  };
	              });
	          })));
	  }
	  function importEntry(entry) {
	      /* var getPublicPath =  defaultGetPublicPath; */
	      if (!entry) {
	          throw new SyntaxError('entry should not be empty!');
	      }
	      // html entry
	      if (typeof entry === 'string') {
	          return importHTML(entry);
	      }
	      // config entry
	      if (Array.isArray(entry.scripts) || Array.isArray(entry.styles)) {
	          /* 		var { scripts = [], styles = [], html = '' } = entry; */
	          var scripts = entry.scripts || [];
	          var styles = entry.styles || [];
	          var html = entry.html || '';
	          return getEmbedHTML(html, styles).then(function (embedHTML) {
	              return {
	                  template: embedHTML,
	                  assetPublicPath: '/',
	                  getExternalScripts: function () {
	                      return getExternalScripts(scripts);
	                  },
	                  getExternalStyleSheets: function () {
	                      return getExternalStyleSheets(styles);
	                  },
	                  execScripts: function (proxy) {
	                      return execScripts(scripts[scripts.length - 1], scripts, proxy);
	                  },
	              };
	          });
	      }
	      else {
	          throw new SyntaxError('entry scripts or styles should be array!');
	      }
	  }

	  exports.execScripts = execScripts;
	  exports.fetch = fetch;
	  exports.importEntry = importEntry;
	  exports.importHTML = importHTML;

	  Object.defineProperty(exports, '__esModule', { value: true });

	})));
	});

	unwrapExports(legionsImportHtmlEntry_umd);
	var legionsImportHtmlEntry_umd_1 = legionsImportHtmlEntry_umd.importHTML;
	var legionsImportHtmlEntry_umd_2 = legionsImportHtmlEntry_umd.importEntry;
	var legionsImportHtmlEntry_umd_3 = legionsImportHtmlEntry_umd.execScripts;

	var microApps = []; // {name:'',entry:'url',container:'DOMid',appId:'',styleId:'',loading:true}

	var scriptResources = {}; // {'entry':{scripts:[],scriptCache:[],sandbox:[],excludeSandboxFiles:[]}}

	/* let isImportHTML = false; */

	var externalOnloadScript = []; // [{url:'',code:''}] 已加载过外部资源列表

	var isPassCheckBrowser = false;
	var currentEnvironment = 'normal'; // 'normal'|'sandbox'  正常环境或沙盒

	var MicroApps =
	/** @class */
	function () {
	  /**
	     *Creates an instance of MicroApps.
	     * @param {*} options  {
	                excludeFiles:['vendor.dll.65dbcc8352253775138423bdeb0f0cdf.js'],
	                importHTML:'',
	                isMerge:false}
	     * @memberof MicroApps
	     */
	  function MicroApps(options) {
	    this.importHTMLOptions = {
	      excludeFiles: [],
	      isMerge: false
	    };

	    if (options && isObject$1(options)) {
	      /* if (options['importHTML']) {
	        this.importHTML = options['importHTML'];
	        //@ts-ignore
	        delete options['importHTML'];
	      } */
	      this.importHTMLOptions = {
	        excludeFiles: options['excludeFiles'] || [],
	        isMerge: options['isMerge'] || false
	      };
	    }
	  }

	  MicroApps.getStore = function () {
	    return {
	      apps: microApps,
	      scriptResources: scriptResources,
	      currentEnvironment: currentEnvironment,
	      externalOnloadScript: externalOnloadScript
	    };
	  };

	  MicroApps.prototype.getApps = function () {
	    return {
	      apps: microApps,
	      scriptResources: scriptResources,
	      currentEnvironment: currentEnvironment,
	      externalOnloadScript: externalOnloadScript
	    };
	  };

	  MicroApps.prototype.isRegister = function (apps) {
	    var unregisteredApps = microApps.filter(function (item) {
	      return item.name === apps.name;
	    });

	    if (unregisteredApps.length > 0) {
	      return unregisteredApps;
	    }

	    return null;
	  };

	  MicroApps.prototype.register = function (apps) {
	    if (Array.isArray(apps)) {
	      var unregisteredApps = apps.filter(function (app) {
	        return !microApps.some(function (registeredApp) {
	          return registeredApp.name === app.name;
	        });
	      });
	      microApps = __spread(microApps, unregisteredApps);
	    }
	  };

	  MicroApps.prototype.addRender = function (app) {
	    microApps.forEach(function (item) {
	      if (item.name === app.name && !item.render) {
	        item.render = app.render;
	      }
	    });
	  };

	  MicroApps.prototype.mounted = function (apps) {
	    var _this = this;

	    var that = this;

	    if (!isPassCheckBrowser) {
	      //@ts-ignore
	      isPassCheckBrowser = checkBrowser();
	    }

	    var sourceUrl = apps['entry'];
	    var appId = apps.appId;
	    var container = apps.container || 'reactSandboxWrap';

	    if (!appId) {
	      console.error('请先设置应用appId信息');
	      return;
	    }

	    if (!sourceUrl) {
	      console.error('请先设置应用入口地址entry信息');
	      return;
	    }

	    var styleId = apps.styleId;

	    var isCheckRegister = function isCheckRegister() {
	      var oldApps = _this.isRegister(apps);

	      if (!oldApps) {
	        microApps = __spread(microApps, [apps]);
	      } else {
	        apps = oldApps[0];
	      }
	    };

	    isCheckRegister.call(that);

	    function renderStyles(styles) {
	      if (styles === void 0) {
	        styles = [];
	      }

	      styles.forEach(function (item) {
	        var style = document.createElement('style');
	        var styleWrap = document.getElementById(styleId);
	        style.innerHTML = item; //@ts-ignore

	        styleWrap.appendChild(style);
	      });
	    }

	    function main() {
	      /* if (reactSandboxList && reactSandboxList.indexOf(sourceUrl)>-1) return; */
	      if (scriptResources && scriptResources.hasOwnProperty(sourceUrl)) {
	        currentEnvironment = 'sandbox';
	        apps.render && apps.render();
	        renderStyles(scriptResources[sourceUrl]['styles']);
	        return;
	      }

	      legionsImportHtmlEntry_umd_1(sourceUrl,
	      /* {
	              excludeFiles:['vendor.dll.js'],
	              isMerge:false,
	          } */
	      that.importHTMLOptions || {}).then(function (res) {
	        /** 添加标记，防止重复加载 */
	        res.getExternalScripts().then(function (exports) {
	          if (res.getScripts) {
	            /** // {excludeFiles:{url:['']},
	             * scripts:{url:[]}} */
	            var scriptList = res.getScripts();
	            var excludeFiles_1 = [];
	            var _scripts = scriptList['scripts'];
	            var scriptCache_1 = [];

	            if (exports && Object.prototype.toString.call(exports) === '[object Array]') {
	              exports.forEach(function (item) {
	                scriptCache_1.push({
	                  key: item.scripts,
	                  code: item['scriptsText']
	                });
	              });
	            }

	            if (scriptList['excludeFiles'].hasOwnProperty(sourceUrl)) {
	              scriptList['excludeFiles'][sourceUrl].forEach(function (item) {
	                scriptCache_1.forEach(function (entity) {
	                  var _index = entity.key.indexOf(item);

	                  if (_index > -1) {
	                    excludeFiles_1.push({
	                      url: entity.key,
	                      code: entity.code
	                    });
	                  }
	                });
	              });
	            }

	            scriptResources[sourceUrl] = {
	              scripts: scriptList['scripts'][sourceUrl],
	              scriptCache: scriptCache_1,
	              excludeSandboxFiles: excludeFiles_1,
	              sandbox: [],
	              styles: []
	            };

	            if (_scripts.hasOwnProperty(sourceUrl)) {
	              _scripts[sourceUrl].forEach(function (item) {
	                excludeFiles_1.forEach(function (entity) {
	                  if (entity) {
	                    var _index = entity.url.indexOf(item);

	                    if (_index < 0) {
	                      scriptResources[sourceUrl]['sandbox'].push(item);
	                    }
	                  }
	                });
	              });
	            }

	            var promiseLoadScript_1 = [];
	            excludeFiles_1.forEach(function (item) {
	              var fn = function fn() {
	                var p = new Promise(function (resolve, reject) {
	                  onloadScript(item.url, function () {
	                    scriptResources[sourceUrl].scriptCache.forEach(function (s) {
	                      if (s.key === item.url) {
	                        externalOnloadScript.push({
	                          url: item.url,
	                          code: s.code
	                        });
	                        resolve(externalOnloadScript);
	                      }
	                    });
	                  });
	                });
	                promiseLoadScript_1.push(p);
	              };

	              if (!externalOnloadScript.length) {
	                // 如果外部加载资源项为空，则直接加载资源
	                fn();
	              } else {
	                externalOnloadScript.forEach(function (entry) {
	                  var _index = entry.url.indexOf(item.url); // 判定资源名称及资源代码字符串是否一致，如果一样，则表示资源已经加载过，不需要重复加载


	                  if (_index < 0 && entry.code !== item.code) {
	                    fn();
	                  }
	                });
	              }
	            });
	            Promise.all(promiseLoadScript_1).then(function (values) {
	              res.execScripts().then(function () {
	                isCheckRegister.call(that);
	                currentEnvironment = 'sandbox';
	                apps.render && apps.render();
	              });
	              res.getExternalStyleSheets().then(function (exports) {
	                if (scriptResources[sourceUrl]['styles'].length) {
	                  scriptResources[sourceUrl]['styles'] = [];
	                }

	                exports.forEach(function (item) {
	                  scriptResources[sourceUrl]['styles'].push(item);
	                  var style = document.createElement('style');
	                  var styleWrap = document.getElementById(styleId);
	                  style.innerHTML = item; //@ts-ignore

	                  styleWrap.appendChild(style);
	                });
	              });
	            });
	          }
	        });
	      });
	    }
	    /** 环境准备，加载import-html-entry.js，创建模块渲染节点，创建样式节点 */


	    var wrap = document.getElementById(container) || document.getElementsByClassName(container);
	    var style = document.createElement('div');
	    var app = document.createElement('div');
	    /* script.src = 'https://hoolinks.com/static/common/plugins/import-html-entry.js'; */

	    style.id = styleId;
	    app.id = appId;

	    if (apps.loading) {
	      app.innerHTML = '<div class="preloader"><div class="cs-loader"><div class="cs-loader-inner"><label> ●</label><label> ●</label><label> ●</label><label> ●</label><label> ●</label><label> ●</label></div></div></div><style type="text/css">.reactSandboxWrap{position:relative;min-height: 100%;}.tab-right{padding: 0!important;}.preloader{position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;background:#1890ff;z-index:9999;transition:opacity .65s}.preloader-hidden-add{opacity:1;display:block}.preloader-hidden-add-active{opacity:0}.preloader-hidden{display:none}.cs-loader{position:absolute;top:0;left:0;height:100%;width:100%}.cs-loader-inner{transform:translateY(-50%);top:50%;position:absolute;width:100%;color:#fff;text-align:center}.cs-loader-inner label{font-size:20px;opacity:0;display:inline-block}@keyframes lol{0%{opacity:0;transform:translateX(-300px)}33%{opacity:1;transform:translateX(0)}66%{opacity:1;transform:translateX(0)}100%{opacity:0;transform:translateX(300px)}}.cs-loader-inner label:nth-child(6){animation:lol 3s infinite ease-in-out}.cs-loader-inner label:nth-child(5){animation:lol 3s .1s infinite ease-in-out}.cs-loader-inner label:nth-child(4){animation:lol 3s .2s infinite ease-in-out}.cs-loader-inner label:nth-child(3){animation:lol 3s .3s infinite ease-in-out}.cs-loader-inner label:nth-child(2){animation:lol 3s .4s infinite ease-in-out}.cs-loader-inner label:nth-child(1){animation:lol 3s .5s infinite ease-in-out}</style>';
	    }
	    /** 插入app节点和样式节点 */


	    if (wrap) {
	      if (wrap instanceof HTMLCollection) {
	        if (wrap[0]) {
	          !document.getElementById(style.id) && wrap[0].appendChild(style);
	          !document.getElementById(app.id) && wrap[0].appendChild(app);
	        } else {
	          !document.getElementById(style.id) && document.body.appendChild(style);
	          !document.getElementById(app.id) && document.body.appendChild(app);
	        }
	      } else {
	        //@ts-ignore
	        !document.getElementById(style.id) && wrap.appendChild(style); //@ts-ignore

	        !document.getElementById(app.id) && wrap.appendChild(app);
	      }
	    } else {
	      !document.getElementById(style.id) && document.body.appendChild(style);
	      !document.getElementById(app.id) && document.body.appendChild(app);
	    }

	    main.call(that);
	  };

	  return MicroApps;
	}();

	var _typeof_1 = createCommonjsModule(function (module) {
	function _typeof(obj) {
	  "@babel/helpers - typeof";

	  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	    module.exports = _typeof = function _typeof(obj) {
	      return typeof obj;
	    };
	  } else {
	    module.exports = _typeof = function _typeof(obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	    };
	  }

	  return _typeof(obj);
	}

	module.exports = _typeof;
	});

	/**
	 * This method returns `undefined`.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.3.0
	 * @category Util
	 * @example
	 *
	 * _.times(2, _.noop);
	 * // => [undefined, undefined]
	 */
	function noop() {
	  // No operation performed.
	}

	var noop_1 = noop;

	/* single-spa@5.8.1 - ESM - prod */
	var t=Object.freeze({__proto__:null,get start(){return xt},get ensureJQuerySupport(){return ft},get setBootstrapMaxTime(){return F},get setMountMaxTime(){return J},get setUnmountMaxTime(){return H},get setUnloadMaxTime(){return Q},get registerApplication(){return Pt},get unregisterApplication(){return Tt},get getMountedApps(){return Et},get getAppStatus(){return Ot},get unloadApplication(){return At},get checkActivityFunctions(){return bt},get getAppNames(){return yt},get pathToActiveWhen(){return _t},get navigateToUrl(){return nt},get triggerAppChange(){return Mt},get addErrorHandler(){return a},get removeErrorHandler(){return c},get mountRootParcel(){return C},get NOT_LOADED(){return l},get LOADING_SOURCE_CODE(){return p},get NOT_BOOTSTRAPPED(){return h},get BOOTSTRAPPING(){return m},get NOT_MOUNTED(){return d},get MOUNTING(){return v},get UPDATING(){return g},get LOAD_ERROR(){return y},get MOUNTED(){return w},get UNMOUNTING(){return E},get SKIP_BECAUSE_BROKEN(){return O}});function n(t){return (n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function e(t,n,e){return n in t?Object.defineProperty(t,n,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[n]=e,t}var r=("undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{}).CustomEvent,o=function(){try{var t=new r("cat",{detail:{foo:"bar"}});return "cat"===t.type&&"bar"===t.detail.foo}catch(t){}return !1}()?r:"undefined"!=typeof document&&"function"==typeof document.createEvent?function(t,n){var e=document.createEvent("CustomEvent");return n?e.initCustomEvent(t,n.bubbles,n.cancelable,n.detail):e.initCustomEvent(t,!1,!1,void 0),e}:function(t,n){var e=document.createEventObject();return e.type=t,n?(e.bubbles=Boolean(n.bubbles),e.cancelable=Boolean(n.cancelable),e.detail=n.detail):(e.bubbles=!1,e.cancelable=!1,e.detail=void 0),e},i=[];function u(t,n,e){var r=f$7(t,n,e);i.length?i.forEach((function(t){return t(r)})):setTimeout((function(){throw r}));}function a(t){if("function"!=typeof t)throw Error(s(28,!1));i.push(t);}function c(t){if("function"!=typeof t)throw Error(s(29,!1));var n=!1;return i=i.filter((function(e){var r=e===t;return n=n||r,!r})),n}function s(t,n){for(var e=arguments.length,r=new Array(e>2?e-2:0),o=2;o<e;o++)r[o-2]=arguments[o];return "single-spa minified message #".concat(t,": ").concat(n?n+" ":"","See https://single-spa.js.org/error/?code=").concat(t).concat(r.length?"&arg=".concat(r.join("&arg=")):"")}function f$7(t,n,e){var r,o="".concat(N(n)," '").concat(T(n),"' died in status ").concat(n.status,": ");if(t instanceof Error){try{t.message=o+t.message;}catch(t){}r=t;}else {console.warn(s(30,!1,n.status,T(n)));try{r=Error(o+JSON.stringify(t));}catch(n){r=t;}}return r.appOrParcelName=T(n),n.status=e,r}var l="NOT_LOADED",p="LOADING_SOURCE_CODE",h="NOT_BOOTSTRAPPED",m="BOOTSTRAPPING",d="NOT_MOUNTED",v="MOUNTING",w="MOUNTED",g="UPDATING",E="UNMOUNTING",y="LOAD_ERROR",O="SKIP_BECAUSE_BROKEN";function P(t){return t.status===w}function b(t){try{return t.activeWhen(window.location)}catch(n){return u(n,t,O),!1}}function T(t){return t.name}function A(t){return Boolean(t.unmountThisParcel)}function N(t){return A(t)?"parcel":"application"}function S(){for(var t=arguments.length-1;t>0;t--)for(var n in arguments[t])"__proto__"!==n&&(arguments[t-1][n]=arguments[t][n]);return arguments[0]}function _(t,n){for(var e=0;e<t.length;e++)if(n(t[e]))return t[e];return null}function D(t){return t&&("function"==typeof t||(n=t,Array.isArray(n)&&!_(n,(function(t){return "function"!=typeof t}))));var n;}function U(t,n){var e=t[n]||[];0===(e=Array.isArray(e)?e:[e]).length&&(e=[function(){return Promise.resolve()}]);var r=N(t),o=T(t);return function(t){return e.reduce((function(e,i,u){return e.then((function(){var e=i(t);return j(e)?e:Promise.reject(s(15,!1,r,o,n,u))}))}),Promise.resolve())}}function j(t){return t&&"function"==typeof t.then&&"function"==typeof t.catch}function M(t,n){return Promise.resolve().then((function(){return t.status!==h?t:(t.status=m,t.bootstrap?V(t,"bootstrap").then(e).catch((function(e){if(n)throw f$7(e,t,O);return u(e,t,O),t})):Promise.resolve().then(e))}));function e(){return t.status=d,t}}function L(t,n){return Promise.resolve().then((function(){if(t.status!==w)return t;t.status=E;var e=Object.keys(t.parcels).map((function(n){return t.parcels[n].unmountThisParcel()}));return Promise.all(e).then(r,(function(e){return r().then((function(){var r=Error(e.message);if(n)throw f$7(r,t,O);u(r,t,O);}))})).then((function(){return t}));function r(){return V(t,"unmount").then((function(){t.status=d;})).catch((function(e){if(n)throw f$7(e,t,O);u(e,t,O);}))}}))}var R=!1,I=!1;function x(t,n){return Promise.resolve().then((function(){return t.status!==d?t:(R||(window.dispatchEvent(new o("single-spa:before-first-mount")),R=!0),V(t,"mount").then((function(){return t.status=w,I||(window.dispatchEvent(new o("single-spa:first-mount")),I=!0),t})).catch((function(e){return t.status=w,L(t,!0).then(r,r);function r(){if(n)throw f$7(e,t,O);return u(e,t,O),t}})))}))}var B=0,G={parcels:{}};function C(){return W.apply(G,arguments)}function W(t,e){var r=this;if(!t||"object"!==n(t)&&"function"!=typeof t)throw Error(s(2,!1));if(t.name&&"string"!=typeof t.name)throw Error(s(3,!1,n(t.name)));if("object"!==n(e))throw Error(s(4,!1,name,n(e)));if(!e.domElement)throw Error(s(5,!1,name));var o,i=B++,u="function"==typeof t,a=u?t:function(){return Promise.resolve(t)},c={id:i,parcels:{},status:u?p:h,customProps:e,parentName:T(r),unmountThisParcel:function(){if(c.status!==w)throw Error(s(6,!1,name,c.status));return L(c,!0).then((function(t){return c.parentName&&delete r.parcels[c.id],t})).then((function(t){return m(t),t})).catch((function(t){throw c.status=O,v(t),t}))}};r.parcels[i]=c;var l=a();if(!l||"function"!=typeof l.then)throw Error(s(7,!1));var m,v,E=(l=l.then((function(t){if(!t)throw Error(s(8,!1));var n=t.name||"parcel-".concat(i);if(Object.prototype.hasOwnProperty.call(t,"bootstrap")&&!D(t.bootstrap))throw Error(s(9,!1,n));if(!D(t.mount))throw Error(s(10,!1,n));if(!D(t.unmount))throw Error(s(11,!1,n));if(t.update&&!D(t.update))throw Error(s(12,!1,n));var e=U(t,"bootstrap"),r=U(t,"mount"),u=U(t,"unmount");c.status=h,c.name=n,c.bootstrap=e,c.mount=r,c.unmount=u,c.timeouts=q(t.timeouts),t.update&&(c.update=U(t,"update"),o.update=function(t){return c.customProps=t,$(function(t){return Promise.resolve().then((function(){if(t.status!==w)throw Error(s(32,!1,T(t)));return t.status=g,V(t,"update").then((function(){return t.status=w,t})).catch((function(n){throw f$7(n,t,O)}))}))}(c))});}))).then((function(){return M(c,!0)})),y=E.then((function(){return x(c,!0)})),P=new Promise((function(t,n){m=t,v=n;}));return o={mount:function(){return $(Promise.resolve().then((function(){if(c.status!==d)throw Error(s(13,!1,name,c.status));return r.parcels[i]=c,x(c)})))},unmount:function(){return $(c.unmountThisParcel())},getStatus:function(){return c.status},loadPromise:$(l),bootstrapPromise:$(E),mountPromise:$(y),unmountPromise:$(P)}}function $(t){return t.then((function(){return null}))}function k(e){var r=T(e),o="function"==typeof e.customProps?e.customProps(r,window.location):e.customProps;("object"!==n(o)||null===o||Array.isArray(o))&&(o={},console.warn(s(40,!1),r,o));var i=S({},o,{name:r,mountParcel:W.bind(e),singleSpa:t});return A(e)&&(i.unmountSelf=e.unmountThisParcel),i}var K={bootstrap:{millis:4e3,dieOnTimeout:!1,warningMillis:1e3},mount:{millis:3e3,dieOnTimeout:!1,warningMillis:1e3},unmount:{millis:3e3,dieOnTimeout:!1,warningMillis:1e3},unload:{millis:3e3,dieOnTimeout:!1,warningMillis:1e3},update:{millis:3e3,dieOnTimeout:!1,warningMillis:1e3}};function F(t,n,e){if("number"!=typeof t||t<=0)throw Error(s(16,!1));K.bootstrap={millis:t,dieOnTimeout:n,warningMillis:e||1e3};}function J(t,n,e){if("number"!=typeof t||t<=0)throw Error(s(17,!1));K.mount={millis:t,dieOnTimeout:n,warningMillis:e||1e3};}function H(t,n,e){if("number"!=typeof t||t<=0)throw Error(s(18,!1));K.unmount={millis:t,dieOnTimeout:n,warningMillis:e||1e3};}function Q(t,n,e){if("number"!=typeof t||t<=0)throw Error(s(19,!1));K.unload={millis:t,dieOnTimeout:n,warningMillis:e||1e3};}function V(t,n){var e=t.timeouts[n],r=e.warningMillis,o=N(t);return new Promise((function(i,u){var a=!1,c=!1;t[n](k(t)).then((function(t){a=!0,i(t);})).catch((function(t){a=!0,u(t);})),setTimeout((function(){return l(1)}),r),setTimeout((function(){return l(!0)}),e.millis);var f=s(31,!1,n,o,T(t),e.millis);function l(t){if(!a)if(!0===t)c=!0,e.dieOnTimeout?u(Error(f)):console.error(f);else if(!c){var n=t,o=n*r;console.warn(f),o+r<e.millis&&setTimeout((function(){return l(n+1)}),r);}}}))}function q(t){var n={};for(var e in K)n[e]=S({},K[e],t&&t[e]||{});return n}function z(t){return Promise.resolve().then((function(){return t.loadPromise?t.loadPromise:t.status!==l&&t.status!==y?t:(t.status=p,t.loadPromise=Promise.resolve().then((function(){var o=t.loadApp(k(t));if(!j(o))throw r=!0,Error(s(33,!1,T(t)));return o.then((function(r){var o;t.loadErrorTime=null,"object"!==n(e=r)&&(o=34),Object.prototype.hasOwnProperty.call(e,"bootstrap")&&!D(e.bootstrap)&&(o=35),D(e.mount)||(o=36),D(e.unmount)||(o=37);var i=N(e);if(o){var a;try{a=JSON.stringify(e);}catch(t){}return console.error(s(o,!1,i,T(t),a),e),u(void 0,t,O),t}return e.devtools&&e.devtools.overlays&&(t.devtools.overlays=S({},t.devtools.overlays,e.devtools.overlays)),t.status=h,t.bootstrap=U(e,"bootstrap"),t.mount=U(e,"mount"),t.unmount=U(e,"unmount"),t.unload=U(e,"unload"),t.timeouts=q(e.timeouts),delete t.loadPromise,t}))})).catch((function(n){var e;return delete t.loadPromise,r?e=O:(e=y,t.loadErrorTime=(new Date).getTime()),u(n,t,e),t})));var e,r;}))}var X,Y="undefined"!=typeof window,Z={hashchange:[],popstate:[]},tt=["hashchange","popstate"];function nt(t){var n;if("string"==typeof t)n=t;else if(this&&this.href)n=this.href;else {if(!(t&&t.currentTarget&&t.currentTarget.href&&t.preventDefault))throw Error(s(14,!1));n=t.currentTarget.href,t.preventDefault();}var e=ct(window.location.href),r=ct(n);0===n.indexOf("#")?window.location.hash=r.hash:e.host!==r.host&&r.host?window.location.href=n:r.pathname===e.pathname&&r.search===e.search?window.location.hash=r.hash:window.history.pushState(null,null,n);}function et(t){var n=this;if(t){var e=t[0].type;tt.indexOf(e)>=0&&Z[e].forEach((function(e){try{e.apply(n,t);}catch(t){setTimeout((function(){throw t}));}}));}}function rt(){Lt([],arguments);}function ot(t,n){return function(){var e=window.location.href,r=t.apply(this,arguments),o=window.location.href;return X&&e===o||window.dispatchEvent(it(window.history.state,n)),r}}function it(t,n){var e;try{e=new PopStateEvent("popstate",{state:t});}catch(n){(e=document.createEvent("PopStateEvent")).initPopStateEvent("popstate",!1,!1,t);}return e.singleSpa=!0,e.singleSpaTrigger=n,e}if(Y){window.addEventListener("hashchange",rt),window.addEventListener("popstate",rt);var ut=window.addEventListener,at=window.removeEventListener;window.addEventListener=function(t,n){if(!("function"==typeof n&&tt.indexOf(t)>=0)||_(Z[t],(function(t){return t===n})))return ut.apply(this,arguments);Z[t].push(n);},window.removeEventListener=function(t,n){if(!("function"==typeof n&&tt.indexOf(t)>=0))return at.apply(this,arguments);Z[t]=Z[t].filter((function(t){return t!==n}));},window.history.pushState=ot(window.history.pushState,"pushState"),window.history.replaceState=ot(window.history.replaceState,"replaceState"),window.singleSpaNavigate?console.warn(s(41,!1)):window.singleSpaNavigate=nt;}function ct(t){var n=document.createElement("a");return n.href=t,n}var st=!1;function ft(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:window.jQuery;if(t||window.$&&window.$.fn&&window.$.fn.jquery&&(t=window.$),t&&!st){var n=t.fn.on,e=t.fn.off;t.fn.on=function(t,e){return lt.call(this,n,window.addEventListener,t,e,arguments)},t.fn.off=function(t,n){return lt.call(this,e,window.removeEventListener,t,n,arguments)},st=!0;}}function lt(t,n,e,r,o){return "string"!=typeof e?t.apply(this,o):(e.split(/\s+/).forEach((function(t){tt.indexOf(t)>=0&&(n(t,r),e=e.replace(t,""));})),""===e.trim()?this:t.apply(this,o))}var pt={};function ht(t){return Promise.resolve().then((function(){var n=pt[T(t)];return n?t.status===l?(mt(t,n),t):"UNLOADING"===t.status?n.promise.then((function(){return t})):t.status!==d?t:(t.status="UNLOADING",V(t,"unload").then((function(){return mt(t,n),t})).catch((function(e){return function(t,n,e){delete pt[T(t)],delete t.bootstrap,delete t.mount,delete t.unmount,delete t.unload,u(e,t,O),n.reject(e);}(t,n,e),t}))):t}))}function mt(t,n){delete pt[T(t)],delete t.bootstrap,delete t.mount,delete t.unmount,delete t.unload,t.status=l,n.resolve();}function dt(t,n,e,r){pt[T(t)]={app:t,resolve:e,reject:r},Object.defineProperty(pt[T(t)],"promise",{get:n});}function vt(t){return pt[t]}var wt=[];function gt(){var t=[],n=[],e=[],r=[],o=(new Date).getTime();return wt.forEach((function(i){var u=i.status!==O&&b(i);switch(i.status){case y:u&&o-i.loadErrorTime>=200&&e.push(i);break;case l:case p:u&&e.push(i);break;case h:case d:!u&&vt(T(i))?t.push(i):u&&r.push(i);break;case w:u||n.push(i);}})),{appsToUnload:t,appsToUnmount:n,appsToLoad:e,appsToMount:r}}function Et(){return wt.filter(P).map(T)}function yt(){return wt.map(T)}function Ot(t){var n=_(wt,(function(n){return T(n)===t}));return n?n.status:null}function Pt(t,e,r,o){var i=function(t,e,r,o){var i,u={name:null,loadApp:null,activeWhen:null,customProps:null};return "object"===n(t)?(function(t){if(Array.isArray(t)||null===t)throw Error(s(39,!1));var e=["name","app","activeWhen","customProps"],r=Object.keys(t).reduce((function(t,n){return e.indexOf(n)>=0?t:t.concat(n)}),[]);if(0!==r.length)throw Error(s(38,!1,e.join(", "),r.join(", ")));if("string"!=typeof t.name||0===t.name.length)throw Error(s(20,!1));if("object"!==n(t.app)&&"function"!=typeof t.app)throw Error(s(20,!1));var o=function(t){return "string"==typeof t||"function"==typeof t};if(!(o(t.activeWhen)||Array.isArray(t.activeWhen)&&t.activeWhen.every(o)))throw Error(s(24,!1));if(!St(t.customProps))throw Error(s(22,!1))}(t),u.name=t.name,u.loadApp=t.app,u.activeWhen=t.activeWhen,u.customProps=t.customProps):(function(t,n,e,r){if("string"!=typeof t||0===t.length)throw Error(s(20,!1));if(!n)throw Error(s(23,!1));if("function"!=typeof e)throw Error(s(24,!1));if(!St(r))throw Error(s(22,!1))}(t,e,r,o),u.name=t,u.loadApp=e,u.activeWhen=r,u.customProps=o),u.loadApp="function"!=typeof(i=u.loadApp)?function(){return Promise.resolve(i)}:i,u.customProps=function(t){return t||{}}(u.customProps),u.activeWhen=function(t){var n=Array.isArray(t)?t:[t];return n=n.map((function(t){return "function"==typeof t?t:_t(t)})),function(t){return n.some((function(n){return n(t)}))}}(u.activeWhen),u}(t,e,r,o);if(-1!==yt().indexOf(i.name))throw Error(s(21,!1,i.name));wt.push(S({loadErrorTime:null,status:l,parcels:{},devtools:{overlays:{options:{},selectors:[]}}},i)),Y&&(ft(),Lt());}function bt(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:window.location;return wt.filter((function(n){return n.activeWhen(t)})).map(T)}function Tt(t){if(0===wt.filter((function(n){return T(n)===t})).length)throw Error(s(25,!1,t));return At(t).then((function(){var n=wt.map(T).indexOf(t);wt.splice(n,1);}))}function At(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{waitForUnmount:!1};if("string"!=typeof t)throw Error(s(26,!1));var e=_(wt,(function(n){return T(n)===t}));if(!e)throw Error(s(27,!1,t));var r,o=vt(T(e));if(n&&n.waitForUnmount){if(o)return o.promise;var i=new Promise((function(t,n){dt(e,(function(){return i}),t,n);}));return i}return o?(r=o.promise,Nt(e,o.resolve,o.reject)):r=new Promise((function(t,n){dt(e,(function(){return r}),t,n),Nt(e,t,n);})),r}function Nt(t,n,e){L(t).then(ht).then((function(){n(),setTimeout((function(){Lt();}));})).catch(e);}function St(t){return !t||"function"==typeof t||"object"===n(t)&&null!==t&&!Array.isArray(t)}function _t(t){var n=function(t){var n=0,e=!1,r="^";"/"!==t[0]&&(t="/"+t);for(var o=0;o<t.length;o++){var i=t[o];(!e&&":"===i||e&&"/"===i)&&u(o);}return u(t.length),new RegExp(r,"i");function u(o){var i=t.slice(n,o).replace(/[|\\{}()[\]^$+*?.]/g,"\\$&");r+=e?"[^/]+/?":i,o!==t.length||e||(r="/"===r.charAt(r.length-1)?"".concat(r,".*$"):"".concat(r,"([/#].*)?$")),e=!e,n=o;}}(t);return function(t){var e=t.href.replace(t.origin,"").replace(t.search,"").split("?")[0];return n.test(e)}}var Dt=!1,Ut=[],jt=Y&&window.location.href;function Mt(){return Lt()}function Lt(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],n=arguments.length>1?arguments[1]:void 0;if(Dt)return new Promise((function(t,e){Ut.push({resolve:t,reject:e,eventArguments:n});}));var r,i=gt(),u=i.appsToUnload,a=i.appsToUnmount,c=i.appsToLoad,s=i.appsToMount,f=!1,p=jt,h=jt=window.location.href;return Bt()?(Dt=!0,r=u.concat(c,a,s),g()):(r=c,v());function m(){f=!0;}function v(){return Promise.resolve().then((function(){var t=c.map(z);return Promise.all(t).then(y).then((function(){return []})).catch((function(t){throw y(),t}))}))}function g(){return Promise.resolve().then((function(){if(window.dispatchEvent(new o(0===r.length?"single-spa:before-no-app-change":"single-spa:before-app-change",P(!0))),window.dispatchEvent(new o("single-spa:before-routing-event",P(!0,{cancelNavigation:m}))),f)return window.dispatchEvent(new o("single-spa:before-mount-routing-event",P(!0))),E(),void nt(p);var n=u.map(ht),e=a.map(L).map((function(t){return t.then(ht)})).concat(n),i=Promise.all(e);i.then((function(){window.dispatchEvent(new o("single-spa:before-mount-routing-event",P(!0)));}));var l=c.map((function(t){return z(t).then((function(t){return Rt(t,i)}))})),h=s.filter((function(t){return c.indexOf(t)<0})).map((function(t){return Rt(t,i)}));return i.catch((function(t){throw y(),t})).then((function(){return y(),Promise.all(l.concat(h)).catch((function(n){throw t.forEach((function(t){return t.reject(n)})),n})).then(E)}))}))}function E(){var n=Et();t.forEach((function(t){return t.resolve(n)}));try{var e=0===r.length?"single-spa:no-app-change":"single-spa:app-change";window.dispatchEvent(new o(e,P())),window.dispatchEvent(new o("single-spa:routing-event",P()));}catch(t){setTimeout((function(){throw t}));}if(Dt=!1,Ut.length>0){var i=Ut;Ut=[],Lt(i);}return n}function y(){t.forEach((function(t){et(t.eventArguments);})),et(n);}function P(){var t,o=arguments.length>0&&void 0!==arguments[0]&&arguments[0],i=arguments.length>1?arguments[1]:void 0,m={},v=(e(t={},w,[]),e(t,d,[]),e(t,l,[]),e(t,O,[]),t);o?(c.concat(s).forEach((function(t,n){E(t,w);})),u.forEach((function(t){E(t,l);})),a.forEach((function(t){E(t,d);}))):r.forEach((function(t){E(t);}));var g={detail:{newAppStatuses:m,appsByNewStatus:v,totalAppChanges:r.length,originalEvent:null==n?void 0:n[0],oldUrl:p,newUrl:h,navigationIsCanceled:f}};return i&&S(g.detail,i),g;function E(t,n){var e=T(t);n=n||Ot(e),m[e]=n,(v[n]=v[n]||[]).push(e);}}}function Rt(t,n){return b(t)?M(t).then((function(t){return n.then((function(){return b(t)?x(t):t}))})):n.then((function(){return t}))}var It=!1;function xt(t){var n;It=!0,t&&t.urlRerouteOnly&&(n=t.urlRerouteOnly,X=n),Y&&Lt();}function Bt(){return It}Y&&setTimeout((function(){It||console.warn(s(1,!1));}),5e3);var Gt={getRawAppData:function(){return [].concat(wt)},reroute:Lt,NOT_LOADED:l,toLoadPromise:z,toBootstrapPromise:M,unregisterApplication:Tt};Y&&window.__SINGLE_SPA_DEVTOOLS__&&(window.__SINGLE_SPA_DEVTOOLS__.exposedMethods=Gt);

	var $includes = arrayIncludes.includes;



	var USES_TO_LENGTH$4 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

	// `Array.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.includes
	_export({ target: 'Array', proto: true, forced: !USES_TO_LENGTH$4 }, {
	  includes: function includes(el /* , fromIndex = 0 */) {
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('includes');

	// `Date.now` method
	// https://tc39.github.io/ecma262/#sec-date.now
	_export({ target: 'Date', stat: true }, {
	  now: function now() {
	    return new Date().getTime();
	  }
	});

	var MATCH = wellKnownSymbol('match');

	// `IsRegExp` abstract operation
	// https://tc39.github.io/ecma262/#sec-isregexp
	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
	};

	var notARegexp = function (it) {
	  if (isRegexp(it)) {
	    throw TypeError("The method doesn't accept regular expressions");
	  } return it;
	};

	var MATCH$1 = wellKnownSymbol('match');

	var correctIsRegexpLogic = function (METHOD_NAME) {
	  var regexp = /./;
	  try {
	    '/./'[METHOD_NAME](regexp);
	  } catch (e) {
	    try {
	      regexp[MATCH$1] = false;
	      return '/./'[METHOD_NAME](regexp);
	    } catch (f) { /* empty */ }
	  } return false;
	};

	// `String.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.includes
	_export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') }, {
	  includes: function includes(searchString /* , position = 0 */) {
	    return !!~String(requireObjectCoercible(this))
	      .indexOf(notARegexp(searchString), arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var requestIdleCallback = window.requestIdleCallback || function requestIdleCallback(cb) {
	  var start = Date.now();
	  return setTimeout(function () {
	    cb({
	      didTimeout: false,
	      timeRemaining: function timeRemaining() {
	        return Math.max(0, 50 - (Date.now() - start));
	      }
	    });
	  }, 1);
	};

	var isSlowNetwork = navigator.connection ? navigator.connection.saveData || navigator.connection.type !== 'wifi' && navigator.connection.type !== 'ethernet' && /(2|3)g/.test(navigator.connection.effectiveType) : false;
	/**
	 * prefetch assets, do nothing while in mobile network
	 * @param entry
	 * @param opts
	 */

	function prefetch(entry, opts) {
	  var _this = this;

	  if (!navigator.onLine || isSlowNetwork) {
	    // Don't prefetch if in a slow network or offline
	    return;
	  }

	  requestIdleCallback(function () {
	    return __awaiter(_this, void 0, void 0, function () {
	      var _a, getExternalScripts, getExternalStyleSheets;

	      return __generator(this, function (_b) {
	        switch (_b.label) {
	          case 0:
	            return [4
	            /*yield*/
	            , legionsImportHtmlEntry_umd_1(entry, opts)];

	          case 1:
	            _a = _b.sent(), getExternalScripts = _a.getExternalScripts, getExternalStyleSheets = _a.getExternalStyleSheets;
	            requestIdleCallback(getExternalStyleSheets);
	            requestIdleCallback(getExternalScripts);
	            return [2
	            /*return*/
	            ];
	        }
	      });
	    });
	  });
	}

	function prefetchAfterFirstMounted(apps, opts) {
	  window.addEventListener('single-spa:first-mount', function listener() {
	    var notLoadedApps = apps.filter(function (app) {
	      return Ot(app.name) === l;
	    }); //@ts-ignore

	    console.log(notLoadedApps, apps, 'notLoadedApps');
	    notLoadedApps.forEach(function (_a) {
	      var entry = _a.entry;
	      return prefetch(entry, opts);
	    });
	    window.removeEventListener('single-spa:first-mount', listener);
	  });
	}

	function prefetchImmediately(apps, opts) {

	  apps.forEach(function (_a) {
	    var entry = _a.entry;
	    return prefetch(entry, opts);
	  });
	}
	function doPrefetchStrategy(apps, prefetchStrategy, importEntryOpts) {
	  var appsName2Apps = function appsName2Apps(names) {
	    return apps.filter(function (app) {
	      return names.includes(app.name);
	    });
	  };

	  if (Array.isArray(prefetchStrategy)) {
	    prefetchAfterFirstMounted(appsName2Apps(prefetchStrategy), importEntryOpts);
	  } else {
	    switch (prefetchStrategy) {
	      case true:
	        prefetchAfterFirstMounted(apps, importEntryOpts);
	        break;

	      case 'all':
	        prefetchImmediately(apps, importEntryOpts);
	        break;
	    }
	  }
	}

	var nativeGetOwnPropertyNames = objectGetOwnPropertyNames.f;

	var toString$1 = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return nativeGetOwnPropertyNames(it);
	  } catch (error) {
	    return windowNames.slice();
	  }
	};

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var f$8 = function getOwnPropertyNames(it) {
	  return windowNames && toString$1.call(it) == '[object Window]'
	    ? getWindowNames(it)
	    : nativeGetOwnPropertyNames(toIndexedObject(it));
	};

	var objectGetOwnPropertyNamesExternal = {
		f: f$8
	};

	var nativeGetOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;

	var FAILS_ON_PRIMITIVES = fails(function () { return !Object.getOwnPropertyNames(1); });

	// `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
	  getOwnPropertyNames: nativeGetOwnPropertyNames$1
	});

	var freezing = !fails(function () {
	  return Object.isExtensible(Object.preventExtensions({}));
	});

	var internalMetadata = createCommonjsModule(function (module) {
	var defineProperty = objectDefineProperty.f;



	var METADATA = uid('meta');
	var id = 0;

	var isExtensible = Object.isExtensible || function () {
	  return true;
	};

	var setMetadata = function (it) {
	  defineProperty(it, METADATA, { value: {
	    objectID: 'O' + ++id, // object ID
	    weakData: {}          // weak collections IDs
	  } });
	};

	var fastKey = function (it, create) {
	  // return a primitive with prefix
	  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!has(it, METADATA)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return 'F';
	    // not necessary to add metadata
	    if (!create) return 'E';
	    // add missing metadata
	    setMetadata(it);
	  // return object ID
	  } return it[METADATA].objectID;
	};

	var getWeakData = function (it, create) {
	  if (!has(it, METADATA)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return true;
	    // not necessary to add metadata
	    if (!create) return false;
	    // add missing metadata
	    setMetadata(it);
	  // return the store of weak collections IDs
	  } return it[METADATA].weakData;
	};

	// add metadata on freeze-family methods calling
	var onFreeze = function (it) {
	  if (freezing && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
	  return it;
	};

	var meta = module.exports = {
	  REQUIRED: false,
	  fastKey: fastKey,
	  getWeakData: getWeakData,
	  onFreeze: onFreeze
	};

	hiddenKeys[METADATA] = true;
	});
	var internalMetadata_1 = internalMetadata.REQUIRED;
	var internalMetadata_2 = internalMetadata.fastKey;
	var internalMetadata_3 = internalMetadata.getWeakData;
	var internalMetadata_4 = internalMetadata.onFreeze;

	// makes subclassing work correct for wrapped built-ins
	var inheritIfRequired = function ($this, dummy, Wrapper) {
	  var NewTarget, NewTargetPrototype;
	  if (
	    // it can work only with native `setPrototypeOf`
	    objectSetPrototypeOf &&
	    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
	    typeof (NewTarget = dummy.constructor) == 'function' &&
	    NewTarget !== Wrapper &&
	    isObject(NewTargetPrototype = NewTarget.prototype) &&
	    NewTargetPrototype !== Wrapper.prototype
	  ) objectSetPrototypeOf($this, NewTargetPrototype);
	  return $this;
	};

	var collection = function (CONSTRUCTOR_NAME, wrapper, common) {
	  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
	  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
	  var ADDER = IS_MAP ? 'set' : 'add';
	  var NativeConstructor = global_1[CONSTRUCTOR_NAME];
	  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
	  var Constructor = NativeConstructor;
	  var exported = {};

	  var fixMethod = function (KEY) {
	    var nativeMethod = NativePrototype[KEY];
	    redefine(NativePrototype, KEY,
	      KEY == 'add' ? function add(value) {
	        nativeMethod.call(this, value === 0 ? 0 : value);
	        return this;
	      } : KEY == 'delete' ? function (key) {
	        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
	      } : KEY == 'get' ? function get(key) {
	        return IS_WEAK && !isObject(key) ? undefined : nativeMethod.call(this, key === 0 ? 0 : key);
	      } : KEY == 'has' ? function has(key) {
	        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
	      } : function set(key, value) {
	        nativeMethod.call(this, key === 0 ? 0 : key, value);
	        return this;
	      }
	    );
	  };

	  // eslint-disable-next-line max-len
	  if (isForced_1(CONSTRUCTOR_NAME, typeof NativeConstructor != 'function' || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
	    new NativeConstructor().entries().next();
	  })))) {
	    // create collection constructor
	    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
	    internalMetadata.REQUIRED = true;
	  } else if (isForced_1(CONSTRUCTOR_NAME, true)) {
	    var instance = new Constructor();
	    // early implementations not supports chaining
	    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
	    // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
	    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
	    // most early implementations doesn't supports iterables, most modern - not close it correctly
	    // eslint-disable-next-line no-new
	    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
	    // for early implementations -0 and +0 not the same
	    var BUGGY_ZERO = !IS_WEAK && fails(function () {
	      // V8 ~ Chromium 42- fails only with 5+ elements
	      var $instance = new NativeConstructor();
	      var index = 5;
	      while (index--) $instance[ADDER](index, index);
	      return !$instance.has(-0);
	    });

	    if (!ACCEPT_ITERABLES) {
	      Constructor = wrapper(function (dummy, iterable) {
	        anInstance(dummy, Constructor, CONSTRUCTOR_NAME);
	        var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
	        if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
	        return that;
	      });
	      Constructor.prototype = NativePrototype;
	      NativePrototype.constructor = Constructor;
	    }

	    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
	      fixMethod('delete');
	      fixMethod('has');
	      IS_MAP && fixMethod('get');
	    }

	    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

	    // weak collections should not contains .clear method
	    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
	  }

	  exported[CONSTRUCTOR_NAME] = Constructor;
	  _export({ global: true, forced: Constructor != NativeConstructor }, exported);

	  setToStringTag(Constructor, CONSTRUCTOR_NAME);

	  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

	  return Constructor;
	};

	var getWeakData = internalMetadata.getWeakData;








	var setInternalState$3 = internalState.set;
	var internalStateGetterFor = internalState.getterFor;
	var find = arrayIteration.find;
	var findIndex = arrayIteration.findIndex;
	var id$1 = 0;

	// fallback for uncaught frozen keys
	var uncaughtFrozenStore = function (store) {
	  return store.frozen || (store.frozen = new UncaughtFrozenStore());
	};

	var UncaughtFrozenStore = function () {
	  this.entries = [];
	};

	var findUncaughtFrozen = function (store, key) {
	  return find(store.entries, function (it) {
	    return it[0] === key;
	  });
	};

	UncaughtFrozenStore.prototype = {
	  get: function (key) {
	    var entry = findUncaughtFrozen(this, key);
	    if (entry) return entry[1];
	  },
	  has: function (key) {
	    return !!findUncaughtFrozen(this, key);
	  },
	  set: function (key, value) {
	    var entry = findUncaughtFrozen(this, key);
	    if (entry) entry[1] = value;
	    else this.entries.push([key, value]);
	  },
	  'delete': function (key) {
	    var index = findIndex(this.entries, function (it) {
	      return it[0] === key;
	    });
	    if (~index) this.entries.splice(index, 1);
	    return !!~index;
	  }
	};

	var collectionWeak = {
	  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
	    var C = wrapper(function (that, iterable) {
	      anInstance(that, C, CONSTRUCTOR_NAME);
	      setInternalState$3(that, {
	        type: CONSTRUCTOR_NAME,
	        id: id$1++,
	        frozen: undefined
	      });
	      if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
	    });

	    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

	    var define = function (that, key, value) {
	      var state = getInternalState(that);
	      var data = getWeakData(anObject(key), true);
	      if (data === true) uncaughtFrozenStore(state).set(key, value);
	      else data[state.id] = value;
	      return that;
	    };

	    redefineAll(C.prototype, {
	      // 23.3.3.2 WeakMap.prototype.delete(key)
	      // 23.4.3.3 WeakSet.prototype.delete(value)
	      'delete': function (key) {
	        var state = getInternalState(this);
	        if (!isObject(key)) return false;
	        var data = getWeakData(key);
	        if (data === true) return uncaughtFrozenStore(state)['delete'](key);
	        return data && has(data, state.id) && delete data[state.id];
	      },
	      // 23.3.3.4 WeakMap.prototype.has(key)
	      // 23.4.3.4 WeakSet.prototype.has(value)
	      has: function has$1(key) {
	        var state = getInternalState(this);
	        if (!isObject(key)) return false;
	        var data = getWeakData(key);
	        if (data === true) return uncaughtFrozenStore(state).has(key);
	        return data && has(data, state.id);
	      }
	    });

	    redefineAll(C.prototype, IS_MAP ? {
	      // 23.3.3.3 WeakMap.prototype.get(key)
	      get: function get(key) {
	        var state = getInternalState(this);
	        if (isObject(key)) {
	          var data = getWeakData(key);
	          if (data === true) return uncaughtFrozenStore(state).get(key);
	          return data ? data[state.id] : undefined;
	        }
	      },
	      // 23.3.3.5 WeakMap.prototype.set(key, value)
	      set: function set(key, value) {
	        return define(this, key, value);
	      }
	    } : {
	      // 23.4.3.1 WeakSet.prototype.add(value)
	      add: function add(value) {
	        return define(this, value, true);
	      }
	    });

	    return C;
	  }
	};

	var es_weakMap = createCommonjsModule(function (module) {






	var enforceIternalState = internalState.enforce;


	var IS_IE11 = !global_1.ActiveXObject && 'ActiveXObject' in global_1;
	var isExtensible = Object.isExtensible;
	var InternalWeakMap;

	var wrapper = function (init) {
	  return function WeakMap() {
	    return init(this, arguments.length ? arguments[0] : undefined);
	  };
	};

	// `WeakMap` constructor
	// https://tc39.github.io/ecma262/#sec-weakmap-constructor
	var $WeakMap = module.exports = collection('WeakMap', wrapper, collectionWeak);

	// IE11 WeakMap frozen keys fix
	// We can't use feature detection because it crash some old IE builds
	// https://github.com/zloirock/core-js/issues/485
	if (nativeWeakMap && IS_IE11) {
	  InternalWeakMap = collectionWeak.getConstructor(wrapper, 'WeakMap', true);
	  internalMetadata.REQUIRED = true;
	  var WeakMapPrototype = $WeakMap.prototype;
	  var nativeDelete = WeakMapPrototype['delete'];
	  var nativeHas = WeakMapPrototype.has;
	  var nativeGet = WeakMapPrototype.get;
	  var nativeSet = WeakMapPrototype.set;
	  redefineAll(WeakMapPrototype, {
	    'delete': function (key) {
	      if (isObject(key) && !isExtensible(key)) {
	        var state = enforceIternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        return nativeDelete.call(this, key) || state.frozen['delete'](key);
	      } return nativeDelete.call(this, key);
	    },
	    has: function has(key) {
	      if (isObject(key) && !isExtensible(key)) {
	        var state = enforceIternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        return nativeHas.call(this, key) || state.frozen.has(key);
	      } return nativeHas.call(this, key);
	    },
	    get: function get(key) {
	      if (isObject(key) && !isExtensible(key)) {
	        var state = enforceIternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        return nativeHas.call(this, key) ? nativeGet.call(this, key) : state.frozen.get(key);
	      } return nativeGet.call(this, key);
	    },
	    set: function set(key, value) {
	      if (isObject(key) && !isExtensible(key)) {
	        var state = enforceIternalState(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        nativeHas.call(this, key) ? nativeSet.call(this, key, value) : state.frozen.set(key, value);
	      } else nativeSet.call(this, key, value);
	      return this;
	    }
	  });
	}
	});

	/** Detect free variable `global` from Node.js. */
	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

	var _freeGlobal = freeGlobal;

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root = _freeGlobal || freeSelf || Function('return this')();

	var _root = root;

	/** Built-in value references. */
	var Symbol$2 = _root.Symbol;

	var _Symbol = Symbol$2;

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$1 = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;

	/** Built-in value references. */
	var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */
	function getRawTag(value) {
	  var isOwn = hasOwnProperty$1.call(value, symToStringTag),
	      tag = value[symToStringTag];

	  try {
	    value[symToStringTag] = undefined;
	    var unmasked = true;
	  } catch (e) {}

	  var result = nativeObjectToString.call(value);
	  if (unmasked) {
	    if (isOwn) {
	      value[symToStringTag] = tag;
	    } else {
	      delete value[symToStringTag];
	    }
	  }
	  return result;
	}

	var _getRawTag = getRawTag;

	/** Used for built-in method references. */
	var objectProto$1 = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString$1 = objectProto$1.toString;

	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString$1(value) {
	  return nativeObjectToString$1.call(value);
	}

	var _objectToString = objectToString$1;

	/** `Object#toString` result references. */
	var nullTag = '[object Null]',
	    undefinedTag = '[object Undefined]';

	/** Built-in value references. */
	var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  if (value == null) {
	    return value === undefined ? undefinedTag : nullTag;
	  }
	  return (symToStringTag$1 && symToStringTag$1 in Object(value))
	    ? _getRawTag(value)
	    : _objectToString(value);
	}

	var _baseGetTag = baseGetTag;

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject$2(value) {
	  var type = typeof value;
	  return value != null && (type == 'object' || type == 'function');
	}

	var isObject_1 = isObject$2;

	/** `Object#toString` result references. */
	var asyncTag = '[object AsyncFunction]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    proxyTag = '[object Proxy]';

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  if (!isObject_1(value)) {
	    return false;
	  }
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 9 which returns 'object' for typed arrays and other constructors.
	  var tag = _baseGetTag(value);
	  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
	}

	var isFunction_1 = isFunction;

	/**
	 * A specialized version of `_.reduce` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {*} [accumulator] The initial value.
	 * @param {boolean} [initAccum] Specify using the first element of `array` as
	 *  the initial value.
	 * @returns {*} Returns the accumulated value.
	 */
	function arrayReduce(array, iteratee, accumulator, initAccum) {
	  var index = -1,
	      length = array == null ? 0 : array.length;

	  if (initAccum && length) {
	    accumulator = array[++index];
	  }
	  while (++index < length) {
	    accumulator = iteratee(accumulator, array[index], index, array);
	  }
	  return accumulator;
	}

	var _arrayReduce = arrayReduce;

	/**
	 * The base implementation of `_.propertyOf` without support for deep paths.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Function} Returns the new accessor function.
	 */
	function basePropertyOf(object) {
	  return function(key) {
	    return object == null ? undefined : object[key];
	  };
	}

	var _basePropertyOf = basePropertyOf;

	/** Used to map Latin Unicode letters to basic Latin letters. */
	var deburredLetters = {
	  // Latin-1 Supplement block.
	  '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
	  '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
	  '\xc7': 'C',  '\xe7': 'c',
	  '\xd0': 'D',  '\xf0': 'd',
	  '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
	  '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
	  '\xcc': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
	  '\xec': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
	  '\xd1': 'N',  '\xf1': 'n',
	  '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
	  '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
	  '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
	  '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
	  '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
	  '\xc6': 'Ae', '\xe6': 'ae',
	  '\xde': 'Th', '\xfe': 'th',
	  '\xdf': 'ss',
	  // Latin Extended-A block.
	  '\u0100': 'A',  '\u0102': 'A', '\u0104': 'A',
	  '\u0101': 'a',  '\u0103': 'a', '\u0105': 'a',
	  '\u0106': 'C',  '\u0108': 'C', '\u010a': 'C', '\u010c': 'C',
	  '\u0107': 'c',  '\u0109': 'c', '\u010b': 'c', '\u010d': 'c',
	  '\u010e': 'D',  '\u0110': 'D', '\u010f': 'd', '\u0111': 'd',
	  '\u0112': 'E',  '\u0114': 'E', '\u0116': 'E', '\u0118': 'E', '\u011a': 'E',
	  '\u0113': 'e',  '\u0115': 'e', '\u0117': 'e', '\u0119': 'e', '\u011b': 'e',
	  '\u011c': 'G',  '\u011e': 'G', '\u0120': 'G', '\u0122': 'G',
	  '\u011d': 'g',  '\u011f': 'g', '\u0121': 'g', '\u0123': 'g',
	  '\u0124': 'H',  '\u0126': 'H', '\u0125': 'h', '\u0127': 'h',
	  '\u0128': 'I',  '\u012a': 'I', '\u012c': 'I', '\u012e': 'I', '\u0130': 'I',
	  '\u0129': 'i',  '\u012b': 'i', '\u012d': 'i', '\u012f': 'i', '\u0131': 'i',
	  '\u0134': 'J',  '\u0135': 'j',
	  '\u0136': 'K',  '\u0137': 'k', '\u0138': 'k',
	  '\u0139': 'L',  '\u013b': 'L', '\u013d': 'L', '\u013f': 'L', '\u0141': 'L',
	  '\u013a': 'l',  '\u013c': 'l', '\u013e': 'l', '\u0140': 'l', '\u0142': 'l',
	  '\u0143': 'N',  '\u0145': 'N', '\u0147': 'N', '\u014a': 'N',
	  '\u0144': 'n',  '\u0146': 'n', '\u0148': 'n', '\u014b': 'n',
	  '\u014c': 'O',  '\u014e': 'O', '\u0150': 'O',
	  '\u014d': 'o',  '\u014f': 'o', '\u0151': 'o',
	  '\u0154': 'R',  '\u0156': 'R', '\u0158': 'R',
	  '\u0155': 'r',  '\u0157': 'r', '\u0159': 'r',
	  '\u015a': 'S',  '\u015c': 'S', '\u015e': 'S', '\u0160': 'S',
	  '\u015b': 's',  '\u015d': 's', '\u015f': 's', '\u0161': 's',
	  '\u0162': 'T',  '\u0164': 'T', '\u0166': 'T',
	  '\u0163': 't',  '\u0165': 't', '\u0167': 't',
	  '\u0168': 'U',  '\u016a': 'U', '\u016c': 'U', '\u016e': 'U', '\u0170': 'U', '\u0172': 'U',
	  '\u0169': 'u',  '\u016b': 'u', '\u016d': 'u', '\u016f': 'u', '\u0171': 'u', '\u0173': 'u',
	  '\u0174': 'W',  '\u0175': 'w',
	  '\u0176': 'Y',  '\u0177': 'y', '\u0178': 'Y',
	  '\u0179': 'Z',  '\u017b': 'Z', '\u017d': 'Z',
	  '\u017a': 'z',  '\u017c': 'z', '\u017e': 'z',
	  '\u0132': 'IJ', '\u0133': 'ij',
	  '\u0152': 'Oe', '\u0153': 'oe',
	  '\u0149': "'n", '\u017f': 's'
	};

	/**
	 * Used by `_.deburr` to convert Latin-1 Supplement and Latin Extended-A
	 * letters to basic Latin letters.
	 *
	 * @private
	 * @param {string} letter The matched letter to deburr.
	 * @returns {string} Returns the deburred letter.
	 */
	var deburrLetter = _basePropertyOf(deburredLetters);

	var _deburrLetter = deburrLetter;

	/**
	 * A specialized version of `_.map` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */
	function arrayMap(array, iteratee) {
	  var index = -1,
	      length = array == null ? 0 : array.length,
	      result = Array(length);

	  while (++index < length) {
	    result[index] = iteratee(array[index], index, array);
	  }
	  return result;
	}

	var _arrayMap = arrayMap;

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray$1 = Array.isArray;

	var isArray_1 = isArray$1;

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}

	var isObjectLike_1 = isObjectLike;

	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag);
	}

	var isSymbol_1 = isSymbol;

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = _Symbol ? _Symbol.prototype : undefined,
	    symbolToString = symbolProto ? symbolProto.toString : undefined;

	/**
	 * The base implementation of `_.toString` which doesn't convert nullish
	 * values to empty strings.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (isArray_1(value)) {
	    // Recursively convert values (susceptible to call stack limits).
	    return _arrayMap(value, baseToString) + '';
	  }
	  if (isSymbol_1(value)) {
	    return symbolToString ? symbolToString.call(value) : '';
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}

	var _baseToString = baseToString;

	/**
	 * Converts `value` to a string. An empty string is returned for `null`
	 * and `undefined` values. The sign of `-0` is preserved.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 * @example
	 *
	 * _.toString(null);
	 * // => ''
	 *
	 * _.toString(-0);
	 * // => '-0'
	 *
	 * _.toString([1, 2, 3]);
	 * // => '1,2,3'
	 */
	function toString$2(value) {
	  return value == null ? '' : _baseToString(value);
	}

	var toString_1 = toString$2;

	/** Used to match Latin Unicode letters (excluding mathematical operators). */
	var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;

	/** Used to compose unicode character classes. */
	var rsComboMarksRange = '\\u0300-\\u036f',
	    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
	    rsComboSymbolsRange = '\\u20d0-\\u20ff',
	    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;

	/** Used to compose unicode capture groups. */
	var rsCombo = '[' + rsComboRange + ']';

	/**
	 * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
	 * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
	 */
	var reComboMark = RegExp(rsCombo, 'g');

	/**
	 * Deburrs `string` by converting
	 * [Latin-1 Supplement](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
	 * and [Latin Extended-A](https://en.wikipedia.org/wiki/Latin_Extended-A)
	 * letters to basic Latin letters and removing
	 * [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category String
	 * @param {string} [string=''] The string to deburr.
	 * @returns {string} Returns the deburred string.
	 * @example
	 *
	 * _.deburr('déjà vu');
	 * // => 'deja vu'
	 */
	function deburr(string) {
	  string = toString_1(string);
	  return string && string.replace(reLatin, _deburrLetter).replace(reComboMark, '');
	}

	var deburr_1 = deburr;

	/** Used to match words composed of alphanumeric characters. */
	var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;

	/**
	 * Splits an ASCII `string` into an array of its words.
	 *
	 * @private
	 * @param {string} The string to inspect.
	 * @returns {Array} Returns the words of `string`.
	 */
	function asciiWords(string) {
	  return string.match(reAsciiWord) || [];
	}

	var _asciiWords = asciiWords;

	/** Used to detect strings that need a more robust regexp to match words. */
	var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

	/**
	 * Checks if `string` contains a word composed of Unicode symbols.
	 *
	 * @private
	 * @param {string} string The string to inspect.
	 * @returns {boolean} Returns `true` if a word is found, else `false`.
	 */
	function hasUnicodeWord(string) {
	  return reHasUnicodeWord.test(string);
	}

	var _hasUnicodeWord = hasUnicodeWord;

	/** Used to compose unicode character classes. */
	var rsAstralRange = '\\ud800-\\udfff',
	    rsComboMarksRange$1 = '\\u0300-\\u036f',
	    reComboHalfMarksRange$1 = '\\ufe20-\\ufe2f',
	    rsComboSymbolsRange$1 = '\\u20d0-\\u20ff',
	    rsComboRange$1 = rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1,
	    rsDingbatRange = '\\u2700-\\u27bf',
	    rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
	    rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
	    rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
	    rsPunctuationRange = '\\u2000-\\u206f',
	    rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
	    rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
	    rsVarRange = '\\ufe0e\\ufe0f',
	    rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

	/** Used to compose unicode capture groups. */
	var rsApos = "['\u2019]",
	    rsBreak = '[' + rsBreakRange + ']',
	    rsCombo$1 = '[' + rsComboRange$1 + ']',
	    rsDigits = '\\d+',
	    rsDingbat = '[' + rsDingbatRange + ']',
	    rsLower = '[' + rsLowerRange + ']',
	    rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
	    rsFitz = '\\ud83c[\\udffb-\\udfff]',
	    rsModifier = '(?:' + rsCombo$1 + '|' + rsFitz + ')',
	    rsNonAstral = '[^' + rsAstralRange + ']',
	    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
	    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
	    rsUpper = '[' + rsUpperRange + ']',
	    rsZWJ = '\\u200d';

	/** Used to compose unicode regexes. */
	var rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')',
	    rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')',
	    rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?',
	    rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?',
	    reOptMod = rsModifier + '?',
	    rsOptVar = '[' + rsVarRange + ']?',
	    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
	    rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])',
	    rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])',
	    rsSeq = rsOptVar + reOptMod + rsOptJoin,
	    rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq;

	/** Used to match complex or compound words. */
	var reUnicodeWord = RegExp([
	  rsUpper + '?' + rsLower + '+' + rsOptContrLower + '(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
	  rsMiscUpper + '+' + rsOptContrUpper + '(?=' + [rsBreak, rsUpper + rsMiscLower, '$'].join('|') + ')',
	  rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower,
	  rsUpper + '+' + rsOptContrUpper,
	  rsOrdUpper,
	  rsOrdLower,
	  rsDigits,
	  rsEmoji
	].join('|'), 'g');

	/**
	 * Splits a Unicode `string` into an array of its words.
	 *
	 * @private
	 * @param {string} The string to inspect.
	 * @returns {Array} Returns the words of `string`.
	 */
	function unicodeWords(string) {
	  return string.match(reUnicodeWord) || [];
	}

	var _unicodeWords = unicodeWords;

	/**
	 * Splits `string` into an array of its words.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category String
	 * @param {string} [string=''] The string to inspect.
	 * @param {RegExp|string} [pattern] The pattern to match words.
	 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
	 * @returns {Array} Returns the words of `string`.
	 * @example
	 *
	 * _.words('fred, barney, & pebbles');
	 * // => ['fred', 'barney', 'pebbles']
	 *
	 * _.words('fred, barney, & pebbles', /[^, ]+/g);
	 * // => ['fred', 'barney', '&', 'pebbles']
	 */
	function words(string, pattern, guard) {
	  string = toString_1(string);
	  pattern = guard ? undefined : pattern;

	  if (pattern === undefined) {
	    return _hasUnicodeWord(string) ? _unicodeWords(string) : _asciiWords(string);
	  }
	  return string.match(pattern) || [];
	}

	var words_1 = words;

	/** Used to compose unicode capture groups. */
	var rsApos$1 = "['\u2019]";

	/** Used to match apostrophes. */
	var reApos = RegExp(rsApos$1, 'g');

	/**
	 * Creates a function like `_.camelCase`.
	 *
	 * @private
	 * @param {Function} callback The function to combine each word.
	 * @returns {Function} Returns the new compounder function.
	 */
	function createCompounder(callback) {
	  return function(string) {
	    return _arrayReduce(words_1(deburr_1(string).replace(reApos, '')), callback, '');
	  };
	}

	var _createCompounder = createCompounder;

	/**
	 * Converts `string` to
	 * [snake case](https://en.wikipedia.org/wiki/Snake_case).
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category String
	 * @param {string} [string=''] The string to convert.
	 * @returns {string} Returns the snake cased string.
	 * @example
	 *
	 * _.snakeCase('Foo Bar');
	 * // => 'foo_bar'
	 *
	 * _.snakeCase('fooBar');
	 * // => 'foo_bar'
	 *
	 * _.snakeCase('--FOO-BAR--');
	 * // => 'foo_bar'
	 */
	var snakeCase = _createCompounder(function(result, word, index) {
	  return result + (index ? '_' : '') + word.toLowerCase();
	});

	var snakeCase_1 = snakeCase;

	function sleep(ms) {
	  return __awaiter(this, void 0, void 0, function () {
	    return __generator(this, function (_a) {
	      return [2
	      /*return*/
	      , new Promise(function (resolve) {
	        return setTimeout(resolve, ms);
	      })];
	    });
	  });
	}
	/**
	 * run a callback after next tick
	 * @param cb
	 */

	function nextTick(cb) {
	  Promise.resolve().then(cb);
	}
	function toArray(array) {
	  return Array.isArray(array) ? array : [array];
	}
	function getDefaultTplWrapper(id, name) {
	  return function (tpl) {
	    return "<div id=\"" + getWrapperId(id) + "\" data-name=\"" + name + "\">" + tpl + "</div>";
	  };
	}
	function getWrapperId(id) {
	  return "__legions_microapp_wrapper_for_" + snakeCase_1(id) + "__";
	}
	function isEnableScopedCSS(sandbox) {
	  if (_typeof_1(sandbox) !== 'object') {
	    return false;
	  }

	  if (sandbox.strictStyleIsolation) {
	    return false;
	  }

	  return !!sandbox.experimentalStyleIsolation;
	}

	var Deferred =
	/** @class */
	function () {
	  function Deferred() {
	    var _this = this;

	    this.promise = new Promise(function (resolve, reject) {
	      _this.resolve = resolve;
	      _this.reject = reject;
	    });
	  }

	  return Deferred;
	}();
	function getContainer(container) {
	  return typeof container === 'string' ? document.querySelector(container) : container;
	}
	/** 校验子应用导出的 生命周期 对象是否正确 */

	function validateExportLifecycle(exports) {
	  var _a = exports !== null && exports !== void 0 ? exports : {},
	      bootstrap = _a.bootstrap,
	      mount = _a.mount,
	      unmount = _a.unmount;

	  return isFunction_1(bootstrap) && isFunction_1(mount) && isFunction_1(unmount);
	}
	var SandBoxType;

	(function (SandBoxType) {
	  SandBoxType["Proxy"] = "Proxy";
	  /** 暂时不用 */

	  SandBoxType["Snapshot"] = "Snapshot";
	  SandBoxType["LegacyProxy"] = "LegacyProxy";
	})(SandBoxType || (SandBoxType = {}));

	var naughtySafari = typeof document.all === 'function' && typeof document.all === 'undefined';
	var isCallable = naughtySafari ? function (fn) {
	  return typeof fn === 'function' && typeof fn !== 'undefined';
	} : function (fn) {
	  return typeof fn === 'function';
	};
	var boundedMap = new WeakMap();
	function isBoundedFunction(fn) {
	  if (boundedMap.has(fn)) {
	    return boundedMap.get(fn);
	  }
	  /*
	   indexOf is faster than startsWith
	   see https://jsperf.com/string-startswith/72
	   */


	  var bounded = fn.name.indexOf('bound ') === 0 && !fn.hasOwnProperty('prototype');
	  boundedMap.set(fn, bounded);
	  return bounded;
	}
	var constructableMap = new WeakMap();
	function isConstructable(fn) {
	  if (constructableMap.has(fn)) {
	    return constructableMap.get(fn);
	  }

	  var constructableFunctionRegex = /^function\b\s[A-Z].*/;
	  var classRegex = /^class\b/; // 有 prototype 并且 prototype 上有定义一系列非 constructor 属性，则可以认为是一个构造函数

	  var constructable = fn.prototype && fn.prototype.constructor === fn && Object.getOwnPropertyNames(fn.prototype).length > 1 || constructableFunctionRegex.test(fn.toString()) || classRegex.test(fn.toString());
	  constructableMap.set(fn, constructable);
	  return constructable;
	}

	// `Array.prototype.{ reduce, reduceRight }` methods implementation
	var createMethod$3 = function (IS_RIGHT) {
	  return function (that, callbackfn, argumentsLength, memo) {
	    aFunction$1(callbackfn);
	    var O = toObject(that);
	    var self = indexedObject(O);
	    var length = toLength(O.length);
	    var index = IS_RIGHT ? length - 1 : 0;
	    var i = IS_RIGHT ? -1 : 1;
	    if (argumentsLength < 2) while (true) {
	      if (index in self) {
	        memo = self[index];
	        index += i;
	        break;
	      }
	      index += i;
	      if (IS_RIGHT ? index < 0 : length <= index) {
	        throw TypeError('Reduce of empty array with no initial value');
	      }
	    }
	    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
	      memo = callbackfn(memo, self[index], index, O);
	    }
	    return memo;
	  };
	};

	var arrayReduce$1 = {
	  // `Array.prototype.reduce` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
	  left: createMethod$3(false),
	  // `Array.prototype.reduceRight` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
	  right: createMethod$3(true)
	};

	var $reduce = arrayReduce$1.left;



	var STRICT_METHOD$3 = arrayMethodIsStrict('reduce');
	var USES_TO_LENGTH$5 = arrayMethodUsesToLength('reduce', { 1: 0 });

	// `Array.prototype.reduce` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.reduce
	_export({ target: 'Array', proto: true, forced: !STRICT_METHOD$3 || !USES_TO_LENGTH$5 }, {
	  reduce: function reduce(callbackfn /* , initialValue */) {
	    return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	/**
	 * A specialized version of `_.forEach` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns `array`.
	 */
	function arrayEach(array, iteratee) {
	  var index = -1,
	      length = array == null ? 0 : array.length;

	  while (++index < length) {
	    if (iteratee(array[index], index, array) === false) {
	      break;
	    }
	  }
	  return array;
	}

	var _arrayEach = arrayEach;

	/**
	 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var index = -1,
	        iterable = Object(object),
	        props = keysFunc(object),
	        length = props.length;

	    while (length--) {
	      var key = props[fromRight ? length : ++index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}

	var _createBaseFor = createBaseFor;

	/**
	 * The base implementation of `baseForOwn` which iterates over `object`
	 * properties returned by `keysFunc` and invokes `iteratee` for each property.
	 * Iteratee functions may exit iteration early by explicitly returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = _createBaseFor();

	var _baseFor = baseFor;

	/**
	 * The base implementation of `_.times` without support for iteratee shorthands
	 * or max array length checks.
	 *
	 * @private
	 * @param {number} n The number of times to invoke `iteratee`.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the array of results.
	 */
	function baseTimes(n, iteratee) {
	  var index = -1,
	      result = Array(n);

	  while (++index < n) {
	    result[index] = iteratee(index);
	  }
	  return result;
	}

	var _baseTimes = baseTimes;

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]';

	/**
	 * The base implementation of `_.isArguments`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 */
	function baseIsArguments(value) {
	  return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
	}

	var _baseIsArguments = baseIsArguments;

	/** Used for built-in method references. */
	var objectProto$2 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$2 = objectProto$2.hasOwnProperty;

	/** Built-in value references. */
	var propertyIsEnumerable = objectProto$2.propertyIsEnumerable;

	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
	  return isObjectLike_1(value) && hasOwnProperty$2.call(value, 'callee') &&
	    !propertyIsEnumerable.call(value, 'callee');
	};

	var isArguments_1 = isArguments;

	/**
	 * This method returns `false`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {boolean} Returns `false`.
	 * @example
	 *
	 * _.times(2, _.stubFalse);
	 * // => [false, false]
	 */
	function stubFalse() {
	  return false;
	}

	var stubFalse_1 = stubFalse;

	var isBuffer_1 = createCommonjsModule(function (module, exports) {
	/** Detect free variable `exports`. */
	var freeExports =  exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Built-in value references. */
	var Buffer = moduleExports ? _root.Buffer : undefined;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

	/**
	 * Checks if `value` is a buffer.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
	 * @example
	 *
	 * _.isBuffer(new Buffer(2));
	 * // => true
	 *
	 * _.isBuffer(new Uint8Array(2));
	 * // => false
	 */
	var isBuffer = nativeIsBuffer || stubFalse_1;

	module.exports = isBuffer;
	});

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  var type = typeof value;
	  length = length == null ? MAX_SAFE_INTEGER : length;

	  return !!length &&
	    (type == 'number' ||
	      (type != 'symbol' && reIsUint.test(value))) &&
	        (value > -1 && value % 1 == 0 && value < length);
	}

	var _isIndex = isIndex;

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER$1 = 9007199254740991;

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
	}

	var isLength_1 = isLength;

	/** `Object#toString` result references. */
	var argsTag$1 = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag$1 = '[object Function]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    weakMapTag = '[object WeakMap]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    dataViewTag = '[object DataView]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';

	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
	typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
	typedArrayTags[mapTag] = typedArrayTags[numberTag] =
	typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
	typedArrayTags[setTag] = typedArrayTags[stringTag] =
	typedArrayTags[weakMapTag] = false;

	/**
	 * The base implementation of `_.isTypedArray` without Node.js optimizations.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 */
	function baseIsTypedArray(value) {
	  return isObjectLike_1(value) &&
	    isLength_1(value.length) && !!typedArrayTags[_baseGetTag(value)];
	}

	var _baseIsTypedArray = baseIsTypedArray;

	/**
	 * The base implementation of `_.unary` without support for storing metadata.
	 *
	 * @private
	 * @param {Function} func The function to cap arguments for.
	 * @returns {Function} Returns the new capped function.
	 */
	function baseUnary(func) {
	  return function(value) {
	    return func(value);
	  };
	}

	var _baseUnary = baseUnary;

	var _nodeUtil = createCommonjsModule(function (module, exports) {
	/** Detect free variable `exports`. */
	var freeExports =  exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Detect free variable `process` from Node.js. */
	var freeProcess = moduleExports && _freeGlobal.process;

	/** Used to access faster Node.js helpers. */
	var nodeUtil = (function() {
	  try {
	    // Use `util.types` for Node.js 10+.
	    var types = freeModule && freeModule.require && freeModule.require('util').types;

	    if (types) {
	      return types;
	    }

	    // Legacy `process.binding('util')` for Node.js < 10.
	    return freeProcess && freeProcess.binding && freeProcess.binding('util');
	  } catch (e) {}
	}());

	module.exports = nodeUtil;
	});

	/* Node.js helper references. */
	var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	var isTypedArray = nodeIsTypedArray ? _baseUnary(nodeIsTypedArray) : _baseIsTypedArray;

	var isTypedArray_1 = isTypedArray;

	/** Used for built-in method references. */
	var objectProto$3 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$3 = objectProto$3.hasOwnProperty;

	/**
	 * Creates an array of the enumerable property names of the array-like `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @param {boolean} inherited Specify returning inherited property names.
	 * @returns {Array} Returns the array of property names.
	 */
	function arrayLikeKeys(value, inherited) {
	  var isArr = isArray_1(value),
	      isArg = !isArr && isArguments_1(value),
	      isBuff = !isArr && !isArg && isBuffer_1(value),
	      isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
	      skipIndexes = isArr || isArg || isBuff || isType,
	      result = skipIndexes ? _baseTimes(value.length, String) : [],
	      length = result.length;

	  for (var key in value) {
	    if ((inherited || hasOwnProperty$3.call(value, key)) &&
	        !(skipIndexes && (
	           // Safari 9 has enumerable `arguments.length` in strict mode.
	           key == 'length' ||
	           // Node.js 0.10 has enumerable non-index properties on buffers.
	           (isBuff && (key == 'offset' || key == 'parent')) ||
	           // PhantomJS 2 has enumerable non-index properties on typed arrays.
	           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
	           // Skip index properties.
	           _isIndex(key, length)
	        ))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	var _arrayLikeKeys = arrayLikeKeys;

	/** Used for built-in method references. */
	var objectProto$4 = Object.prototype;

	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype(value) {
	  var Ctor = value && value.constructor,
	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$4;

	  return value === proto;
	}

	var _isPrototype = isPrototype;

	/**
	 * Creates a unary function that invokes `func` with its argument transformed.
	 *
	 * @private
	 * @param {Function} func The function to wrap.
	 * @param {Function} transform The argument transform.
	 * @returns {Function} Returns the new function.
	 */
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}

	var _overArg = overArg;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeKeys = _overArg(Object.keys, Object);

	var _nativeKeys = nativeKeys;

	/** Used for built-in method references. */
	var objectProto$5 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

	/**
	 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeys(object) {
	  if (!_isPrototype(object)) {
	    return _nativeKeys(object);
	  }
	  var result = [];
	  for (var key in Object(object)) {
	    if (hasOwnProperty$4.call(object, key) && key != 'constructor') {
	      result.push(key);
	    }
	  }
	  return result;
	}

	var _baseKeys = baseKeys;

	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength_1(value.length) && !isFunction_1(value);
	}

	var isArrayLike_1 = isArrayLike;

	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	function keys$1(object) {
	  return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
	}

	var keys_1 = keys$1;

	/**
	 * The base implementation of `_.forOwn` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForOwn(object, iteratee) {
	  return object && _baseFor(object, iteratee, keys_1);
	}

	var _baseForOwn = baseForOwn;

	/**
	 * Creates a `baseEach` or `baseEachRight` function.
	 *
	 * @private
	 * @param {Function} eachFunc The function to iterate over a collection.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseEach(eachFunc, fromRight) {
	  return function(collection, iteratee) {
	    if (collection == null) {
	      return collection;
	    }
	    if (!isArrayLike_1(collection)) {
	      return eachFunc(collection, iteratee);
	    }
	    var length = collection.length,
	        index = fromRight ? length : -1,
	        iterable = Object(collection);

	    while ((fromRight ? index-- : ++index < length)) {
	      if (iteratee(iterable[index], index, iterable) === false) {
	        break;
	      }
	    }
	    return collection;
	  };
	}

	var _createBaseEach = createBaseEach;

	/**
	 * The base implementation of `_.forEach` without support for iteratee shorthands.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array|Object} Returns `collection`.
	 */
	var baseEach = _createBaseEach(_baseForOwn);

	var _baseEach = baseEach;

	/**
	 * This method returns the first argument it receives.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Util
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 *
	 * console.log(_.identity(object) === object);
	 * // => true
	 */
	function identity(value) {
	  return value;
	}

	var identity_1 = identity;

	/**
	 * Casts `value` to `identity` if it's not a function.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {Function} Returns cast function.
	 */
	function castFunction(value) {
	  return typeof value == 'function' ? value : identity_1;
	}

	var _castFunction = castFunction;

	/**
	 * Iterates over elements of `collection` and invokes `iteratee` for each element.
	 * The iteratee is invoked with three arguments: (value, index|key, collection).
	 * Iteratee functions may exit iteration early by explicitly returning `false`.
	 *
	 * **Note:** As with other "Collections" methods, objects with a "length"
	 * property are iterated like arrays. To avoid this behavior use `_.forIn`
	 * or `_.forOwn` for object iteration.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @alias each
	 * @category Collection
	 * @param {Array|Object} collection The collection to iterate over.
	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	 * @returns {Array|Object} Returns `collection`.
	 * @see _.forEachRight
	 * @example
	 *
	 * _.forEach([1, 2], function(value) {
	 *   console.log(value);
	 * });
	 * // => Logs `1` then `2`.
	 *
	 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
	 *   console.log(key);
	 * });
	 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
	 */
	function forEach(collection, iteratee) {
	  var func = isArray_1(collection) ? _arrayEach : _baseEach;
	  return func(collection, _castFunction(iteratee));
	}

	var forEach_1 = forEach;

	/**
	 * Appends the elements of `values` to `array`.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {Array} values The values to append.
	 * @returns {Array} Returns `array`.
	 */
	function arrayPush(array, values) {
	  var index = -1,
	      length = values.length,
	      offset = array.length;

	  while (++index < length) {
	    array[offset + index] = values[index];
	  }
	  return array;
	}

	var _arrayPush = arrayPush;

	/** Built-in value references. */
	var spreadableSymbol = _Symbol ? _Symbol.isConcatSpreadable : undefined;

	/**
	 * Checks if `value` is a flattenable `arguments` object or array.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
	 */
	function isFlattenable(value) {
	  return isArray_1(value) || isArguments_1(value) ||
	    !!(spreadableSymbol && value && value[spreadableSymbol]);
	}

	var _isFlattenable = isFlattenable;

	/**
	 * The base implementation of `_.flatten` with support for restricting flattening.
	 *
	 * @private
	 * @param {Array} array The array to flatten.
	 * @param {number} depth The maximum recursion depth.
	 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
	 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
	 * @param {Array} [result=[]] The initial result value.
	 * @returns {Array} Returns the new flattened array.
	 */
	function baseFlatten(array, depth, predicate, isStrict, result) {
	  var index = -1,
	      length = array.length;

	  predicate || (predicate = _isFlattenable);
	  result || (result = []);

	  while (++index < length) {
	    var value = array[index];
	    if (depth > 0 && predicate(value)) {
	      if (depth > 1) {
	        // Recursively flatten arrays (susceptible to call stack limits).
	        baseFlatten(value, depth - 1, predicate, isStrict, result);
	      } else {
	        _arrayPush(result, value);
	      }
	    } else if (!isStrict) {
	      result[result.length] = value;
	    }
	  }
	  return result;
	}

	var _baseFlatten = baseFlatten;

	/**
	 * Copies the values of `source` to `array`.
	 *
	 * @private
	 * @param {Array} source The array to copy values from.
	 * @param {Array} [array=[]] The array to copy values to.
	 * @returns {Array} Returns `array`.
	 */
	function copyArray(source, array) {
	  var index = -1,
	      length = source.length;

	  array || (array = Array(length));
	  while (++index < length) {
	    array[index] = source[index];
	  }
	  return array;
	}

	var _copyArray = copyArray;

	/**
	 * Creates a new array concatenating `array` with any additional arrays
	 * and/or values.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Array
	 * @param {Array} array The array to concatenate.
	 * @param {...*} [values] The values to concatenate.
	 * @returns {Array} Returns the new concatenated array.
	 * @example
	 *
	 * var array = [1];
	 * var other = _.concat(array, 2, [3], [[4]]);
	 *
	 * console.log(other);
	 * // => [1, 2, 3, [4]]
	 *
	 * console.log(array);
	 * // => [1]
	 */
	function concat() {
	  var length = arguments.length;
	  if (!length) {
	    return [];
	  }
	  var args = Array(length - 1),
	      array = arguments[0],
	      index = length;

	  while (index--) {
	    args[index - 1] = arguments[index];
	  }
	  return _arrayPush(isArray_1(array) ? _copyArray(array) : [array], _baseFlatten(args, 1));
	}

	var concat_1 = concat;

	/**
	 * Removes all key-value entries from the list cache.
	 *
	 * @private
	 * @name clear
	 * @memberOf ListCache
	 */
	function listCacheClear() {
	  this.__data__ = [];
	  this.size = 0;
	}

	var _listCacheClear = listCacheClear;

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 * var other = { 'a': 1 };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}

	var eq_1 = eq;

	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function assocIndexOf(array, key) {
	  var length = array.length;
	  while (length--) {
	    if (eq_1(array[length][0], key)) {
	      return length;
	    }
	  }
	  return -1;
	}

	var _assocIndexOf = assocIndexOf;

	/** Used for built-in method references. */
	var arrayProto = Array.prototype;

	/** Built-in value references. */
	var splice = arrayProto.splice;

	/**
	 * Removes `key` and its value from the list cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf ListCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function listCacheDelete(key) {
	  var data = this.__data__,
	      index = _assocIndexOf(data, key);

	  if (index < 0) {
	    return false;
	  }
	  var lastIndex = data.length - 1;
	  if (index == lastIndex) {
	    data.pop();
	  } else {
	    splice.call(data, index, 1);
	  }
	  --this.size;
	  return true;
	}

	var _listCacheDelete = listCacheDelete;

	/**
	 * Gets the list cache value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf ListCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function listCacheGet(key) {
	  var data = this.__data__,
	      index = _assocIndexOf(data, key);

	  return index < 0 ? undefined : data[index][1];
	}

	var _listCacheGet = listCacheGet;

	/**
	 * Checks if a list cache value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf ListCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function listCacheHas(key) {
	  return _assocIndexOf(this.__data__, key) > -1;
	}

	var _listCacheHas = listCacheHas;

	/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */
	function listCacheSet(key, value) {
	  var data = this.__data__,
	      index = _assocIndexOf(data, key);

	  if (index < 0) {
	    ++this.size;
	    data.push([key, value]);
	  } else {
	    data[index][1] = value;
	  }
	  return this;
	}

	var _listCacheSet = listCacheSet;

	/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function ListCache(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `ListCache`.
	ListCache.prototype.clear = _listCacheClear;
	ListCache.prototype['delete'] = _listCacheDelete;
	ListCache.prototype.get = _listCacheGet;
	ListCache.prototype.has = _listCacheHas;
	ListCache.prototype.set = _listCacheSet;

	var _ListCache = ListCache;

	/**
	 * Removes all key-value entries from the stack.
	 *
	 * @private
	 * @name clear
	 * @memberOf Stack
	 */
	function stackClear() {
	  this.__data__ = new _ListCache;
	  this.size = 0;
	}

	var _stackClear = stackClear;

	/**
	 * Removes `key` and its value from the stack.
	 *
	 * @private
	 * @name delete
	 * @memberOf Stack
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function stackDelete(key) {
	  var data = this.__data__,
	      result = data['delete'](key);

	  this.size = data.size;
	  return result;
	}

	var _stackDelete = stackDelete;

	/**
	 * Gets the stack value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Stack
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function stackGet(key) {
	  return this.__data__.get(key);
	}

	var _stackGet = stackGet;

	/**
	 * Checks if a stack value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Stack
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function stackHas(key) {
	  return this.__data__.has(key);
	}

	var _stackHas = stackHas;

	/** Used to detect overreaching core-js shims. */
	var coreJsData = _root['__core-js_shared__'];

	var _coreJsData = coreJsData;

	/** Used to detect methods masquerading as native. */
	var maskSrcKey = (function() {
	  var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
	  return uid ? ('Symbol(src)_1.' + uid) : '';
	}());

	/**
	 * Checks if `func` has its source masked.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
	 */
	function isMasked(func) {
	  return !!maskSrcKey && (maskSrcKey in func);
	}

	var _isMasked = isMasked;

	/** Used for built-in method references. */
	var funcProto = Function.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to convert.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
	  if (func != null) {
	    try {
	      return funcToString.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}

	var _toSource = toSource;

	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for built-in method references. */
	var funcProto$1 = Function.prototype,
	    objectProto$6 = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString$1 = funcProto$1.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty$5 = objectProto$6.hasOwnProperty;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString$1.call(hasOwnProperty$5).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * The base implementation of `_.isNative` without bad shim checks.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 */
	function baseIsNative(value) {
	  if (!isObject_1(value) || _isMasked(value)) {
	    return false;
	  }
	  var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
	  return pattern.test(_toSource(value));
	}

	var _baseIsNative = baseIsNative;

	/**
	 * Gets the value at `key` of `object`.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function getValue(object, key) {
	  return object == null ? undefined : object[key];
	}

	var _getValue = getValue;

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = _getValue(object, key);
	  return _baseIsNative(value) ? value : undefined;
	}

	var _getNative = getNative;

	/* Built-in method references that are verified to be native. */
	var Map$1 = _getNative(_root, 'Map');

	var _Map = Map$1;

	/* Built-in method references that are verified to be native. */
	var nativeCreate = _getNative(Object, 'create');

	var _nativeCreate = nativeCreate;

	/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */
	function hashClear() {
	  this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
	  this.size = 0;
	}

	var _hashClear = hashClear;

	/**
	 * Removes `key` and its value from the hash.
	 *
	 * @private
	 * @name delete
	 * @memberOf Hash
	 * @param {Object} hash The hash to modify.
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function hashDelete(key) {
	  var result = this.has(key) && delete this.__data__[key];
	  this.size -= result ? 1 : 0;
	  return result;
	}

	var _hashDelete = hashDelete;

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/** Used for built-in method references. */
	var objectProto$7 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$6 = objectProto$7.hasOwnProperty;

	/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Hash
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function hashGet(key) {
	  var data = this.__data__;
	  if (_nativeCreate) {
	    var result = data[key];
	    return result === HASH_UNDEFINED ? undefined : result;
	  }
	  return hasOwnProperty$6.call(data, key) ? data[key] : undefined;
	}

	var _hashGet = hashGet;

	/** Used for built-in method references. */
	var objectProto$8 = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$7 = objectProto$8.hasOwnProperty;

	/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Hash
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function hashHas(key) {
	  var data = this.__data__;
	  return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$7.call(data, key);
	}

	var _hashHas = hashHas;

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

	/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Hash
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the hash instance.
	 */
	function hashSet(key, value) {
	  var data = this.__data__;
	  this.size += this.has(key) ? 0 : 1;
	  data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
	  return this;
	}

	var _hashSet = hashSet;

	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Hash(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `Hash`.
	Hash.prototype.clear = _hashClear;
	Hash.prototype['delete'] = _hashDelete;
	Hash.prototype.get = _hashGet;
	Hash.prototype.has = _hashHas;
	Hash.prototype.set = _hashSet;

	var _Hash = Hash;

	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapCacheClear() {
	  this.size = 0;
	  this.__data__ = {
	    'hash': new _Hash,
	    'map': new (_Map || _ListCache),
	    'string': new _Hash
	  };
	}

	var _mapCacheClear = mapCacheClear;

	/**
	 * Checks if `value` is suitable for use as unique object key.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	 */
	function isKeyable(value) {
	  var type = typeof value;
	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
	    ? (value !== '__proto__')
	    : (value === null);
	}

	var _isKeyable = isKeyable;

	/**
	 * Gets the data for `map`.
	 *
	 * @private
	 * @param {Object} map The map to query.
	 * @param {string} key The reference key.
	 * @returns {*} Returns the map data.
	 */
	function getMapData(map, key) {
	  var data = map.__data__;
	  return _isKeyable(key)
	    ? data[typeof key == 'string' ? 'string' : 'hash']
	    : data.map;
	}

	var _getMapData = getMapData;

	/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function mapCacheDelete(key) {
	  var result = _getMapData(this, key)['delete'](key);
	  this.size -= result ? 1 : 0;
	  return result;
	}

	var _mapCacheDelete = mapCacheDelete;

	/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function mapCacheGet(key) {
	  return _getMapData(this, key).get(key);
	}

	var _mapCacheGet = mapCacheGet;

	/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapCacheHas(key) {
	  return _getMapData(this, key).has(key);
	}

	var _mapCacheHas = mapCacheHas;

	/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache instance.
	 */
	function mapCacheSet(key, value) {
	  var data = _getMapData(this, key),
	      size = data.size;

	  data.set(key, value);
	  this.size += data.size == size ? 0 : 1;
	  return this;
	}

	var _mapCacheSet = mapCacheSet;

	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function MapCache(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `MapCache`.
	MapCache.prototype.clear = _mapCacheClear;
	MapCache.prototype['delete'] = _mapCacheDelete;
	MapCache.prototype.get = _mapCacheGet;
	MapCache.prototype.has = _mapCacheHas;
	MapCache.prototype.set = _mapCacheSet;

	var _MapCache = MapCache;

	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;

	/**
	 * Sets the stack `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Stack
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the stack cache instance.
	 */
	function stackSet(key, value) {
	  var data = this.__data__;
	  if (data instanceof _ListCache) {
	    var pairs = data.__data__;
	    if (!_Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
	      pairs.push([key, value]);
	      this.size = ++data.size;
	      return this;
	    }
	    data = this.__data__ = new _MapCache(pairs);
	  }
	  data.set(key, value);
	  this.size = data.size;
	  return this;
	}

	var _stackSet = stackSet;

	/**
	 * Creates a stack cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Stack(entries) {
	  var data = this.__data__ = new _ListCache(entries);
	  this.size = data.size;
	}

	// Add methods to `Stack`.
	Stack.prototype.clear = _stackClear;
	Stack.prototype['delete'] = _stackDelete;
	Stack.prototype.get = _stackGet;
	Stack.prototype.has = _stackHas;
	Stack.prototype.set = _stackSet;

	var _Stack = Stack;

	var defineProperty$3 = (function() {
	  try {
	    var func = _getNative(Object, 'defineProperty');
	    func({}, '', {});
	    return func;
	  } catch (e) {}
	}());

	var _defineProperty = defineProperty$3;

	/**
	 * The base implementation of `assignValue` and `assignMergeValue` without
	 * value checks.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function baseAssignValue(object, key, value) {
	  if (key == '__proto__' && _defineProperty) {
	    _defineProperty(object, key, {
	      'configurable': true,
	      'enumerable': true,
	      'value': value,
	      'writable': true
	    });
	  } else {
	    object[key] = value;
	  }
	}

	var _baseAssignValue = baseAssignValue;

	/**
	 * This function is like `assignValue` except that it doesn't assign
	 * `undefined` values.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignMergeValue(object, key, value) {
	  if ((value !== undefined && !eq_1(object[key], value)) ||
	      (value === undefined && !(key in object))) {
	    _baseAssignValue(object, key, value);
	  }
	}

	var _assignMergeValue = assignMergeValue;

	var _cloneBuffer = createCommonjsModule(function (module, exports) {
	/** Detect free variable `exports`. */
	var freeExports =  exports && !exports.nodeType && exports;

	/** Detect free variable `module`. */
	var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

	/** Detect the popular CommonJS extension `module.exports`. */
	var moduleExports = freeModule && freeModule.exports === freeExports;

	/** Built-in value references. */
	var Buffer = moduleExports ? _root.Buffer : undefined,
	    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

	/**
	 * Creates a clone of  `buffer`.
	 *
	 * @private
	 * @param {Buffer} buffer The buffer to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Buffer} Returns the cloned buffer.
	 */
	function cloneBuffer(buffer, isDeep) {
	  if (isDeep) {
	    return buffer.slice();
	  }
	  var length = buffer.length,
	      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

	  buffer.copy(result);
	  return result;
	}

	module.exports = cloneBuffer;
	});

	/** Built-in value references. */
	var Uint8Array$1 = _root.Uint8Array;

	var _Uint8Array = Uint8Array$1;

	/**
	 * Creates a clone of `arrayBuffer`.
	 *
	 * @private
	 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
	 * @returns {ArrayBuffer} Returns the cloned array buffer.
	 */
	function cloneArrayBuffer(arrayBuffer) {
	  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
	  new _Uint8Array(result).set(new _Uint8Array(arrayBuffer));
	  return result;
	}

	var _cloneArrayBuffer = cloneArrayBuffer;

	/**
	 * Creates a clone of `typedArray`.
	 *
	 * @private
	 * @param {Object} typedArray The typed array to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned typed array.
	 */
	function cloneTypedArray(typedArray, isDeep) {
	  var buffer = isDeep ? _cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
	  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
	}

	var _cloneTypedArray = cloneTypedArray;

	/** Built-in value references. */
	var objectCreate$1 = Object.create;

	/**
	 * The base implementation of `_.create` without support for assigning
	 * properties to the created object.
	 *
	 * @private
	 * @param {Object} proto The object to inherit from.
	 * @returns {Object} Returns the new object.
	 */
	var baseCreate = (function() {
	  function object() {}
	  return function(proto) {
	    if (!isObject_1(proto)) {
	      return {};
	    }
	    if (objectCreate$1) {
	      return objectCreate$1(proto);
	    }
	    object.prototype = proto;
	    var result = new object;
	    object.prototype = undefined;
	    return result;
	  };
	}());

	var _baseCreate = baseCreate;

	/** Built-in value references. */
	var getPrototype = _overArg(Object.getPrototypeOf, Object);

	var _getPrototype = getPrototype;

	/**
	 * Initializes an object clone.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneObject(object) {
	  return (typeof object.constructor == 'function' && !_isPrototype(object))
	    ? _baseCreate(_getPrototype(object))
	    : {};
	}

	var _initCloneObject = initCloneObject;

	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
	  return isObjectLike_1(value) && isArrayLike_1(value);
	}

	var isArrayLikeObject_1 = isArrayLikeObject;

	/** `Object#toString` result references. */
	var objectTag$1 = '[object Object]';

	/** Used for built-in method references. */
	var funcProto$2 = Function.prototype,
	    objectProto$9 = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString$2 = funcProto$2.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty$8 = objectProto$9.hasOwnProperty;

	/** Used to infer the `Object` constructor. */
	var objectCtorString = funcToString$2.call(Object);

	/**
	 * Checks if `value` is a plain object, that is, an object created by the
	 * `Object` constructor or one with a `[[Prototype]]` of `null`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.8.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 * }
	 *
	 * _.isPlainObject(new Foo);
	 * // => false
	 *
	 * _.isPlainObject([1, 2, 3]);
	 * // => false
	 *
	 * _.isPlainObject({ 'x': 0, 'y': 0 });
	 * // => true
	 *
	 * _.isPlainObject(Object.create(null));
	 * // => true
	 */
	function isPlainObject(value) {
	  if (!isObjectLike_1(value) || _baseGetTag(value) != objectTag$1) {
	    return false;
	  }
	  var proto = _getPrototype(value);
	  if (proto === null) {
	    return true;
	  }
	  var Ctor = hasOwnProperty$8.call(proto, 'constructor') && proto.constructor;
	  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
	    funcToString$2.call(Ctor) == objectCtorString;
	}

	var isPlainObject_1 = isPlainObject;

	/**
	 * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the property to get.
	 * @returns {*} Returns the property value.
	 */
	function safeGet(object, key) {
	  if (key === 'constructor' && typeof object[key] === 'function') {
	    return;
	  }

	  if (key == '__proto__') {
	    return;
	  }

	  return object[key];
	}

	var _safeGet = safeGet;

	/** Used for built-in method references. */
	var objectProto$a = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$9 = objectProto$a.hasOwnProperty;

	/**
	 * Assigns `value` to `key` of `object` if the existing value is not equivalent
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignValue(object, key, value) {
	  var objValue = object[key];
	  if (!(hasOwnProperty$9.call(object, key) && eq_1(objValue, value)) ||
	      (value === undefined && !(key in object))) {
	    _baseAssignValue(object, key, value);
	  }
	}

	var _assignValue = assignValue;

	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property identifiers to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @param {Function} [customizer] The function to customize copied values.
	 * @returns {Object} Returns `object`.
	 */
	function copyObject(source, props, object, customizer) {
	  var isNew = !object;
	  object || (object = {});

	  var index = -1,
	      length = props.length;

	  while (++index < length) {
	    var key = props[index];

	    var newValue = customizer
	      ? customizer(object[key], source[key], key, object, source)
	      : undefined;

	    if (newValue === undefined) {
	      newValue = source[key];
	    }
	    if (isNew) {
	      _baseAssignValue(object, key, newValue);
	    } else {
	      _assignValue(object, key, newValue);
	    }
	  }
	  return object;
	}

	var _copyObject = copyObject;

	/**
	 * This function is like
	 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * except that it includes inherited enumerable properties.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function nativeKeysIn(object) {
	  var result = [];
	  if (object != null) {
	    for (var key in Object(object)) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	var _nativeKeysIn = nativeKeysIn;

	/** Used for built-in method references. */
	var objectProto$b = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$a = objectProto$b.hasOwnProperty;

	/**
	 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeysIn(object) {
	  if (!isObject_1(object)) {
	    return _nativeKeysIn(object);
	  }
	  var isProto = _isPrototype(object),
	      result = [];

	  for (var key in object) {
	    if (!(key == 'constructor' && (isProto || !hasOwnProperty$a.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	var _baseKeysIn = baseKeysIn;

	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  return isArrayLike_1(object) ? _arrayLikeKeys(object, true) : _baseKeysIn(object);
	}

	var keysIn_1 = keysIn;

	/**
	 * Converts `value` to a plain object flattening inherited enumerable string
	 * keyed properties of `value` to own properties of the plain object.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {Object} Returns the converted plain object.
	 * @example
	 *
	 * function Foo() {
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.assign({ 'a': 1 }, new Foo);
	 * // => { 'a': 1, 'b': 2 }
	 *
	 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
	 * // => { 'a': 1, 'b': 2, 'c': 3 }
	 */
	function toPlainObject(value) {
	  return _copyObject(value, keysIn_1(value));
	}

	var toPlainObject_1 = toPlainObject;

	/**
	 * A specialized version of `baseMerge` for arrays and objects which performs
	 * deep merges and tracks traversed objects enabling objects with circular
	 * references to be merged.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {string} key The key of the value to merge.
	 * @param {number} srcIndex The index of `source`.
	 * @param {Function} mergeFunc The function to merge values.
	 * @param {Function} [customizer] The function to customize assigned values.
	 * @param {Object} [stack] Tracks traversed source values and their merged
	 *  counterparts.
	 */
	function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
	  var objValue = _safeGet(object, key),
	      srcValue = _safeGet(source, key),
	      stacked = stack.get(srcValue);

	  if (stacked) {
	    _assignMergeValue(object, key, stacked);
	    return;
	  }
	  var newValue = customizer
	    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
	    : undefined;

	  var isCommon = newValue === undefined;

	  if (isCommon) {
	    var isArr = isArray_1(srcValue),
	        isBuff = !isArr && isBuffer_1(srcValue),
	        isTyped = !isArr && !isBuff && isTypedArray_1(srcValue);

	    newValue = srcValue;
	    if (isArr || isBuff || isTyped) {
	      if (isArray_1(objValue)) {
	        newValue = objValue;
	      }
	      else if (isArrayLikeObject_1(objValue)) {
	        newValue = _copyArray(objValue);
	      }
	      else if (isBuff) {
	        isCommon = false;
	        newValue = _cloneBuffer(srcValue, true);
	      }
	      else if (isTyped) {
	        isCommon = false;
	        newValue = _cloneTypedArray(srcValue, true);
	      }
	      else {
	        newValue = [];
	      }
	    }
	    else if (isPlainObject_1(srcValue) || isArguments_1(srcValue)) {
	      newValue = objValue;
	      if (isArguments_1(objValue)) {
	        newValue = toPlainObject_1(objValue);
	      }
	      else if (!isObject_1(objValue) || isFunction_1(objValue)) {
	        newValue = _initCloneObject(srcValue);
	      }
	    }
	    else {
	      isCommon = false;
	    }
	  }
	  if (isCommon) {
	    // Recursively merge objects and arrays (susceptible to call stack limits).
	    stack.set(srcValue, newValue);
	    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
	    stack['delete'](srcValue);
	  }
	  _assignMergeValue(object, key, newValue);
	}

	var _baseMergeDeep = baseMergeDeep;

	/**
	 * The base implementation of `_.merge` without support for multiple sources.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {number} srcIndex The index of `source`.
	 * @param {Function} [customizer] The function to customize merged values.
	 * @param {Object} [stack] Tracks traversed source values and their merged
	 *  counterparts.
	 */
	function baseMerge(object, source, srcIndex, customizer, stack) {
	  if (object === source) {
	    return;
	  }
	  _baseFor(source, function(srcValue, key) {
	    stack || (stack = new _Stack);
	    if (isObject_1(srcValue)) {
	      _baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
	    }
	    else {
	      var newValue = customizer
	        ? customizer(_safeGet(object, key), srcValue, (key + ''), object, source, stack)
	        : undefined;

	      if (newValue === undefined) {
	        newValue = srcValue;
	      }
	      _assignMergeValue(object, key, newValue);
	    }
	  }, keysIn_1);
	}

	var _baseMerge = baseMerge;

	/**
	 * A faster alternative to `Function#apply`, this function invokes `func`
	 * with the `this` binding of `thisArg` and the arguments of `args`.
	 *
	 * @private
	 * @param {Function} func The function to invoke.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {Array} args The arguments to invoke `func` with.
	 * @returns {*} Returns the result of `func`.
	 */
	function apply(func, thisArg, args) {
	  switch (args.length) {
	    case 0: return func.call(thisArg);
	    case 1: return func.call(thisArg, args[0]);
	    case 2: return func.call(thisArg, args[0], args[1]);
	    case 3: return func.call(thisArg, args[0], args[1], args[2]);
	  }
	  return func.apply(thisArg, args);
	}

	var _apply = apply;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;

	/**
	 * A specialized version of `baseRest` which transforms the rest array.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @param {Function} transform The rest array transform.
	 * @returns {Function} Returns the new function.
	 */
	function overRest(func, start, transform) {
	  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        array = Array(length);

	    while (++index < length) {
	      array[index] = args[start + index];
	    }
	    index = -1;
	    var otherArgs = Array(start + 1);
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = transform(array);
	    return _apply(func, this, otherArgs);
	  };
	}

	var _overRest = overRest;

	/**
	 * Creates a function that returns `value`.
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Util
	 * @param {*} value The value to return from the new function.
	 * @returns {Function} Returns the new constant function.
	 * @example
	 *
	 * var objects = _.times(2, _.constant({ 'a': 1 }));
	 *
	 * console.log(objects);
	 * // => [{ 'a': 1 }, { 'a': 1 }]
	 *
	 * console.log(objects[0] === objects[1]);
	 * // => true
	 */
	function constant(value) {
	  return function() {
	    return value;
	  };
	}

	var constant_1 = constant;

	/**
	 * The base implementation of `setToString` without support for hot loop shorting.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var baseSetToString = !_defineProperty ? identity_1 : function(func, string) {
	  return _defineProperty(func, 'toString', {
	    'configurable': true,
	    'enumerable': false,
	    'value': constant_1(string),
	    'writable': true
	  });
	};

	var _baseSetToString = baseSetToString;

	/** Used to detect hot functions by number of calls within a span of milliseconds. */
	var HOT_COUNT = 800,
	    HOT_SPAN = 16;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeNow = Date.now;

	/**
	 * Creates a function that'll short out and invoke `identity` instead
	 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
	 * milliseconds.
	 *
	 * @private
	 * @param {Function} func The function to restrict.
	 * @returns {Function} Returns the new shortable function.
	 */
	function shortOut(func) {
	  var count = 0,
	      lastCalled = 0;

	  return function() {
	    var stamp = nativeNow(),
	        remaining = HOT_SPAN - (stamp - lastCalled);

	    lastCalled = stamp;
	    if (remaining > 0) {
	      if (++count >= HOT_COUNT) {
	        return arguments[0];
	      }
	    } else {
	      count = 0;
	    }
	    return func.apply(undefined, arguments);
	  };
	}

	var _shortOut = shortOut;

	/**
	 * Sets the `toString` method of `func` to return `string`.
	 *
	 * @private
	 * @param {Function} func The function to modify.
	 * @param {Function} string The `toString` result.
	 * @returns {Function} Returns `func`.
	 */
	var setToString = _shortOut(_baseSetToString);

	var _setToString = setToString;

	/**
	 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
	 *
	 * @private
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 */
	function baseRest(func, start) {
	  return _setToString(_overRest(func, start, identity_1), func + '');
	}

	var _baseRest = baseRest;

	/**
	 * Checks if the given arguments are from an iteratee call.
	 *
	 * @private
	 * @param {*} value The potential iteratee value argument.
	 * @param {*} index The potential iteratee index or key argument.
	 * @param {*} object The potential iteratee object argument.
	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
	 *  else `false`.
	 */
	function isIterateeCall(value, index, object) {
	  if (!isObject_1(object)) {
	    return false;
	  }
	  var type = typeof index;
	  if (type == 'number'
	        ? (isArrayLike_1(object) && _isIndex(index, object.length))
	        : (type == 'string' && index in object)
	      ) {
	    return eq_1(object[index], value);
	  }
	  return false;
	}

	var _isIterateeCall = isIterateeCall;

	/**
	 * Creates a function like `_.assign`.
	 *
	 * @private
	 * @param {Function} assigner The function to assign values.
	 * @returns {Function} Returns the new assigner function.
	 */
	function createAssigner(assigner) {
	  return _baseRest(function(object, sources) {
	    var index = -1,
	        length = sources.length,
	        customizer = length > 1 ? sources[length - 1] : undefined,
	        guard = length > 2 ? sources[2] : undefined;

	    customizer = (assigner.length > 3 && typeof customizer == 'function')
	      ? (length--, customizer)
	      : undefined;

	    if (guard && _isIterateeCall(sources[0], sources[1], guard)) {
	      customizer = length < 3 ? undefined : customizer;
	      length = 1;
	    }
	    object = Object(object);
	    while (++index < length) {
	      var source = sources[index];
	      if (source) {
	        assigner(object, source, index, customizer);
	      }
	    }
	    return object;
	  });
	}

	var _createAssigner = createAssigner;

	/**
	 * This method is like `_.merge` except that it accepts `customizer` which
	 * is invoked to produce the merged values of the destination and source
	 * properties. If `customizer` returns `undefined`, merging is handled by the
	 * method instead. The `customizer` is invoked with six arguments:
	 * (objValue, srcValue, key, object, source, stack).
	 *
	 * **Note:** This method mutates `object`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} sources The source objects.
	 * @param {Function} customizer The function to customize assigned values.
	 * @returns {Object} Returns `object`.
	 * @example
	 *
	 * function customizer(objValue, srcValue) {
	 *   if (_.isArray(objValue)) {
	 *     return objValue.concat(srcValue);
	 *   }
	 * }
	 *
	 * var object = { 'a': [1], 'b': [2] };
	 * var other = { 'a': [3], 'b': [4] };
	 *
	 * _.mergeWith(object, other, customizer);
	 * // => { 'a': [1, 3], 'b': [2, 4] }
	 */
	var mergeWith = _createAssigner(function(object, source, srcIndex, customizer) {
	  _baseMerge(object, source, srcIndex, customizer);
	});

	var mergeWith_1 = mergeWith;

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
	  else object[propertyKey] = value;
	};

	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('slice');
	var USES_TO_LENGTH$6 = arrayMethodUsesToLength('slice', { ACCESSORS: true, 0: 0, 1: 2 });

	var SPECIES$5 = wellKnownSymbol('species');
	var nativeSlice = [].slice;
	var max$1 = Math.max;

	// `Array.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 || !USES_TO_LENGTH$6 }, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject(this);
	    var length = toLength(O.length);
	    var k = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
	    var Constructor, result, n;
	    if (isArray(O)) {
	      Constructor = O.constructor;
	      // cross-realm fallback
	      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject(Constructor)) {
	        Constructor = Constructor[SPECIES$5];
	        if (Constructor === null) Constructor = undefined;
	      }
	      if (Constructor === Array || Constructor === undefined) {
	        return nativeSlice.call(O, k, fin);
	      }
	    }
	    result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));
	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
	    result.length = n;
	    return result;
	  }
	});

	// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
	// so we use an intermediate function.
	function RE(s, f) {
	  return RegExp(s, f);
	}

	var UNSUPPORTED_Y = fails(function () {
	  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
	  var re = RE('a', 'y');
	  re.lastIndex = 2;
	  return re.exec('abcd') != null;
	});

	var BROKEN_CARET = fails(function () {
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
	  var re = RE('^r', 'gy');
	  re.lastIndex = 2;
	  return re.exec('str') != null;
	});

	var regexpStickyHelpers = {
		UNSUPPORTED_Y: UNSUPPORTED_Y,
		BROKEN_CARET: BROKEN_CARET
	};

	var nativeExec = RegExp.prototype.exec;
	// This always refers to the native implementation, because the
	// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
	// which loads this file before patching the method.
	var nativeReplace = String.prototype.replace;

	var patchedExec = nativeExec;

	var UPDATES_LAST_INDEX_WRONG = (function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  nativeExec.call(re1, 'a');
	  nativeExec.call(re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	})();

	var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET;

	// nonparticipating capturing group, copied from es5-shim's String#split patch.
	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1;

	if (PATCH) {
	  patchedExec = function exec(str) {
	    var re = this;
	    var lastIndex, reCopy, match, i;
	    var sticky = UNSUPPORTED_Y$1 && re.sticky;
	    var flags = regexpFlags.call(re);
	    var source = re.source;
	    var charsAdded = 0;
	    var strCopy = str;

	    if (sticky) {
	      flags = flags.replace('y', '');
	      if (flags.indexOf('g') === -1) {
	        flags += 'g';
	      }

	      strCopy = String(str).slice(re.lastIndex);
	      // Support anchored sticky behavior.
	      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
	        source = '(?: ' + source + ')';
	        strCopy = ' ' + strCopy;
	        charsAdded++;
	      }
	      // ^(? + rx + ) is needed, in combination with some str slicing, to
	      // simulate the 'y' flag.
	      reCopy = new RegExp('^(?:' + source + ')', flags);
	    }

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
	    }
	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

	    match = nativeExec.call(sticky ? reCopy : re, strCopy);

	    if (sticky) {
	      if (match) {
	        match.input = match.input.slice(charsAdded);
	        match[0] = match[0].slice(charsAdded);
	        match.index = re.lastIndex;
	        re.lastIndex += match[0].length;
	      } else re.lastIndex = 0;
	    } else if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }
	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      nativeReplace.call(match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    return match;
	  };
	}

	var regexpExec = patchedExec;

	_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
	  exec: regexpExec
	});

	// TODO: Remove from `core-js@4` since it's moved to entry points







	var SPECIES$6 = wellKnownSymbol('species');

	var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
	  // #replace needs built-in support for named groups.
	  // #match works fine because it just return the exec results, even if it has
	  // a "grops" property.
	  var re = /./;
	  re.exec = function () {
	    var result = [];
	    result.groups = { a: '7' };
	    return result;
	  };
	  return ''.replace(re, '$<a>') !== '7';
	});

	// IE <= 11 replaces $0 with the whole match, as if it was $&
	// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
	var REPLACE_KEEPS_$0 = (function () {
	  return 'a'.replace(/./, '$0') === '$0';
	})();

	var REPLACE = wellKnownSymbol('replace');
	// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
	var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
	  if (/./[REPLACE]) {
	    return /./[REPLACE]('a', '$0') === '';
	  }
	  return false;
	})();

	// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	// Weex JS has frozen built-in prototypes, so use try / catch wrapper
	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
	  var re = /(?:)/;
	  var originalExec = re.exec;
	  re.exec = function () { return originalExec.apply(this, arguments); };
	  var result = 'ab'.split(re);
	  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
	});

	var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
	  var SYMBOL = wellKnownSymbol(KEY);

	  var DELEGATES_TO_SYMBOL = !fails(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};
	    O[SYMBOL] = function () { return 7; };
	    return ''[KEY](O) != 7;
	  });

	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;

	    if (KEY === 'split') {
	      // We can't use real regex here since it causes deoptimization
	      // and serious performance degradation in V8
	      // https://github.com/zloirock/core-js/issues/306
	      re = {};
	      // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.
	      re.constructor = {};
	      re.constructor[SPECIES$6] = function () { return re; };
	      re.flags = '';
	      re[SYMBOL] = /./[SYMBOL];
	    }

	    re.exec = function () { execCalled = true; return null; };

	    re[SYMBOL]('');
	    return !execCalled;
	  });

	  if (
	    !DELEGATES_TO_SYMBOL ||
	    !DELEGATES_TO_EXEC ||
	    (KEY === 'replace' && !(
	      REPLACE_SUPPORTS_NAMED_GROUPS &&
	      REPLACE_KEEPS_$0 &&
	      !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
	    )) ||
	    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
	  ) {
	    var nativeRegExpMethod = /./[SYMBOL];
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      if (regexp.exec === regexpExec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
	        }
	        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
	      }
	      return { done: false };
	    }, {
	      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
	      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
	    });
	    var stringMethod = methods[0];
	    var regexMethod = methods[1];

	    redefine(String.prototype, KEY, stringMethod);
	    redefine(RegExp.prototype, SYMBOL, length == 2
	      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	      ? function (string, arg) { return regexMethod.call(string, this, arg); }
	      // 21.2.5.6 RegExp.prototype[@@match](string)
	      // 21.2.5.9 RegExp.prototype[@@search](string)
	      : function (string) { return regexMethod.call(string, this); }
	    );
	  }

	  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
	};

	var charAt$1 = stringMultibyte.charAt;

	// `AdvanceStringIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-advancestringindex
	var advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? charAt$1(S, index).length : 1);
	};

	// `RegExpExec` abstract operation
	// https://tc39.github.io/ecma262/#sec-regexpexec
	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;
	  if (typeof exec === 'function') {
	    var result = exec.call(R, S);
	    if (typeof result !== 'object') {
	      throw TypeError('RegExp exec method returned something other than an Object or null');
	    }
	    return result;
	  }

	  if (classofRaw(R) !== 'RegExp') {
	    throw TypeError('RegExp#exec called on incompatible receiver');
	  }

	  return regexpExec.call(R, S);
	};

	var max$2 = Math.max;
	var min$2 = Math.min;
	var floor$1 = Math.floor;
	var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

	var maybeToString = function (it) {
	  return it === undefined ? it : String(it);
	};

	// @@replace logic
	fixRegexpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
	  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
	  var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
	  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

	  return [
	    // `String.prototype.replace` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
	    function replace(searchValue, replaceValue) {
	      var O = requireObjectCoercible(this);
	      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
	      return replacer !== undefined
	        ? replacer.call(searchValue, O, replaceValue)
	        : nativeReplace.call(String(O), searchValue, replaceValue);
	    },
	    // `RegExp.prototype[@@replace]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
	    function (regexp, replaceValue) {
	      if (
	        (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0) ||
	        (typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1)
	      ) {
	        var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
	        if (res.done) return res.value;
	      }

	      var rx = anObject(regexp);
	      var S = String(this);

	      var functionalReplace = typeof replaceValue === 'function';
	      if (!functionalReplace) replaceValue = String(replaceValue);

	      var global = rx.global;
	      if (global) {
	        var fullUnicode = rx.unicode;
	        rx.lastIndex = 0;
	      }
	      var results = [];
	      while (true) {
	        var result = regexpExecAbstract(rx, S);
	        if (result === null) break;

	        results.push(result);
	        if (!global) break;

	        var matchStr = String(result[0]);
	        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	      }

	      var accumulatedResult = '';
	      var nextSourcePosition = 0;
	      for (var i = 0; i < results.length; i++) {
	        result = results[i];

	        var matched = String(result[0]);
	        var position = max$2(min$2(toInteger(result.index), S.length), 0);
	        var captures = [];
	        // NOTE: This is equivalent to
	        //   captures = result.slice(1).map(maybeToString)
	        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
	        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
	        var namedCaptures = result.groups;
	        if (functionalReplace) {
	          var replacerArgs = [matched].concat(captures, position, S);
	          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
	          var replacement = String(replaceValue.apply(undefined, replacerArgs));
	        } else {
	          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
	        }
	        if (position >= nextSourcePosition) {
	          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
	          nextSourcePosition = position + matched.length;
	        }
	      }
	      return accumulatedResult + S.slice(nextSourcePosition);
	    }
	  ];

	  // https://tc39.github.io/ecma262/#sec-getsubstitution
	  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
	    var tailPos = position + matched.length;
	    var m = captures.length;
	    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
	    if (namedCaptures !== undefined) {
	      namedCaptures = toObject(namedCaptures);
	      symbols = SUBSTITUTION_SYMBOLS;
	    }
	    return nativeReplace.call(replacement, symbols, function (match, ch) {
	      var capture;
	      switch (ch.charAt(0)) {
	        case '$': return '$';
	        case '&': return matched;
	        case '`': return str.slice(0, position);
	        case "'": return str.slice(tailPos);
	        case '<':
	          capture = namedCaptures[ch.slice(1, -1)];
	          break;
	        default: // \d\d?
	          var n = +ch;
	          if (n === 0) return match;
	          if (n > m) {
	            var f = floor$1(n / 10);
	            if (f === 0) return match;
	            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
	            return match;
	          }
	          capture = captures[n - 1];
	      }
	      return capture === undefined ? '' : capture;
	    });
	  }
	});

	// a string of all valid unicode whitespaces
	// eslint-disable-next-line max-len
	var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var whitespace = '[' + whitespaces + ']';
	var ltrim = RegExp('^' + whitespace + whitespace + '*');
	var rtrim = RegExp(whitespace + whitespace + '*$');

	// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
	var createMethod$4 = function (TYPE) {
	  return function ($this) {
	    var string = String(requireObjectCoercible($this));
	    if (TYPE & 1) string = string.replace(ltrim, '');
	    if (TYPE & 2) string = string.replace(rtrim, '');
	    return string;
	  };
	};

	var stringTrim = {
	  // `String.prototype.{ trimLeft, trimStart }` methods
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
	  start: createMethod$4(1),
	  // `String.prototype.{ trimRight, trimEnd }` methods
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
	  end: createMethod$4(2),
	  // `String.prototype.trim` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
	  trim: createMethod$4(3)
	};

	var non = '\u200B\u0085\u180E';

	// check that a method works with the correct list
	// of whitespaces and has a correct name
	var stringTrimForced = function (METHOD_NAME) {
	  return fails(function () {
	    return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
	  });
	};

	var $trim = stringTrim.trim;


	// `String.prototype.trim` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.trim
	_export({ target: 'String', proto: true, forced: stringTrimForced('trim') }, {
	  trim: function trim() {
	    return $trim(this);
	  }
	});

	var RuleType;

	(function (RuleType) {
	  // type: rule will be rewrote
	  RuleType[RuleType["STYLE"] = 1] = "STYLE";
	  RuleType[RuleType["MEDIA"] = 4] = "MEDIA";
	  RuleType[RuleType["SUPPORTS"] = 12] = "SUPPORTS"; // type: value will be kept

	  RuleType[RuleType["IMPORT"] = 3] = "IMPORT";
	  RuleType[RuleType["FONT_FACE"] = 5] = "FONT_FACE";
	  RuleType[RuleType["PAGE"] = 6] = "PAGE";
	  RuleType[RuleType["KEYFRAMES"] = 7] = "KEYFRAMES";
	  RuleType[RuleType["KEYFRAME"] = 8] = "KEYFRAME";
	})(RuleType || (RuleType = {}));

	var arrayify = function arrayify(list) {
	  return [].slice.call(list, 0);
	};

	var rawDocumentBodyAppend = HTMLBodyElement.prototype.appendChild;
	var QiankunCSSRewriteAttr = 'data-legions';

	var ScopedCSS =
	/** @class */
	function () {
	  function ScopedCSS() {
	    var styleNode = document.createElement('style');
	    rawDocumentBodyAppend.call(document.body, styleNode);
	    this.swapNode = styleNode;
	    this.sheet = styleNode.sheet;
	    this.sheet.disabled = true;
	  }

	  ScopedCSS.prototype.process = function (styleNode, prefix) {
	    var _this = this;

	    var _a;

	    if (prefix === void 0) {
	      prefix = '';
	    }

	    if (styleNode.textContent !== '') {
	      var textNode = document.createTextNode(styleNode.textContent || '');
	      this.swapNode.appendChild(textNode);
	      var sheet = this.swapNode.sheet; // type is missing

	      var rules = arrayify((_a = sheet === null || sheet === void 0 ? void 0 : sheet.cssRules) !== null && _a !== void 0 ? _a : []);
	      var css = this.rewrite(rules, prefix); // eslint-disable-next-line no-param-reassign

	      styleNode.textContent = css; // cleanup

	      this.swapNode.removeChild(textNode);
	      return;
	    }

	    var mutator = new MutationObserver(function (mutations) {
	      var _a;

	      for (var i = 0; i < mutations.length; i += 1) {
	        var mutation = mutations[i];

	        if (ScopedCSS.ModifiedTag in styleNode) {
	          return;
	        }

	        if (mutation.type === 'childList') {
	          var sheet = styleNode.sheet;
	          var rules = arrayify((_a = sheet === null || sheet === void 0 ? void 0 : sheet.cssRules) !== null && _a !== void 0 ? _a : []);

	          var css = _this.rewrite(rules, prefix); // eslint-disable-next-line no-param-reassign


	          styleNode.textContent = css; // eslint-disable-next-line no-param-reassign

	          styleNode[ScopedCSS.ModifiedTag] = true;
	        }
	      }
	    }); // since observer will be deleted when node be removed
	    // we dont need create a cleanup function manually
	    // see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/disconnect

	    mutator.observe(styleNode, {
	      childList: true
	    });
	  };

	  ScopedCSS.prototype.rewrite = function (rules, prefix) {
	    var _this = this;

	    if (prefix === void 0) {
	      prefix = '';
	    }

	    var css = '';
	    rules.forEach(function (rule) {
	      switch (rule.type) {
	        case RuleType.STYLE:
	          css += _this.ruleStyle(rule, prefix);
	          break;

	        case RuleType.MEDIA:
	          css += _this.ruleMedia(rule, prefix);
	          break;

	        case RuleType.SUPPORTS:
	          css += _this.ruleSupport(rule, prefix);
	          break;

	        default:
	          css += "" + rule.cssText;
	          break;
	      }
	    });
	    return css;
	  }; // handle case:
	  // .app-main {}
	  // html, body {}
	  // eslint-disable-next-line class-methods-use-this


	  ScopedCSS.prototype.ruleStyle = function (rule, prefix) {
	    var rootSelectorRE = /((?:[^\w\-.#]|^)(body|html|:root))/gm;
	    var rootCombinationRE = /(html[^\w{[]+)/gm;
	    var selector = rule.selectorText.trim();
	    var cssText = rule.cssText; // handle html { ... }
	    // handle body { ... }
	    // handle :root { ... }

	    if (selector === 'html' || selector === 'body' || selector === ':root') {
	      return cssText.replace(rootSelectorRE, prefix);
	    } // handle html body { ... }
	    // handle html > body { ... }


	    if (rootCombinationRE.test(rule.selectorText)) {
	      var siblingSelectorRE = /(html[^\w{]+)(\+|~)/gm; // since html + body is a non-standard rule for html
	      // transformer will ignore it

	      if (!siblingSelectorRE.test(rule.selectorText)) {
	        cssText = cssText.replace(rootCombinationRE, '');
	      }
	    } // handle grouping selector, a,span,p,div { ... }


	    cssText = cssText.replace(/^[\s\S]+{/, function (selectors) {
	      return selectors.replace(/(^|,\n?)([^,]+)/g, function (item, p, s) {
	        // handle div,body,span { ... }
	        if (rootSelectorRE.test(item)) {
	          return item.replace(rootSelectorRE, function (m) {
	            // do not discard valid previous character, such as body,html or *:not(:root)
	            var whitePrevChars = [',', '('];

	            if (m && whitePrevChars.includes(m[0])) {
	              return "" + m[0] + prefix;
	            } // replace root selector with prefix


	            return prefix;
	          });
	        }

	        return "" + p + prefix + " " + s.replace(/^ */, '');
	      });
	    });
	    return cssText;
	  }; // handle case:
	  // @media screen and (max-width: 300px) {}


	  ScopedCSS.prototype.ruleMedia = function (rule, prefix) {
	    var css = this.rewrite(arrayify(rule.cssRules), prefix);
	    return "@media " + rule.conditionText + " {" + css + "}";
	  }; // handle case:
	  // @supports (display: grid) {}


	  ScopedCSS.prototype.ruleSupport = function (rule, prefix) {
	    var css = this.rewrite(arrayify(rule.cssRules), prefix);
	    return "@supports " + rule.conditionText + " {" + css + "}";
	  };

	  ScopedCSS.ModifiedTag = 'Symbol(style-modified-qiankun)';
	  return ScopedCSS;
	}();
	var processor;
	var process$4 = function process(appWrapper, stylesheetElement, appName) {
	  // lazy singleton pattern
	  if (!processor) {
	    processor = new ScopedCSS();
	  }

	  if (stylesheetElement.tagName === 'LINK') {
	    console.warn('Feature: sandbox.experimentalStyleIsolation is not support for link element yet.');
	  }

	  var mountDOM = appWrapper;

	  if (!mountDOM) {
	    return;
	  }

	  var tag = (mountDOM.tagName || '').toLowerCase();

	  if (tag && stylesheetElement.tagName === 'STYLE') {
	    var prefix = tag + "[" + QiankunCSSRewriteAttr + "=\"" + appName + "\"]";
	    processor.process(stylesheetElement, prefix);
	  }
	};

	var rawPublicPath = window.__INJECTED_PUBLIC_PATH_BY_LEGIONS__;
	function getAddOn(global, publicPath) {
	  if (publicPath === void 0) {
	    publicPath = '/';
	  }

	  var hasMountedOnce = false;
	  return {
	    beforeLoad: function beforeLoad() {
	      return __awaiter(this, void 0, void 0, function () {
	        return __generator(this, function (_a) {
	          // eslint-disable-next-line no-param-reassign
	          global.__INJECTED_PUBLIC_PATH_BY_LEGIONS__ = publicPath;
	          return [2
	          /*return*/
	          ];
	        });
	      });
	    },
	    beforeMount: function beforeMount() {
	      return __awaiter(this, void 0, void 0, function () {
	        return __generator(this, function (_a) {
	          if (hasMountedOnce) {
	            // eslint-disable-next-line no-param-reassign
	            global.__INJECTED_PUBLIC_PATH_BY_LEGIONS__ = publicPath;
	          }

	          return [2
	          /*return*/
	          ];
	        });
	      });
	    },
	    beforeUnmount: function beforeUnmount() {
	      return __awaiter(this, void 0, void 0, function () {
	        return __generator(this, function (_a) {
	          if (rawPublicPath === undefined) {
	            // eslint-disable-next-line no-param-reassign
	            delete global.__INJECTED_PUBLIC_PATH_BY_LEGIONS__;
	          } else {
	            // eslint-disable-next-line no-param-reassign
	            global.__INJECTED_PUBLIC_PATH_BY_LEGIONS__ = rawPublicPath;
	          }

	          hasMountedOnce = true;
	          return [2
	          /*return*/
	          ];
	        });
	      });
	    }
	  };
	}

	function getAddOn$1(global) {
	  return {
	    beforeLoad: function beforeLoad() {
	      return __awaiter(this, void 0, void 0, function () {
	        return __generator(this, function (_a) {
	          // eslint-disable-next-line no-param-reassign
	          global.__POWERED_BY_LEGIONS__ = true;
	          return [2
	          /*return*/
	          ];
	        });
	      });
	    },
	    beforeMount: function beforeMount() {
	      return __awaiter(this, void 0, void 0, function () {
	        return __generator(this, function (_a) {
	          // eslint-disable-next-line no-param-reassign
	          global.__POWERED_BY_LEGIONS__ = true;
	          return [2
	          /*return*/
	          ];
	        });
	      });
	    },
	    beforeUnmount: function beforeUnmount() {
	      return __awaiter(this, void 0, void 0, function () {
	        return __generator(this, function (_a) {
	          // eslint-disable-next-line no-param-reassign
	          delete global.__POWERED_BY_LEGIONS__;
	          return [2
	          /*return*/
	          ];
	        });
	      });
	    }
	  };
	}

	function getAddOns(global, publicPath) {
	  return mergeWith_1({}, getAddOn$1(global), getAddOn(global, publicPath), function (v1, v2) {
	    return concat_1(v1 !== null && v1 !== void 0 ? v1 : [], v2 !== null && v2 !== void 0 ? v2 : []);
	  });
	}

	var nativeAssign = Object.assign;
	var defineProperty$4 = Object.defineProperty;

	// `Object.assign` method
	// https://tc39.github.io/ecma262/#sec-object.assign
	var objectAssign = !nativeAssign || fails(function () {
	  // should have correct order of operations (Edge bug)
	  if (descriptors && nativeAssign({ b: 1 }, nativeAssign(defineProperty$4({}, 'a', {
	    enumerable: true,
	    get: function () {
	      defineProperty$4(this, 'b', {
	        value: 3,
	        enumerable: false
	      });
	    }
	  }), { b: 2 })).b !== 1) return true;
	  // should work with symbols and should have deterministic property order (V8 bug)
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line no-undef
	  var symbol = Symbol();
	  var alphabet = 'abcdefghijklmnopqrst';
	  A[symbol] = 7;
	  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
	  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
	  var T = toObject(target);
	  var argumentsLength = arguments.length;
	  var index = 1;
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
	  while (argumentsLength > index) {
	    var S = indexedObject(arguments[index++]);
	    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) {
	      key = keys[j++];
	      if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
	    }
	  } return T;
	} : nativeAssign;

	// `Object.assign` method
	// https://tc39.github.io/ecma262/#sec-object.assign
	_export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
	  assign: objectAssign
	});

	var FAILS_ON_PRIMITIVES$1 = fails(function () { objectKeys(1); });

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$1 }, {
	  keys: function keys(it) {
	    return objectKeys(toObject(it));
	  }
	});

	/**
	 * The base implementation of `_.assign` without support for multiple sources
	 * or `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @returns {Object} Returns `object`.
	 */
	function baseAssign(object, source) {
	  return object && _copyObject(source, keys_1(source), object);
	}

	var _baseAssign = baseAssign;

	/**
	 * The base implementation of `_.assignIn` without support for multiple sources
	 * or `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @returns {Object} Returns `object`.
	 */
	function baseAssignIn(object, source) {
	  return object && _copyObject(source, keysIn_1(source), object);
	}

	var _baseAssignIn = baseAssignIn;

	/**
	 * A specialized version of `_.filter` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {Array} Returns the new filtered array.
	 */
	function arrayFilter(array, predicate) {
	  var index = -1,
	      length = array == null ? 0 : array.length,
	      resIndex = 0,
	      result = [];

	  while (++index < length) {
	    var value = array[index];
	    if (predicate(value, index, array)) {
	      result[resIndex++] = value;
	    }
	  }
	  return result;
	}

	var _arrayFilter = arrayFilter;

	/**
	 * This method returns a new empty array.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.13.0
	 * @category Util
	 * @returns {Array} Returns the new empty array.
	 * @example
	 *
	 * var arrays = _.times(2, _.stubArray);
	 *
	 * console.log(arrays);
	 * // => [[], []]
	 *
	 * console.log(arrays[0] === arrays[1]);
	 * // => false
	 */
	function stubArray() {
	  return [];
	}

	var stubArray_1 = stubArray;

	/** Used for built-in method references. */
	var objectProto$c = Object.prototype;

	/** Built-in value references. */
	var propertyIsEnumerable$1 = objectProto$c.propertyIsEnumerable;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetSymbols = Object.getOwnPropertySymbols;

	/**
	 * Creates an array of the own enumerable symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of symbols.
	 */
	var getSymbols = !nativeGetSymbols ? stubArray_1 : function(object) {
	  if (object == null) {
	    return [];
	  }
	  object = Object(object);
	  return _arrayFilter(nativeGetSymbols(object), function(symbol) {
	    return propertyIsEnumerable$1.call(object, symbol);
	  });
	};

	var _getSymbols = getSymbols;

	/**
	 * Copies own symbols of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy symbols from.
	 * @param {Object} [object={}] The object to copy symbols to.
	 * @returns {Object} Returns `object`.
	 */
	function copySymbols(source, object) {
	  return _copyObject(source, _getSymbols(source), object);
	}

	var _copySymbols = copySymbols;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetSymbols$1 = Object.getOwnPropertySymbols;

	/**
	 * Creates an array of the own and inherited enumerable symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of symbols.
	 */
	var getSymbolsIn = !nativeGetSymbols$1 ? stubArray_1 : function(object) {
	  var result = [];
	  while (object) {
	    _arrayPush(result, _getSymbols(object));
	    object = _getPrototype(object);
	  }
	  return result;
	};

	var _getSymbolsIn = getSymbolsIn;

	/**
	 * Copies own and inherited symbols of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy symbols from.
	 * @param {Object} [object={}] The object to copy symbols to.
	 * @returns {Object} Returns `object`.
	 */
	function copySymbolsIn(source, object) {
	  return _copyObject(source, _getSymbolsIn(source), object);
	}

	var _copySymbolsIn = copySymbolsIn;

	/**
	 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
	 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
	 * symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @param {Function} symbolsFunc The function to get the symbols of `object`.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function baseGetAllKeys(object, keysFunc, symbolsFunc) {
	  var result = keysFunc(object);
	  return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
	}

	var _baseGetAllKeys = baseGetAllKeys;

	/**
	 * Creates an array of own enumerable property names and symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function getAllKeys(object) {
	  return _baseGetAllKeys(object, keys_1, _getSymbols);
	}

	var _getAllKeys = getAllKeys;

	/**
	 * Creates an array of own and inherited enumerable property names and
	 * symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function getAllKeysIn(object) {
	  return _baseGetAllKeys(object, keysIn_1, _getSymbolsIn);
	}

	var _getAllKeysIn = getAllKeysIn;

	/* Built-in method references that are verified to be native. */
	var DataView$1 = _getNative(_root, 'DataView');

	var _DataView = DataView$1;

	/* Built-in method references that are verified to be native. */
	var Promise$2 = _getNative(_root, 'Promise');

	var _Promise = Promise$2;

	/* Built-in method references that are verified to be native. */
	var Set$1 = _getNative(_root, 'Set');

	var _Set = Set$1;

	/* Built-in method references that are verified to be native. */
	var WeakMap$3 = _getNative(_root, 'WeakMap');

	var _WeakMap = WeakMap$3;

	/** `Object#toString` result references. */
	var mapTag$1 = '[object Map]',
	    objectTag$2 = '[object Object]',
	    promiseTag = '[object Promise]',
	    setTag$1 = '[object Set]',
	    weakMapTag$1 = '[object WeakMap]';

	var dataViewTag$1 = '[object DataView]';

	/** Used to detect maps, sets, and weakmaps. */
	var dataViewCtorString = _toSource(_DataView),
	    mapCtorString = _toSource(_Map),
	    promiseCtorString = _toSource(_Promise),
	    setCtorString = _toSource(_Set),
	    weakMapCtorString = _toSource(_WeakMap);

	/**
	 * Gets the `toStringTag` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	var getTag = _baseGetTag;

	// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
	if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$1) ||
	    (_Map && getTag(new _Map) != mapTag$1) ||
	    (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
	    (_Set && getTag(new _Set) != setTag$1) ||
	    (_WeakMap && getTag(new _WeakMap) != weakMapTag$1)) {
	  getTag = function(value) {
	    var result = _baseGetTag(value),
	        Ctor = result == objectTag$2 ? value.constructor : undefined,
	        ctorString = Ctor ? _toSource(Ctor) : '';

	    if (ctorString) {
	      switch (ctorString) {
	        case dataViewCtorString: return dataViewTag$1;
	        case mapCtorString: return mapTag$1;
	        case promiseCtorString: return promiseTag;
	        case setCtorString: return setTag$1;
	        case weakMapCtorString: return weakMapTag$1;
	      }
	    }
	    return result;
	  };
	}

	var _getTag = getTag;

	/** Used for built-in method references. */
	var objectProto$d = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty$b = objectProto$d.hasOwnProperty;

	/**
	 * Initializes an array clone.
	 *
	 * @private
	 * @param {Array} array The array to clone.
	 * @returns {Array} Returns the initialized clone.
	 */
	function initCloneArray(array) {
	  var length = array.length,
	      result = new array.constructor(length);

	  // Add properties assigned by `RegExp#exec`.
	  if (length && typeof array[0] == 'string' && hasOwnProperty$b.call(array, 'index')) {
	    result.index = array.index;
	    result.input = array.input;
	  }
	  return result;
	}

	var _initCloneArray = initCloneArray;

	/**
	 * Creates a clone of `dataView`.
	 *
	 * @private
	 * @param {Object} dataView The data view to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned data view.
	 */
	function cloneDataView(dataView, isDeep) {
	  var buffer = isDeep ? _cloneArrayBuffer(dataView.buffer) : dataView.buffer;
	  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
	}

	var _cloneDataView = cloneDataView;

	/** Used to match `RegExp` flags from their coerced string values. */
	var reFlags = /\w*$/;

	/**
	 * Creates a clone of `regexp`.
	 *
	 * @private
	 * @param {Object} regexp The regexp to clone.
	 * @returns {Object} Returns the cloned regexp.
	 */
	function cloneRegExp(regexp) {
	  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
	  result.lastIndex = regexp.lastIndex;
	  return result;
	}

	var _cloneRegExp = cloneRegExp;

	/** Used to convert symbols to primitives and strings. */
	var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
	    symbolValueOf = symbolProto$1 ? symbolProto$1.valueOf : undefined;

	/**
	 * Creates a clone of the `symbol` object.
	 *
	 * @private
	 * @param {Object} symbol The symbol object to clone.
	 * @returns {Object} Returns the cloned symbol object.
	 */
	function cloneSymbol(symbol) {
	  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
	}

	var _cloneSymbol = cloneSymbol;

	/** `Object#toString` result references. */
	var boolTag$1 = '[object Boolean]',
	    dateTag$1 = '[object Date]',
	    mapTag$2 = '[object Map]',
	    numberTag$1 = '[object Number]',
	    regexpTag$1 = '[object RegExp]',
	    setTag$2 = '[object Set]',
	    stringTag$1 = '[object String]',
	    symbolTag$1 = '[object Symbol]';

	var arrayBufferTag$1 = '[object ArrayBuffer]',
	    dataViewTag$2 = '[object DataView]',
	    float32Tag$1 = '[object Float32Array]',
	    float64Tag$1 = '[object Float64Array]',
	    int8Tag$1 = '[object Int8Array]',
	    int16Tag$1 = '[object Int16Array]',
	    int32Tag$1 = '[object Int32Array]',
	    uint8Tag$1 = '[object Uint8Array]',
	    uint8ClampedTag$1 = '[object Uint8ClampedArray]',
	    uint16Tag$1 = '[object Uint16Array]',
	    uint32Tag$1 = '[object Uint32Array]';

	/**
	 * Initializes an object clone based on its `toStringTag`.
	 *
	 * **Note:** This function only supports cloning values with tags of
	 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @param {string} tag The `toStringTag` of the object to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneByTag(object, tag, isDeep) {
	  var Ctor = object.constructor;
	  switch (tag) {
	    case arrayBufferTag$1:
	      return _cloneArrayBuffer(object);

	    case boolTag$1:
	    case dateTag$1:
	      return new Ctor(+object);

	    case dataViewTag$2:
	      return _cloneDataView(object, isDeep);

	    case float32Tag$1: case float64Tag$1:
	    case int8Tag$1: case int16Tag$1: case int32Tag$1:
	    case uint8Tag$1: case uint8ClampedTag$1: case uint16Tag$1: case uint32Tag$1:
	      return _cloneTypedArray(object, isDeep);

	    case mapTag$2:
	      return new Ctor;

	    case numberTag$1:
	    case stringTag$1:
	      return new Ctor(object);

	    case regexpTag$1:
	      return _cloneRegExp(object);

	    case setTag$2:
	      return new Ctor;

	    case symbolTag$1:
	      return _cloneSymbol(object);
	  }
	}

	var _initCloneByTag = initCloneByTag;

	/** `Object#toString` result references. */
	var mapTag$3 = '[object Map]';

	/**
	 * The base implementation of `_.isMap` without Node.js optimizations.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
	 */
	function baseIsMap(value) {
	  return isObjectLike_1(value) && _getTag(value) == mapTag$3;
	}

	var _baseIsMap = baseIsMap;

	/* Node.js helper references. */
	var nodeIsMap = _nodeUtil && _nodeUtil.isMap;

	/**
	 * Checks if `value` is classified as a `Map` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
	 * @example
	 *
	 * _.isMap(new Map);
	 * // => true
	 *
	 * _.isMap(new WeakMap);
	 * // => false
	 */
	var isMap = nodeIsMap ? _baseUnary(nodeIsMap) : _baseIsMap;

	var isMap_1 = isMap;

	/** `Object#toString` result references. */
	var setTag$3 = '[object Set]';

	/**
	 * The base implementation of `_.isSet` without Node.js optimizations.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
	 */
	function baseIsSet(value) {
	  return isObjectLike_1(value) && _getTag(value) == setTag$3;
	}

	var _baseIsSet = baseIsSet;

	/* Node.js helper references. */
	var nodeIsSet = _nodeUtil && _nodeUtil.isSet;

	/**
	 * Checks if `value` is classified as a `Set` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
	 * @example
	 *
	 * _.isSet(new Set);
	 * // => true
	 *
	 * _.isSet(new WeakSet);
	 * // => false
	 */
	var isSet = nodeIsSet ? _baseUnary(nodeIsSet) : _baseIsSet;

	var isSet_1 = isSet;

	/** Used to compose bitmasks for cloning. */
	var CLONE_DEEP_FLAG = 1,
	    CLONE_FLAT_FLAG = 2,
	    CLONE_SYMBOLS_FLAG = 4;

	/** `Object#toString` result references. */
	var argsTag$2 = '[object Arguments]',
	    arrayTag$1 = '[object Array]',
	    boolTag$2 = '[object Boolean]',
	    dateTag$2 = '[object Date]',
	    errorTag$1 = '[object Error]',
	    funcTag$2 = '[object Function]',
	    genTag$1 = '[object GeneratorFunction]',
	    mapTag$4 = '[object Map]',
	    numberTag$2 = '[object Number]',
	    objectTag$3 = '[object Object]',
	    regexpTag$2 = '[object RegExp]',
	    setTag$4 = '[object Set]',
	    stringTag$2 = '[object String]',
	    symbolTag$2 = '[object Symbol]',
	    weakMapTag$2 = '[object WeakMap]';

	var arrayBufferTag$2 = '[object ArrayBuffer]',
	    dataViewTag$3 = '[object DataView]',
	    float32Tag$2 = '[object Float32Array]',
	    float64Tag$2 = '[object Float64Array]',
	    int8Tag$2 = '[object Int8Array]',
	    int16Tag$2 = '[object Int16Array]',
	    int32Tag$2 = '[object Int32Array]',
	    uint8Tag$2 = '[object Uint8Array]',
	    uint8ClampedTag$2 = '[object Uint8ClampedArray]',
	    uint16Tag$2 = '[object Uint16Array]',
	    uint32Tag$2 = '[object Uint32Array]';

	/** Used to identify `toStringTag` values supported by `_.clone`. */
	var cloneableTags = {};
	cloneableTags[argsTag$2] = cloneableTags[arrayTag$1] =
	cloneableTags[arrayBufferTag$2] = cloneableTags[dataViewTag$3] =
	cloneableTags[boolTag$2] = cloneableTags[dateTag$2] =
	cloneableTags[float32Tag$2] = cloneableTags[float64Tag$2] =
	cloneableTags[int8Tag$2] = cloneableTags[int16Tag$2] =
	cloneableTags[int32Tag$2] = cloneableTags[mapTag$4] =
	cloneableTags[numberTag$2] = cloneableTags[objectTag$3] =
	cloneableTags[regexpTag$2] = cloneableTags[setTag$4] =
	cloneableTags[stringTag$2] = cloneableTags[symbolTag$2] =
	cloneableTags[uint8Tag$2] = cloneableTags[uint8ClampedTag$2] =
	cloneableTags[uint16Tag$2] = cloneableTags[uint32Tag$2] = true;
	cloneableTags[errorTag$1] = cloneableTags[funcTag$2] =
	cloneableTags[weakMapTag$2] = false;

	/**
	 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
	 * traversed objects.
	 *
	 * @private
	 * @param {*} value The value to clone.
	 * @param {boolean} bitmask The bitmask flags.
	 *  1 - Deep clone
	 *  2 - Flatten inherited properties
	 *  4 - Clone symbols
	 * @param {Function} [customizer] The function to customize cloning.
	 * @param {string} [key] The key of `value`.
	 * @param {Object} [object] The parent object of `value`.
	 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
	 * @returns {*} Returns the cloned value.
	 */
	function baseClone(value, bitmask, customizer, key, object, stack) {
	  var result,
	      isDeep = bitmask & CLONE_DEEP_FLAG,
	      isFlat = bitmask & CLONE_FLAT_FLAG,
	      isFull = bitmask & CLONE_SYMBOLS_FLAG;

	  if (customizer) {
	    result = object ? customizer(value, key, object, stack) : customizer(value);
	  }
	  if (result !== undefined) {
	    return result;
	  }
	  if (!isObject_1(value)) {
	    return value;
	  }
	  var isArr = isArray_1(value);
	  if (isArr) {
	    result = _initCloneArray(value);
	    if (!isDeep) {
	      return _copyArray(value, result);
	    }
	  } else {
	    var tag = _getTag(value),
	        isFunc = tag == funcTag$2 || tag == genTag$1;

	    if (isBuffer_1(value)) {
	      return _cloneBuffer(value, isDeep);
	    }
	    if (tag == objectTag$3 || tag == argsTag$2 || (isFunc && !object)) {
	      result = (isFlat || isFunc) ? {} : _initCloneObject(value);
	      if (!isDeep) {
	        return isFlat
	          ? _copySymbolsIn(value, _baseAssignIn(result, value))
	          : _copySymbols(value, _baseAssign(result, value));
	      }
	    } else {
	      if (!cloneableTags[tag]) {
	        return object ? value : {};
	      }
	      result = _initCloneByTag(value, tag, isDeep);
	    }
	  }
	  // Check for circular references and return its corresponding clone.
	  stack || (stack = new _Stack);
	  var stacked = stack.get(value);
	  if (stacked) {
	    return stacked;
	  }
	  stack.set(value, result);

	  if (isSet_1(value)) {
	    value.forEach(function(subValue) {
	      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
	    });
	  } else if (isMap_1(value)) {
	    value.forEach(function(subValue, key) {
	      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
	    });
	  }

	  var keysFunc = isFull
	    ? (isFlat ? _getAllKeysIn : _getAllKeys)
	    : (isFlat ? keysIn_1 : keys_1);

	  var props = isArr ? undefined : keysFunc(value);
	  _arrayEach(props || value, function(subValue, key) {
	    if (props) {
	      key = subValue;
	      subValue = value[key];
	    }
	    // Recursively populate clone (susceptible to call stack limits).
	    _assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
	  });
	  return result;
	}

	var _baseClone = baseClone;

	/** Used to compose bitmasks for cloning. */
	var CLONE_DEEP_FLAG$1 = 1,
	    CLONE_SYMBOLS_FLAG$1 = 4;

	/**
	 * This method is like `_.clone` except that it recursively clones `value`.
	 *
	 * @static
	 * @memberOf _
	 * @since 1.0.0
	 * @category Lang
	 * @param {*} value The value to recursively clone.
	 * @returns {*} Returns the deep cloned value.
	 * @see _.clone
	 * @example
	 *
	 * var objects = [{ 'a': 1 }, { 'b': 2 }];
	 *
	 * var deep = _.cloneDeep(objects);
	 * console.log(deep[0] === objects[0]);
	 * // => false
	 */
	function cloneDeep(value) {
	  return _baseClone(value, CLONE_DEEP_FLAG$1 | CLONE_SYMBOLS_FLAG$1);
	}

	var cloneDeep_1 = cloneDeep;

	var globalState = {};
	var deps = {}; // 触发全局监听

	function emitGlobal(state, prevState) {
	  Object.keys(deps).forEach(function (id) {
	    if (deps[id] instanceof Function) {
	      deps[id](cloneDeep_1(state), cloneDeep_1(prevState));
	    }
	  });
	}
	function getMicroAppStateActions(id, isMaster) {
	  return {
	    /**
	     * onGlobalStateChange 全局依赖监听
	     *
	     * 收集 setState 时所需要触发的依赖
	     *
	     * 限制条件：每个子应用只有一个激活状态的全局监听，新监听覆盖旧监听，若只是监听部分属性，请使用 onGlobalStateChange
	     *
	     * 这么设计是为了减少全局监听滥用导致的内存爆炸
	     *
	     * 依赖数据结构为：
	     * {
	     *   {id}: callback
	     * }
	     *
	     * @param callback
	     * @param fireImmediately
	     */
	    onGlobalStateChange: function onGlobalStateChange(callback, fireImmediately) {
	      if (!(callback instanceof Function)) {
	        console.error('[legions] callback must be function!');
	        return;
	      }

	      if (deps[id]) {
	        console.warn("[legions] '" + id + "' global listener already exists before this, new listener will overwrite it.");
	      }

	      deps[id] = callback;
	      var cloneState = cloneDeep_1(globalState);

	      if (fireImmediately) {
	        callback(cloneState, cloneState);
	      }
	    },

	    /**
	     * setGlobalState 更新 store 数据
	     *
	     * 1. 对输入 state 的第一层属性做校验，只有初始化时声明过的第一层（bucket）属性才会被更改
	     * 2. 修改 store 并触发全局监听
	     *
	     * @param state
	     */
	    setGlobalState: function setGlobalState(state) {
	      if (state === void 0) {
	        state = {};
	      }

	      if (state === globalState) {
	        console.warn('[legions] state has not changed！');
	        return false;
	      }

	      var changeKeys = [];
	      var prevGlobalState = cloneDeep_1(globalState);
	      globalState = cloneDeep_1(Object.keys(state).reduce(function (_globalState, changeKey) {
	        var _a;

	        if (isMaster || _globalState.hasOwnProperty(changeKey)) {
	          changeKeys.push(changeKey);
	          return Object.assign(_globalState, (_a = {}, _a[changeKey] = state[changeKey], _a));
	        }

	        console.warn("[legions] '" + changeKey + "' not declared when init state\uFF01");
	        return _globalState;
	      }, globalState));

	      if (changeKeys.length === 0) {
	        console.warn('[legions] state has not changed！');
	        return false;
	      }

	      emitGlobal(globalState, prevGlobalState);
	      return true;
	    },
	    // 注销该应用下的依赖
	    offGlobalStateChange: function offGlobalStateChange() {
	      delete deps[id];
	      return true;
	    }
	  };
	}

	var $map = arrayIteration.map;



	var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('map');
	// FF49- issue
	var USES_TO_LENGTH$7 = arrayMethodUsesToLength('map');

	// `Array.prototype.map` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.map
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 || !USES_TO_LENGTH$7 }, {
	  map: function map(callbackfn /* , thisArg */) {
	    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var f$9 = wellKnownSymbol;

	var wellKnownSymbolWrapped = {
		f: f$9
	};

	var defineProperty$5 = objectDefineProperty.f;

	var defineWellKnownSymbol = function (NAME) {
	  var Symbol = path.Symbol || (path.Symbol = {});
	  if (!has(Symbol, NAME)) defineProperty$5(Symbol, NAME, {
	    value: wellKnownSymbolWrapped.f(NAME)
	  });
	};

	var $forEach$1 = arrayIteration.forEach;

	var HIDDEN = sharedKey('hidden');
	var SYMBOL = 'Symbol';
	var PROTOTYPE$1 = 'prototype';
	var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
	var setInternalState$4 = internalState.set;
	var getInternalState$3 = internalState.getterFor(SYMBOL);
	var ObjectPrototype$1 = Object[PROTOTYPE$1];
	var $Symbol = global_1.Symbol;
	var $stringify = getBuiltIn('JSON', 'stringify');
	var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	var nativeDefineProperty$1 = objectDefineProperty.f;
	var nativeGetOwnPropertyNames$2 = objectGetOwnPropertyNamesExternal.f;
	var nativePropertyIsEnumerable$1 = objectPropertyIsEnumerable.f;
	var AllSymbols = shared('symbols');
	var ObjectPrototypeSymbols = shared('op-symbols');
	var StringToSymbolRegistry = shared('string-to-symbol-registry');
	var SymbolToStringRegistry = shared('symbol-to-string-registry');
	var WellKnownSymbolsStore$1 = shared('wks');
	var QObject = global_1.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDescriptor = descriptors && fails(function () {
	  return objectCreate(nativeDefineProperty$1({}, 'a', {
	    get: function () { return nativeDefineProperty$1(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (O, P, Attributes) {
	  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$1(ObjectPrototype$1, P);
	  if (ObjectPrototypeDescriptor) delete ObjectPrototype$1[P];
	  nativeDefineProperty$1(O, P, Attributes);
	  if (ObjectPrototypeDescriptor && O !== ObjectPrototype$1) {
	    nativeDefineProperty$1(ObjectPrototype$1, P, ObjectPrototypeDescriptor);
	  }
	} : nativeDefineProperty$1;

	var wrap$1 = function (tag, description) {
	  var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]);
	  setInternalState$4(symbol, {
	    type: SYMBOL,
	    tag: tag,
	    description: description
	  });
	  if (!descriptors) symbol.description = description;
	  return symbol;
	};

	var isSymbol$1 = useSymbolAsUid ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  return Object(it) instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(O, P, Attributes) {
	  if (O === ObjectPrototype$1) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
	  anObject(O);
	  var key = toPrimitive(P, true);
	  anObject(Attributes);
	  if (has(AllSymbols, key)) {
	    if (!Attributes.enumerable) {
	      if (!has(O, HIDDEN)) nativeDefineProperty$1(O, HIDDEN, createPropertyDescriptor(1, {}));
	      O[HIDDEN][key] = true;
	    } else {
	      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
	      Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
	    } return setSymbolDescriptor(O, key, Attributes);
	  } return nativeDefineProperty$1(O, key, Attributes);
	};

	var $defineProperties = function defineProperties(O, Properties) {
	  anObject(O);
	  var properties = toIndexedObject(Properties);
	  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
	  $forEach$1(keys, function (key) {
	    if (!descriptors || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
	  });
	  return O;
	};

	var $create = function create(O, Properties) {
	  return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
	};

	var $propertyIsEnumerable = function propertyIsEnumerable(V) {
	  var P = toPrimitive(V, true);
	  var enumerable = nativePropertyIsEnumerable$1.call(this, P);
	  if (this === ObjectPrototype$1 && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
	  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
	};

	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
	  var it = toIndexedObject(O);
	  var key = toPrimitive(P, true);
	  if (it === ObjectPrototype$1 && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
	  var descriptor = nativeGetOwnPropertyDescriptor$1(it, key);
	  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
	    descriptor.enumerable = true;
	  }
	  return descriptor;
	};

	var $getOwnPropertyNames = function getOwnPropertyNames(O) {
	  var names = nativeGetOwnPropertyNames$2(toIndexedObject(O));
	  var result = [];
	  $forEach$1(names, function (key) {
	    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
	  });
	  return result;
	};

	var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
	  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype$1;
	  var names = nativeGetOwnPropertyNames$2(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
	  var result = [];
	  $forEach$1(names, function (key) {
	    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype$1, key))) {
	      result.push(AllSymbols[key]);
	    }
	  });
	  return result;
	};

	// `Symbol` constructor
	// https://tc39.github.io/ecma262/#sec-symbol-constructor
	if (!nativeSymbol) {
	  $Symbol = function Symbol() {
	    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
	    var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
	    var tag = uid(description);
	    var setter = function (value) {
	      if (this === ObjectPrototype$1) setter.call(ObjectPrototypeSymbols, value);
	      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
	    };
	    if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype$1, tag, { configurable: true, set: setter });
	    return wrap$1(tag, description);
	  };

	  redefine($Symbol[PROTOTYPE$1], 'toString', function toString() {
	    return getInternalState$3(this).tag;
	  });

	  redefine($Symbol, 'withoutSetter', function (description) {
	    return wrap$1(uid(description), description);
	  });

	  objectPropertyIsEnumerable.f = $propertyIsEnumerable;
	  objectDefineProperty.f = $defineProperty;
	  objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
	  objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
	  objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

	  wellKnownSymbolWrapped.f = function (name) {
	    return wrap$1(wellKnownSymbol(name), name);
	  };

	  if (descriptors) {
	    // https://github.com/tc39/proposal-Symbol-description
	    nativeDefineProperty$1($Symbol[PROTOTYPE$1], 'description', {
	      configurable: true,
	      get: function description() {
	        return getInternalState$3(this).description;
	      }
	    });
	    {
	      redefine(ObjectPrototype$1, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
	    }
	  }
	}

	_export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
	  Symbol: $Symbol
	});

	$forEach$1(objectKeys(WellKnownSymbolsStore$1), function (name) {
	  defineWellKnownSymbol(name);
	});

	_export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
	  // `Symbol.for` method
	  // https://tc39.github.io/ecma262/#sec-symbol.for
	  'for': function (key) {
	    var string = String(key);
	    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
	    var symbol = $Symbol(string);
	    StringToSymbolRegistry[string] = symbol;
	    SymbolToStringRegistry[symbol] = string;
	    return symbol;
	  },
	  // `Symbol.keyFor` method
	  // https://tc39.github.io/ecma262/#sec-symbol.keyfor
	  keyFor: function keyFor(sym) {
	    if (!isSymbol$1(sym)) throw TypeError(sym + ' is not a symbol');
	    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
	  },
	  useSetter: function () { USE_SETTER = true; },
	  useSimple: function () { USE_SETTER = false; }
	});

	_export({ target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors }, {
	  // `Object.create` method
	  // https://tc39.github.io/ecma262/#sec-object.create
	  create: $create,
	  // `Object.defineProperty` method
	  // https://tc39.github.io/ecma262/#sec-object.defineproperty
	  defineProperty: $defineProperty,
	  // `Object.defineProperties` method
	  // https://tc39.github.io/ecma262/#sec-object.defineproperties
	  defineProperties: $defineProperties,
	  // `Object.getOwnPropertyDescriptor` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
	});

	_export({ target: 'Object', stat: true, forced: !nativeSymbol }, {
	  // `Object.getOwnPropertyNames` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // `Object.getOwnPropertySymbols` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
	// https://bugs.chromium.org/p/v8/issues/detail?id=3443
	_export({ target: 'Object', stat: true, forced: fails(function () { objectGetOwnPropertySymbols.f(1); }) }, {
	  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
	    return objectGetOwnPropertySymbols.f(toObject(it));
	  }
	});

	// `JSON.stringify` method behavior with symbols
	// https://tc39.github.io/ecma262/#sec-json.stringify
	if ($stringify) {
	  var FORCED_JSON_STRINGIFY = !nativeSymbol || fails(function () {
	    var symbol = $Symbol();
	    // MS Edge converts symbol values to JSON as {}
	    return $stringify([symbol]) != '[null]'
	      // WebKit converts symbol values to JSON as null
	      || $stringify({ a: symbol }) != '{}'
	      // V8 throws on boxed symbols
	      || $stringify(Object(symbol)) != '{}';
	  });

	  _export({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
	    // eslint-disable-next-line no-unused-vars
	    stringify: function stringify(it, replacer, space) {
	      var args = [it];
	      var index = 1;
	      var $replacer;
	      while (arguments.length > index) args.push(arguments[index++]);
	      $replacer = replacer;
	      if (!isObject(replacer) && it === undefined || isSymbol$1(it)) return; // IE8 returns string on undefined
	      if (!isArray(replacer)) replacer = function (key, value) {
	        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
	        if (!isSymbol$1(value)) return value;
	      };
	      args[1] = replacer;
	      return $stringify.apply(null, args);
	    }
	  });
	}

	// `Symbol.prototype[@@toPrimitive]` method
	// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
	if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE]) {
	  createNonEnumerableProperty($Symbol[PROTOTYPE$1], TO_PRIMITIVE, $Symbol[PROTOTYPE$1].valueOf);
	}
	// `Symbol.prototype[@@toStringTag]` property
	// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
	setToStringTag($Symbol, SYMBOL);

	hiddenKeys[HIDDEN] = true;

	var defineProperty$6 = objectDefineProperty.f;


	var NativeSymbol = global_1.Symbol;

	if (descriptors && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
	  // Safari 12 bug
	  NativeSymbol().description !== undefined
	)) {
	  var EmptyStringDescriptionStore = {};
	  // wrap Symbol constructor for correct work with undefined description
	  var SymbolWrapper = function Symbol() {
	    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
	    var result = this instanceof SymbolWrapper
	      ? new NativeSymbol(description)
	      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
	      : description === undefined ? NativeSymbol() : NativeSymbol(description);
	    if (description === '') EmptyStringDescriptionStore[result] = true;
	    return result;
	  };
	  copyConstructorProperties(SymbolWrapper, NativeSymbol);
	  var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
	  symbolPrototype.constructor = SymbolWrapper;

	  var symbolToString$1 = symbolPrototype.toString;
	  var native = String(NativeSymbol('test')) == 'Symbol(test)';
	  var regexp = /^Symbol\((.*)\)[^)]+$/;
	  defineProperty$6(symbolPrototype, 'description', {
	    configurable: true,
	    get: function description() {
	      var symbol = isObject(this) ? this.valueOf() : this;
	      var string = symbolToString$1.call(symbol);
	      if (has(EmptyStringDescriptionStore, symbol)) return '';
	      var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
	      return desc === '' ? undefined : desc;
	    }
	  });

	  _export({ global: true, forced: true }, {
	    Symbol: SymbolWrapper
	  });
	}

	// `Symbol.unscopables` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.unscopables
	defineWellKnownSymbol('unscopables');

	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
	var MAX_SAFE_INTEGER$2 = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

	// We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679
	var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});

	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED$1 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

	// `Array.prototype.concat` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species
	_export({ target: 'Array', proto: true, forced: FORCED$1 }, {
	  concat: function concat(arg) { // eslint-disable-line no-unused-vars
	    var O = toObject(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;
	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];
	      if (isConcatSpreadable(E)) {
	        len = toLength(E.length);
	        if (n + len > MAX_SAFE_INTEGER$2) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER$2) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty(A, n++, E);
	      }
	    }
	    A.length = n;
	    return A;
	  }
	});

	var defineProperty$7 = objectDefineProperty.f;








	var fastKey = internalMetadata.fastKey;


	var setInternalState$5 = internalState.set;
	var internalStateGetterFor$1 = internalState.getterFor;

	var collectionStrong = {
	  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
	    var C = wrapper(function (that, iterable) {
	      anInstance(that, C, CONSTRUCTOR_NAME);
	      setInternalState$5(that, {
	        type: CONSTRUCTOR_NAME,
	        index: objectCreate(null),
	        first: undefined,
	        last: undefined,
	        size: 0
	      });
	      if (!descriptors) that.size = 0;
	      if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
	    });

	    var getInternalState = internalStateGetterFor$1(CONSTRUCTOR_NAME);

	    var define = function (that, key, value) {
	      var state = getInternalState(that);
	      var entry = getEntry(that, key);
	      var previous, index;
	      // change existing entry
	      if (entry) {
	        entry.value = value;
	      // create new entry
	      } else {
	        state.last = entry = {
	          index: index = fastKey(key, true),
	          key: key,
	          value: value,
	          previous: previous = state.last,
	          next: undefined,
	          removed: false
	        };
	        if (!state.first) state.first = entry;
	        if (previous) previous.next = entry;
	        if (descriptors) state.size++;
	        else that.size++;
	        // add to index
	        if (index !== 'F') state.index[index] = entry;
	      } return that;
	    };

	    var getEntry = function (that, key) {
	      var state = getInternalState(that);
	      // fast case
	      var index = fastKey(key);
	      var entry;
	      if (index !== 'F') return state.index[index];
	      // frozen object case
	      for (entry = state.first; entry; entry = entry.next) {
	        if (entry.key == key) return entry;
	      }
	    };

	    redefineAll(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function clear() {
	        var that = this;
	        var state = getInternalState(that);
	        var data = state.index;
	        var entry = state.first;
	        while (entry) {
	          entry.removed = true;
	          if (entry.previous) entry.previous = entry.previous.next = undefined;
	          delete data[entry.index];
	          entry = entry.next;
	        }
	        state.first = state.last = undefined;
	        if (descriptors) state.size = 0;
	        else that.size = 0;
	      },
	      // 23.1.3.3 Map.prototype.delete(key)
	      // 23.2.3.4 Set.prototype.delete(value)
	      'delete': function (key) {
	        var that = this;
	        var state = getInternalState(that);
	        var entry = getEntry(that, key);
	        if (entry) {
	          var next = entry.next;
	          var prev = entry.previous;
	          delete state.index[entry.index];
	          entry.removed = true;
	          if (prev) prev.next = next;
	          if (next) next.previous = prev;
	          if (state.first == entry) state.first = next;
	          if (state.last == entry) state.last = prev;
	          if (descriptors) state.size--;
	          else that.size--;
	        } return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function forEach(callbackfn /* , that = undefined */) {
	        var state = getInternalState(this);
	        var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
	        var entry;
	        while (entry = entry ? entry.next : state.first) {
	          boundFunction(entry.value, entry.key, this);
	          // revert to the last existing entry
	          while (entry && entry.removed) entry = entry.previous;
	        }
	      },
	      // 23.1.3.7 Map.prototype.has(key)
	      // 23.2.3.7 Set.prototype.has(value)
	      has: function has(key) {
	        return !!getEntry(this, key);
	      }
	    });

	    redefineAll(C.prototype, IS_MAP ? {
	      // 23.1.3.6 Map.prototype.get(key)
	      get: function get(key) {
	        var entry = getEntry(this, key);
	        return entry && entry.value;
	      },
	      // 23.1.3.9 Map.prototype.set(key, value)
	      set: function set(key, value) {
	        return define(this, key === 0 ? 0 : key, value);
	      }
	    } : {
	      // 23.2.3.1 Set.prototype.add(value)
	      add: function add(value) {
	        return define(this, value = value === 0 ? 0 : value, value);
	      }
	    });
	    if (descriptors) defineProperty$7(C.prototype, 'size', {
	      get: function () {
	        return getInternalState(this).size;
	      }
	    });
	    return C;
	  },
	  setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
	    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
	    var getInternalCollectionState = internalStateGetterFor$1(CONSTRUCTOR_NAME);
	    var getInternalIteratorState = internalStateGetterFor$1(ITERATOR_NAME);
	    // add .keys, .values, .entries, [@@iterator]
	    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
	    defineIterator(C, CONSTRUCTOR_NAME, function (iterated, kind) {
	      setInternalState$5(this, {
	        type: ITERATOR_NAME,
	        target: iterated,
	        state: getInternalCollectionState(iterated),
	        kind: kind,
	        last: undefined
	      });
	    }, function () {
	      var state = getInternalIteratorState(this);
	      var kind = state.kind;
	      var entry = state.last;
	      // revert to the last existing entry
	      while (entry && entry.removed) entry = entry.previous;
	      // get next entry
	      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
	        // or finish the iteration
	        state.target = undefined;
	        return { value: undefined, done: true };
	      }
	      // return step by kind
	      if (kind == 'keys') return { value: entry.key, done: false };
	      if (kind == 'values') return { value: entry.value, done: false };
	      return { value: [entry.key, entry.value], done: false };
	    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

	    // add [@@species], 23.1.2.2, 23.2.2.2
	    setSpecies(CONSTRUCTOR_NAME);
	  }
	};

	// `Map` constructor
	// https://tc39.github.io/ecma262/#sec-map-objects
	var es_map = collection('Map', function (init) {
	  return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
	}, collectionStrong);

	// `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty
	_export({ target: 'Object', stat: true, forced: !descriptors, sham: !descriptors }, {
	  defineProperty: objectDefineProperty.f
	});

	var onFreeze = internalMetadata.onFreeze;

	var nativeFreeze = Object.freeze;
	var FAILS_ON_PRIMITIVES$2 = fails(function () { nativeFreeze(1); });

	// `Object.freeze` method
	// https://tc39.github.io/ecma262/#sec-object.freeze
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$2, sham: !freezing }, {
	  freeze: function freeze(it) {
	    return nativeFreeze && isObject(it) ? nativeFreeze(onFreeze(it)) : it;
	  }
	});

	var nativeGetOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;


	var FAILS_ON_PRIMITIVES$3 = fails(function () { nativeGetOwnPropertyDescriptor$2(1); });
	var FORCED$2 = !descriptors || FAILS_ON_PRIMITIVES$3;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
	_export({ target: 'Object', stat: true, forced: FORCED$2, sham: !descriptors }, {
	  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
	    return nativeGetOwnPropertyDescriptor$2(toIndexedObject(it), key);
	  }
	});

	// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
	var ERROR_INSTEAD_OF_FALSE = fails(function () {
	  // eslint-disable-next-line no-undef
	  Reflect.defineProperty(objectDefineProperty.f({}, 1, { value: 1 }), 1, { value: 2 });
	});

	// `Reflect.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-reflect.defineproperty
	_export({ target: 'Reflect', stat: true, forced: ERROR_INSTEAD_OF_FALSE, sham: !descriptors }, {
	  defineProperty: function defineProperty(target, propertyKey, attributes) {
	    anObject(target);
	    var key = toPrimitive(propertyKey, true);
	    anObject(attributes);
	    try {
	      objectDefineProperty.f(target, key, attributes);
	      return true;
	    } catch (error) {
	      return false;
	    }
	  }
	});

	// `Reflect.ownKeys` method
	// https://tc39.github.io/ecma262/#sec-reflect.ownkeys
	_export({ target: 'Reflect', stat: true }, {
	  ownKeys: ownKeys
	});

	// `Set` constructor
	// https://tc39.github.io/ecma262/#sec-set-objects
	var es_set = collection('Set', function (init) {
	  return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
	}, collectionStrong);

	var slice$1 = [].slice;
	var factories = {};

	var construct = function (C, argsLength, args) {
	  if (!(argsLength in factories)) {
	    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
	    // eslint-disable-next-line no-new-func
	    factories[argsLength] = Function('C,a', 'return new C(' + list.join(',') + ')');
	  } return factories[argsLength](C, args);
	};

	// `Function.prototype.bind` method implementation
	// https://tc39.github.io/ecma262/#sec-function.prototype.bind
	var functionBind = Function.bind || function bind(that /* , ...args */) {
	  var fn = aFunction$1(this);
	  var partArgs = slice$1.call(arguments, 1);
	  var boundFunction = function bound(/* args... */) {
	    var args = partArgs.concat(slice$1.call(arguments));
	    return this instanceof boundFunction ? construct(fn, args.length, args) : fn.apply(that, args);
	  };
	  if (isObject(fn.prototype)) boundFunction.prototype = fn.prototype;
	  return boundFunction;
	};

	// `Function.prototype.bind` method
	// https://tc39.github.io/ecma262/#sec-function.prototype.bind
	_export({ target: 'Function', proto: true }, {
	  bind: functionBind
	});

	var documentAttachProxyMap = new WeakMap();
	var functionBoundedValueMap = new WeakMap();
	function getTargetValue(target, value) {
	  /*
	      仅绑定 isCallable && !isBoundedFunction && !isConstructable 的函数对象，如 window.console、window.atob 这类。目前没有完美的检测方式，这里通过 prototype 中是否还有可枚举的拓展方法的方式来判断
	      @warning 这里不要随意替换成别的判断方式，因为可能触发一些 edge case（比如在 lodash.isFunction 在 iframe 上下文中可能由于调用了 top window 对象触发的安全异常）
	     */
	  if (isCallable(value) && !isBoundedFunction(value) && !isConstructable(value)) {
	    var cachedBoundValue = functionBoundedValueMap.get(value);

	    if (cachedBoundValue) {
	      return cachedBoundValue;
	    }

	    var boundValue = value.bind(target); // some callable function has custom fields, we need to copy the enumerable props to boundValue. such as moment function.
	    // use for..in rather than Object.keys.forEach for performance reason
	    // eslint-disable-next-line guard-for-in,no-restricted-syntax

	    for (var key in value) {
	      // 当函数上面存在属性时，需要遍历所有属性
	      boundValue[key] = value[key];
	    } // copy prototype, for performance reason, we use in operator to check rather than hasOwnProperty


	    if ('prototype' in value) boundValue.prototype = value.prototype; // 原型拷贝

	    functionBoundedValueMap.set(value, boundValue);
	    return boundValue;
	  }

	  return value;
	}

	/* let PROXY = Proxy;
	if (!window.Proxy) {
	  window['Proxy'] = Proxy;
	} */

	var activeSandboxCount = 0;
	/**
	 * fastest(at most time) unique array method
	 * @see https://jsperf.com/array-filter-unique/30
	 */

	function uniq(array) {
	  return array.filter(function filter(element) {
	    return element in this ? false : this[element] = true;
	  }, {});
	}

	var unscopables = {
	  undefined: true,
	  Array: true,
	  Object: true,
	  String: true,
	  Boolean: true,
	  Math: true,
	  eval: true,
	  Number: true,
	  Symbol: true,
	  parseFloat: true,
	  Float32Array: true
	};
	var rawObjectDefineProperty = Object.defineProperty;
	var variableWhiteListInDev = //@ts-ignore
	 [];

	var variableWhiteList = __spread(['System', '__cjsWrapper'], variableWhiteListInDev);

	function createFakeWindow(global) {
	  // map always has the fastest performance in has check scenario
	  // see https://jsperf.com/array-indexof-vs-set-has/23
	  var propertiesWithGetter = new Map();
	  var fakeWindow = {};
	  /*
	   copy the non-configurable property of global to fakeWindow
	   see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor
	   > A property cannot be reported as non-configurable, if it does not exists as an own property of the target object or if it exists as a configurable own property of the target object.
	   */

	  Object.getOwnPropertyNames(global).filter(function (p) {
	    var descriptor = Object.getOwnPropertyDescriptor(global, p);
	    return !(descriptor === null || descriptor === void 0 ? void 0 : descriptor.configurable);
	  }).forEach(function (p) {
	    var descriptor = Object.getOwnPropertyDescriptor(global, p);

	    if (descriptor) {
	      var hasGetter = Object.prototype.hasOwnProperty.call(descriptor, 'get');
	      /*
	       make top/self/window property configurable and writable, otherwise it will cause TypeError while get trap return.
	       see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
	       > The value reported for a property must be the same as the value of the corresponding target object property if the target object property is a non-writable, non-configurable data property.
	       */

	      if (p === 'top' || p === 'parent' || p === 'self' || p === 'window' || //@ts-ignore
	      "production" === 'test' ) {
	        descriptor.configurable = true;
	        /*
	         The descriptor of window.window/window.top/window.self in Safari/FF are accessor descriptors, we need to avoid adding a data descriptor while it was
	         Example:
	          Safari/FF: Object.getOwnPropertyDescriptor(window, 'top') -> {get: function, set: undefined, enumerable: true, configurable: false}
	          Chrome: Object.getOwnPropertyDescriptor(window, 'top') -> {value: Window, writable: false, enumerable: true, configurable: false}
	         */

	        if (!hasGetter) {
	          descriptor.writable = true;
	        }
	      }

	      if (hasGetter) propertiesWithGetter.set(p, true); // freeze the descriptor to avoid being modified by zone.js
	      // see https://github.com/angular/zone.js/blob/a5fe09b0fac27ac5df1fa746042f96f05ccb6a00/lib/browser/define-property.ts#L71

	      rawObjectDefineProperty(fakeWindow, p, Object.freeze(descriptor));
	    }
	  });
	  return {
	    fakeWindow: fakeWindow,
	    propertiesWithGetter: propertiesWithGetter
	  };
	} // check window contructor function， like Object Array


	var ProxySandbox =
	/** @class */
	function () {
	  function ProxySandbox(props) {
	    if (props === void 0) {
	      props = {
	        name: ''
	      };
	    }

	    this.eventListeners = {};
	    this.timeoutIds = [];
	    this.intervalIds = [];
	    /* private propertyAdded = {};
	           private originalValues = {}; */

	    /** window 值变更记录 */

	    this.updatedValueSet = new Set();
	    /** 沙箱的名字 */

	    this.name = '';
	    /** 沙箱的类型 */

	    this.type = SandBoxType.Proxy;
	    /** 沙箱是否在运行中 */

	    this.sandboxRunning = true;
	    var multiMode = props.multiMode;

	    if (!window.Proxy) {
	      console.warn('proxy sandbox is not support by current browser');
	      /* this.sandboxDisabled = true; */
	    }
	    /*  else {
	    PROXY = window.Proxy;
	    } */
	    //@ts-ignore


	    this.sandbox = null;
	    this.name = props.name;
	    this.createProxySandbox();
	  }

	  ProxySandbox.prototype.active = function () {
	    if (!this.sandboxRunning) activeSandboxCount++;
	    this.sandboxRunning = true;
	  };

	  ProxySandbox.prototype.inactive = function () {
	    var _this = this; //@ts-ignore

	    if (--activeSandboxCount === 0) {
	      variableWhiteList.forEach(function (p) {
	        if (_this.sandbox.hasOwnProperty(p)) {
	          // @ts-ignore
	          delete window[p];
	        }
	      });
	    }

	    this.sandboxRunning = false;
	  };

	  ProxySandbox.prototype.createProxySandbox = function () {
	    var
	    /* propertyAdded, originalValues,  */
	    updatedValueSet = this.updatedValueSet;
	    var self = this;
	    var rawWindow = window;

	    var _a = createFakeWindow(rawWindow),
	        fakeWindow = _a.fakeWindow,
	        propertiesWithGetter = _a.propertiesWithGetter; // 生成一份伪造的window


	    var descriptorTargetMap = new Map();

	    var hasOwnProperty = function hasOwnProperty(key) {
	      return fakeWindow.hasOwnProperty(key) || rawWindow.hasOwnProperty(key);
	    };

	    var sandbox = new window.Proxy(fakeWindow, {
	      set: function set(target, p, value) {
	        if (self.sandboxRunning) {
	          // eslint-disable-next-line no-prototype-builtins

	          /* if (!rawWindow.hasOwnProperty(p)) {
	            // 如果在原始window 不存在，则在沙箱中添加
	            // recorde value added in sandbox
	            propertyAdded[p] = value;
	            // eslint-disable-next-line no-prototype-builtins
	          } else if (!originalValues.hasOwnProperty(p)) {
	            // 如果在原始window 存在，则记录原始值
	            // if it is already been setted in orignal window, record it's original value
	            originalValues[p] = rawWindow[p];
	          } */
	          // set new value to original window in case of jsonp, js bundle which will be execute outof sandbox

	          /* if (!multiMode) {
	            rawWindow[p] = value;
	          } */
	          if (variableWhiteList.indexOf(p) !== -1) {
	            // @ts-ignore
	            rawWindow[p] = value;
	          } // eslint-disable-next-line no-param-reassign
	          //@ts-ignore


	          target[p] = value;
	          updatedValueSet.add(p);
	        }

	        return true;
	      },
	      get: function get(target, p) {
	        if (p === Symbol.unscopables) {
	          // 加固，防止逃逸
	          return unscopables;
	        } // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13


	        if (p === 'window' || p === 'self') {
	          return sandbox;
	        }

	        if (p === 'top' || p === 'parent') {
	          // if your master app in an iframe context, allow these props escape the sandbox
	          if (rawWindow === rawWindow.parent) {
	            return sandbox;
	          }

	          return rawWindow[p];
	        } // proxy hasOwnProperty, in case of proxy.hasOwnProperty value represented as originalWindow.hasOwnProperty


	        if (p === 'hasOwnProperty') {
	          // eslint-disable-next-line no-prototype-builtins

	          /* return (key: PropertyKey) =>
	            //@ts-ignore
	            !!target[key] || rawWindow.hasOwnProperty(key); */
	          return hasOwnProperty;
	        } // mark the symbol to document while accessing as document.createElement could know is invoked by which sandbox for dynamic append patcher


	        if (p === 'document') {
	          documentAttachProxyMap.set(document, sandbox); // remove the mark in next tick, thus we can identify whether it in micro app or not
	          // this approach is just a workaround, it could not cover all the complex scenarios, such as the micro app runs in the same task context with master in som case
	          // fixme if you have any other good ideas

	          nextTick(function () {
	            return documentAttachProxyMap["delete"](document);
	          });
	          return document;
	        }

	        var value = propertiesWithGetter.has(p) ? rawWindow[p] : target[p] || rawWindow[p];
	        return getTargetValue(rawWindow, value);
	      },
	      has: function has(target, p) {
	        return p in unscopables || p in target || p in rawWindow;
	      },
	      getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, p) {
	        /*
	         as the descriptor of top/self/window/mockTop in raw window are configurable but not in proxy target, we need to get it from target to avoid TypeError
	         see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor
	         > A property cannot be reported as non-configurable, if it does not exists as an own property of the target object or if it exists as a configurable own property of the target object.
	         */
	        if (target.hasOwnProperty(p)) {
	          var descriptor = Object.getOwnPropertyDescriptor(target, p);
	          descriptorTargetMap.set(p, 'target');
	          return descriptor;
	        }

	        if (rawWindow.hasOwnProperty(p)) {
	          var descriptor = Object.getOwnPropertyDescriptor(rawWindow, p);
	          descriptorTargetMap.set(p, 'rawWindow'); // A property cannot be reported as non-configurable, if it does not exists as an own property of the target object

	          if (descriptor && !descriptor.configurable) {
	            descriptor.configurable = true;
	          }

	          return descriptor;
	        }

	        return undefined;
	      },
	      // trap to support iterator with sandbox
	      ownKeys: function ownKeys(target) {
	        return uniq(Reflect.ownKeys(rawWindow).concat(Reflect.ownKeys(target)));
	      },
	      defineProperty: function defineProperty(target, p, attributes) {
	        var from = descriptorTargetMap.get(p);
	        /*
	         Descriptor must be defined to native window while it comes from native window via Object.getOwnPropertyDescriptor(window, p),
	         otherwise it would cause a TypeError with illegal invocation.
	         */

	        switch (from) {
	          case 'rawWindow':
	            return Reflect.defineProperty(rawWindow, p, attributes);

	          default:
	            return Reflect.defineProperty(target, p, attributes);
	        }
	      },
	      deleteProperty: function deleteProperty(target, p) {
	        if (target.hasOwnProperty(p)) {
	          // @ts-ignore
	          delete target[p];
	          updatedValueSet["delete"](p);
	          return true;
	        }

	        return true;
	      }
	    });
	    this.sandbox = sandbox;
	  };

	  ProxySandbox.prototype.getSandbox = function () {
	    return this.sandbox;
	  };

	  return ProxySandbox;
	}();

	var HAS_SPECIES_SUPPORT$3 = arrayMethodHasSpeciesSupport('splice');
	var USES_TO_LENGTH$8 = arrayMethodUsesToLength('splice', { ACCESSORS: true, 0: 0, 1: 2 });

	var max$3 = Math.max;
	var min$3 = Math.min;
	var MAX_SAFE_INTEGER$3 = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

	// `Array.prototype.splice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.splice
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$3 || !USES_TO_LENGTH$8 }, {
	  splice: function splice(start, deleteCount /* , ...items */) {
	    var O = toObject(this);
	    var len = toLength(O.length);
	    var actualStart = toAbsoluteIndex(start, len);
	    var argumentsLength = arguments.length;
	    var insertCount, actualDeleteCount, A, k, from, to;
	    if (argumentsLength === 0) {
	      insertCount = actualDeleteCount = 0;
	    } else if (argumentsLength === 1) {
	      insertCount = 0;
	      actualDeleteCount = len - actualStart;
	    } else {
	      insertCount = argumentsLength - 2;
	      actualDeleteCount = min$3(max$3(toInteger(deleteCount), 0), len - actualStart);
	    }
	    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER$3) {
	      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
	    }
	    A = arraySpeciesCreate(O, actualDeleteCount);
	    for (k = 0; k < actualDeleteCount; k++) {
	      from = actualStart + k;
	      if (from in O) createProperty(A, k, O[from]);
	    }
	    A.length = actualDeleteCount;
	    if (insertCount < actualDeleteCount) {
	      for (k = actualStart; k < len - actualDeleteCount; k++) {
	        from = k + actualDeleteCount;
	        to = k + insertCount;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
	    } else if (insertCount > actualDeleteCount) {
	      for (k = len - actualDeleteCount; k > actualStart; k--) {
	        from = k + actualDeleteCount - 1;
	        to = k + insertCount - 1;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	    }
	    for (k = 0; k < insertCount; k++) {
	      O[k + actualStart] = arguments[k + 2];
	    }
	    O.length = len - actualDeleteCount + insertCount;
	    return A;
	  }
	});

	function hijack() {
	  // FIXME umi unmount feature request
	  // @see http://gitlab.alipay-inc.com/bigfish/bigfish/issues/1154
	  var rawHistoryListen = function rawHistoryListen() {
	    var _ = [];

	    for (var _i = 0; _i < arguments.length; _i++) {
	      _[_i] = arguments[_i];
	    }

	    return noop_1;
	  };

	  var historyListeners = [];
	  var historyUnListens = [];

	  if (window.g_history && isFunction_1(window.g_history.listen)) {
	    rawHistoryListen = window.g_history.listen.bind(window.g_history);

	    window.g_history.listen = function (listener) {
	      historyListeners.push(listener);
	      var unListen = rawHistoryListen(listener);
	      historyUnListens.push(unListen);
	      return function () {
	        unListen();
	        historyUnListens.splice(historyUnListens.indexOf(unListen), 1);
	        historyListeners.splice(historyListeners.indexOf(listener), 1);
	      };
	    };
	  }

	  return function free() {
	    var rebuild = noop_1;
	    /*
	     还存在余量 listener 表明未被卸载，存在两种情况
	     1. 应用在 unmout 时未正确卸载 listener
	     2. listener 是应用 mount 之前绑定的，
	     第二种情况下应用在下次 mount 之前需重新绑定该 listener
	     */

	    if (historyListeners.length) {
	      rebuild = function rebuild() {
	        // 必须使用 window.g_history.listen 的方式重新绑定 listener，从而能保证 rebuild 这部分也能被捕获到，否则在应用卸载后无法正确的移除这部分副作用
	        historyListeners.forEach(function (listener) {
	          return window.g_history.listen(listener);
	        });
	      };
	    } // 卸载余下的 listener


	    historyUnListens.forEach(function (unListen) {
	      return unListen();
	    }); // restore

	    if (window.g_history && isFunction_1(window.g_history.listen)) {
	      window.g_history.listen = rawHistoryListen;
	    }

	    return rebuild;
	  };
	}

	function hijack$1() {
	  var rawWindowInterval = window.setInterval.bind(window);
	  var rawWindowTimeout = window.setTimeout.bind(window);
	  var timerIds = [];
	  var intervalIds = [];

	  window.setInterval = function () {
	    var args = [];

	    for (var _i = 0; _i < arguments.length; _i++) {
	      args[_i] = arguments[_i];
	    } // @ts-ignore


	    var intervalId = rawWindowInterval.apply(void 0, __spread(args));
	    intervalIds.push(intervalId);
	    return intervalId;
	  };

	  window.setTimeout = function () {
	    var args = [];

	    for (var _i = 0; _i < arguments.length; _i++) {
	      args[_i] = arguments[_i];
	    } // @ts-ignore


	    var timerId = rawWindowTimeout.apply(void 0, __spread(args));
	    timerIds.push(timerId);
	    return timerId;
	  };

	  return function free() {
	    var _this = this;

	    window.setInterval = rawWindowInterval;
	    window.setTimeout = rawWindowTimeout;
	    timerIds.forEach(function (id) {
	      return __awaiter(_this, void 0, void 0, function () {
	        return __generator(this, function (_a) {
	          switch (_a.label) {
	            case 0:
	              // 延迟 timeout 的清理，因为可能会有动画还没完成
	              return [4
	              /*yield*/
	              , sleep(500)];

	            case 1:
	              // 延迟 timeout 的清理，因为可能会有动画还没完成
	              _a.sent();

	              window.clearTimeout(id);
	              return [2
	              /*return*/
	              ];
	          }
	        });
	      });
	    });
	    intervalIds.forEach(function (id) {
	      window.clearInterval(id);
	    });
	    return noop_1;
	  };
	}

	function hijack$2() {
	  var listenerMap = new Map();
	  var rawAddEventListener = window.addEventListener;
	  var rawRemoveEventListener = window.removeEventListener;

	  window.addEventListener = function (type, listener, options) {
	    var listeners = listenerMap.get(type) || [];
	    listenerMap.set(type, __spread(listeners, [listener]));
	    return rawAddEventListener.call(window, type, listener, options);
	  };

	  window.removeEventListener = function (type, listener, options) {
	    var storedTypeListeners = listenerMap.get(type);

	    if (storedTypeListeners && storedTypeListeners.length && storedTypeListeners.indexOf(listener) !== -1) {
	      storedTypeListeners.splice(storedTypeListeners.indexOf(listener), 1);
	    }

	    return rawRemoveEventListener.call(window, type, listener, options);
	  };

	  return function free() {
	    listenerMap.forEach(function (listeners, type) {
	      return listeners.forEach(function (listener) {
	        return window.removeEventListener(type, listener);
	      });
	    });
	    window.addEventListener = rawAddEventListener.bind(window);
	    window.removeEventListener = rawRemoveEventListener.bind(window);
	    return noop_1;
	  };
	}

	var styledComponentSymbol = Symbol('styled-component');
	var rawHeadAppendChild = HTMLHeadElement.prototype.appendChild;
	var rawHeadRemoveChild = HTMLHeadElement.prototype.removeChild;
	var rawAppendChild = HTMLElement.prototype.appendChild;
	var rawRemoveChild = HTMLElement.prototype.removeChild;
	var SCRIPT_TAG_NAME = 'SCRIPT';
	var LINK_TAG_NAME = 'LINK';
	var STYLE_TAG_NAME = 'STYLE';
	/**
	 * Check if a style element is a styled-component liked.
	 * A styled-components liked element is which not have textContext but keep the rules in its styleSheet.cssRules.
	 * Such as the style element generated by styled-components and emotion.
	 * @param element
	 */

	function isStyledComponentsLike(element) {
	  var _a, _b;

	  return !element.textContent && (((_a = element.sheet) === null || _a === void 0 ? void 0 : _a.cssRules.length) || ((_b = getCachedRules(element)) === null || _b === void 0 ? void 0 : _b.length));
	}

	function getCachedRules(element) {
	  return element[styledComponentSymbol];
	}

	function setCachedRules(element, cssRules) {
	  Object.defineProperty(element, styledComponentSymbol, {
	    value: cssRules,
	    configurable: true,
	    enumerable: false
	  });
	}

	function assertElementExist(appName, element) {
	  if (!element) throw new Error("[legions] " + appName + " wrapper with id " + getWrapperId(appName) + " not ready!");
	}

	function getWrapperElement(appName) {
	  return document.getElementById(getWrapperId(appName));
	}
	/**
	 * Just hijack dynamic head append, that could avoid accidentally hijacking the insertion of elements except in head.
	 * Such a case: ReactDOM.createPortal(<style>.test{color:blue}</style>, container),
	 * this could made we append the style element into app wrapper but it will cause an error while the react portal unmounting, as ReactDOM could not find the style in body children list.
	 * @param appName
	 * @param proxy
	 * @param mounting
	 */


	function hijack$3(appName, proxy, mounting) {
	  if (mounting === void 0) {
	    mounting = true;
	  }

	  var dynamicStyleSheetElements = [];

	  HTMLHeadElement.prototype.appendChild = function appendChild(newChild) {
	    var element = newChild;

	    if (element.tagName) {
	      switch (element.tagName) {
	        case LINK_TAG_NAME:
	        case STYLE_TAG_NAME:
	          {
	            var stylesheetElement = newChild; // check if the currently specified application is active
	            // While we switch page from qiankun app to a normal react routing page, the normal one may load stylesheet dynamically while page rendering,
	            // but the url change listener must to wait until the current call stack is flushed.
	            // This scenario may cause we record the stylesheet from react routing page dynamic injection,
	            // and remove them after the url change triggered and qiankun app is unmouting
	            // see https://github.com/ReactTraining/history/blob/master/modules/createHashHistory.js#L222-L230

	            var activated = bt(window.location).some(function (name) {
	              return name === appName;
	            }); // only hijack dynamic style injection when app activated

	            if (activated) {
	              dynamicStyleSheetElements.push(stylesheetElement);
	              var appWrapper = getWrapperElement(appName);
	              assertElementExist(appName, appWrapper);
	              return rawAppendChild.call(appWrapper, stylesheetElement);
	            }

	            return rawHeadAppendChild.call(this, element);
	          }

	        case SCRIPT_TAG_NAME:
	          {
	            var _a = element,
	                src = _a.src,
	                text = _a.text;

	            if (src) {
	              legionsImportHtmlEntry_umd_3(null, [src], proxy).then(function () {
	                // we need to invoke the onload event manually to notify the event listener that the script was completed
	                // here are the two typical ways of dynamic script loading
	                // 1. element.onload callback way, which webpack and loadjs used, see https://github.com/muicss/loadjs/blob/master/src/loadjs.js#L138
	                // 2. addEventListener way, which toast-loader used, see https://github.com/pyrsmk/toast/blob/master/src/Toast.ts#L64
	                var loadEvent = new CustomEvent('load'); // 自定义事件名称

	                if (isFunction_1(element.onload)) {
	                  element.onload(loadEvent);
	                } else {
	                  element.dispatchEvent(loadEvent);
	                }
	              }, function () {
	                var errorEvent = new CustomEvent('error');

	                if (isFunction_1(element.onerror)) {
	                  element.onerror(errorEvent);
	                } else {
	                  element.dispatchEvent(errorEvent);
	                }
	              });
	              var dynamicScriptCommentElement = document.createComment("dynamic script " + src + " replaced by qiankun");
	              var appWrapper_1 = getWrapperElement(appName);
	              assertElementExist(appName, appWrapper_1);
	              return rawAppendChild.call(appWrapper_1, dynamicScriptCommentElement);
	            }

	            legionsImportHtmlEntry_umd_3(null, ["<script>" + text + "</script>"], proxy).then(element.onload, element.onerror);
	            var dynamicInlineScriptCommentElement = document.createComment('dynamic inline script replaced by qiankun');
	            var appWrapper = getWrapperElement(appName);
	            assertElementExist(appName, appWrapper);
	            return rawAppendChild.call(appWrapper, dynamicInlineScriptCommentElement);
	          }
	      }
	    }

	    return rawHeadAppendChild.call(this, element);
	  };

	  HTMLHeadElement.prototype.removeChild = function removeChild(child) {
	    var appWrapper = getWrapperElement(appName);

	    if (appWrapper === null || appWrapper === void 0 ? void 0 : appWrapper.contains(child)) {
	      return rawRemoveChild.call(appWrapper, child);
	    }

	    return rawHeadRemoveChild.call(this, child);
	  };

	  return function free() {
	    HTMLHeadElement.prototype.appendChild = rawHeadAppendChild;
	    HTMLHeadElement.prototype.removeChild = rawHeadRemoveChild;
	    dynamicStyleSheetElements.forEach(function (stylesheetElement) {
	      /*
	         With a styled-components generated style element, we need to record its cssRules for restore next re-mounting time.
	         We're doing this because the sheet of style element is going to be cleaned automatically by browser after the style element dom removed from document.
	         see https://www.w3.org/TR/cssom-1/#associated-css-style-sheet
	         */
	      if (stylesheetElement instanceof HTMLStyleElement && isStyledComponentsLike(stylesheetElement)) {
	        if (stylesheetElement.sheet) {
	          // record the original css rules of the style element for restore
	          setCachedRules(stylesheetElement, stylesheetElement.sheet.cssRules);
	        }
	      } // As now the sub app content all wrapped with a special id container,
	      // the dynamic style sheet would be removed automatically while unmoutting

	    });
	    return function rebuild() {
	      dynamicStyleSheetElements.forEach(function (stylesheetElement) {
	        // re-append the dynamic stylesheet to sub-app container
	        var appWrapper = getWrapperElement(appName);
	        assertElementExist(appName, appWrapper); // Using document.head.appendChild ensures that appendChild calls
	        // can also directly use the HTMLHeadElement.prototype.appendChild method which is overwritten at mounting phase

	        document.head.appendChild.call(appWrapper, stylesheetElement);
	        /*
	        get the stored css rules from styled-components generated element, and the re-insert rules for them.
	        note that we must do this after style element had been added to document, which stylesheet would be associated to the document automatically.
	        check the spec https://www.w3.org/TR/cssom-1/#associated-css-style-sheet
	         */

	        if (stylesheetElement instanceof HTMLStyleElement && isStyledComponentsLike(stylesheetElement)) {
	          var cssRules = getCachedRules(stylesheetElement);

	          if (cssRules) {
	            // eslint-disable-next-line no-plusplus
	            for (var i = 0; i < cssRules.length; i++) {
	              var cssRule = cssRules[i];
	              stylesheetElement.sheet.insertRule(cssRule.cssText);
	            }
	          }
	        }
	      }); // As the hijacker will be invoked every mounting phase, we could release the cache for gc after rebuilding

	      if (mounting) {
	        dynamicStyleSheetElements = [];
	      }
	    };
	  };
	}

	function hijackAtMounting(appName, proxy) {
	  return [hijack$1(), hijack$2(), hijack(), hijack$3(appName, proxy)];
	}
	function hijackAtBootstrapping(appName, proxy) {
	  return [//@ts-ignore
	   hijack$3(appName, proxy, false) ];
	}

	/**
	 * @author Hydrogen
	 * @since 2020-3-8
	 */

	function iter(obj, callbackFn) {
	  // eslint-disable-next-line guard-for-in, no-restricted-syntax
	  for (var prop in obj) {
	    if (obj.hasOwnProperty(prop)) {
	      callbackFn(prop);
	    }
	  }
	}
	/**
	 * 基于 diff 方式实现的沙箱，用于不支持 Proxy 的低版本浏览器
	 */


	var SnapshotSandbox =
	/** @class */
	function () {
	  function SnapshotSandbox(name) {
	    this.sandboxRunning = true;
	    this.modifyPropsMap = {};
	    this.name = name;
	    this.sandbox = window;
	    this.type = SandBoxType.Snapshot;
	  }

	  SnapshotSandbox.prototype.active = function () {
	    var _this = this; // 记录当前快照


	    this.windowSnapshot = {};
	    iter(window, function (prop) {
	      _this.windowSnapshot[prop] = window[prop];
	    }); // 恢复之前的变更

	    Object.keys(this.modifyPropsMap).forEach(function (p) {
	      window[p] = _this.modifyPropsMap[p];
	    });
	    this.sandboxRunning = true;
	  };

	  SnapshotSandbox.prototype.inactive = function () {
	    var _this = this;

	    this.modifyPropsMap = {};
	    iter(window, function (prop) {
	      if (window[prop] !== _this.windowSnapshot[prop]) {
	        // 记录变更，恢复环境
	        _this.modifyPropsMap[prop] = window[prop];
	        window[prop] = _this.windowSnapshot[prop];
	      }
	    }); //@ts-ignore

	    this.sandboxRunning = false;
	  };

	  return SnapshotSandbox;
	}();

	function createSandbox(appName) {
	  var sandbox;

	  if (window.Proxy) {
	    sandbox = new ProxySandbox({
	      name: appName
	    });
	  } else {
	    sandbox = new SnapshotSandbox(appName);
	  } // mounting freers are one-off and should be re-init at every mounting time


	  var mountingFreers = [];
	  var sideEffectsRebuilders = [];
	  console.log(sandbox, 'createSandboxcreateSandbox');
	  var bootstrappingFreers = hijackAtBootstrapping(appName, sandbox.sandbox);
	  return {
	    proxy: sandbox.sandbox,

	    /**
	     * 沙箱被 mount
	     * 可能是从 bootstrap 状态进入的 mount
	     * 也可能是从 unmount 之后再次唤醒进入 mount
	     */
	    mount: function mount() {
	      return __awaiter(this, void 0, void 0, function () {
	        var sideEffectsRebuildersAtBootstrapping, sideEffectsRebuildersAtMounting;
	        return __generator(this, function (_a) {
	          sideEffectsRebuildersAtBootstrapping = sideEffectsRebuilders.slice(0, bootstrappingFreers.length);
	          sideEffectsRebuildersAtMounting = sideEffectsRebuilders.slice(bootstrappingFreers.length); // must rebuild the side effects which added at bootstrapping firstly to recovery to nature state

	          if (sideEffectsRebuildersAtBootstrapping.length) {
	            sideEffectsRebuildersAtBootstrapping.forEach(function (rebuild) {
	              return rebuild();
	            });
	          }
	          /* ------------------------------------------ 因为有上下文依赖（window），以下代码执行顺序不能变 ------------------------------------------ */

	          /* ------------------------------------------ 1. 启动/恢复 沙箱------------------------------------------ */


	          sandbox.active();
	          /* ------------------------------------------ 2. 开启全局变量补丁 ------------------------------------------*/
	          // render 沙箱启动时开始劫持各类全局监听，尽量不要在应用初始化阶段有 事件监听/定时器 等副作用

	          if (window.Proxy) {
	            // 在不支持Proxy浏览器环境，比如IE11及以下，执行代码会导致切换应用时，执行异常，暂时还未查出原因，先临时这样处理
	            mountingFreers.push.apply(mountingFreers, __spread(hijackAtMounting(appName, sandbox.sandbox)));
	          }
	          /* ------------------------------------------ 3. 重置一些初始化时的副作用 ------------------------------------------*/
	          // 存在 rebuilder 则表明有些副作用需要重建


	          if (sideEffectsRebuildersAtMounting.length) {
	            sideEffectsRebuildersAtMounting.forEach(function (rebuild) {
	              return rebuild();
	            });
	          } // clean up rebuilders


	          sideEffectsRebuilders = [];
	          return [2
	          /*return*/
	          ];
	        });
	      });
	    },

	    /**
	     * 恢复 global 状态，使其能回到应用加载之前的状态
	     */
	    unmount: function unmount() {
	      return __awaiter(this, void 0, void 0, function () {
	        return __generator(this, function (_a) {
	          // record the rebuilders of window side effects (event listeners or timers)
	          // note that the frees of mounting phase are one-off as it will be re-init at next mounting
	          sideEffectsRebuilders = __spread(bootstrappingFreers, mountingFreers).map(function (free) {
	            return free();
	          });
	          sandbox.inactive();
	          return [2
	          /*return*/
	          ];
	        });
	      });
	    }
	  };
	}

	function assertElementExist$1(element, msg) {
	  if (!element) {
	    if (msg) {
	      throw new Error(msg);
	    }

	    throw new Error('[legions] element not existed!');
	  }
	}

	function execHooksChain(hooks, app, global) {
	  if (global === void 0) {
	    global = window;
	  }

	  if (hooks.length) {
	    return hooks.reduce(function (chain, hook) {
	      return chain.then(function () {
	        return hook(app, global);
	      });
	    }, Promise.resolve());
	  }

	  return Promise.resolve();
	}

	function getAppWrapperGetter(appName, appInstanceId, useLegacyRender, strictStyleIsolation, scopedCSS, elementGetter) {
	  return function () {
	    if (useLegacyRender) {
	      if (strictStyleIsolation) throw new Error('[legions]: strictStyleIsolation can not be used with legacy render!');
	      if (scopedCSS) throw new Error('[legions]: experimentalStyleIsolation can not be used with legacy render!');
	      var appWrapper = document.getElementById(getWrapperId(appInstanceId));
	      console.log(useLegacyRender, strictStyleIsolation, appInstanceId, appWrapper, 'appInstanceIdappInstanceIdappInstanceId');
	      assertElementExist$1(appWrapper, "[legions] Wrapper element for " + appName + " with instance " + appInstanceId + " is not existed!");
	      return appWrapper;
	    }

	    var element = elementGetter();
	    assertElementExist$1(element, "[legions] Wrapper element for " + appName + " with instance " + appInstanceId + " is not existed!");

	    if (strictStyleIsolation) {
	      return element.shadowRoot;
	    }

	    return element;
	  };
	}

	var rawAppendChild$1 = HTMLElement.prototype.appendChild;
	var rawRemoveChild$1 = HTMLElement.prototype.removeChild;

	function getRender(appName, appContent, legacyRender) {
	  var render = function render(_a, phase) {
	    var element = _a.element,
	        loading = _a.loading,
	        container = _a.container;

	    if (legacyRender) {

	      return legacyRender({
	        loading: loading,
	        appContent: element ? appContent : ''
	      });
	    }

	    var containerElement = getContainer(container); // The container might have be removed after micro app unmounted.
	    // Such as the micro app unmount lifecycle called by a react componentWillUnmount lifecycle, after micro app unmounted, the react component might also be removed

	    if (phase !== 'unmounted') {
	      var errorMsg = function () {
	        switch (phase) {
	          case 'loading':
	          case 'mounting':
	            return "[legions] Target container with " + container + " not existed while " + appName + " " + phase + "!";

	          case 'mounted':
	            return "[legions] Target container with " + container + " not existed after " + appName + " " + phase + "!";

	          default:
	            return "[legions] Target container with " + container + " not existed while " + appName + " rendering!";
	        }
	      }();

	      assertElementExist$1(containerElement, errorMsg);
	    }

	    if (containerElement && !containerElement.contains(element)) {
	      // clear the container
	      while (containerElement.firstChild) {
	        rawRemoveChild$1.call(containerElement, containerElement.firstChild);
	      } // append the element to container if it exist


	      if (element) {
	        rawAppendChild$1.call(containerElement, element);
	      }
	    }

	    return undefined;
	  };

	  return render;
	}

	var supportShadowDOM = // @ts-ignore
	document.head.attachShadow || document.head.createShadowRoot;

	function createElement(appContent, strictStyleIsolation, scopedCSS, appName) {
	  var containerElement = document.createElement('div');
	  containerElement.innerHTML = appContent; // appContent always wrapped with a singular div

	  var appElement = containerElement.firstChild;

	  if (strictStyleIsolation) {
	    if (!supportShadowDOM) {
	      console.warn('[legions]: As current browser not support shadow dom, your strictStyleIsolation configuration will be ignored!');
	    } else {
	      var innerHTML = appElement.innerHTML;
	      appElement.innerHTML = '';
	      var shadow = void 0;

	      if (appElement.attachShadow) {
	        shadow = appElement.attachShadow({
	          mode: 'open'
	        });
	      } else {
	        // createShadowRoot was proposed in initial spec, which has then been deprecated
	        shadow = appElement.createShadowRoot();
	      }

	      shadow.innerHTML = innerHTML;
	    }
	  }

	  if (scopedCSS) {
	    var attr = appElement.getAttribute(QiankunCSSRewriteAttr);

	    if (!attr) {
	      appElement.setAttribute(QiankunCSSRewriteAttr, appName);
	    }

	    var styleNodes = appElement.querySelectorAll('style') || [];
	    forEach_1(styleNodes, function (stylesheetElement) {
	      process$4(appElement, stylesheetElement, appName);
	    });
	  }

	  return appElement;
	}

	function validateSingularMode(validate, app) {
	  return __awaiter(this, void 0, void 0, function () {
	    return __generator(this, function (_a) {
	      return [2
	      /*return*/
	      , typeof validate === 'function' ? validate(app) : !!validate];
	    });
	  });
	}

	function getLifecyclesFromExports(scriptExports, appName, global) {
	  console.log(appName, 'appName', global['react15-home'], validateExportLifecycle(scriptExports));

	  if (validateExportLifecycle(scriptExports)) {
	    return scriptExports;
	  } //@ts-ignore


	  var globalVariableExports = global[appName];

	  if (validateExportLifecycle(globalVariableExports)) {
	    return globalVariableExports;
	  }

	  throw new Error("[legions] You need to export lifecycle functions in " + appName + " entry");
	}

	var prevAppUnmountedDeferred;
	function loadApp(app, configuration, lifeCycles) {
	  if (configuration === void 0) {
	    configuration = {};
	  }

	  return __awaiter(this, void 0, void 0, function () {
	    var entry, appName, appInstanceId, _a, singular, _b, sandbox, excludeAssetFilter, importEntryOpts, _c, template, execScripts, assetPublicPath, appContent, strictStyleIsolation, scopedCSS, initialAppWrapperElement, initialContainer, legacyRender, render, global, mountSandbox, unmountSandbox, sandboxInstance, _d, _e, beforeUnmount, _f, afterUnmount, _g, afterMount, _h, beforeMount, _j, beforeLoad, scriptExports, _k, bootstrap, mount, unmount, update, _l, onGlobalStateChange, setGlobalState, offGlobalStateChange, syncAppWrapperElement2Sandbox, parcelConfigGetter;

	    var _this = this;

	    return __generator(this, function (_m) {
	      switch (_m.label) {
	        case 0:
	          entry = app.entry, appName = app.name;
	          appInstanceId = appName + "_" + +new Date() + "_" + Math.floor(Math.random() * 1000);

	          _a = configuration.singular, singular = _a === void 0 ? false : _a, _b = configuration.sandbox, sandbox = _b === void 0 ? true : _b, excludeAssetFilter = configuration.excludeAssetFilter, importEntryOpts = __rest(configuration, ["singular", "sandbox", "excludeAssetFilter"]);
	          return [4
	          /*yield*/
	          , legionsImportHtmlEntry_umd_1(entry, importEntryOpts)];

	        case 1:
	          _c = _m.sent(), template = _c.template, execScripts = _c.execScripts, assetPublicPath = _c.assetPublicPath;
	          console.log(execScripts, 'execScripts');
	          return [4
	          /*yield*/
	          , validateSingularMode(singular, app)];

	        case 2:
	          if (!_m.sent()) return [3
	          /*break*/
	          , 4];
	          return [4
	          /*yield*/
	          , prevAppUnmountedDeferred && prevAppUnmountedDeferred.promise];

	        case 3:
	          _m.sent();

	          _m.label = 4;

	        case 4:
	          appContent = getDefaultTplWrapper(appInstanceId, appName)(template);
	          strictStyleIsolation = _typeof_1(sandbox) === 'object' && !!sandbox.strictStyleIsolation;
	          scopedCSS = isEnableScopedCSS(sandbox);
	          initialAppWrapperElement = createElement(appContent, strictStyleIsolation, scopedCSS, appName);
	          initialContainer = 'container' in app ? app.container : undefined;
	          legacyRender = 'render' in app ? app.render : undefined;
	          render = getRender(appName, appContent, legacyRender); // 第一次加载设置应用可见区域 dom 结构
	          // 确保每次应用加载前容器 dom 结构已经设置完毕

	          render({
	            element: initialAppWrapperElement,
	            loading: true,
	            container: initialContainer
	          }, 'loading');
	          global = window;

	          mountSandbox = function mountSandbox() {
	            return Promise.resolve();
	          };

	          unmountSandbox = function unmountSandbox() {
	            return Promise.resolve();
	          };

	          if (sandbox) {
	            sandboxInstance = createSandbox(appName // FIXME should use a strict sandbox logic while remount, see https://github.com/umijs/qiankun/issues/518
	            ); // 用沙箱的代理对象作为接下来使用的全局对象

	            global = sandboxInstance.proxy;
	            mountSandbox = sandboxInstance.mount;
	            unmountSandbox = sandboxInstance.unmount;
	          }

	          _d = mergeWith_1({}, getAddOns(global, assetPublicPath), lifeCycles, function (v1, v2) {
	            return concat_1(v1 !== null && v1 !== void 0 ? v1 : [], v2 !== null && v2 !== void 0 ? v2 : []);
	          }), _e = _d.beforeUnmount, beforeUnmount = _e === void 0 ? [] : _e, _f = _d.afterUnmount, afterUnmount = _f === void 0 ? [] : _f, _g = _d.afterMount, afterMount = _g === void 0 ? [] : _g, _h = _d.beforeMount, beforeMount = _h === void 0 ? [] : _h, _j = _d.beforeLoad, beforeLoad = _j === void 0 ? [] : _j;
	          return [4
	          /*yield*/
	          , execHooksChain(toArray(beforeLoad), app, global)];

	        case 5:
	          _m.sent();

	          return [4
	          /*yield*/
	          , execScripts(global)];

	        case 6:
	          scriptExports = _m.sent();
	          _k = getLifecyclesFromExports(scriptExports, appName, global), bootstrap = _k.bootstrap, mount = _k.mount, unmount = _k.unmount, update = _k.update;
	          _l = getMicroAppStateActions(appInstanceId), onGlobalStateChange = _l.onGlobalStateChange, setGlobalState = _l.setGlobalState, offGlobalStateChange = _l.offGlobalStateChange;

	          syncAppWrapperElement2Sandbox = function syncAppWrapperElement2Sandbox(element) {
	            return initialAppWrapperElement = element;
	          };

	          parcelConfigGetter = function parcelConfigGetter(remountContainer) {
	            if (remountContainer === void 0) {
	              remountContainer = initialContainer;
	            }

	            var appWrapperElement = initialAppWrapperElement;
	            var appWrapperGetter = getAppWrapperGetter(appName, appInstanceId, !!legacyRender, strictStyleIsolation, scopedCSS, function () {
	              return appWrapperElement;
	            });
	            var parcelConfig = {
	              name: appInstanceId,
	              bootstrap: bootstrap,
	              mount: [function () {
	                return __awaiter(_this, void 0, void 0, function () {
	                  return __generator(this, function (_a) {

	                    return [2
	                    /*return*/
	                    ];
	                  });
	                });
	              }, function () {
	                return __awaiter(_this, void 0, void 0, function () {
	                  return __generator(this, function (_a) {
	                    switch (_a.label) {
	                      case 0:
	                        return [4
	                        /*yield*/
	                        , validateSingularMode(singular, app)];

	                      case 1:
	                        if (_a.sent() && prevAppUnmountedDeferred) {
	                          return [2
	                          /*return*/
	                          , prevAppUnmountedDeferred.promise];
	                        }

	                        return [2
	                        /*return*/
	                        , undefined];
	                    }
	                  });
	                });
	              }, // 添加 mount hook, 确保每次应用加载前容器 dom 结构已经设置完毕
	              function () {
	                return __awaiter(_this, void 0, void 0, function () {
	                  var useNewContainer;
	                  return __generator(this, function (_a) {
	                    useNewContainer = remountContainer !== initialContainer;

	                    if (useNewContainer || !appWrapperElement) {
	                      // element will be destroyed after unmounted, we need to recreate it if it not exist
	                      // or we try to remount into a new container
	                      appWrapperElement = createElement(appContent, strictStyleIsolation, scopedCSS, appName);
	                      syncAppWrapperElement2Sandbox(appWrapperElement);
	                    }

	                    render({
	                      element: appWrapperElement,
	                      loading: true,
	                      container: remountContainer
	                    }, 'mounting');
	                    return [2
	                    /*return*/
	                    ];
	                  });
	                });
	              }, mountSandbox, // exec the chain after rendering to keep the behavior with beforeLoad
	              function () {
	                return __awaiter(_this, void 0, void 0, function () {
	                  return __generator(this, function (_a) {
	                    return [2
	                    /*return*/
	                    , execHooksChain(toArray(beforeMount), app, global)];
	                  });
	                });
	              }, function (props) {
	                return __awaiter(_this, void 0, void 0, function () {
	                  return __generator(this, function (_a) {
	                    return [2
	                    /*return*/
	                    , mount(__assign(__assign({}, props), {
	                      container: appWrapperGetter(),
	                      setGlobalState: setGlobalState,
	                      onGlobalStateChange: onGlobalStateChange
	                    }))];
	                  });
	                });
	              }, // finish loading after app mounted
	              function () {
	                return __awaiter(_this, void 0, void 0, function () {
	                  return __generator(this, function (_a) {
	                    return [2
	                    /*return*/
	                    , render({
	                      element: appWrapperElement,
	                      loading: false,
	                      container: remountContainer
	                    }, 'mounted')];
	                  });
	                });
	              }, function () {
	                return __awaiter(_this, void 0, void 0, function () {
	                  return __generator(this, function (_a) {
	                    return [2
	                    /*return*/
	                    , execHooksChain(toArray(afterMount), app, global)];
	                  });
	                });
	              }, // initialize the unmount defer after app mounted and resolve the defer after it unmounted
	              function () {
	                return __awaiter(_this, void 0, void 0, function () {
	                  return __generator(this, function (_a) {
	                    switch (_a.label) {
	                      case 0:
	                        return [4
	                        /*yield*/
	                        , validateSingularMode(singular, app)];

	                      case 1:
	                        if (_a.sent()) {
	                          prevAppUnmountedDeferred = new Deferred();
	                        }

	                        return [2
	                        /*return*/
	                        ];
	                    }
	                  });
	                });
	              }, function () {
	                return __awaiter(_this, void 0, void 0, function () {
	                  return __generator(this, function (_a) {

	                    return [2
	                    /*return*/
	                    ];
	                  });
	                });
	              }],
	              unmount: [function () {
	                return __awaiter(_this, void 0, void 0, function () {
	                  return __generator(this, function (_a) {
	                    return [2
	                    /*return*/
	                    , execHooksChain(toArray(beforeUnmount), app, global)];
	                  });
	                });
	              }, function (props) {
	                return __awaiter(_this, void 0, void 0, function () {
	                  return __generator(this, function (_a) {
	                    return [2
	                    /*return*/
	                    , unmount(__assign(__assign({}, props), {
	                      container: appWrapperGetter()
	                    }))];
	                  });
	                });
	              }, unmountSandbox, function () {
	                return __awaiter(_this, void 0, void 0, function () {
	                  return __generator(this, function (_a) {
	                    return [2
	                    /*return*/
	                    , execHooksChain(toArray(afterUnmount), app, global)];
	                  });
	                });
	              }, function () {
	                return __awaiter(_this, void 0, void 0, function () {
	                  return __generator(this, function (_a) {
	                    render({
	                      element: null,
	                      loading: false,
	                      container: remountContainer
	                    }, 'unmounted');
	                    offGlobalStateChange(appInstanceId); // for gc

	                    appWrapperElement = null;
	                    syncAppWrapperElement2Sandbox(appWrapperElement);
	                    return [2
	                    /*return*/
	                    ];
	                  });
	                });
	              }, function () {
	                return __awaiter(_this, void 0, void 0, function () {
	                  return __generator(this, function (_a) {
	                    switch (_a.label) {
	                      case 0:
	                        return [4
	                        /*yield*/
	                        , validateSingularMode(singular, app)];

	                      case 1:
	                        if (_a.sent() && prevAppUnmountedDeferred) {
	                          prevAppUnmountedDeferred.resolve();
	                        }

	                        return [2
	                        /*return*/
	                        ];
	                    }
	                  });
	                });
	              }]
	            };

	            if (typeof update === 'function') {
	              parcelConfig.update = update;
	            }

	            return parcelConfig;
	          };

	          return [2
	          /*return*/
	          , parcelConfigGetter];
	      }
	    });
	  });
	}

	var frameworkConfiguration = {};
	var frameworkStartedDefer = new Deferred();
	var microApps$1 = [];
	function registerMicroApps(apps, lifeCycles) {
	  var _this = this; // Each app only needs to be registered once


	  var unregisteredApps = apps.filter(function (app) {
	    return !microApps$1.some(function (registeredApp) {
	      return registeredApp.name === app.name;
	    });
	  });
	  microApps$1 = __spread(microApps$1, unregisteredApps);
	  unregisteredApps.forEach(function (app) {
	    var name = app.name,
	        activeRule = app.activeRule,
	        _a = app.loader,
	        loader = _a === void 0 ? noop_1 : _a,
	        props = app.props,
	        appConfig = __rest(app, ["name", "activeRule", "loader", "props"]);

	    Pt({
	      name: name,
	      app: function app() {
	        return __awaiter(_this, void 0, void 0, function () {
	          var _a, mount, otherMicroAppConfigs;

	          var _this = this;

	          return __generator(this, function (_b) {
	            switch (_b.label) {
	              case 0:
	                loader(true);
	                return [4
	                /*yield*/
	                , frameworkStartedDefer.promise];

	              case 1:
	                _b.sent();

	                return [4
	                /*yield*/
	                , loadApp(__assign({
	                  name: name,
	                  props: props
	                }, appConfig), frameworkConfiguration, lifeCycles)];

	              case 2:
	                _a = _b.sent()(), mount = _a.mount, otherMicroAppConfigs = __rest(_a, ["mount"]);
	                return [2
	                /*return*/
	                , __assign({
	                  mount: __spread([function () {
	                    return __awaiter(_this, void 0, void 0, function () {
	                      return __generator(this, function (_a) {
	                        return [2
	                        /*return*/
	                        , loader(true)];
	                      });
	                    });
	                  }], toArray(mount), [function () {
	                    return __awaiter(_this, void 0, void 0, function () {
	                      return __generator(this, function (_a) {
	                        return [2
	                        /*return*/
	                        , loader(false)];
	                      });
	                    });
	                  }])
	                }, otherMicroAppConfigs)];
	            }
	          });
	        });
	      },
	      activeWhen: activeRule,
	      customProps: props
	    });
	  });
	}
	function start(opts) {
	  if (opts === void 0) {
	    opts = {};
	  }

	  frameworkConfiguration = __assign({
	    prefetch: true,
	    singular: true,
	    sandbox: true
	  }, opts);

	  var prefetch = frameworkConfiguration.prefetch,
	      sandbox = frameworkConfiguration.sandbox,
	      singular = frameworkConfiguration.singular,
	      urlRerouteOnly = frameworkConfiguration.urlRerouteOnly,
	      importEntryOpts = __rest(frameworkConfiguration, ["prefetch", "sandbox", "singular", "urlRerouteOnly"]);

	  console.log(frameworkConfiguration, 'frameworkConfigurationframeworkConfigurationframeworkConfiguration');

	  if (prefetch) {
	    doPrefetchStrategy(microApps$1, prefetch, importEntryOpts);
	  }

	  if (sandbox) {
	    if (!window.Proxy) {
	      console.warn('[legions] Miss window.Proxy, proxySandbox will degenerate into snapshotSandbox');
	      frameworkConfiguration.sandbox = _typeof_1(sandbox) === 'object' ? __assign(__assign({}, sandbox), {
	        loose: true
	      }) : {
	        loose: true
	      };

	      if (!singular) {
	        console.warn('[legions] Setting singular as false may cause unexpected behavior while your browser not support window.Proxy');
	      }
	    }
	  }

	  xt({
	    urlRerouteOnly: urlRerouteOnly
	  });
	  frameworkStartedDefer.resolve();
	}

	function setDefaultMountApp(defaultAppLink) {
	  // can not use addEventListener once option for ie support
	  window.addEventListener('single-spa:no-app-change', function listener() {
	    var mountedApps = Et();
	    console.log(mountedApps, 'mountedApps');

	    if (!mountedApps.length) {
	      nt(defaultAppLink);
	    }

	    window.removeEventListener('single-spa:no-app-change', listener);
	  });
	}

	exports.MicroApps = MicroApps;
	exports.registerMicroApps = registerMicroApps;
	exports.setDefaultMountApp = setDefaultMountApp;
	exports.start = start;

	return exports;

}({}));
