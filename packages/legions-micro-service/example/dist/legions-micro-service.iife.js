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


	var MutationObserver = global_1.MutationObserver || global_1.WebKitMutationObserver;
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
	  } else if (MutationObserver && !engineIsIos) {
	    toggle = true;
	    node = document.createTextNode('');
	    new MutationObserver(flush).observe(node, { characterData: true });
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
	  *  legions-import-html-entry v0.0.5
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
	      window.proxy = proxy;
	      var isIE = window.ActiveXObject || 'ActiveXObject' in window;
	      if (isIE) {
	          return (';(function(window, self){;' +
	              scriptText +
	              '\n}).bind(window.proxy)(window.proxy, window.proxy);');
	      }
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
	  function execScripts(entryMain, scripts, proxy, keys) {
	      return getExternalScripts(scripts).then(function (scriptsText) {
	          proxy = window;
	          window.proxy = proxy;
	          var geval = eval;
	          var entry = [];
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
	              noteGlobalProps();
	              /* var exports = proxy[getGlobalProp()] || {};
	              resolve(exports); */
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
	                          geval(getExecutableScript(inlineScript, proxy));
	                      }
	                  }
	                  catch (e) {
	                      console.error('error occurs while executing the entry ' + scriptSrc + '}');
	                      /* console.error(e); */
	                      throw e;
	                  }
	                  var exports = proxy[getGlobalProp(proxy)] || {};
	                  resolve(exports);
	              }
	              else {
	                  if (typeof inlineScript === 'string') {
	                      try {
	                          if (isExcludeFile(scriptSrc)) {
	                              /* geval(''+inlineScript+'\n'); */
	                          }
	                          else {
	                              geval(getExecutableScript(inlineScript, proxy));
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
	                          geval(getExecutableScript(entry.join(' '), proxy));
	                          /* geval(';(function(window){;'+entry.join(' ')+'\n}).bind(window.proxy)(window.proxy);'); */
	                          /* geval(';(function(window){;'+entry.join(' ')+'\n})(window.proxy);'); */
	                      }
	                      else {
	                          geval(getExecutableScript(entry.join(' '), proxy));
	                          /* geval(';(function(window){;'+entry.join(' ')+'\n}).bind(window.proxy)(window.proxy);'); */
	                      }
	                  }
	                  else {
	                      /* compileCode(''+entry.join(' ')+'').bind(window.proxy)(window.proxy); */
	                      geval(getExecutableScript(entry.join(' '), proxy));
	                      // geval(';(function(window){;'+entry.join(' ')+'\n})(window);');
					  }
					  var exports = proxy[getGlobalProp(proxy)] || {}; 
					  console.log(proxy[getGlobalProp(proxy)],exports,'proxy')
	                  resolve(exports);
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
	                      collectInlineScript(scriptSrc, inlineScript, resolvePromise);
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

	  exports.importEntry = importEntry;
	  exports.importHTML = importHTML;

	  Object.defineProperty(exports, '__esModule', { value: true });

	})));
	});

	unwrapExports(legionsImportHtmlEntry_umd);
	var legionsImportHtmlEntry_umd_1 = legionsImportHtmlEntry_umd.importHTML;
	var legionsImportHtmlEntry_umd_2 = legionsImportHtmlEntry_umd.importEntry;

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
					
	              res.execScripts(window).then(function (value) {
					console.log(res,value['react15-home']['mount']())
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
	var f$7 = function getOwnPropertyNames(it) {
	  return windowNames && toString$1.call(it) == '[object Window]'
	    ? getWindowNames(it)
	    : nativeGetOwnPropertyNames(toIndexedObject(it));
	};

	var objectGetOwnPropertyNamesExternal = {
		f: f$7
	};

	var f$8 = wellKnownSymbol;

	var wellKnownSymbolWrapped = {
		f: f$8
	};

	var defineProperty$3 = objectDefineProperty.f;

	var defineWellKnownSymbol = function (NAME) {
	  var Symbol = path.Symbol || (path.Symbol = {});
	  if (!has(Symbol, NAME)) defineProperty$3(Symbol, NAME, {
	    value: wellKnownSymbolWrapped.f(NAME)
	  });
	};

	var $forEach$1 = arrayIteration.forEach;

	var HIDDEN = sharedKey('hidden');
	var SYMBOL = 'Symbol';
	var PROTOTYPE$1 = 'prototype';
	var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
	var setInternalState$3 = internalState.set;
	var getInternalState$3 = internalState.getterFor(SYMBOL);
	var ObjectPrototype$1 = Object[PROTOTYPE$1];
	var $Symbol = global_1.Symbol;
	var $stringify = getBuiltIn('JSON', 'stringify');
	var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	var nativeDefineProperty$1 = objectDefineProperty.f;
	var nativeGetOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;
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
	  setInternalState$3(symbol, {
	    type: SYMBOL,
	    tag: tag,
	    description: description
	  });
	  if (!descriptors) symbol.description = description;
	  return symbol;
	};

	var isSymbol = useSymbolAsUid ? function (it) {
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
	  var names = nativeGetOwnPropertyNames$1(toIndexedObject(O));
	  var result = [];
	  $forEach$1(names, function (key) {
	    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
	  });
	  return result;
	};

	var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
	  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype$1;
	  var names = nativeGetOwnPropertyNames$1(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
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
	    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
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
	      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	      if (!isArray(replacer)) replacer = function (key, value) {
	        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
	        if (!isSymbol(value)) return value;
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

	var defineProperty$4 = objectDefineProperty.f;


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

	  var symbolToString = symbolPrototype.toString;
	  var native = String(NativeSymbol('test')) == 'Symbol(test)';
	  var regexp = /^Symbol\((.*)\)[^)]+$/;
	  defineProperty$4(symbolPrototype, 'description', {
	    configurable: true,
	    get: function description() {
	      var symbol = isObject(this) ? this.valueOf() : this;
	      var string = symbolToString.call(symbol);
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

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
	  else object[propertyKey] = value;
	};

	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('slice');
	var USES_TO_LENGTH$5 = arrayMethodUsesToLength('slice', { ACCESSORS: true, 0: 0, 1: 2 });

	var SPECIES$5 = wellKnownSymbol('species');
	var nativeSlice = [].slice;
	var max$1 = Math.max;

	// `Array.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 || !USES_TO_LENGTH$5 }, {
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

	var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('splice');
	var USES_TO_LENGTH$6 = arrayMethodUsesToLength('splice', { ACCESSORS: true, 0: 0, 1: 2 });

	var max$2 = Math.max;
	var min$2 = Math.min;
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

	// `Array.prototype.splice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.splice
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 || !USES_TO_LENGTH$6 }, {
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
	      actualDeleteCount = min$2(max$2(toInteger(deleteCount), 0), len - actualStart);
	    }
	    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
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

	// `Object.create` method
	// https://tc39.github.io/ecma262/#sec-object.create
	_export({ target: 'Object', stat: true, sham: !descriptors }, {
	  create: objectCreate
	});

	var nativeGetOwnPropertyNames$2 = objectGetOwnPropertyNamesExternal.f;

	var FAILS_ON_PRIMITIVES = fails(function () { return !Object.getOwnPropertyNames(1); });

	// `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
	  getOwnPropertyNames: nativeGetOwnPropertyNames$2
	});

	var FAILS_ON_PRIMITIVES$1 = fails(function () { objectKeys(1); });

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$1 }, {
	  keys: function keys(it) {
	    return objectKeys(toObject(it));
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

	/**
	 * es6-proxy-polyfill
	 * @version 2.1.0
	 * @author Ambit-Tsai <ambit_tsai@qq.com>
	 * @license Apache-2.0
	 * @see {@link https://github.com/ambit-tsai/es6-proxy-polyfill#readme}
	 */
	var t="[[ProxyTarget]]",n="[[Get]]",r="[[Set]]",e="[[Call]]",o=Object.defineProperty,i=Object.defineProperties,u=Object.getPrototypeOf,c=Object.getOwnPropertyDescriptor,a=!!i&&s(i),f$9=a?Object.__proto__?u:function(t){return "function"==typeof t?t.__proto__||{}:u(t)}:function(t){return _isVbObject(t)&&_getVbInternalOf(t).__proto__||{}};function s(t){return "function"==typeof t&&/\[native code\]/.test(t.toString())}function p(t,n){if(this instanceof p)return l(new y(t,n));h("Constructor Proxy requires 'new'");}function l(f){var s=f[t];return "function"==typeof s?function(n){var r=n[t];function o(){return this instanceof o?n["[[Construct]]"](arguments,o):n[e](this,arguments)}if(o.prototype=r.prototype,a){var c=j(n),f=O(u(r),c);for(var s in g(o,f),c=x(r,n))d(o,s)&&delete c[s];i(o,c);}else P(o,r);return o}(f):s instanceof Array?function(e){var i,f,s=e[t];a&&((i=j(e)).concat.get=function(){var t=e[n]("concat",this);return t===Array.prototype.concat?t.bind(s):t},f=O(u(s),i));return (i=x(s,e)).length.set=function(n){var i=n-s.length;e[r]("length",n,this),i&&function(n,r,e){var i=e[t];if(n>0)for(var u=i.length,a=u-n;a<u;++a){var f=c(r,a);f?o(i,a,f):i[a]=undefined,f=w(i,a,e),o(r,a,f);}else for(var s=(a=i.length)-n;a<s;++a)delete r[a];}(i,this,e);},O(f,i)}(f):function(n){var r,e,o=n[t];a&&(r=j(n),e=O(u(o),r));return r=x(o,n),O(e,r)}(f)}function y(n,r){v(n)&&v(r)||h("Cannot create proxy with a non-object as target or handler"),"REVOKED"===(f$9(n).__PROXY__||f$9(r).__PROXY__)&&h("Cannot create proxy with a revoked proxy as target or handler"),this[t]=n,this["[[ProxyHandler]]"]=r;}function _(t,n){t||h("Cannot perform '"+n+"' on a proxy that has been revoked");}function h(t){throw new TypeError(t)}function v(t){return !!t&&("object"==typeof t||"function"==typeof t)}function d(t,n){return Object.prototype.hasOwnProperty.call(t,n)}p.revocable=function(n,r){this instanceof p.revocable&&h("Proxy.revocable is not a constructor");var e=new y(n,r),o=l(e);return {proxy:o,revoke:function(){e[t]=undefined,e["[[ProxyHandler]]"]=undefined,a||(f$9(o).__PROXY__="REVOKED");}}},y.prototype[n]=function(n,r){var e=this["[[ProxyHandler]]"];return _(e,"get"),null==e.get?this[t][n]:"function"==typeof e.get?e.get(this[t],n,r):void h("Trap 'get' is not a function: "+e.get)},y.prototype[r]=function(n,r,e){var o=this["[[ProxyHandler]]"];if(_(o,"set"),null==o.set)this[t][n]=r;else if("function"==typeof o.set){o.set(this[t],n,r,e)||h("Trap 'set' returned false for property '"+n+"'");}else h("Trap 'set' is not a function: "+o.set);},y.prototype[e]=function(n,r){var e=this["[[ProxyHandler]]"];return _(e,"apply"),null==e.apply?this[t].apply(n,r):"function"==typeof e.apply?e.apply(this[t],n,r):void h("Trap 'apply' is not a function: "+e.apply)},y.prototype["[[Construct]]"]=function(n,r){var e,o=this["[[ProxyHandler]]"];if(_(o,"construct"),null==o.construct?e=function(t,n){for(var r=[],e=0,o=n.length;e<o;++e)r.push("args["+e+"]");return new Function("Ctor","args","return new Ctor("+r.join(", ")+")")(t,n)}(this[t],n):"function"==typeof o.construct?e=o.construct(this[t],n,r):h("Trap 'construct' is not a function: "+o.construct),v(e))return e;h("Trap 'construct' returned non-object: "+e);};var b=Object.getOwnPropertyNames||function(t){var n=[];for(var r in t)d(t,r)&&n.push(r);return n},g=s(Object.setPrototypeOf)?Object.setPrototypeOf:Object.__proto__?function(t,n){return t.__proto__=n,t}:function(t,n){return o(t,"__proto__",{value:n})},O=a?Object.create:function(t,n){var r=i({},n);if(_isVbObject(r)){var e={__PROXY__:undefined};_getVbInternalOf(r).__proto__=e;}return r},P=Object.assign||function(t,n){for(var r in n)d(n,r)&&(t[r]=n[r]);return t};function j(n){for(var r={},e=n[t];e=u(e);){var o=x(e,n);P(r,o);}return r.__PROXY__={get:function(){return n[t]?undefined:"REVOKED"}},r}function x(t,n){for(var r=b(t),e={},o=r.length-1;o>=0;--o)e[r[o]]=w(t,r[o],n);return e}function w(t,e,o){var i=c(t,e);return {get:function(){return o[n](e,this)},set:function(t){o[r](e,t,this);},enumerable:i.enumerable,configurable:i.configurable}}var C="undefined"==typeof Proxy?p:Proxy;

	var PROXY = C; // check window contructor function， like Object Array

	function isConstructor(fn) {
	  // generator function and has own prototype properties
	  var hasConstructor = fn.prototype && fn.prototype.constructor === fn && Object.getOwnPropertyNames(fn.prototype).length > 1; // unnecessary to call toString if it has contructor function

	  var functionStr = !hasConstructor && fn.toString();
	  var upperCaseRegex = /^function\s+[A-Z]/;
	  return hasConstructor || // upper case
	  upperCaseRegex.test(functionStr) || // ES6 class, window function do not have this case
	  functionStr.slice(0, 5) === 'class';
	} // get function from original window, such as scrollTo, parseInt


	function isWindowFunction(func) {
	  return func && typeof func === 'function' && !isConstructor(func);
	}

	var Sandbox =
	/** @class */
	function () {
	  function Sandbox(props) {
	    if (props === void 0) {
	      props = {};
	    }

	    this.multiMode = false;
	    this.eventListeners = {};
	    this.timeoutIds = [];
	    this.intervalIds = [];
	    this.propertyAdded = {};
	    this.originalValues = {};
	    var multiMode = props.multiMode;

	    if (!window.Proxy) {
	      console.warn('proxy sandbox is not support by current browser');
	      /* this.sandboxDisabled = true; */
	    } else {
	      PROXY = window.Proxy;
	    } // enable multiMode in case of create mulit sandbox in same time
	    //@ts-ignore


	    this.multiMode = multiMode; //@ts-ignore

	    this.sandbox = null;
	  }

	  Sandbox.prototype.createProxySandbox = function () {
	    var _this = this;

	    var _a = this,
	        propertyAdded = _a.propertyAdded,
	        originalValues = _a.originalValues,
	        multiMode = _a.multiMode;

	    var proxyWindow = Object.create(null);
	    var originalWindow = window;
	    var originalAddEventListener = window.addEventListener;
	    var originalRemoveEventListener = window.removeEventListener;
	    var originalSetInerval = window.setInterval;
	    var originalSetTimeout = window.setTimeout; // hijack addEventListener

	    proxyWindow.addEventListener = function (eventName, fn) {
	      var rest = [];

	      for (var _i = 2; _i < arguments.length; _i++) {
	        rest[_i - 2] = arguments[_i];
	      }

	      var listeners = _this.eventListeners[eventName] || [];
	      listeners.push(fn);
	      return originalAddEventListener.apply(originalWindow, __spread([eventName, fn], rest));
	    }; // hijack removeEventListener


	    proxyWindow.removeEventListener = function (eventName, fn) {
	      var rest = [];

	      for (var _i = 2; _i < arguments.length; _i++) {
	        rest[_i - 2] = arguments[_i];
	      }

	      var listeners = _this.eventListeners[eventName] || [];

	      if (listeners.includes(fn)) {
	        listeners.splice(listeners.indexOf(fn), 1);
	      }

	      return originalRemoveEventListener.apply(originalWindow, __spread([eventName, fn], rest));
	    }; // hijack setTimeout


	    proxyWindow.setTimeout = function () {
	      var args = [];

	      for (var _i = 0; _i < arguments.length; _i++) {
	        args[_i] = arguments[_i];
	      }

	      var timerId = originalSetTimeout.apply(void 0, __spread(args));

	      _this.timeoutIds.push(timerId);

	      return timerId;
	    }; // hijack setInterval


	    proxyWindow.setInterval = function () {
	      var args = [];

	      for (var _i = 0; _i < arguments.length; _i++) {
	        args[_i] = arguments[_i];
	      }

	      var intervalId = originalSetInerval.apply(void 0, __spread(args));

	      _this.intervalIds.push(intervalId);

	      return intervalId;
	    };

	    var sandbox = new PROXY(proxyWindow, {
	      set: function set(target, p, value) {
	        // eslint-disable-next-line no-prototype-builtins
	        if (!originalWindow.hasOwnProperty(p)) {
	          // recorde value added in sandbox
	          propertyAdded[p] = value; // eslint-disable-next-line no-prototype-builtins
	        } else if (!originalValues.hasOwnProperty(p)) {
	          // if it is already been setted in orignal window, record it's original value
	          originalValues[p] = originalWindow[p];
	        } // set new value to original window in case of jsonp, js bundle which will be execute outof sandbox


	        if (!multiMode) {
	          originalWindow[p] = value;
	        } // eslint-disable-next-line no-param-reassign


	        target[p] = value;
	        return true;
	      },
	      get: function get(target, p) {
	        if (p === Symbol.unscopables) {
	          // 加固，防止逃逸
	          return undefined;
	        } //@ts-ignore


	        if (['top', 'window', 'self', 'globalThis'].includes(p)) {
	          // 优先从自身应用取值
	          return sandbox;
	        } // proxy hasOwnProperty, in case of proxy.hasOwnProperty value represented as originalWindow.hasOwnProperty


	        if (p === 'hasOwnProperty') {
	          // eslint-disable-next-line no-prototype-builtins
	          return function (key) {
	            return !!target[key] || originalWindow.hasOwnProperty(key);
	          };
	        }

	        var targetValue = target[p];

	        if (targetValue) {
	          // case of addEventListener, removeEventListener, setTimeout, setInterval setted in sandbox
	          return targetValue;
	        } else {
	          var value = originalWindow[p];

	          if (isWindowFunction(value)) {
	            // fix Illegal invocation
	            return value.bind(originalWindow);
	          } else {
	            // case of window.clientWidth、new window.Object()
	            return value;
	          }
	        }
	      },
	      has: function has(target, p) {
	        return p in target || p in originalWindow;
	      }
	    });
	    this.sandbox = sandbox;
	  };

	  Sandbox.prototype.getSandbox = function () {
	    return this.sandbox;
	  };

	  Sandbox.prototype.execScriptInSandbox = function (script) {
	    if (!this.sandboxDisabled) {
	      // create sandbox before exec script
	      if (!this.sandbox) {
	        this.createProxySandbox();
	      }

	      try {
	        var execScript = "with (sandbox) {;" + script + "\n}"; // eslint-disable-next-line no-new-func

	        var code = new Function('sandbox', execScript).bind(this.sandbox); // run code with sandbox

	        code(this.sandbox);
	      } catch (error) {
	        console.error("error occurs when execute script in sandbox: " + error);
	        throw error;
	      }
	    }
	  };

	  Sandbox.prototype.clear = function () {
	    var _this = this;

	    if (!this.sandboxDisabled) {
	      // remove event listeners
	      Object.keys(this.eventListeners).forEach(function (eventName) {
	        (_this.eventListeners[eventName] || []).forEach(function (listener) {
	          window.removeEventListener(eventName, listener);
	        });
	      }); // clear timeout

	      this.timeoutIds.forEach(function (id) {
	        return window.clearTimeout(id);
	      });
	      this.intervalIds.forEach(function (id) {
	        return window.clearInterval(id);
	      }); // recover original values

	      Object.keys(this.originalValues).forEach(function (key) {
	        window[key] = _this.originalValues[key];
	      });
	      Object.keys(this.propertyAdded).forEach(function (key) {
	        delete window[key];
	      });
	    }
	  };

	  return Sandbox;
	}();

	exports.MicroApps = MicroApps;
	exports.Sandbox = Sandbox;

	return exports;

}({}));
