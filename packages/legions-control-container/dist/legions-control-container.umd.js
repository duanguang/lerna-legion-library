/**
  *  legions-control-container v0.0.2
  * (c) 2020 duanguang
  * @license MIT
  */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('reflect-metadata')) :
    typeof define === 'function' && define.amd ? define(['exports', 'reflect-metadata'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.legionsControlContainer = {}));
}(this, (function (exports) { 'use strict';

    var NAMED_TAG = "named";
    var NAME_TAG = "name";
    var UNMANAGED_TAG = "unmanaged";
    var OPTIONAL_TAG = "optional";
    var INJECT_TAG = "inject";
    var MULTI_INJECT_TAG = "multi_inject";
    var TAGGED = "inversify:tagged";
    var TAGGED_PROP = "inversify:tagged_props";
    var PARAM_TYPES = "inversify:paramtypes";
    var DESIGN_PARAM_TYPES = "design:paramtypes";
    var POST_CONSTRUCT = "post_construct";

    var keys = /*#__PURE__*/Object.freeze({
        __proto__: null,
        NAMED_TAG: NAMED_TAG,
        NAME_TAG: NAME_TAG,
        UNMANAGED_TAG: UNMANAGED_TAG,
        OPTIONAL_TAG: OPTIONAL_TAG,
        INJECT_TAG: INJECT_TAG,
        MULTI_INJECT_TAG: MULTI_INJECT_TAG,
        TAGGED: TAGGED,
        TAGGED_PROP: TAGGED_PROP,
        PARAM_TYPES: PARAM_TYPES,
        DESIGN_PARAM_TYPES: DESIGN_PARAM_TYPES,
        POST_CONSTRUCT: POST_CONSTRUCT
    });

    var BindingScopeEnum = {
        Request: "Request",
        Singleton: "Singleton",
        Transient: "Transient"
    };
    var BindingTypeEnum = {
        ConstantValue: "ConstantValue",
        Constructor: "Constructor",
        DynamicValue: "DynamicValue",
        Factory: "Factory",
        Function: "Function",
        Instance: "Instance",
        Invalid: "Invalid",
        Provider: "Provider"
    };
    var TargetTypeEnum = {
        ClassProperty: "ClassProperty",
        ConstructorArgument: "ConstructorArgument",
        Variable: "Variable"
    };

    var idCounter = 0;
    function id() {
        return idCounter++;
    }

    var Binding = (function () {
        function Binding(serviceIdentifier, scope) {
            this.id = id();
            this.activated = false;
            this.serviceIdentifier = serviceIdentifier;
            this.scope = scope;
            this.type = BindingTypeEnum.Invalid;
            this.constraint = function (request) { return true; };
            this.implementationType = null;
            this.cache = null;
            this.factory = null;
            this.provider = null;
            this.onActivation = null;
            this.dynamicValue = null;
        }
        Binding.prototype.clone = function () {
            var clone = new Binding(this.serviceIdentifier, this.scope);
            clone.activated = false;
            clone.implementationType = this.implementationType;
            clone.dynamicValue = this.dynamicValue;
            clone.scope = this.scope;
            clone.type = this.type;
            clone.factory = this.factory;
            clone.provider = this.provider;
            clone.constraint = this.constraint;
            clone.onActivation = this.onActivation;
            clone.cache = this.cache;
            return clone;
        };
        return Binding;
    }());

    var DUPLICATED_INJECTABLE_DECORATOR = "Cannot apply @injectable decorator multiple times.";
    var DUPLICATED_METADATA = "Metadata key was used more than once in a parameter:";
    var NULL_ARGUMENT = "NULL argument";
    var KEY_NOT_FOUND = "Key Not Found";
    var AMBIGUOUS_MATCH = "Ambiguous match found for serviceIdentifier:";
    var CANNOT_UNBIND = "Could not unbind serviceIdentifier:";
    var NOT_REGISTERED = "No matching bindings found for serviceIdentifier:";
    var MISSING_INJECTABLE_ANNOTATION = "Missing required @injectable annotation in:";
    var MISSING_INJECT_ANNOTATION = "Missing required @inject or @multiInject annotation in:";
    var UNDEFINED_INJECT_ANNOTATION = function (name) {
        return "@inject called with undefined this could mean that the class " + name + " has " +
            "a circular dependency problem. You can use a LazyServiceIdentifer to  " +
            "overcome this limitation.";
    };
    var CIRCULAR_DEPENDENCY = "Circular dependency found:";
    var INVALID_BINDING_TYPE = "Invalid binding type:";
    var NO_MORE_SNAPSHOTS_AVAILABLE = "No snapshot available to restore.";
    var INVALID_MIDDLEWARE_RETURN = "Invalid return type in middleware. Middleware must return!";
    var INVALID_FUNCTION_BINDING = "Value provided to function binding must be a function!";
    var INVALID_TO_SELF_VALUE = "The toSelf function can only be applied when a constructor is " +
        "used as service identifier";
    var INVALID_DECORATOR_OPERATION = "The @inject @multiInject @tagged and @named decorators " +
        "must be applied to the parameters of a class constructor or a class property.";
    var ARGUMENTS_LENGTH_MISMATCH = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        return "The number of constructor arguments in the derived class " +
            (values[0] + " must be >= than the number of constructor arguments of its base class.");
    };
    var CONTAINER_OPTIONS_MUST_BE_AN_OBJECT = "Invalid Container constructor argument. Container options " +
        "must be an object.";
    var CONTAINER_OPTIONS_INVALID_DEFAULT_SCOPE = "Invalid Container option. Default scope must " +
        "be a string ('singleton' or 'transient').";
    var CONTAINER_OPTIONS_INVALID_AUTO_BIND_INJECTABLE = "Invalid Container option. Auto bind injectable must " +
        "be a boolean";
    var CONTAINER_OPTIONS_INVALID_SKIP_BASE_CHECK = "Invalid Container option. Skip base check must " +
        "be a boolean";
    var POST_CONSTRUCT_ERROR = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        return "@postConstruct error in class " + values[0] + ": " + values[1];
    };
    var CIRCULAR_DEPENDENCY_IN_FACTORY = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        return "It looks like there is a circular dependency " +
            ("in one of the '" + values[0] + "' bindings. Please investigate bindings with") +
            ("service identifier '" + values[1] + "'.");
    };
    var STACK_OVERFLOW = "Maximum call stack size exceeded";

    var MetadataReader = (function () {
        function MetadataReader() {
        }
        MetadataReader.prototype.getConstructorMetadata = function (constructorFunc) {
            var compilerGeneratedMetadata = Reflect.getMetadata(PARAM_TYPES, constructorFunc);
            var userGeneratedMetadata = Reflect.getMetadata(TAGGED, constructorFunc);
            return {
                compilerGeneratedMetadata: compilerGeneratedMetadata,
                userGeneratedMetadata: userGeneratedMetadata || {}
            };
        };
        MetadataReader.prototype.getPropertiesMetadata = function (constructorFunc) {
            var userGeneratedMetadata = Reflect.getMetadata(TAGGED_PROP, constructorFunc) || [];
            return userGeneratedMetadata;
        };
        return MetadataReader;
    }());

    var BindingCount = {
        MultipleBindingsAvailable: 2,
        NoBindingsAvailable: 0,
        OnlyOneBindingAvailable: 1
    };

    function isStackOverflowExeption(error) {
        return (error instanceof RangeError ||
            error.message === STACK_OVERFLOW);
    }

    function getServiceIdentifierAsString(serviceIdentifier) {
        if (typeof serviceIdentifier === "function") {
            var _serviceIdentifier = serviceIdentifier;
            return _serviceIdentifier.name;
        }
        else if (typeof serviceIdentifier === "symbol") {
            return serviceIdentifier.toString();
        }
        else {
            var _serviceIdentifier = serviceIdentifier;
            return _serviceIdentifier;
        }
    }
    function listRegisteredBindingsForServiceIdentifier(container, serviceIdentifier, getBindings) {
        var registeredBindingsList = "";
        var registeredBindings = getBindings(container, serviceIdentifier);
        if (registeredBindings.length !== 0) {
            registeredBindingsList = "\nRegistered bindings:";
            registeredBindings.forEach(function (binding) {
                var name = "Object";
                if (binding.implementationType !== null) {
                    name = getFunctionName(binding.implementationType);
                }
                registeredBindingsList = registeredBindingsList + "\n " + name;
                if (binding.constraint.metaData) {
                    registeredBindingsList = registeredBindingsList + " - " + binding.constraint.metaData;
                }
            });
        }
        return registeredBindingsList;
    }
    function alreadyDependencyChain(request, serviceIdentifier) {
        if (request.parentRequest === null) {
            return false;
        }
        else if (request.parentRequest.serviceIdentifier === serviceIdentifier) {
            return true;
        }
        else {
            return alreadyDependencyChain(request.parentRequest, serviceIdentifier);
        }
    }
    function dependencyChainToString(request) {
        function _createStringArr(req, result) {
            if (result === void 0) { result = []; }
            var serviceIdentifier = getServiceIdentifierAsString(req.serviceIdentifier);
            result.push(serviceIdentifier);
            if (req.parentRequest !== null) {
                return _createStringArr(req.parentRequest, result);
            }
            return result;
        }
        var stringArr = _createStringArr(request);
        return stringArr.reverse().join(" --> ");
    }
    function circularDependencyToException(request) {
        request.childRequests.forEach(function (childRequest) {
            if (alreadyDependencyChain(childRequest, childRequest.serviceIdentifier)) {
                var services = dependencyChainToString(childRequest);
                throw new Error(CIRCULAR_DEPENDENCY + " " + services);
            }
            else {
                circularDependencyToException(childRequest);
            }
        });
    }
    function listMetadataForTarget(serviceIdentifierString, target) {
        if (target.isTagged() || target.isNamed()) {
            var m_1 = "";
            var namedTag = target.getNamedTag();
            var otherTags = target.getCustomTags();
            if (namedTag !== null) {
                m_1 += namedTag.toString() + "\n";
            }
            if (otherTags !== null) {
                otherTags.forEach(function (tag) {
                    m_1 += tag.toString() + "\n";
                });
            }
            return " " + serviceIdentifierString + "\n " + serviceIdentifierString + " - " + m_1;
        }
        else {
            return " " + serviceIdentifierString;
        }
    }
    function getFunctionName(v) {
        if (v.name) {
            return v.name;
        }
        else {
            var name_1 = v.toString();
            var match = name_1.match(/^function\s*([^\s(]+)/);
            return match ? match[1] : "Anonymous function: " + name_1;
        }
    }

    var Context = (function () {
        function Context(container) {
            this.id = id();
            this.container = container;
        }
        Context.prototype.addPlan = function (plan) {
            this.plan = plan;
        };
        Context.prototype.setCurrentRequest = function (currentRequest) {
            this.currentRequest = currentRequest;
        };
        return Context;
    }());

    var Metadata = (function () {
        function Metadata(key, value) {
            this.key = key;
            this.value = value;
        }
        Metadata.prototype.toString = function () {
            if (this.key === NAMED_TAG) {
                return "named: " + this.value.toString() + " ";
            }
            else {
                return "tagged: { key:" + this.key.toString() + ", value: " + this.value + " }";
            }
        };
        return Metadata;
    }());

    var Plan = (function () {
        function Plan(parentContext, rootRequest) {
            this.parentContext = parentContext;
            this.rootRequest = rootRequest;
        }
        return Plan;
    }());

    function tagParameter(annotationTarget, propertyName, parameterIndex, metadata) {
        var metadataKey = TAGGED;
        _tagParameterOrProperty(metadataKey, annotationTarget, propertyName, metadata, parameterIndex);
    }
    function tagProperty(annotationTarget, propertyName, metadata) {
        var metadataKey = TAGGED_PROP;
        _tagParameterOrProperty(metadataKey, annotationTarget.constructor, propertyName, metadata);
    }
    function _tagParameterOrProperty(metadataKey, annotationTarget, propertyName, metadata, parameterIndex) {
        var paramsOrPropertiesMetadata = {};
        var isParameterDecorator = (typeof parameterIndex === "number");
        var key = (parameterIndex !== undefined && isParameterDecorator) ? parameterIndex.toString() : propertyName;
        if (isParameterDecorator && propertyName !== undefined) {
            throw new Error(INVALID_DECORATOR_OPERATION);
        }
        if (Reflect.hasOwnMetadata(metadataKey, annotationTarget)) {
            paramsOrPropertiesMetadata = Reflect.getMetadata(metadataKey, annotationTarget);
        }
        var paramOrPropertyMetadata = paramsOrPropertiesMetadata[key];
        if (!Array.isArray(paramOrPropertyMetadata)) {
            paramOrPropertyMetadata = [];
        }
        else {
            for (var _i = 0, paramOrPropertyMetadata_1 = paramOrPropertyMetadata; _i < paramOrPropertyMetadata_1.length; _i++) {
                var m = paramOrPropertyMetadata_1[_i];
                if (m.key === metadata.key) {
                    throw new Error(DUPLICATED_METADATA + " " + m.key.toString());
                }
            }
        }
        paramOrPropertyMetadata.push(metadata);
        paramsOrPropertiesMetadata[key] = paramOrPropertyMetadata;
        Reflect.defineMetadata(metadataKey, paramsOrPropertiesMetadata, annotationTarget);
    }
    function _decorate(decorators, target) {
        Reflect.decorate(decorators, target);
    }
    function _param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function decorate(decorator, target, parameterIndex) {
        if (typeof parameterIndex === "number") {
            _decorate([_param(parameterIndex, decorator)], target);
        }
        else if (typeof parameterIndex === "string") {
            Reflect.decorate([decorator], target, parameterIndex);
        }
        else {
            _decorate([decorator], target);
        }
    }

    var LazyServiceIdentifer = (function () {
        function LazyServiceIdentifer(cb) {
            this._cb = cb;
        }
        LazyServiceIdentifer.prototype.unwrap = function () {
            return this._cb();
        };
        return LazyServiceIdentifer;
    }());
    function inject(serviceIdentifier) {
        return function (target, targetKey, index) {
            if (serviceIdentifier === undefined) {
                throw new Error(UNDEFINED_INJECT_ANNOTATION(target.name));
            }
            var metadata = new Metadata(INJECT_TAG, serviceIdentifier);
            if (typeof index === "number") {
                tagParameter(target, targetKey, index, metadata);
            }
            else {
                tagProperty(target, targetKey, metadata);
            }
        };
    }

    var QueryableString = (function () {
        function QueryableString(str) {
            this.str = str;
        }
        QueryableString.prototype.startsWith = function (searchString) {
            return this.str.indexOf(searchString) === 0;
        };
        QueryableString.prototype.endsWith = function (searchString) {
            var reverseString = "";
            var reverseSearchString = searchString.split("").reverse().join("");
            reverseString = this.str.split("").reverse().join("");
            return this.startsWith.call({ str: reverseString }, reverseSearchString);
        };
        QueryableString.prototype.contains = function (searchString) {
            return (this.str.indexOf(searchString) !== -1);
        };
        QueryableString.prototype.equals = function (compareString) {
            return this.str === compareString;
        };
        QueryableString.prototype.value = function () {
            return this.str;
        };
        return QueryableString;
    }());

    var Target = (function () {
        function Target(type, name, serviceIdentifier, namedOrTagged) {
            this.id = id();
            this.type = type;
            this.serviceIdentifier = serviceIdentifier;
            this.name = new QueryableString(name || "");
            this.metadata = new Array();
            var metadataItem = null;
            if (typeof namedOrTagged === "string") {
                metadataItem = new Metadata(NAMED_TAG, namedOrTagged);
            }
            else if (namedOrTagged instanceof Metadata) {
                metadataItem = namedOrTagged;
            }
            if (metadataItem !== null) {
                this.metadata.push(metadataItem);
            }
        }
        Target.prototype.hasTag = function (key) {
            for (var _i = 0, _a = this.metadata; _i < _a.length; _i++) {
                var m = _a[_i];
                if (m.key === key) {
                    return true;
                }
            }
            return false;
        };
        Target.prototype.isArray = function () {
            return this.hasTag(MULTI_INJECT_TAG);
        };
        Target.prototype.matchesArray = function (name) {
            return this.matchesTag(MULTI_INJECT_TAG)(name);
        };
        Target.prototype.isNamed = function () {
            return this.hasTag(NAMED_TAG);
        };
        Target.prototype.isTagged = function () {
            return this.metadata.some(function (m) {
                return (m.key !== INJECT_TAG) &&
                    (m.key !== MULTI_INJECT_TAG) &&
                    (m.key !== NAME_TAG) &&
                    (m.key !== UNMANAGED_TAG) &&
                    (m.key !== NAMED_TAG);
            });
        };
        Target.prototype.isOptional = function () {
            return this.matchesTag(OPTIONAL_TAG)(true);
        };
        Target.prototype.getNamedTag = function () {
            if (this.isNamed()) {
                return this.metadata.filter(function (m) { return m.key === NAMED_TAG; })[0];
            }
            return null;
        };
        Target.prototype.getCustomTags = function () {
            if (this.isTagged()) {
                return this.metadata.filter(function (m) {
                    return (m.key !== INJECT_TAG) &&
                        (m.key !== MULTI_INJECT_TAG) &&
                        (m.key !== NAME_TAG) &&
                        (m.key !== UNMANAGED_TAG) &&
                        (m.key !== NAMED_TAG);
                });
            }
            return null;
        };
        Target.prototype.matchesNamedTag = function (name) {
            return this.matchesTag(NAMED_TAG)(name);
        };
        Target.prototype.matchesTag = function (key) {
            var _this = this;
            return function (value) {
                for (var _i = 0, _a = _this.metadata; _i < _a.length; _i++) {
                    var m = _a[_i];
                    if (m.key === key && m.value === value) {
                        return true;
                    }
                }
                return false;
            };
        };
        return Target;
    }());

    function getDependencies(metadataReader, func) {
        var constructorName = getFunctionName(func);
        var targets = getTargets(metadataReader, constructorName, func, false);
        return targets;
    }
    function getTargets(metadataReader, constructorName, func, isBaseClass) {
        var metadata = metadataReader.getConstructorMetadata(func);
        var serviceIdentifiers = metadata.compilerGeneratedMetadata;
        if (serviceIdentifiers === undefined) {
            var msg = MISSING_INJECTABLE_ANNOTATION + " " + constructorName + ".";
            throw new Error(msg);
        }
        var constructorArgsMetadata = metadata.userGeneratedMetadata;
        var keys = Object.keys(constructorArgsMetadata);
        var hasUserDeclaredUnknownInjections = (func.length === 0 && keys.length > 0);
        var iterations = (hasUserDeclaredUnknownInjections) ? keys.length : func.length;
        var constructorTargets = getConstructorArgsAsTargets(isBaseClass, constructorName, serviceIdentifiers, constructorArgsMetadata, iterations);
        var propertyTargets = getClassPropsAsTargets(metadataReader, func);
        var targets = constructorTargets.concat(propertyTargets);
        return targets;
    }
    function getConstructorArgsAsTarget(index, isBaseClass, constructorName, serviceIdentifiers, constructorArgsMetadata) {
        var targetMetadata = constructorArgsMetadata[index.toString()] || [];
        var metadata = formatTargetMetadata(targetMetadata);
        var isManaged = metadata.unmanaged !== true;
        var serviceIdentifier = serviceIdentifiers[index];
        var injectIdentifier = (metadata.inject || metadata.multiInject);
        serviceIdentifier = (injectIdentifier) ? (injectIdentifier) : serviceIdentifier;
        if (serviceIdentifier instanceof LazyServiceIdentifer) {
            serviceIdentifier = serviceIdentifier.unwrap();
        }
        if (isManaged) {
            var isObject = serviceIdentifier === Object;
            var isFunction = serviceIdentifier === Function;
            var isUndefined = serviceIdentifier === undefined;
            var isUnknownType = (isObject || isFunction || isUndefined);
            if (!isBaseClass && isUnknownType) {
                var msg = MISSING_INJECT_ANNOTATION + " argument " + index + " in class " + constructorName + ".";
                throw new Error(msg);
            }
            var target = new Target(TargetTypeEnum.ConstructorArgument, metadata.targetName, serviceIdentifier);
            target.metadata = targetMetadata;
            return target;
        }
        return null;
    }
    function getConstructorArgsAsTargets(isBaseClass, constructorName, serviceIdentifiers, constructorArgsMetadata, iterations) {
        var targets = [];
        for (var i = 0; i < iterations; i++) {
            var index = i;
            var target = getConstructorArgsAsTarget(index, isBaseClass, constructorName, serviceIdentifiers, constructorArgsMetadata);
            if (target !== null) {
                targets.push(target);
            }
        }
        return targets;
    }
    function getClassPropsAsTargets(metadataReader, constructorFunc) {
        var classPropsMetadata = metadataReader.getPropertiesMetadata(constructorFunc);
        var targets = [];
        var keys = Object.keys(classPropsMetadata);
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            var targetMetadata = classPropsMetadata[key];
            var metadata = formatTargetMetadata(classPropsMetadata[key]);
            var targetName = metadata.targetName || key;
            var serviceIdentifier = (metadata.inject || metadata.multiInject);
            var target = new Target(TargetTypeEnum.ClassProperty, targetName, serviceIdentifier);
            target.metadata = targetMetadata;
            targets.push(target);
        }
        var baseConstructor = Object.getPrototypeOf(constructorFunc.prototype).constructor;
        if (baseConstructor !== Object) {
            var baseTargets = getClassPropsAsTargets(metadataReader, baseConstructor);
            targets = targets.concat(baseTargets);
        }
        return targets;
    }
    function getBaseClassDependencyCount(metadataReader, func) {
        var baseConstructor = Object.getPrototypeOf(func.prototype).constructor;
        if (baseConstructor !== Object) {
            var baseConstructorName = getFunctionName(baseConstructor);
            var targets = getTargets(metadataReader, baseConstructorName, baseConstructor, true);
            var metadata = targets.map(function (t) {
                return t.metadata.filter(function (m) {
                    return m.key === UNMANAGED_TAG;
                });
            });
            var unmanagedCount = [].concat.apply([], metadata).length;
            var dependencyCount = targets.length - unmanagedCount;
            if (dependencyCount > 0) {
                return dependencyCount;
            }
            else {
                return getBaseClassDependencyCount(metadataReader, baseConstructor);
            }
        }
        else {
            return 0;
        }
    }
    function formatTargetMetadata(targetMetadata) {
        var targetMetadataMap = {};
        targetMetadata.forEach(function (m) {
            targetMetadataMap[m.key.toString()] = m.value;
        });
        return {
            inject: targetMetadataMap[INJECT_TAG],
            multiInject: targetMetadataMap[MULTI_INJECT_TAG],
            targetName: targetMetadataMap[NAME_TAG],
            unmanaged: targetMetadataMap[UNMANAGED_TAG]
        };
    }

    var Request = (function () {
        function Request(serviceIdentifier, parentContext, parentRequest, bindings, target) {
            this.id = id();
            this.serviceIdentifier = serviceIdentifier;
            this.parentContext = parentContext;
            this.parentRequest = parentRequest;
            this.target = target;
            this.childRequests = [];
            this.bindings = (Array.isArray(bindings) ? bindings : [bindings]);
            this.requestScope = parentRequest === null
                ? new Map()
                : null;
        }
        Request.prototype.addChildRequest = function (serviceIdentifier, bindings, target) {
            var child = new Request(serviceIdentifier, this.parentContext, this, bindings, target);
            this.childRequests.push(child);
            return child;
        };
        return Request;
    }());

    function getBindingDictionary(cntnr) {
        return cntnr._bindingDictionary;
    }
    function _createTarget(isMultiInject, targetType, serviceIdentifier, name, key, value) {
        var metadataKey = isMultiInject ? MULTI_INJECT_TAG : INJECT_TAG;
        var injectMetadata = new Metadata(metadataKey, serviceIdentifier);
        var target = new Target(targetType, name, serviceIdentifier, injectMetadata);
        if (key !== undefined) {
            var tagMetadata = new Metadata(key, value);
            target.metadata.push(tagMetadata);
        }
        return target;
    }
    function _getActiveBindings(metadataReader, avoidConstraints, context, parentRequest, target) {
        var bindings = getBindings(context.container, target.serviceIdentifier);
        var activeBindings = [];
        if (bindings.length === BindingCount.NoBindingsAvailable &&
            context.container.options.autoBindInjectable &&
            typeof target.serviceIdentifier === "function" &&
            metadataReader.getConstructorMetadata(target.serviceIdentifier).compilerGeneratedMetadata) {
            context.container.bind(target.serviceIdentifier).toSelf();
            bindings = getBindings(context.container, target.serviceIdentifier);
        }
        if (!avoidConstraints) {
            activeBindings = bindings.filter(function (binding) {
                var request = new Request(binding.serviceIdentifier, context, parentRequest, binding, target);
                return binding.constraint(request);
            });
        }
        else {
            activeBindings = bindings;
        }
        _validateActiveBindingCount(target.serviceIdentifier, activeBindings, target, context.container);
        return activeBindings;
    }
    function _validateActiveBindingCount(serviceIdentifier, bindings, target, container) {
        switch (bindings.length) {
            case BindingCount.NoBindingsAvailable:
                if (target.isOptional()) {
                    return bindings;
                }
                else {
                    var serviceIdentifierString = getServiceIdentifierAsString(serviceIdentifier);
                    var msg = NOT_REGISTERED;
                    msg += listMetadataForTarget(serviceIdentifierString, target);
                    msg += listRegisteredBindingsForServiceIdentifier(container, serviceIdentifierString, getBindings);
                    throw new Error(msg);
                }
            case BindingCount.OnlyOneBindingAvailable:
                if (!target.isArray()) {
                    return bindings;
                }
            case BindingCount.MultipleBindingsAvailable:
            default:
                if (!target.isArray()) {
                    var serviceIdentifierString = getServiceIdentifierAsString(serviceIdentifier);
                    var msg = AMBIGUOUS_MATCH + " " + serviceIdentifierString;
                    msg += listRegisteredBindingsForServiceIdentifier(container, serviceIdentifierString, getBindings);
                    throw new Error(msg);
                }
                else {
                    return bindings;
                }
        }
    }
    function _createSubRequests(metadataReader, avoidConstraints, serviceIdentifier, context, parentRequest, target) {
        var activeBindings;
        var childRequest;
        if (parentRequest === null) {
            activeBindings = _getActiveBindings(metadataReader, avoidConstraints, context, null, target);
            childRequest = new Request(serviceIdentifier, context, null, activeBindings, target);
            var thePlan = new Plan(context, childRequest);
            context.addPlan(thePlan);
        }
        else {
            activeBindings = _getActiveBindings(metadataReader, avoidConstraints, context, parentRequest, target);
            childRequest = parentRequest.addChildRequest(target.serviceIdentifier, activeBindings, target);
        }
        activeBindings.forEach(function (binding) {
            var subChildRequest = null;
            if (target.isArray()) {
                subChildRequest = childRequest.addChildRequest(binding.serviceIdentifier, binding, target);
            }
            else {
                if (binding.cache) {
                    return;
                }
                subChildRequest = childRequest;
            }
            if (binding.type === BindingTypeEnum.Instance && binding.implementationType !== null) {
                var dependencies = getDependencies(metadataReader, binding.implementationType);
                if (!context.container.options.skipBaseClassChecks) {
                    var baseClassDependencyCount = getBaseClassDependencyCount(metadataReader, binding.implementationType);
                    if (dependencies.length < baseClassDependencyCount) {
                        var error = ARGUMENTS_LENGTH_MISMATCH(getFunctionName(binding.implementationType));
                        throw new Error(error);
                    }
                }
                dependencies.forEach(function (dependency) {
                    _createSubRequests(metadataReader, false, dependency.serviceIdentifier, context, subChildRequest, dependency);
                });
            }
        });
    }
    function getBindings(container, serviceIdentifier) {
        var bindings = [];
        var bindingDictionary = getBindingDictionary(container);
        if (bindingDictionary.hasKey(serviceIdentifier)) {
            bindings = bindingDictionary.get(serviceIdentifier);
        }
        else if (container.parent !== null) {
            bindings = getBindings(container.parent, serviceIdentifier);
        }
        return bindings;
    }
    function plan(metadataReader, container, isMultiInject, targetType, serviceIdentifier, key, value, avoidConstraints) {
        if (avoidConstraints === void 0) { avoidConstraints = false; }
        var context = new Context(container);
        var target = _createTarget(isMultiInject, targetType, serviceIdentifier, "", key, value);
        try {
            _createSubRequests(metadataReader, avoidConstraints, serviceIdentifier, context, null, target);
            return context;
        }
        catch (error) {
            if (isStackOverflowExeption(error)) {
                if (context.plan) {
                    circularDependencyToException(context.plan.rootRequest);
                }
            }
            throw error;
        }
    }
    function createMockRequest(container, serviceIdentifier, key, value) {
        var target = new Target(TargetTypeEnum.Variable, "", serviceIdentifier, new Metadata(key, value));
        var context = new Context(container);
        var request = new Request(serviceIdentifier, context, null, [], target);
        return request;
    }

    function _injectProperties(instance, childRequests, resolveRequest) {
        var propertyInjectionsRequests = childRequests.filter(function (childRequest) {
            return (childRequest.target !== null &&
                childRequest.target.type === TargetTypeEnum.ClassProperty);
        });
        var propertyInjections = propertyInjectionsRequests.map(resolveRequest);
        propertyInjectionsRequests.forEach(function (r, index) {
            var propertyName = "";
            propertyName = r.target.name.value();
            var injection = propertyInjections[index];
            instance[propertyName] = injection;
        });
        return instance;
    }
    function _createInstance(Func, injections) {
        return new (Func.bind.apply(Func, [void 0].concat(injections)))();
    }
    function _postConstruct(constr, result) {
        if (Reflect.hasMetadata(POST_CONSTRUCT, constr)) {
            var data = Reflect.getMetadata(POST_CONSTRUCT, constr);
            try {
                result[data.value]();
            }
            catch (e) {
                throw new Error(POST_CONSTRUCT_ERROR(constr.name, e.message));
            }
        }
    }
    function resolveInstance(constr, childRequests, resolveRequest) {
        var result = null;
        if (childRequests.length > 0) {
            var constructorInjectionsRequests = childRequests.filter(function (childRequest) {
                return (childRequest.target !== null && childRequest.target.type === TargetTypeEnum.ConstructorArgument);
            });
            var constructorInjections = constructorInjectionsRequests.map(resolveRequest);
            result = _createInstance(constr, constructorInjections);
            result = _injectProperties(result, childRequests, resolveRequest);
        }
        else {
            result = new constr();
        }
        _postConstruct(constr, result);
        return result;
    }

    var invokeFactory = function (factoryType, serviceIdentifier, fn) {
        try {
            return fn();
        }
        catch (error) {
            if (isStackOverflowExeption(error)) {
                throw new Error(CIRCULAR_DEPENDENCY_IN_FACTORY(factoryType, serviceIdentifier.toString()));
            }
            else {
                throw error;
            }
        }
    };
    var _resolveRequest = function (requestScope) {
        return function (request) {
            request.parentContext.setCurrentRequest(request);
            var bindings = request.bindings;
            var childRequests = request.childRequests;
            var targetIsAnArray = request.target && request.target.isArray();
            var targetParentIsNotAnArray = !request.parentRequest ||
                !request.parentRequest.target ||
                !request.target ||
                !request.parentRequest.target.matchesArray(request.target.serviceIdentifier);
            if (targetIsAnArray && targetParentIsNotAnArray) {
                return childRequests.map(function (childRequest) {
                    var _f = _resolveRequest(requestScope);
                    return _f(childRequest);
                });
            }
            else {
                var result = null;
                if (request.target.isOptional() && bindings.length === 0) {
                    return undefined;
                }
                var binding_1 = bindings[0];
                var isSingleton = binding_1.scope === BindingScopeEnum.Singleton;
                var isRequestSingleton = binding_1.scope === BindingScopeEnum.Request;
                if (isSingleton && binding_1.activated) {
                    return binding_1.cache;
                }
                if (isRequestSingleton &&
                    requestScope !== null &&
                    requestScope.has(binding_1.id)) {
                    return requestScope.get(binding_1.id);
                }
                if (binding_1.type === BindingTypeEnum.ConstantValue) {
                    result = binding_1.cache;
                }
                else if (binding_1.type === BindingTypeEnum.Function) {
                    result = binding_1.cache;
                }
                else if (binding_1.type === BindingTypeEnum.Constructor) {
                    result = binding_1.implementationType;
                }
                else if (binding_1.type === BindingTypeEnum.DynamicValue && binding_1.dynamicValue !== null) {
                    result = invokeFactory("toDynamicValue", binding_1.serviceIdentifier, function () { return binding_1.dynamicValue(request.parentContext); });
                }
                else if (binding_1.type === BindingTypeEnum.Factory && binding_1.factory !== null) {
                    result = invokeFactory("toFactory", binding_1.serviceIdentifier, function () { return binding_1.factory(request.parentContext); });
                }
                else if (binding_1.type === BindingTypeEnum.Provider && binding_1.provider !== null) {
                    result = invokeFactory("toProvider", binding_1.serviceIdentifier, function () { return binding_1.provider(request.parentContext); });
                }
                else if (binding_1.type === BindingTypeEnum.Instance && binding_1.implementationType !== null) {
                    result = resolveInstance(binding_1.implementationType, childRequests, _resolveRequest(requestScope));
                }
                else {
                    var serviceIdentifier = getServiceIdentifierAsString(request.serviceIdentifier);
                    throw new Error(INVALID_BINDING_TYPE + " " + serviceIdentifier);
                }
                if (typeof binding_1.onActivation === "function") {
                    result = binding_1.onActivation(request.parentContext, result);
                }
                if (isSingleton) {
                    binding_1.cache = result;
                    binding_1.activated = true;
                }
                if (isRequestSingleton &&
                    requestScope !== null &&
                    !requestScope.has(binding_1.id)) {
                    requestScope.set(binding_1.id, result);
                }
                return result;
            }
        };
    };
    function resolve(context) {
        var _f = _resolveRequest(context.plan.rootRequest.requestScope);
        return _f(context.plan.rootRequest);
    }

    var traverseAncerstors = function (request, constraint) {
        var parent = request.parentRequest;
        if (parent !== null) {
            return constraint(parent) ? true : traverseAncerstors(parent, constraint);
        }
        else {
            return false;
        }
    };
    var taggedConstraint = function (key) { return function (value) {
        var constraint = function (request) {
            return request !== null && request.target !== null && request.target.matchesTag(key)(value);
        };
        constraint.metaData = new Metadata(key, value);
        return constraint;
    }; };
    var namedConstraint = taggedConstraint(NAMED_TAG);
    var typeConstraint = function (type) { return function (request) {
        var binding = null;
        if (request !== null) {
            binding = request.bindings[0];
            if (typeof type === "string") {
                var serviceIdentifier = binding.serviceIdentifier;
                return serviceIdentifier === type;
            }
            else {
                var constructor = request.bindings[0].implementationType;
                return type === constructor;
            }
        }
        return false;
    }; };

    var BindingWhenSyntax = (function () {
        function BindingWhenSyntax(binding) {
            this._binding = binding;
        }
        BindingWhenSyntax.prototype.when = function (constraint) {
            this._binding.constraint = constraint;
            return new BindingOnSyntax(this._binding);
        };
        BindingWhenSyntax.prototype.whenTargetNamed = function (name) {
            this._binding.constraint = namedConstraint(name);
            return new BindingOnSyntax(this._binding);
        };
        BindingWhenSyntax.prototype.whenTargetIsDefault = function () {
            this._binding.constraint = function (request) {
                var targetIsDefault = (request.target !== null) &&
                    (!request.target.isNamed()) &&
                    (!request.target.isTagged());
                return targetIsDefault;
            };
            return new BindingOnSyntax(this._binding);
        };
        BindingWhenSyntax.prototype.whenTargetTagged = function (tag, value) {
            this._binding.constraint = taggedConstraint(tag)(value);
            return new BindingOnSyntax(this._binding);
        };
        BindingWhenSyntax.prototype.whenInjectedInto = function (parent) {
            this._binding.constraint = function (request) {
                return typeConstraint(parent)(request.parentRequest);
            };
            return new BindingOnSyntax(this._binding);
        };
        BindingWhenSyntax.prototype.whenParentNamed = function (name) {
            this._binding.constraint = function (request) {
                return namedConstraint(name)(request.parentRequest);
            };
            return new BindingOnSyntax(this._binding);
        };
        BindingWhenSyntax.prototype.whenParentTagged = function (tag, value) {
            this._binding.constraint = function (request) {
                return taggedConstraint(tag)(value)(request.parentRequest);
            };
            return new BindingOnSyntax(this._binding);
        };
        BindingWhenSyntax.prototype.whenAnyAncestorIs = function (ancestor) {
            this._binding.constraint = function (request) {
                return traverseAncerstors(request, typeConstraint(ancestor));
            };
            return new BindingOnSyntax(this._binding);
        };
        BindingWhenSyntax.prototype.whenNoAncestorIs = function (ancestor) {
            this._binding.constraint = function (request) {
                return !traverseAncerstors(request, typeConstraint(ancestor));
            };
            return new BindingOnSyntax(this._binding);
        };
        BindingWhenSyntax.prototype.whenAnyAncestorNamed = function (name) {
            this._binding.constraint = function (request) {
                return traverseAncerstors(request, namedConstraint(name));
            };
            return new BindingOnSyntax(this._binding);
        };
        BindingWhenSyntax.prototype.whenNoAncestorNamed = function (name) {
            this._binding.constraint = function (request) {
                return !traverseAncerstors(request, namedConstraint(name));
            };
            return new BindingOnSyntax(this._binding);
        };
        BindingWhenSyntax.prototype.whenAnyAncestorTagged = function (tag, value) {
            this._binding.constraint = function (request) {
                return traverseAncerstors(request, taggedConstraint(tag)(value));
            };
            return new BindingOnSyntax(this._binding);
        };
        BindingWhenSyntax.prototype.whenNoAncestorTagged = function (tag, value) {
            this._binding.constraint = function (request) {
                return !traverseAncerstors(request, taggedConstraint(tag)(value));
            };
            return new BindingOnSyntax(this._binding);
        };
        BindingWhenSyntax.prototype.whenAnyAncestorMatches = function (constraint) {
            this._binding.constraint = function (request) {
                return traverseAncerstors(request, constraint);
            };
            return new BindingOnSyntax(this._binding);
        };
        BindingWhenSyntax.prototype.whenNoAncestorMatches = function (constraint) {
            this._binding.constraint = function (request) {
                return !traverseAncerstors(request, constraint);
            };
            return new BindingOnSyntax(this._binding);
        };
        return BindingWhenSyntax;
    }());

    var BindingOnSyntax = (function () {
        function BindingOnSyntax(binding) {
            this._binding = binding;
        }
        BindingOnSyntax.prototype.onActivation = function (handler) {
            this._binding.onActivation = handler;
            return new BindingWhenSyntax(this._binding);
        };
        return BindingOnSyntax;
    }());

    var BindingWhenOnSyntax = (function () {
        function BindingWhenOnSyntax(binding) {
            this._binding = binding;
            this._bindingWhenSyntax = new BindingWhenSyntax(this._binding);
            this._bindingOnSyntax = new BindingOnSyntax(this._binding);
        }
        BindingWhenOnSyntax.prototype.when = function (constraint) {
            return this._bindingWhenSyntax.when(constraint);
        };
        BindingWhenOnSyntax.prototype.whenTargetNamed = function (name) {
            return this._bindingWhenSyntax.whenTargetNamed(name);
        };
        BindingWhenOnSyntax.prototype.whenTargetIsDefault = function () {
            return this._bindingWhenSyntax.whenTargetIsDefault();
        };
        BindingWhenOnSyntax.prototype.whenTargetTagged = function (tag, value) {
            return this._bindingWhenSyntax.whenTargetTagged(tag, value);
        };
        BindingWhenOnSyntax.prototype.whenInjectedInto = function (parent) {
            return this._bindingWhenSyntax.whenInjectedInto(parent);
        };
        BindingWhenOnSyntax.prototype.whenParentNamed = function (name) {
            return this._bindingWhenSyntax.whenParentNamed(name);
        };
        BindingWhenOnSyntax.prototype.whenParentTagged = function (tag, value) {
            return this._bindingWhenSyntax.whenParentTagged(tag, value);
        };
        BindingWhenOnSyntax.prototype.whenAnyAncestorIs = function (ancestor) {
            return this._bindingWhenSyntax.whenAnyAncestorIs(ancestor);
        };
        BindingWhenOnSyntax.prototype.whenNoAncestorIs = function (ancestor) {
            return this._bindingWhenSyntax.whenNoAncestorIs(ancestor);
        };
        BindingWhenOnSyntax.prototype.whenAnyAncestorNamed = function (name) {
            return this._bindingWhenSyntax.whenAnyAncestorNamed(name);
        };
        BindingWhenOnSyntax.prototype.whenAnyAncestorTagged = function (tag, value) {
            return this._bindingWhenSyntax.whenAnyAncestorTagged(tag, value);
        };
        BindingWhenOnSyntax.prototype.whenNoAncestorNamed = function (name) {
            return this._bindingWhenSyntax.whenNoAncestorNamed(name);
        };
        BindingWhenOnSyntax.prototype.whenNoAncestorTagged = function (tag, value) {
            return this._bindingWhenSyntax.whenNoAncestorTagged(tag, value);
        };
        BindingWhenOnSyntax.prototype.whenAnyAncestorMatches = function (constraint) {
            return this._bindingWhenSyntax.whenAnyAncestorMatches(constraint);
        };
        BindingWhenOnSyntax.prototype.whenNoAncestorMatches = function (constraint) {
            return this._bindingWhenSyntax.whenNoAncestorMatches(constraint);
        };
        BindingWhenOnSyntax.prototype.onActivation = function (handler) {
            return this._bindingOnSyntax.onActivation(handler);
        };
        return BindingWhenOnSyntax;
    }());

    var BindingInSyntax = (function () {
        function BindingInSyntax(binding) {
            this._binding = binding;
        }
        BindingInSyntax.prototype.inRequestScope = function () {
            this._binding.scope = BindingScopeEnum.Request;
            return new BindingWhenOnSyntax(this._binding);
        };
        BindingInSyntax.prototype.inSingletonScope = function () {
            this._binding.scope = BindingScopeEnum.Singleton;
            return new BindingWhenOnSyntax(this._binding);
        };
        BindingInSyntax.prototype.inTransientScope = function () {
            this._binding.scope = BindingScopeEnum.Transient;
            return new BindingWhenOnSyntax(this._binding);
        };
        return BindingInSyntax;
    }());

    var BindingInWhenOnSyntax = (function () {
        function BindingInWhenOnSyntax(binding) {
            this._binding = binding;
            this._bindingWhenSyntax = new BindingWhenSyntax(this._binding);
            this._bindingOnSyntax = new BindingOnSyntax(this._binding);
            this._bindingInSyntax = new BindingInSyntax(binding);
        }
        BindingInWhenOnSyntax.prototype.inRequestScope = function () {
            return this._bindingInSyntax.inRequestScope();
        };
        BindingInWhenOnSyntax.prototype.inSingletonScope = function () {
            return this._bindingInSyntax.inSingletonScope();
        };
        BindingInWhenOnSyntax.prototype.inTransientScope = function () {
            return this._bindingInSyntax.inTransientScope();
        };
        BindingInWhenOnSyntax.prototype.when = function (constraint) {
            return this._bindingWhenSyntax.when(constraint);
        };
        BindingInWhenOnSyntax.prototype.whenTargetNamed = function (name) {
            return this._bindingWhenSyntax.whenTargetNamed(name);
        };
        BindingInWhenOnSyntax.prototype.whenTargetIsDefault = function () {
            return this._bindingWhenSyntax.whenTargetIsDefault();
        };
        BindingInWhenOnSyntax.prototype.whenTargetTagged = function (tag, value) {
            return this._bindingWhenSyntax.whenTargetTagged(tag, value);
        };
        BindingInWhenOnSyntax.prototype.whenInjectedInto = function (parent) {
            return this._bindingWhenSyntax.whenInjectedInto(parent);
        };
        BindingInWhenOnSyntax.prototype.whenParentNamed = function (name) {
            return this._bindingWhenSyntax.whenParentNamed(name);
        };
        BindingInWhenOnSyntax.prototype.whenParentTagged = function (tag, value) {
            return this._bindingWhenSyntax.whenParentTagged(tag, value);
        };
        BindingInWhenOnSyntax.prototype.whenAnyAncestorIs = function (ancestor) {
            return this._bindingWhenSyntax.whenAnyAncestorIs(ancestor);
        };
        BindingInWhenOnSyntax.prototype.whenNoAncestorIs = function (ancestor) {
            return this._bindingWhenSyntax.whenNoAncestorIs(ancestor);
        };
        BindingInWhenOnSyntax.prototype.whenAnyAncestorNamed = function (name) {
            return this._bindingWhenSyntax.whenAnyAncestorNamed(name);
        };
        BindingInWhenOnSyntax.prototype.whenAnyAncestorTagged = function (tag, value) {
            return this._bindingWhenSyntax.whenAnyAncestorTagged(tag, value);
        };
        BindingInWhenOnSyntax.prototype.whenNoAncestorNamed = function (name) {
            return this._bindingWhenSyntax.whenNoAncestorNamed(name);
        };
        BindingInWhenOnSyntax.prototype.whenNoAncestorTagged = function (tag, value) {
            return this._bindingWhenSyntax.whenNoAncestorTagged(tag, value);
        };
        BindingInWhenOnSyntax.prototype.whenAnyAncestorMatches = function (constraint) {
            return this._bindingWhenSyntax.whenAnyAncestorMatches(constraint);
        };
        BindingInWhenOnSyntax.prototype.whenNoAncestorMatches = function (constraint) {
            return this._bindingWhenSyntax.whenNoAncestorMatches(constraint);
        };
        BindingInWhenOnSyntax.prototype.onActivation = function (handler) {
            return this._bindingOnSyntax.onActivation(handler);
        };
        return BindingInWhenOnSyntax;
    }());

    var BindingToSyntax = (function () {
        function BindingToSyntax(binding) {
            this._binding = binding;
        }
        BindingToSyntax.prototype.to = function (constructor) {
            this._binding.type = BindingTypeEnum.Instance;
            this._binding.implementationType = constructor;
            return new BindingInWhenOnSyntax(this._binding);
        };
        BindingToSyntax.prototype.toSelf = function () {
            if (typeof this._binding.serviceIdentifier !== "function") {
                throw new Error("" + INVALID_TO_SELF_VALUE);
            }
            var self = this._binding.serviceIdentifier;
            return this.to(self);
        };
        BindingToSyntax.prototype.toConstantValue = function (value) {
            this._binding.type = BindingTypeEnum.ConstantValue;
            this._binding.cache = value;
            this._binding.dynamicValue = null;
            this._binding.implementationType = null;
            return new BindingWhenOnSyntax(this._binding);
        };
        BindingToSyntax.prototype.toDynamicValue = function (func) {
            this._binding.type = BindingTypeEnum.DynamicValue;
            this._binding.cache = null;
            this._binding.dynamicValue = func;
            this._binding.implementationType = null;
            return new BindingInWhenOnSyntax(this._binding);
        };
        BindingToSyntax.prototype.toConstructor = function (constructor) {
            this._binding.type = BindingTypeEnum.Constructor;
            this._binding.implementationType = constructor;
            return new BindingWhenOnSyntax(this._binding);
        };
        BindingToSyntax.prototype.toFactory = function (factory) {
            this._binding.type = BindingTypeEnum.Factory;
            this._binding.factory = factory;
            return new BindingWhenOnSyntax(this._binding);
        };
        BindingToSyntax.prototype.toFunction = function (func) {
            if (typeof func !== "function") {
                throw new Error(INVALID_FUNCTION_BINDING);
            }
            var bindingWhenOnSyntax = this.toConstantValue(func);
            this._binding.type = BindingTypeEnum.Function;
            return bindingWhenOnSyntax;
        };
        BindingToSyntax.prototype.toAutoFactory = function (serviceIdentifier) {
            this._binding.type = BindingTypeEnum.Factory;
            this._binding.factory = function (context) {
                var autofactory = function () { return context.container.get(serviceIdentifier); };
                return autofactory;
            };
            return new BindingWhenOnSyntax(this._binding);
        };
        BindingToSyntax.prototype.toProvider = function (provider) {
            this._binding.type = BindingTypeEnum.Provider;
            this._binding.provider = provider;
            return new BindingWhenOnSyntax(this._binding);
        };
        BindingToSyntax.prototype.toService = function (service) {
            this.toDynamicValue(function (context) { return context.container.get(service); });
        };
        return BindingToSyntax;
    }());

    var ContainerSnapshot = (function () {
        function ContainerSnapshot() {
        }
        ContainerSnapshot.of = function (bindings, middleware) {
            var snapshot = new ContainerSnapshot();
            snapshot.bindings = bindings;
            snapshot.middleware = middleware;
            return snapshot;
        };
        return ContainerSnapshot;
    }());

    var Lookup = (function () {
        function Lookup() {
            this._map = new Map();
        }
        Lookup.prototype.getMap = function () {
            return this._map;
        };
        Lookup.prototype.add = function (serviceIdentifier, value) {
            if (serviceIdentifier === null || serviceIdentifier === undefined) {
                throw new Error(NULL_ARGUMENT);
            }
            if (value === null || value === undefined) {
                throw new Error(NULL_ARGUMENT);
            }
            var entry = this._map.get(serviceIdentifier);
            if (entry !== undefined) {
                entry.push(value);
                this._map.set(serviceIdentifier, entry);
            }
            else {
                this._map.set(serviceIdentifier, [value]);
            }
        };
        Lookup.prototype.get = function (serviceIdentifier) {
            if (serviceIdentifier === null || serviceIdentifier === undefined) {
                throw new Error(NULL_ARGUMENT);
            }
            var entry = this._map.get(serviceIdentifier);
            if (entry !== undefined) {
                return entry;
            }
            else {
                throw new Error(KEY_NOT_FOUND);
            }
        };
        Lookup.prototype.remove = function (serviceIdentifier) {
            if (serviceIdentifier === null || serviceIdentifier === undefined) {
                throw new Error(NULL_ARGUMENT);
            }
            if (!this._map.delete(serviceIdentifier)) {
                throw new Error(KEY_NOT_FOUND);
            }
        };
        Lookup.prototype.removeByCondition = function (condition) {
            var _this = this;
            this._map.forEach(function (entries, key) {
                var updatedEntries = entries.filter(function (entry) { return !condition(entry); });
                if (updatedEntries.length > 0) {
                    _this._map.set(key, updatedEntries);
                }
                else {
                    _this._map.delete(key);
                }
            });
        };
        Lookup.prototype.hasKey = function (serviceIdentifier) {
            if (serviceIdentifier === null || serviceIdentifier === undefined) {
                throw new Error(NULL_ARGUMENT);
            }
            return this._map.has(serviceIdentifier);
        };
        Lookup.prototype.clone = function () {
            var copy = new Lookup();
            this._map.forEach(function (value, key) {
                value.forEach(function (b) { return copy.add(key, b.clone()); });
            });
            return copy;
        };
        Lookup.prototype.traverse = function (func) {
            this._map.forEach(function (value, key) {
                func(key, value);
            });
        };
        return Lookup;
    }());

    var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [0, t.value];
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
    };
    var Container = (function () {
        function Container(containerOptions) {
            var options = containerOptions || {};
            if (typeof options !== "object") {
                throw new Error("" + CONTAINER_OPTIONS_MUST_BE_AN_OBJECT);
            }
            if (options.defaultScope === undefined) {
                options.defaultScope = BindingScopeEnum.Transient;
            }
            else if (options.defaultScope !== BindingScopeEnum.Singleton &&
                options.defaultScope !== BindingScopeEnum.Transient &&
                options.defaultScope !== BindingScopeEnum.Request) {
                throw new Error("" + CONTAINER_OPTIONS_INVALID_DEFAULT_SCOPE);
            }
            if (options.autoBindInjectable === undefined) {
                options.autoBindInjectable = false;
            }
            else if (typeof options.autoBindInjectable !== "boolean") {
                throw new Error("" + CONTAINER_OPTIONS_INVALID_AUTO_BIND_INJECTABLE);
            }
            if (options.skipBaseClassChecks === undefined) {
                options.skipBaseClassChecks = false;
            }
            else if (typeof options.skipBaseClassChecks !== "boolean") {
                throw new Error("" + CONTAINER_OPTIONS_INVALID_SKIP_BASE_CHECK);
            }
            this.options = {
                autoBindInjectable: options.autoBindInjectable,
                defaultScope: options.defaultScope,
                skipBaseClassChecks: options.skipBaseClassChecks
            };
            this.id = id();
            this._bindingDictionary = new Lookup();
            this._snapshots = [];
            this._middleware = null;
            this.parent = null;
            this._metadataReader = new MetadataReader();
        }
        Container.merge = function (container1, container2) {
            var container = new Container();
            var bindingDictionary = getBindingDictionary(container);
            var bindingDictionary1 = getBindingDictionary(container1);
            var bindingDictionary2 = getBindingDictionary(container2);
            function copyDictionary(origin, destination) {
                origin.traverse(function (key, value) {
                    value.forEach(function (binding) {
                        destination.add(binding.serviceIdentifier, binding.clone());
                    });
                });
            }
            copyDictionary(bindingDictionary1, bindingDictionary);
            copyDictionary(bindingDictionary2, bindingDictionary);
            return container;
        };
        Container.prototype.load = function () {
            var modules = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                modules[_i] = arguments[_i];
            }
            var getHelpers = this._getContainerModuleHelpersFactory();
            for (var _a = 0, modules_1 = modules; _a < modules_1.length; _a++) {
                var currentModule = modules_1[_a];
                var containerModuleHelpers = getHelpers(currentModule.id);
                currentModule.registry(containerModuleHelpers.bindFunction, containerModuleHelpers.unbindFunction, containerModuleHelpers.isboundFunction, containerModuleHelpers.rebindFunction);
            }
        };
        Container.prototype.loadAsync = function () {
            var modules = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                modules[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var getHelpers, _a, modules_2, currentModule, containerModuleHelpers;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            getHelpers = this._getContainerModuleHelpersFactory();
                            _a = 0, modules_2 = modules;
                            _b.label = 1;
                        case 1:
                            if (!(_a < modules_2.length)) return [3, 4];
                            currentModule = modules_2[_a];
                            containerModuleHelpers = getHelpers(currentModule.id);
                            return [4, currentModule.registry(containerModuleHelpers.bindFunction, containerModuleHelpers.unbindFunction, containerModuleHelpers.isboundFunction, containerModuleHelpers.rebindFunction)];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            _a++;
                            return [3, 1];
                        case 4: return [2];
                    }
                });
            });
        };
        Container.prototype.unload = function () {
            var _this = this;
            var modules = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                modules[_i] = arguments[_i];
            }
            var conditionFactory = function (expected) { return function (item) {
                return item.moduleId === expected;
            }; };
            modules.forEach(function (module) {
                var condition = conditionFactory(module.id);
                _this._bindingDictionary.removeByCondition(condition);
            });
        };
        Container.prototype.bind = function (serviceIdentifier) {
            var scope = this.options.defaultScope || BindingScopeEnum.Transient;
            var binding = new Binding(serviceIdentifier, scope);
            this._bindingDictionary.add(serviceIdentifier, binding);
            return new BindingToSyntax(binding);
        };
        Container.prototype.rebind = function (serviceIdentifier) {
            this.unbind(serviceIdentifier);
            return this.bind(serviceIdentifier);
        };
        Container.prototype.unbind = function (serviceIdentifier) {
            try {
                this._bindingDictionary.remove(serviceIdentifier);
            }
            catch (e) {
                throw new Error(CANNOT_UNBIND + " " + getServiceIdentifierAsString(serviceIdentifier));
            }
        };
        Container.prototype.unbindAll = function () {
            this._bindingDictionary = new Lookup();
        };
        Container.prototype.isBound = function (serviceIdentifier) {
            var bound = this._bindingDictionary.hasKey(serviceIdentifier);
            if (!bound && this.parent) {
                bound = this.parent.isBound(serviceIdentifier);
            }
            return bound;
        };
        Container.prototype.isBoundNamed = function (serviceIdentifier, named) {
            return this.isBoundTagged(serviceIdentifier, NAMED_TAG, named);
        };
        Container.prototype.isBoundTagged = function (serviceIdentifier, key, value) {
            var bound = false;
            if (this._bindingDictionary.hasKey(serviceIdentifier)) {
                var bindings = this._bindingDictionary.get(serviceIdentifier);
                var request_1 = createMockRequest(this, serviceIdentifier, key, value);
                bound = bindings.some(function (b) { return b.constraint(request_1); });
            }
            if (!bound && this.parent) {
                bound = this.parent.isBoundTagged(serviceIdentifier, key, value);
            }
            return bound;
        };
        Container.prototype.snapshot = function () {
            this._snapshots.push(ContainerSnapshot.of(this._bindingDictionary.clone(), this._middleware));
        };
        Container.prototype.restore = function () {
            var snapshot = this._snapshots.pop();
            if (snapshot === undefined) {
                throw new Error(NO_MORE_SNAPSHOTS_AVAILABLE);
            }
            this._bindingDictionary = snapshot.bindings;
            this._middleware = snapshot.middleware;
        };
        Container.prototype.createChild = function (containerOptions) {
            var child = new Container(containerOptions || this.options);
            child.parent = this;
            return child;
        };
        Container.prototype.applyMiddleware = function () {
            var middlewares = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                middlewares[_i] = arguments[_i];
            }
            var initial = (this._middleware) ? this._middleware : this._planAndResolve();
            this._middleware = middlewares.reduce(function (prev, curr) { return curr(prev); }, initial);
        };
        Container.prototype.applyCustomMetadataReader = function (metadataReader) {
            this._metadataReader = metadataReader;
        };
        Container.prototype.get = function (serviceIdentifier) {
            return this._get(false, false, TargetTypeEnum.Variable, serviceIdentifier);
        };
        Container.prototype.getTagged = function (serviceIdentifier, key, value) {
            return this._get(false, false, TargetTypeEnum.Variable, serviceIdentifier, key, value);
        };
        Container.prototype.getNamed = function (serviceIdentifier, named) {
            return this.getTagged(serviceIdentifier, NAMED_TAG, named);
        };
        Container.prototype.getAll = function (serviceIdentifier) {
            return this._get(true, true, TargetTypeEnum.Variable, serviceIdentifier);
        };
        Container.prototype.getAllTagged = function (serviceIdentifier, key, value) {
            return this._get(false, true, TargetTypeEnum.Variable, serviceIdentifier, key, value);
        };
        Container.prototype.getAllNamed = function (serviceIdentifier, named) {
            return this.getAllTagged(serviceIdentifier, NAMED_TAG, named);
        };
        Container.prototype.resolve = function (constructorFunction) {
            var tempContainer = this.createChild();
            tempContainer.bind(constructorFunction).toSelf();
            return tempContainer.get(constructorFunction);
        };
        Container.prototype._getContainerModuleHelpersFactory = function () {
            var _this = this;
            var setModuleId = function (bindingToSyntax, moduleId) {
                bindingToSyntax._binding.moduleId = moduleId;
            };
            var getBindFunction = function (moduleId) {
                return function (serviceIdentifier) {
                    var _bind = _this.bind.bind(_this);
                    var bindingToSyntax = _bind(serviceIdentifier);
                    setModuleId(bindingToSyntax, moduleId);
                    return bindingToSyntax;
                };
            };
            var getUnbindFunction = function (moduleId) {
                return function (serviceIdentifier) {
                    var _unbind = _this.unbind.bind(_this);
                    _unbind(serviceIdentifier);
                };
            };
            var getIsboundFunction = function (moduleId) {
                return function (serviceIdentifier) {
                    var _isBound = _this.isBound.bind(_this);
                    return _isBound(serviceIdentifier);
                };
            };
            var getRebindFunction = function (moduleId) {
                return function (serviceIdentifier) {
                    var _rebind = _this.rebind.bind(_this);
                    var bindingToSyntax = _rebind(serviceIdentifier);
                    setModuleId(bindingToSyntax, moduleId);
                    return bindingToSyntax;
                };
            };
            return function (mId) { return ({
                bindFunction: getBindFunction(mId),
                isboundFunction: getIsboundFunction(),
                rebindFunction: getRebindFunction(mId),
                unbindFunction: getUnbindFunction()
            }); };
        };
        Container.prototype._get = function (avoidConstraints, isMultiInject, targetType, serviceIdentifier, key, value) {
            var result = null;
            var defaultArgs = {
                avoidConstraints: avoidConstraints,
                contextInterceptor: function (context) { return context; },
                isMultiInject: isMultiInject,
                key: key,
                serviceIdentifier: serviceIdentifier,
                targetType: targetType,
                value: value
            };
            if (this._middleware) {
                result = this._middleware(defaultArgs);
                if (result === undefined || result === null) {
                    throw new Error(INVALID_MIDDLEWARE_RETURN);
                }
            }
            else {
                result = this._planAndResolve()(defaultArgs);
            }
            return result;
        };
        Container.prototype._planAndResolve = function () {
            var _this = this;
            return function (args) {
                var context = plan(_this._metadataReader, _this, args.isMultiInject, args.targetType, args.serviceIdentifier, args.key, args.value, args.avoidConstraints);
                context = args.contextInterceptor(context);
                var result = resolve(context);
                return result;
            };
        };
        return Container;
    }());

    var ContainerModule = (function () {
        function ContainerModule(registry) {
            this.id = id();
            this.registry = registry;
        }
        return ContainerModule;
    }());

    function injectable() {
        return function (target) {
            if (Reflect.hasOwnMetadata(PARAM_TYPES, target)) {
                throw new Error(DUPLICATED_INJECTABLE_DECORATOR);
            }
            var types = Reflect.getMetadata(DESIGN_PARAM_TYPES, target) || [];
            Reflect.defineMetadata(PARAM_TYPES, types, target);
            return target;
        };
    }

    var METADATA_KEY = keys;

    var METADATA_KEY$1 = {
        provide: "inversify-binding-decorators:provide",
    };

    function provide(serviceIdentifier, force) {
        return function (target) {
            var isAlreadyDecorated = Reflect.hasOwnMetadata(METADATA_KEY.PARAM_TYPES, target);
            var redecorateWithInject = force === true;
            if (redecorateWithInject === true && isAlreadyDecorated === false) {
                decorate(injectable(), target);
            }
            else if (redecorateWithInject === true && isAlreadyDecorated === true) ;
            else {
                try {
                    decorate(injectable(), target);
                }
                catch (e) {
                    throw new Error("Cannot apply @provide decorator multiple times but is has been used " +
                        ("multiple times in " + target.name + " ") +
                        "Please use @provide(ID, true) if you are trying to declare multiple bindings!");
                }
            }
            var currentMetadata = {
                constraint: function (bind, bindTarget) { return bind(serviceIdentifier).to(bindTarget); },
                implementationType: target
            };
            var previousMetadata = Reflect.getMetadata(METADATA_KEY$1.provide, Reflect) || [];
            var newMetadata = [currentMetadata].concat(previousMetadata);
            Reflect.defineMetadata(METADATA_KEY$1.provide, newMetadata, Reflect);
            return target;
        };
    }

    var ProvideInWhenOnSyntax = /** @class */ (function () {
        function ProvideInWhenOnSyntax(provideInSyntax, provideWhenSyntax, provideOnSyntax) {
            this._provideInSyntax = provideInSyntax;
            this._provideWhenSyntax = provideWhenSyntax;
            this._provideOnSyntax = provideOnSyntax;
        }
        ProvideInWhenOnSyntax.prototype.when = function (constraint) {
            return this._provideWhenSyntax.when(constraint);
        };
        ProvideInWhenOnSyntax.prototype.whenTargetNamed = function (name) {
            return this._provideWhenSyntax.whenTargetNamed(name);
        };
        ProvideInWhenOnSyntax.prototype.whenTargetTagged = function (tag, value) {
            return this._provideWhenSyntax.whenTargetTagged(tag, value);
        };
        ProvideInWhenOnSyntax.prototype.whenInjectedInto = function (parent) {
            return this._provideWhenSyntax.whenInjectedInto(parent);
        };
        ProvideInWhenOnSyntax.prototype.whenParentNamed = function (name) {
            return this._provideWhenSyntax.whenParentNamed(name);
        };
        ProvideInWhenOnSyntax.prototype.whenParentTagged = function (tag, value) {
            return this._provideWhenSyntax.whenParentTagged(tag, value);
        };
        ProvideInWhenOnSyntax.prototype.whenAnyAncestorIs = function (ancestor) {
            return this._provideWhenSyntax.whenAnyAncestorIs(ancestor);
        };
        ProvideInWhenOnSyntax.prototype.whenNoAncestorIs = function (ancestor) {
            return this._provideWhenSyntax.whenNoAncestorIs(ancestor);
        };
        ProvideInWhenOnSyntax.prototype.whenAnyAncestorNamed = function (name) {
            return this._provideWhenSyntax.whenAnyAncestorNamed(name);
        };
        ProvideInWhenOnSyntax.prototype.whenAnyAncestorTagged = function (tag, value) {
            return this._provideWhenSyntax.whenAnyAncestorTagged(tag, value);
        };
        ProvideInWhenOnSyntax.prototype.whenNoAncestorNamed = function (name) {
            return this._provideWhenSyntax.whenNoAncestorNamed(name);
        };
        ProvideInWhenOnSyntax.prototype.whenNoAncestorTagged = function (tag, value) {
            return this._provideWhenSyntax.whenNoAncestorTagged(tag, value);
        };
        ProvideInWhenOnSyntax.prototype.whenAnyAncestorMatches = function (constraint) {
            return this._provideWhenSyntax.whenAnyAncestorMatches(constraint);
        };
        ProvideInWhenOnSyntax.prototype.whenNoAncestorMatches = function (constraint) {
            return this._provideWhenSyntax.whenNoAncestorMatches(constraint);
        };
        ProvideInWhenOnSyntax.prototype.onActivation = function (fn) {
            return this._provideOnSyntax.onActivation(fn);
        };
        ProvideInWhenOnSyntax.prototype.inSingletonScope = function () {
            return this._provideInSyntax.inSingletonScope();
        };
        ProvideInWhenOnSyntax.prototype.inTransientScope = function () {
            return this._provideInSyntax.inTransientScope();
        };
        ProvideInWhenOnSyntax.prototype.done = function (force) {
            return this._provideInSyntax.done(force);
        };
        return ProvideInWhenOnSyntax;
    }());

    var ProvideDoneSyntax = /** @class */ (function () {
        function ProvideDoneSyntax(binding) {
            this._binding = binding;
        }
        ProvideDoneSyntax.prototype.done = function (force) {
            var that = this;
            return function (target) {
                var isAlreadyDecorated = Reflect.hasOwnMetadata(METADATA_KEY.PARAM_TYPES, target);
                var redecorateWithInject = force === true;
                if (redecorateWithInject === true && isAlreadyDecorated === false) {
                    decorate(injectable(), target);
                }
                else if (redecorateWithInject === true && isAlreadyDecorated === true) ;
                else {
                    try {
                        decorate(injectable(), target);
                    }
                    catch (e) {
                        throw new Error("Cannot apply @provideFluent decorator multiple times but is has been used " +
                            ("multiple times in " + target.name + " ") +
                            "Please use done(true) if you are trying to declare multiple bindings!");
                    }
                }
                var currentMetadata = {
                    constraint: that._binding,
                    implementationType: target
                };
                var previousMetadata = Reflect.getMetadata(METADATA_KEY$1.provide, Reflect) || [];
                var newMetadata = [currentMetadata].concat(previousMetadata);
                Reflect.defineMetadata(METADATA_KEY$1.provide, newMetadata, Reflect);
                return target;
            };
        };
        return ProvideDoneSyntax;
    }());

    var ProvideOnSyntax = /** @class */ (function () {
        function ProvideOnSyntax(bindingOnSyntax, provideDoneSyntax) {
            this._bindingOnSyntax = bindingOnSyntax;
            this._provideDoneSyntax = provideDoneSyntax;
        }
        ProvideOnSyntax.prototype.onActivation = function (fn) {
            var _this = this;
            var bindingWhenSyntax = function (bind, target) { return _this._bindingOnSyntax(bind, target).onActivation(fn); };
            var onDoneSyntax = new ProvideDoneSyntax(bindingWhenSyntax);
            return new ProvideWhenSyntax(bindingWhenSyntax, onDoneSyntax);
        };
        ProvideOnSyntax.prototype.done = function (force) {
            return this._provideDoneSyntax.done(force);
        };
        return ProvideOnSyntax;
    }());

    var ProvideWhenSyntax = /** @class */ (function () {
        function ProvideWhenSyntax(bindingWhenSyntax, provideDoneSyntax) {
            this._bindingWhenSyntax = bindingWhenSyntax;
            this._provideDoneSyntax = provideDoneSyntax;
        }
        ProvideWhenSyntax.prototype.when = function (constraint) {
            var _this = this;
            var bindingOnSyntax = function (bind, target) {
                return _this._bindingWhenSyntax(bind, target).when(constraint);
            };
            var whenDoneSyntax = new ProvideDoneSyntax(bindingOnSyntax);
            return new ProvideOnSyntax(bindingOnSyntax, whenDoneSyntax);
        };
        ProvideWhenSyntax.prototype.whenTargetNamed = function (name) {
            var _this = this;
            var bindingOnSyntax = function (bind, target) {
                return _this._bindingWhenSyntax(bind, target).whenTargetNamed(name);
            };
            var whenDoneSyntax = new ProvideDoneSyntax(bindingOnSyntax);
            return new ProvideOnSyntax(bindingOnSyntax, whenDoneSyntax);
        };
        ProvideWhenSyntax.prototype.whenTargetTagged = function (tag, value) {
            var _this = this;
            var bindingOnSyntax = function (bind, target) {
                return _this._bindingWhenSyntax(bind, target).whenTargetTagged(tag, value);
            };
            var whenDoneSyntax = new ProvideDoneSyntax(bindingOnSyntax);
            return new ProvideOnSyntax(bindingOnSyntax, whenDoneSyntax);
        };
        ProvideWhenSyntax.prototype.whenInjectedInto = function (parent) {
            var _this = this;
            var bindingOnSyntax = function (bind, target) {
                return _this._bindingWhenSyntax(bind, target).whenInjectedInto(parent);
            };
            var whenDoneSyntax = new ProvideDoneSyntax(bindingOnSyntax);
            return new ProvideOnSyntax(bindingOnSyntax, whenDoneSyntax);
        };
        ProvideWhenSyntax.prototype.whenParentNamed = function (name) {
            var _this = this;
            var bindingOnSyntax = function (bind, target) {
                return _this._bindingWhenSyntax(bind, target).whenParentNamed(name);
            };
            var whenDoneSyntax = new ProvideDoneSyntax(bindingOnSyntax);
            return new ProvideOnSyntax(bindingOnSyntax, whenDoneSyntax);
        };
        ProvideWhenSyntax.prototype.whenParentTagged = function (tag, value) {
            var _this = this;
            var bindingOnSyntax = function (bind, target) {
                return _this._bindingWhenSyntax(bind, target).whenParentTagged(tag, value);
            };
            var whenDoneSyntax = new ProvideDoneSyntax(bindingOnSyntax);
            return new ProvideOnSyntax(bindingOnSyntax, whenDoneSyntax);
        };
        ProvideWhenSyntax.prototype.whenAnyAncestorIs = function (ancestor) {
            var _this = this;
            var bindingOnSyntax = function (bind, target) {
                return _this._bindingWhenSyntax(bind, target).whenAnyAncestorIs(ancestor);
            };
            var whenDoneSyntax = new ProvideDoneSyntax(bindingOnSyntax);
            return new ProvideOnSyntax(bindingOnSyntax, whenDoneSyntax);
        };
        ProvideWhenSyntax.prototype.whenNoAncestorIs = function (ancestor) {
            var _this = this;
            var bindingOnSyntax = function (bind, target) {
                return _this._bindingWhenSyntax(bind, target).whenNoAncestorIs(ancestor);
            };
            var whenDoneSyntax = new ProvideDoneSyntax(bindingOnSyntax);
            return new ProvideOnSyntax(bindingOnSyntax, whenDoneSyntax);
        };
        ProvideWhenSyntax.prototype.whenAnyAncestorNamed = function (name) {
            var _this = this;
            var bindingOnSyntax = function (bind, target) {
                return _this._bindingWhenSyntax(bind, target).whenAnyAncestorNamed(name);
            };
            var whenDoneSyntax = new ProvideDoneSyntax(bindingOnSyntax);
            return new ProvideOnSyntax(bindingOnSyntax, whenDoneSyntax);
        };
        ProvideWhenSyntax.prototype.whenAnyAncestorTagged = function (tag, value) {
            var _this = this;
            var bindingOnSyntax = function (bind, target) {
                return _this._bindingWhenSyntax(bind, target).whenAnyAncestorTagged(tag, value);
            };
            var whenDoneSyntax = new ProvideDoneSyntax(bindingOnSyntax);
            return new ProvideOnSyntax(bindingOnSyntax, whenDoneSyntax);
        };
        ProvideWhenSyntax.prototype.whenNoAncestorNamed = function (name) {
            var _this = this;
            var bindingOnSyntax = function (bind, target) {
                return _this._bindingWhenSyntax(bind, target).whenNoAncestorNamed(name);
            };
            var whenDoneSyntax = new ProvideDoneSyntax(bindingOnSyntax);
            return new ProvideOnSyntax(bindingOnSyntax, whenDoneSyntax);
        };
        ProvideWhenSyntax.prototype.whenNoAncestorTagged = function (tag, value) {
            var _this = this;
            var bindingOnSyntax = function (bind, target) {
                return _this._bindingWhenSyntax(bind, target).whenNoAncestorTagged(tag, value);
            };
            var whenDoneSyntax = new ProvideDoneSyntax(bindingOnSyntax);
            return new ProvideOnSyntax(bindingOnSyntax, whenDoneSyntax);
        };
        ProvideWhenSyntax.prototype.whenAnyAncestorMatches = function (constraint) {
            var _this = this;
            var bindingOnSyntax = function (bind, target) {
                return _this._bindingWhenSyntax(bind, target).whenAnyAncestorMatches(constraint);
            };
            var whenDoneSyntax = new ProvideDoneSyntax(bindingOnSyntax);
            return new ProvideOnSyntax(bindingOnSyntax, whenDoneSyntax);
        };
        ProvideWhenSyntax.prototype.whenNoAncestorMatches = function (constraint) {
            var _this = this;
            var bindingOnSyntax = function (bind, target) {
                return _this._bindingWhenSyntax(bind, target).whenNoAncestorMatches(constraint);
            };
            var whenDoneSyntax = new ProvideDoneSyntax(bindingOnSyntax);
            return new ProvideOnSyntax(bindingOnSyntax, whenDoneSyntax);
        };
        ProvideWhenSyntax.prototype.done = function (force) {
            return this._provideDoneSyntax.done(force);
        };
        return ProvideWhenSyntax;
    }());

    var ProvideWhenOnSyntax = /** @class */ (function () {
        function ProvideWhenOnSyntax(provideWhenSyntax, provideOnSyntax) {
            this._provideWhenSyntax = provideWhenSyntax;
            this._provideOnSyntax = provideOnSyntax;
        }
        ProvideWhenOnSyntax.prototype.when = function (constraint) {
            return this._provideWhenSyntax.when(constraint);
        };
        ProvideWhenOnSyntax.prototype.whenTargetNamed = function (name) {
            return this._provideWhenSyntax.whenTargetNamed(name);
        };
        ProvideWhenOnSyntax.prototype.whenTargetTagged = function (tag, value) {
            return this._provideWhenSyntax.whenTargetTagged(tag, value);
        };
        ProvideWhenOnSyntax.prototype.whenInjectedInto = function (parent) {
            return this._provideWhenSyntax.whenInjectedInto(parent);
        };
        ProvideWhenOnSyntax.prototype.whenParentNamed = function (name) {
            return this._provideWhenSyntax.whenParentNamed(name);
        };
        ProvideWhenOnSyntax.prototype.whenParentTagged = function (tag, value) {
            return this._provideWhenSyntax.whenParentTagged(tag, value);
        };
        ProvideWhenOnSyntax.prototype.whenAnyAncestorIs = function (ancestor) {
            return this._provideWhenSyntax.whenAnyAncestorIs(ancestor);
        };
        ProvideWhenOnSyntax.prototype.whenNoAncestorIs = function (ancestor) {
            return this._provideWhenSyntax.whenNoAncestorIs(ancestor);
        };
        ProvideWhenOnSyntax.prototype.whenAnyAncestorNamed = function (name) {
            return this._provideWhenSyntax.whenAnyAncestorNamed(name);
        };
        ProvideWhenOnSyntax.prototype.whenAnyAncestorTagged = function (tag, value) {
            return this._provideWhenSyntax.whenAnyAncestorTagged(tag, value);
        };
        ProvideWhenOnSyntax.prototype.whenNoAncestorNamed = function (name) {
            return this._provideWhenSyntax.whenNoAncestorNamed(name);
        };
        ProvideWhenOnSyntax.prototype.whenNoAncestorTagged = function (tag, value) {
            return this._provideWhenSyntax.whenNoAncestorTagged(tag, value);
        };
        ProvideWhenOnSyntax.prototype.whenAnyAncestorMatches = function (constraint) {
            return this._provideWhenSyntax.whenAnyAncestorMatches(constraint);
        };
        ProvideWhenOnSyntax.prototype.whenNoAncestorMatches = function (constraint) {
            return this._provideWhenSyntax.whenNoAncestorMatches(constraint);
        };
        ProvideWhenOnSyntax.prototype.onActivation = function (fn) {
            return this._provideOnSyntax.onActivation(fn);
        };
        ProvideWhenOnSyntax.prototype.done = function (force) {
            return this._provideWhenSyntax.done(force);
        };
        return ProvideWhenOnSyntax;
    }());

    var ProvideInSyntax = /** @class */ (function () {
        function ProvideInSyntax(bindingInSyntax, provideDoneSyntax) {
            this._bindingInSyntax = bindingInSyntax;
            this._provideDoneSyntax = provideDoneSyntax;
        }
        ProvideInSyntax.prototype.inSingletonScope = function () {
            var _this = this;
            var bindingWhenOnSyntax = function (bind, target) {
                return _this._bindingInSyntax(bind, target).inSingletonScope();
            };
            var inDoneSyntax = new ProvideDoneSyntax(bindingWhenOnSyntax);
            var provideWhenSyntax = new ProvideWhenSyntax(bindingWhenOnSyntax, inDoneSyntax);
            var provideOnSyntax = new ProvideOnSyntax(bindingWhenOnSyntax, inDoneSyntax);
            return new ProvideWhenOnSyntax(provideWhenSyntax, provideOnSyntax);
        };
        ProvideInSyntax.prototype.inTransientScope = function () {
            var _this = this;
            var bindingWhenOnSyntax = function (bind, target) { return _this._bindingInSyntax(bind, target).inTransientScope(); };
            var inDoneSyntax = new ProvideDoneSyntax(bindingWhenOnSyntax);
            var provideWhenSyntax = new ProvideWhenSyntax(bindingWhenOnSyntax, inDoneSyntax);
            var provideOnSyntax = new ProvideOnSyntax(bindingWhenOnSyntax, inDoneSyntax);
            return new ProvideWhenOnSyntax(provideWhenSyntax, provideOnSyntax);
        };
        ProvideInSyntax.prototype.done = function (force) {
            return this._provideDoneSyntax.done(force);
        };
        return ProvideInSyntax;
    }());

    function fluentProvide(serviceIdentifier) {
        var bindingWhenOnSyntax = function (bind, target) { return bind(serviceIdentifier).to(target); };
        var bindingConstraintFunction = function (bind, target) { return bindingWhenOnSyntax(bind, target)._binding; };
        var provideDoneSyntax = new ProvideDoneSyntax(bindingConstraintFunction);
        var provideInWhenOnSyntax = new ProvideInWhenOnSyntax(new ProvideInSyntax(function (bind, target) { return bindingWhenOnSyntax(bind, target); }, provideDoneSyntax), new ProvideWhenSyntax(bindingWhenOnSyntax, provideDoneSyntax), new ProvideOnSyntax(bindingWhenOnSyntax, provideDoneSyntax));
        return provideInWhenOnSyntax;
    }

    function buildProviderModule() {
        return new ContainerModule(function (bind, unbind) {
            var provideMetadata = Reflect.getMetadata(METADATA_KEY$1.provide, Reflect) || [];
            provideMetadata.map(function (metadata) { return resolve$1(metadata, bind); });
        });
    }
    function resolve$1(metadata, bind) {
        return metadata.constraint(bind, metadata.implementationType);
    }

    var INJECTION = Symbol.for("INJECTION");
    function _proxyGetter(proto, key, resolve, doCache) {
        function getter() {
            if (doCache && !Reflect.hasMetadata(INJECTION, this, key)) {
                Reflect.defineMetadata(INJECTION, resolve(), this, key);
            }
            if (Reflect.hasMetadata(INJECTION, this, key)) {
                return Reflect.getMetadata(INJECTION, this, key);
            }
            else {
                return resolve();
            }
        }
        function setter(newVal) {
            Reflect.defineMetadata(INJECTION, newVal, this, key);
        }
        Object.defineProperty(proto, key, {
            configurable: true,
            enumerable: true,
            get: getter,
            set: setter
        });
    }
    function makePropertyInjectDecorator(container, doCache) {
        return function (serviceIdentifier) {
            return function (proto, key) {
                var resolve = function () {
                    return container.get(serviceIdentifier);
                };
                _proxyGetter(proto, key, resolve, doCache);
            };
        };
    }
    function makePropertyInjectNamedDecorator(container, doCache) {
        return function (serviceIdentifier, named) {
            return function (proto, key) {
                var resolve = function () {
                    return container.getNamed(serviceIdentifier, named);
                };
                _proxyGetter(proto, key, resolve, doCache);
            };
        };
    }
    function makePropertyInjectTaggedDecorator(container, doCache) {
        return function (serviceIdentifier, key, value) {
            return function (proto, propertyName) {
                var resolve = function () {
                    return container.getTagged(serviceIdentifier, key, value);
                };
                _proxyGetter(proto, propertyName, resolve, doCache);
            };
        };
    }
    function makePropertyMultiInjectDecorator(container, doCache) {
        return function (serviceIdentifier) {
            return function (proto, key) {
                var resolve = function () {
                    return container.getAll(serviceIdentifier);
                };
                _proxyGetter(proto, key, resolve, doCache);
            };
        };
    }

    function getDecorators(container, doCache) {
        if (doCache === void 0) { doCache = true; }
        var lazyInject = makePropertyInjectDecorator(container, doCache);
        var lazyInjectNamed = makePropertyInjectNamedDecorator(container, doCache);
        var lazyInjectTagged = makePropertyInjectTaggedDecorator(container, doCache);
        var lazyMultiInject = makePropertyMultiInjectDecorator(container, doCache);
        return {
            lazyInject: lazyInject,
            lazyInjectNamed: lazyInjectNamed,
            lazyInjectTagged: lazyInjectTagged,
            lazyMultiInject: lazyMultiInject
        };
    }

    var legionsContainer = new Container({
        skipBaseClassChecks: true,
    });
    var  
    /** @internal */
    lazyInject = getDecorators(legionsContainer).lazyInject;

    var METADATA_KEY$2 = {
        provide: 'inversify-binding-decorators:provide',
    };
    /** 自动往容器里面注册类实例信息
     *  与provide 区别在于 ,不需要手动调用legionsContainer.load(buildProviderModule());
     */
    function fullProvider(serviceIdentifier, force) {
        return function (target) {
            decorate(provide(serviceIdentifier, force), target);
            var provideMetadata = Reflect.getMetadata(METADATA_KEY$2.provide, Reflect) || [];
            var Metadata = provideMetadata.find(function (item) { return item.implementationType === target; });
            if (Metadata && !legionsContainer.isBound(serviceIdentifier)) {
                var warriors = new ContainerModule(function (bind) {
                    Metadata.constraint(bind, Metadata.implementationType);
                });
                legionsContainer.load(warriors);
            }
            return target;
        };
    }

    function loadProviderModule() {
        legionsContainer.load(buildProviderModule());
    }

    exports.buildProviderModule = buildProviderModule;
    exports.decorate = decorate;
    exports.fluentProvide = fluentProvide;
    exports.fullProvider = fullProvider;
    exports.inject = inject;
    exports.injectable = injectable;
    exports.lazyInject = lazyInject;
    exports.legionsContainer = legionsContainer;
    exports.loadProviderModule = loadProviderModule;
    exports.provide = provide;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
