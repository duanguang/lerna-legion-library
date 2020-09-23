!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("reflect-metadata")):"function"==typeof define&&define.amd?define(["exports","reflect-metadata"],t):t((n="undefined"!=typeof globalThis?globalThis:n||self).legionsControlContainer={})}(this,function(n){"use strict";var o="named",e="name",d="unmanaged",t="optional",v="inject",b="multi_inject",u="inversify:tagged",s="inversify:tagged_props",i="inversify:paramtypes",r="design:paramtypes",p="post_construct",a=Object.freeze({__proto__:null,NAMED_TAG:o,NAME_TAG:e,UNMANAGED_TAG:d,OPTIONAL_TAG:t,INJECT_TAG:v,MULTI_INJECT_TAG:b,TAGGED:u,TAGGED_PROP:s,PARAM_TYPES:i,DESIGN_PARAM_TYPES:r,POST_CONSTRUCT:p}),f="Request",y="Singleton",c="Transient",l={ConstantValue:"ConstantValue",Constructor:"Constructor",DynamicValue:"DynamicValue",Factory:"Factory",Function:"Function",Instance:"Instance",Invalid:"Invalid",Provider:"Provider"},g={ClassProperty:"ClassProperty",ConstructorArgument:"ConstructorArgument",Variable:"Variable"},h=0;function w(){return h++}var m=(_.prototype.clone=function(){var n=new _(this.serviceIdentifier,this.scope);return n.activated=!1,n.implementationType=this.implementationType,n.dynamicValue=this.dynamicValue,n.scope=this.scope,n.type=this.type,n.factory=this.factory,n.provider=this.provider,n.constraint=this.constraint,n.onActivation=this.onActivation,n.cache=this.cache,n},_);function _(n,t){this.id=w(),this.activated=!1,this.serviceIdentifier=n,this.scope=t,this.type=l.Invalid,this.constraint=function(n){return!0},this.implementationType=null,this.cache=null,this.factory=null,this.provider=null,this.onActivation=null,this.dynamicValue=null}var A="Cannot apply @injectable decorator multiple times.",S="Metadata key was used more than once in a parameter:",T="NULL argument",I="Key Not Found",x="Ambiguous match found for serviceIdentifier:",N="No matching bindings found for serviceIdentifier:",M="Missing required @injectable annotation in:",W="Missing required @inject or @multiInject annotation in:",C="Circular dependency found:",R="The @inject @multiInject @tagged and @named decorators must be applied to the parameters of a class constructor or a class property.",P=function(){for(var n=[],t=0;t<arguments.length;t++)n[t]=arguments[t];return"The number of constructor arguments in the derived class "+n[0]+" must be >= than the number of constructor arguments of its base class."},E=function(){for(var n=[],t=0;t<arguments.length;t++)n[t]=arguments[t];return"@postConstruct error in class "+n[0]+": "+n[1]},j="Maximum call stack size exceeded",k=(O.prototype.getConstructorMetadata=function(n){return{compilerGeneratedMetadata:Reflect.getMetadata(i,n),userGeneratedMetadata:Reflect.getMetadata(u,n)||{}}},O.prototype.getPropertiesMetadata=function(n){return Reflect.getMetadata(s,n)||[]},O);function O(){}var D={MultipleBindingsAvailable:2,NoBindingsAvailable:0,OnlyOneBindingAvailable:1};function q(n){return n instanceof RangeError||n.message===j}function F(n){return"function"!=typeof n?"symbol"==typeof n?n.toString():n:n.name}function B(n,t,e){var i="",r=e(n,t);return 0!==r.length&&(i="\nRegistered bindings:",r.forEach(function(n){var t="Object";null!==n.implementationType&&(t=K(n.implementationType)),i=i+"\n "+t,n.constraint.metaData&&(i=i+" - "+n.constraint.metaData)})),i}function V(n){return function n(t,e){void 0===e&&(e=[]);var i=F(t.serviceIdentifier);return e.push(i),null!==t.parentRequest?n(t.parentRequest,e):e}(n).reverse().join(" --\x3e ")}function G(n){n.childRequests.forEach(function(n){if(function n(t,e){return null!==t.parentRequest&&(t.parentRequest.serviceIdentifier===e||n(t.parentRequest,e))}(n,n.serviceIdentifier)){var t=V(n);throw new Error(C+" "+t)}G(n)})}function K(n){if(n.name)return n.name;var t=n.toString(),e=t.match(/^function\s*([^\s(]+)/);return e?e[1]:"Anonymous function: "+t}var L=(Y.prototype.addPlan=function(n){this.plan=n},Y.prototype.setCurrentRequest=function(n){this.currentRequest=n},Y);function Y(n){this.id=w(),this.container=n}var z=(U.prototype.toString=function(){return this.key===o?"named: "+this.value.toString()+" ":"tagged: { key:"+this.key.toString()+", value: "+this.value+" }"},U);function U(n,t){this.key=n,this.value=t}var H=function(n,t){this.parentContext=n,this.rootRequest=t};function J(n,t,e,i,r){var o={},a="number"==typeof r,u=void 0!==r&&a?r.toString():e;if(a&&void 0!==e)throw new Error(R);Reflect.hasOwnMetadata(n,t)&&(o=Reflect.getMetadata(n,t));var s=o[u];if(Array.isArray(s))for(var c=0,h=s;c<h.length;c++){var d=h[c];if(d.key===i.key)throw new Error(S+" "+d.key.toString())}else s=[];s.push(i),o[u]=s,Reflect.defineMetadata(n,o,t)}function Q(n,t){Reflect.decorate(n,t)}function X(n,t,e){var i,r;"number"==typeof e?Q([(i=e,r=n,function(n,t){r(n,t,i)})],t):"string"==typeof e?Reflect.decorate([n],t,e):Q([n],t)}var Z=($.prototype.unwrap=function(){return this._cb()},$);function $(n){this._cb=n}var nn=(tn.prototype.startsWith=function(n){return 0===this.str.indexOf(n)},tn.prototype.endsWith=function(n){var t=n.split("").reverse().join(""),e=this.str.split("").reverse().join("");return this.startsWith.call({str:e},t)},tn.prototype.contains=function(n){return-1!==this.str.indexOf(n)},tn.prototype.equals=function(n){return this.str===n},tn.prototype.value=function(){return this.str},tn);function tn(n){this.str=n}var en=(rn.prototype.hasTag=function(n){for(var t=0,e=this.metadata;t<e.length;t++){if(e[t].key===n)return!0}return!1},rn.prototype.isArray=function(){return this.hasTag(b)},rn.prototype.matchesArray=function(n){return this.matchesTag(b)(n)},rn.prototype.isNamed=function(){return this.hasTag(o)},rn.prototype.isTagged=function(){return this.metadata.some(function(n){return n.key!==v&&n.key!==b&&n.key!==e&&n.key!==d&&n.key!==o})},rn.prototype.isOptional=function(){return this.matchesTag(t)(!0)},rn.prototype.getNamedTag=function(){return this.isNamed()?this.metadata.filter(function(n){return n.key===o})[0]:null},rn.prototype.getCustomTags=function(){return this.isTagged()?this.metadata.filter(function(n){return n.key!==v&&n.key!==b&&n.key!==e&&n.key!==d&&n.key!==o}):null},rn.prototype.matchesNamedTag=function(n){return this.matchesTag(o)(n)},rn.prototype.matchesTag=function(r){var o=this;return function(n){for(var t=0,e=o.metadata;t<e.length;t++){var i=e[t];if(i.key===r&&i.value===n)return!0}return!1}},rn);function rn(n,t,e,i){this.id=w(),this.type=n,this.serviceIdentifier=e,this.name=new nn(t||""),this.metadata=new Array;var r=null;"string"==typeof i?r=new z(o,i):i instanceof z&&(r=i),null!==r&&this.metadata.push(r)}function on(n,t,e,i){var r=n.getConstructorMetadata(e),o=r.compilerGeneratedMetadata;if(void 0===o)throw new Error(M+" "+t+".");var a=r.userGeneratedMetadata,u=Object.keys(a),s=function(n,t,e,i,r){for(var o=[],a=0;a<r;a++){var u=function(n,t,e,i,r){var o=r[n.toString()]||[],a=an(o),u=!0!==a.unmanaged,s=i[n],c=a.inject||a.multiInject;(s=c||s)instanceof Z&&(s=s.unwrap());if(u){var h=s===Object,d=s===Function,p=void 0===s,f=h||d||p;if(!t&&f)throw new Error(W+" argument "+n+" in class "+e+".");var y=new en(g.ConstructorArgument,a.targetName,s);return y.metadata=o,y}return null}(a,n,t,e,i);null!==u&&o.push(u)}return o}(i,t,o,a,0===e.length&&0<u.length?u.length:e.length),c=function n(t,e){var i=t.getPropertiesMetadata(e);var r=[];var o=Object.keys(i);for(var a=0,u=o;a<u.length;a++){var s=u[a],c=i[s],h=an(i[s]),d=h.targetName||s,p=h.inject||h.multiInject,f=new en(g.ClassProperty,d,p);f.metadata=c,r.push(f)}var y=Object.getPrototypeOf(e.prototype).constructor;{var l;y!==Object&&(l=n(t,y),r=r.concat(l))}return r}(n,e);return s.concat(c)}function an(n){var t={};return n.forEach(function(n){t[n.key.toString()]=n.value}),{inject:t[v],multiInject:t[b],targetName:t[e],unmanaged:t[d]}}var un=(sn.prototype.addChildRequest=function(n,t,e){var i=new sn(n,this.parentContext,this,t,e);return this.childRequests.push(i),i},sn);function sn(n,t,e,i,r){this.id=w(),this.serviceIdentifier=n,this.parentContext=t,this.parentRequest=e,this.target=r,this.childRequests=[],this.bindings=Array.isArray(i)?i:[i],this.requestScope=null===e?new Map:null}function cn(n){return n._bindingDictionary}function hn(n,t,e,i,r){var o=pn(e.container,r.serviceIdentifier),a=[];return o.length===D.NoBindingsAvailable&&e.container.options.autoBindInjectable&&"function"==typeof r.serviceIdentifier&&n.getConstructorMetadata(r.serviceIdentifier).compilerGeneratedMetadata&&(e.container.bind(r.serviceIdentifier).toSelf(),o=pn(e.container,r.serviceIdentifier)),a=t?o:o.filter(function(n){var t=new un(n.serviceIdentifier,e,i,n,r);return n.constraint(t)}),function(n,t,e,i){switch(t.length){case D.NoBindingsAvailable:if(e.isOptional())return;var r=F(n),o=N;throw o+=function(n,t){if(t.isTagged()||t.isNamed()){var e="",i=t.getNamedTag(),r=t.getCustomTags();return null!==i&&(e+=i.toString()+"\n"),null!==r&&r.forEach(function(n){e+=n.toString()+"\n"})," "+n+"\n "+n+" - "+e}return" "+n}(r,e),o+=B(i,r,pn),new Error(o);case D.OnlyOneBindingAvailable:if(!e.isArray())return;case D.MultipleBindingsAvailable:default:if(e.isArray())return;r=F(n),o=x+" "+r;throw o+=B(i,r,pn),new Error(o)}}(r.serviceIdentifier,a,r,e.container),a}function dn(u,n,t,s,e,c){var i,h,r;null===e?(i=hn(u,n,s,null,c),h=new un(t,s,null,i,c),r=new H(s,h),s.addPlan(r)):(i=hn(u,n,s,e,c),h=e.addChildRequest(c.serviceIdentifier,i,c)),i.forEach(function(n){var t,e,i=null;if(c.isArray())i=h.addChildRequest(n.serviceIdentifier,n,c);else{if(n.cache)return;i=h}if(n.type===l.Instance&&null!==n.implementationType){var r=(t=u,e=n.implementationType,on(t,K(e),e,!1));if(!s.container.options.skipBaseClassChecks){var o=function n(t,e){var i=Object.getPrototypeOf(e.prototype).constructor;if(i===Object)return 0;var r=on(t,K(i),i,!0),o=r.map(function(n){return n.metadata.filter(function(n){return n.key===d})}),a=[].concat.apply([],o).length,u=r.length-a;return 0<u?u:n(t,i)}(u,n.implementationType);if(r.length<o){var a=P(K(n.implementationType));throw new Error(a)}}r.forEach(function(n){dn(u,!1,n.serviceIdentifier,s,i,n)})}})}function pn(n,t){var e=[],i=cn(n);return i.hasKey(t)?e=i.get(t):null!==n.parent&&(e=pn(n.parent,t)),e}function fn(n,t,e,i,r,o,a,u){void 0===u&&(u=!1);var s,c,h,d,p,f,y,l,g=new L(t),w=(s=i,h="",d=o,p=a,y=new z(e?b:v,c=r),l=new en(s,h,c,y),void 0!==d&&(f=new z(d,p),l.metadata.push(f)),l);try{return dn(n,u,r,g,null,w),g}catch(n){throw q(n)&&g.plan&&G(g.plan.rootRequest),n}}function yn(n,t,e){var i,r,o,a,u,s,c,h=null,h=0<t.length?(i=t.filter(function(n){return null!==n.target&&n.target.type===g.ConstructorArgument}).map(e),c=i,h=new((s=n).bind.apply(s,[void 0].concat(c))),r=h,o=e,a=t.filter(function(n){return null!==n.target&&n.target.type===g.ClassProperty}),u=a.map(o),a.forEach(function(n,t){var e=n.target.name.value(),i=u[t];r[e]=i}),r):new n;return function(t,n){if(Reflect.hasMetadata(p,t)){var e=Reflect.getMetadata(p,t);try{n[e.value]()}catch(n){throw new Error(E(t.name,n.message))}}}(n,h),h}function ln(t,e,n){try{return n()}catch(n){throw q(n)?new Error(function(){for(var n=[],t=0;t<arguments.length;t++)n[t]=arguments[t];return"It looks like there is a circular dependency in one of the '"+n[0]+"' bindings. Please investigate bindings withservice identifier '"+n[1]+"'."}(t,e.toString())):n}}var gn=function(h){return function(n){n.parentContext.setCurrentRequest(n);var t=n.bindings,e=n.childRequests,i=n.target&&n.target.isArray(),r=!(n.parentRequest&&n.parentRequest.target&&n.target&&n.parentRequest.target.matchesArray(n.target.serviceIdentifier));if(i&&r)return e.map(function(n){return gn(h)(n)});var o=null;if(!n.target.isOptional()||0!==t.length){var a=t[0],u=a.scope===y,s=a.scope===f;if(u&&a.activated)return a.cache;if(s&&null!==h&&h.has(a.id))return h.get(a.id);if(a.type===l.ConstantValue)o=a.cache;else if(a.type===l.Function)o=a.cache;else if(a.type===l.Constructor)o=a.implementationType;else if(a.type===l.DynamicValue&&null!==a.dynamicValue)o=ln("toDynamicValue",a.serviceIdentifier,function(){return a.dynamicValue(n.parentContext)});else if(a.type===l.Factory&&null!==a.factory)o=ln("toFactory",a.serviceIdentifier,function(){return a.factory(n.parentContext)});else if(a.type===l.Provider&&null!==a.provider)o=ln("toProvider",a.serviceIdentifier,function(){return a.provider(n.parentContext)});else{if(a.type!==l.Instance||null===a.implementationType){var c=F(n.serviceIdentifier);throw new Error("Invalid binding type: "+c)}o=yn(a.implementationType,e,gn(h))}return"function"==typeof a.onActivation&&(o=a.onActivation(n.parentContext,o)),u&&(a.cache=o,a.activated=!0),s&&null!==h&&!h.has(a.id)&&h.set(a.id,o),o}}};function wn(e){return function(t){function n(n){return null!==n&&null!==n.target&&n.target.matchesTag(e)(t)}return n.metaData=new z(e,t),n}}function vn(i){return function(n){if(null===n)return!1;var t=n.bindings[0];if("string"==typeof i)return t.serviceIdentifier===i;var e=n.bindings[0].implementationType;return i===e}}var bn=function(n,t){var e=n.parentRequest;return null!==e&&(!!t(e)||bn(e,t))},mn=wn(o),_n=(An.prototype.when=function(n){return this._binding.constraint=n,new Sn(this._binding)},An.prototype.whenTargetNamed=function(n){return this._binding.constraint=mn(n),new Sn(this._binding)},An.prototype.whenTargetIsDefault=function(){return this._binding.constraint=function(n){return null!==n.target&&!n.target.isNamed()&&!n.target.isTagged()},new Sn(this._binding)},An.prototype.whenTargetTagged=function(n,t){return this._binding.constraint=wn(n)(t),new Sn(this._binding)},An.prototype.whenInjectedInto=function(t){return this._binding.constraint=function(n){return vn(t)(n.parentRequest)},new Sn(this._binding)},An.prototype.whenParentNamed=function(t){return this._binding.constraint=function(n){return mn(t)(n.parentRequest)},new Sn(this._binding)},An.prototype.whenParentTagged=function(t,e){return this._binding.constraint=function(n){return wn(t)(e)(n.parentRequest)},new Sn(this._binding)},An.prototype.whenAnyAncestorIs=function(t){return this._binding.constraint=function(n){return bn(n,vn(t))},new Sn(this._binding)},An.prototype.whenNoAncestorIs=function(t){return this._binding.constraint=function(n){return!bn(n,vn(t))},new Sn(this._binding)},An.prototype.whenAnyAncestorNamed=function(t){return this._binding.constraint=function(n){return bn(n,mn(t))},new Sn(this._binding)},An.prototype.whenNoAncestorNamed=function(t){return this._binding.constraint=function(n){return!bn(n,mn(t))},new Sn(this._binding)},An.prototype.whenAnyAncestorTagged=function(t,e){return this._binding.constraint=function(n){return bn(n,wn(t)(e))},new Sn(this._binding)},An.prototype.whenNoAncestorTagged=function(t,e){return this._binding.constraint=function(n){return!bn(n,wn(t)(e))},new Sn(this._binding)},An.prototype.whenAnyAncestorMatches=function(t){return this._binding.constraint=function(n){return bn(n,t)},new Sn(this._binding)},An.prototype.whenNoAncestorMatches=function(t){return this._binding.constraint=function(n){return!bn(n,t)},new Sn(this._binding)},An);function An(n){this._binding=n}var Sn=(Tn.prototype.onActivation=function(n){return this._binding.onActivation=n,new _n(this._binding)},Tn);function Tn(n){this._binding=n}var In=(xn.prototype.when=function(n){return this._bindingWhenSyntax.when(n)},xn.prototype.whenTargetNamed=function(n){return this._bindingWhenSyntax.whenTargetNamed(n)},xn.prototype.whenTargetIsDefault=function(){return this._bindingWhenSyntax.whenTargetIsDefault()},xn.prototype.whenTargetTagged=function(n,t){return this._bindingWhenSyntax.whenTargetTagged(n,t)},xn.prototype.whenInjectedInto=function(n){return this._bindingWhenSyntax.whenInjectedInto(n)},xn.prototype.whenParentNamed=function(n){return this._bindingWhenSyntax.whenParentNamed(n)},xn.prototype.whenParentTagged=function(n,t){return this._bindingWhenSyntax.whenParentTagged(n,t)},xn.prototype.whenAnyAncestorIs=function(n){return this._bindingWhenSyntax.whenAnyAncestorIs(n)},xn.prototype.whenNoAncestorIs=function(n){return this._bindingWhenSyntax.whenNoAncestorIs(n)},xn.prototype.whenAnyAncestorNamed=function(n){return this._bindingWhenSyntax.whenAnyAncestorNamed(n)},xn.prototype.whenAnyAncestorTagged=function(n,t){return this._bindingWhenSyntax.whenAnyAncestorTagged(n,t)},xn.prototype.whenNoAncestorNamed=function(n){return this._bindingWhenSyntax.whenNoAncestorNamed(n)},xn.prototype.whenNoAncestorTagged=function(n,t){return this._bindingWhenSyntax.whenNoAncestorTagged(n,t)},xn.prototype.whenAnyAncestorMatches=function(n){return this._bindingWhenSyntax.whenAnyAncestorMatches(n)},xn.prototype.whenNoAncestorMatches=function(n){return this._bindingWhenSyntax.whenNoAncestorMatches(n)},xn.prototype.onActivation=function(n){return this._bindingOnSyntax.onActivation(n)},xn);function xn(n){this._binding=n,this._bindingWhenSyntax=new _n(this._binding),this._bindingOnSyntax=new Sn(this._binding)}var Nn=(Mn.prototype.inRequestScope=function(){return this._binding.scope=f,new In(this._binding)},Mn.prototype.inSingletonScope=function(){return this._binding.scope=y,new In(this._binding)},Mn.prototype.inTransientScope=function(){return this._binding.scope=c,new In(this._binding)},Mn);function Mn(n){this._binding=n}var Wn=(Cn.prototype.inRequestScope=function(){return this._bindingInSyntax.inRequestScope()},Cn.prototype.inSingletonScope=function(){return this._bindingInSyntax.inSingletonScope()},Cn.prototype.inTransientScope=function(){return this._bindingInSyntax.inTransientScope()},Cn.prototype.when=function(n){return this._bindingWhenSyntax.when(n)},Cn.prototype.whenTargetNamed=function(n){return this._bindingWhenSyntax.whenTargetNamed(n)},Cn.prototype.whenTargetIsDefault=function(){return this._bindingWhenSyntax.whenTargetIsDefault()},Cn.prototype.whenTargetTagged=function(n,t){return this._bindingWhenSyntax.whenTargetTagged(n,t)},Cn.prototype.whenInjectedInto=function(n){return this._bindingWhenSyntax.whenInjectedInto(n)},Cn.prototype.whenParentNamed=function(n){return this._bindingWhenSyntax.whenParentNamed(n)},Cn.prototype.whenParentTagged=function(n,t){return this._bindingWhenSyntax.whenParentTagged(n,t)},Cn.prototype.whenAnyAncestorIs=function(n){return this._bindingWhenSyntax.whenAnyAncestorIs(n)},Cn.prototype.whenNoAncestorIs=function(n){return this._bindingWhenSyntax.whenNoAncestorIs(n)},Cn.prototype.whenAnyAncestorNamed=function(n){return this._bindingWhenSyntax.whenAnyAncestorNamed(n)},Cn.prototype.whenAnyAncestorTagged=function(n,t){return this._bindingWhenSyntax.whenAnyAncestorTagged(n,t)},Cn.prototype.whenNoAncestorNamed=function(n){return this._bindingWhenSyntax.whenNoAncestorNamed(n)},Cn.prototype.whenNoAncestorTagged=function(n,t){return this._bindingWhenSyntax.whenNoAncestorTagged(n,t)},Cn.prototype.whenAnyAncestorMatches=function(n){return this._bindingWhenSyntax.whenAnyAncestorMatches(n)},Cn.prototype.whenNoAncestorMatches=function(n){return this._bindingWhenSyntax.whenNoAncestorMatches(n)},Cn.prototype.onActivation=function(n){return this._bindingOnSyntax.onActivation(n)},Cn);function Cn(n){this._binding=n,this._bindingWhenSyntax=new _n(this._binding),this._bindingOnSyntax=new Sn(this._binding),this._bindingInSyntax=new Nn(n)}var Rn=(Pn.prototype.to=function(n){return this._binding.type=l.Instance,this._binding.implementationType=n,new Wn(this._binding)},Pn.prototype.toSelf=function(){if("function"!=typeof this._binding.serviceIdentifier)throw new Error("The toSelf function can only be applied when a constructor is used as service identifier");var n=this._binding.serviceIdentifier;return this.to(n)},Pn.prototype.toConstantValue=function(n){return this._binding.type=l.ConstantValue,this._binding.cache=n,this._binding.dynamicValue=null,this._binding.implementationType=null,new In(this._binding)},Pn.prototype.toDynamicValue=function(n){return this._binding.type=l.DynamicValue,this._binding.cache=null,this._binding.dynamicValue=n,this._binding.implementationType=null,new Wn(this._binding)},Pn.prototype.toConstructor=function(n){return this._binding.type=l.Constructor,this._binding.implementationType=n,new In(this._binding)},Pn.prototype.toFactory=function(n){return this._binding.type=l.Factory,this._binding.factory=n,new In(this._binding)},Pn.prototype.toFunction=function(n){if("function"!=typeof n)throw new Error("Value provided to function binding must be a function!");var t=this.toConstantValue(n);return this._binding.type=l.Function,t},Pn.prototype.toAutoFactory=function(t){return this._binding.type=l.Factory,this._binding.factory=function(n){return function(){return n.container.get(t)}},new In(this._binding)},Pn.prototype.toProvider=function(n){return this._binding.type=l.Provider,this._binding.provider=n,new In(this._binding)},Pn.prototype.toService=function(t){this.toDynamicValue(function(n){return n.container.get(t)})},Pn);function Pn(n){this._binding=n}var En=(jn.of=function(n,t){var e=new jn;return e.bindings=n,e.middleware=t,e},jn);function jn(){}var kn=(On.prototype.getMap=function(){return this._map},On.prototype.add=function(n,t){if(null==n)throw new Error(T);if(null==t)throw new Error(T);var e=this._map.get(n);void 0!==e?(e.push(t),this._map.set(n,e)):this._map.set(n,[t])},On.prototype.get=function(n){if(null==n)throw new Error(T);var t=this._map.get(n);if(void 0!==t)return t;throw new Error(I)},On.prototype.remove=function(n){if(null==n)throw new Error(T);if(!this._map.delete(n))throw new Error(I)},On.prototype.removeByCondition=function(i){var r=this;this._map.forEach(function(n,t){var e=n.filter(function(n){return!i(n)});0<e.length?r._map.set(t,e):r._map.delete(t)})},On.prototype.hasKey=function(n){if(null==n)throw new Error(T);return this._map.has(n)},On.prototype.clone=function(){var e=new On;return this._map.forEach(function(n,t){n.forEach(function(n){return e.add(t,n.clone())})}),e},On.prototype.traverse=function(e){this._map.forEach(function(n,t){e(t,n)})},On);function On(){this._map=new Map}var Dn=function(o,a,u,s){return new(u=u||Promise)(function(n,t){function e(n){try{r(s.next(n))}catch(n){t(n)}}function i(n){try{r(s.throw(n))}catch(n){t(n)}}function r(t){t.done?n(t.value):new u(function(n){n(t.value)}).then(e,i)}r((s=s.apply(o,a||[])).next())})},qn=function(e,i){var r,o,a,u={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]},n={next:t(0),throw:t(1),return:t(2)};return"function"==typeof Symbol&&(n[Symbol.iterator]=function(){return this}),n;function t(t){return function(n){return function(t){if(r)throw new TypeError("Generator is already executing.");for(;u;)try{if(r=1,o&&(a=o[2&t[0]?"return":t[0]?"throw":"next"])&&!(a=a.call(o,t[1])).done)return a;switch(o=0,a&&(t=[0,a.value]),t[0]){case 0:case 1:a=t;break;case 4:return u.label++,{value:t[1],done:!1};case 5:u.label++,o=t[1],t=[0];continue;case 7:t=u.ops.pop(),u.trys.pop();continue;default:if(!(a=0<(a=u.trys).length&&a[a.length-1])&&(6===t[0]||2===t[0])){u=0;continue}if(3===t[0]&&(!a||t[1]>a[0]&&t[1]<a[3])){u.label=t[1];break}if(6===t[0]&&u.label<a[1]){u.label=a[1],a=t;break}if(a&&u.label<a[2]){u.label=a[2],u.ops.push(t);break}a[2]&&u.ops.pop(),u.trys.pop();continue}t=i.call(e,u)}catch(n){t=[6,n],o=0}finally{r=a=0}if(5&t[0])throw t[1];return{value:t[0]?t[1]:void 0,done:!0}}([t,n])}}},Fn=(Bn.merge=function(n,t){var e=new Bn,i=cn(e),r=cn(n),o=cn(t);function a(n,e){n.traverse(function(n,t){t.forEach(function(n){e.add(n.serviceIdentifier,n.clone())})})}return a(r,i),a(o,i),e},Bn.prototype.load=function(){for(var n=[],t=0;t<arguments.length;t++)n[t]=arguments[t];for(var e=this._getContainerModuleHelpersFactory(),i=0,r=n;i<r.length;i++){var o=r[i],a=e(o.id);o.registry(a.bindFunction,a.unbindFunction,a.isboundFunction,a.rebindFunction)}},Bn.prototype.loadAsync=function(){for(var a=[],n=0;n<arguments.length;n++)a[n]=arguments[n];return Dn(this,void 0,void 0,function(){var t,e,i,r,o;return qn(this,function(n){switch(n.label){case 0:t=this._getContainerModuleHelpersFactory(),e=0,i=a,n.label=1;case 1:return e<i.length?(r=i[e],o=t(r.id),[4,r.registry(o.bindFunction,o.unbindFunction,o.isboundFunction,o.rebindFunction)]):[3,4];case 2:n.sent(),n.label=3;case 3:return e++,[3,1];case 4:return[2]}})})},Bn.prototype.unload=function(){for(var i=this,n=[],t=0;t<arguments.length;t++)n[t]=arguments[t];n.forEach(function(n){var t,e=(t=n.id,function(n){return n.moduleId===t});i._bindingDictionary.removeByCondition(e)})},Bn.prototype.bind=function(n){var t=this.options.defaultScope||c,e=new m(n,t);return this._bindingDictionary.add(n,e),new Rn(e)},Bn.prototype.rebind=function(n){return this.unbind(n),this.bind(n)},Bn.prototype.unbind=function(t){try{this._bindingDictionary.remove(t)}catch(n){throw new Error("Could not unbind serviceIdentifier: "+F(t))}},Bn.prototype.unbindAll=function(){this._bindingDictionary=new kn},Bn.prototype.isBound=function(n){var t=this._bindingDictionary.hasKey(n);return!t&&this.parent&&(t=this.parent.isBound(n)),t},Bn.prototype.isBoundNamed=function(n,t){return this.isBoundTagged(n,o,t)},Bn.prototype.isBoundTagged=function(n,t,e){var i,r,o,a,u,s,c,h,d=!1;return this._bindingDictionary.hasKey(n)&&(i=this._bindingDictionary.get(n),o=this,a=n,u=t,s=e,c=new en(g.Variable,"",a,new z(u,s)),h=new L(o),r=new un(a,h,null,[],c),d=i.some(function(n){return n.constraint(r)})),!d&&this.parent&&(d=this.parent.isBoundTagged(n,t,e)),d},Bn.prototype.snapshot=function(){this._snapshots.push(En.of(this._bindingDictionary.clone(),this._middleware))},Bn.prototype.restore=function(){var n=this._snapshots.pop();if(void 0===n)throw new Error("No snapshot available to restore.");this._bindingDictionary=n.bindings,this._middleware=n.middleware},Bn.prototype.createChild=function(n){var t=new Bn(n||this.options);return t.parent=this,t},Bn.prototype.applyMiddleware=function(){for(var n=[],t=0;t<arguments.length;t++)n[t]=arguments[t];var e=this._middleware?this._middleware:this._planAndResolve();this._middleware=n.reduce(function(n,t){return t(n)},e)},Bn.prototype.applyCustomMetadataReader=function(n){this._metadataReader=n},Bn.prototype.get=function(n){return this._get(!1,!1,g.Variable,n)},Bn.prototype.getTagged=function(n,t,e){return this._get(!1,!1,g.Variable,n,t,e)},Bn.prototype.getNamed=function(n,t){return this.getTagged(n,o,t)},Bn.prototype.getAll=function(n){return this._get(!0,!0,g.Variable,n)},Bn.prototype.getAllTagged=function(n,t,e){return this._get(!1,!0,g.Variable,n,t,e)},Bn.prototype.getAllNamed=function(n,t){return this.getAllTagged(n,o,t)},Bn.prototype.resolve=function(n){var t=this.createChild();return t.bind(n).toSelf(),t.get(n)},Bn.prototype._getContainerModuleHelpersFactory=function(){function r(n,t){n._binding.moduleId=t}var o=this;return function(n){return{bindFunction:function(n){var t=o.bind.bind(o)(n);return r(t,i),t},isboundFunction:function(n){return o.isBound.bind(o)(n)},rebindFunction:(e=i=n,function(n){var t=o.rebind.bind(o)(n);return r(t,e),t}),unbindFunction:function(n){o.unbind.bind(o)(n)}};var e,i}},Bn.prototype._get=function(n,t,e,i,r,o){var a=null,u={avoidConstraints:n,contextInterceptor:function(n){return n},isMultiInject:t,key:r,serviceIdentifier:i,targetType:e,value:o};if(this._middleware){if(null==(a=this._middleware(u)))throw new Error("Invalid return type in middleware. Middleware must return!")}else a=this._planAndResolve()(u);return a},Bn.prototype._planAndResolve=function(){var i=this;return function(n){var t,e=fn(i._metadataReader,i,n.isMultiInject,n.targetType,n.serviceIdentifier,n.key,n.value,n.avoidConstraints),e=n.contextInterceptor(e);return gn((t=e).plan.rootRequest.requestScope)(t.plan.rootRequest)}},Bn);function Bn(n){var t=n||{};if("object"!=typeof t)throw new Error("Invalid Container constructor argument. Container options must be an object.");if(void 0===t.defaultScope)t.defaultScope=c;else if(t.defaultScope!==y&&t.defaultScope!==c&&t.defaultScope!==f)throw new Error("Invalid Container option. Default scope must be a string ('singleton' or 'transient').");if(void 0===t.autoBindInjectable)t.autoBindInjectable=!1;else if("boolean"!=typeof t.autoBindInjectable)throw new Error("Invalid Container option. Auto bind injectable must be a boolean");if(void 0===t.skipBaseClassChecks)t.skipBaseClassChecks=!1;else if("boolean"!=typeof t.skipBaseClassChecks)throw new Error("Invalid Container option. Skip base check must be a boolean");this.options={autoBindInjectable:t.autoBindInjectable,defaultScope:t.defaultScope,skipBaseClassChecks:t.skipBaseClassChecks},this.id=w(),this._bindingDictionary=new kn,this._snapshots=[],this._middleware=null,this.parent=null,this._metadataReader=new k}var Vn=function(n){this.id=w(),this.registry=n};function Gn(){return function(n){if(Reflect.hasOwnMetadata(i,n))throw new Error(A);var t=Reflect.getMetadata(r,n)||[];return Reflect.defineMetadata(i,t,n),n}}var Kn=a,Ln={provide:"inversify-binding-decorators:provide"};function Yn(a,u){return function(t){var n=Reflect.hasOwnMetadata(Kn.PARAM_TYPES,t),e=!0===u;if(!0==e&&!1===n)X(Gn(),t);else if(!0!=e||!0!==n)try{X(Gn(),t)}catch(n){throw new Error("Cannot apply @provide decorator multiple times but is has been used multiple times in "+t.name+" Please use @provide(ID, true) if you are trying to declare multiple bindings!")}var i={constraint:function(n,t){return n(a).to(t)},implementationType:t},r=Reflect.getMetadata(Ln.provide,Reflect)||[],o=[i].concat(r);return Reflect.defineMetadata(Ln.provide,o,Reflect),t}}var zn=(Un.prototype.when=function(n){return this._provideWhenSyntax.when(n)},Un.prototype.whenTargetNamed=function(n){return this._provideWhenSyntax.whenTargetNamed(n)},Un.prototype.whenTargetTagged=function(n,t){return this._provideWhenSyntax.whenTargetTagged(n,t)},Un.prototype.whenInjectedInto=function(n){return this._provideWhenSyntax.whenInjectedInto(n)},Un.prototype.whenParentNamed=function(n){return this._provideWhenSyntax.whenParentNamed(n)},Un.prototype.whenParentTagged=function(n,t){return this._provideWhenSyntax.whenParentTagged(n,t)},Un.prototype.whenAnyAncestorIs=function(n){return this._provideWhenSyntax.whenAnyAncestorIs(n)},Un.prototype.whenNoAncestorIs=function(n){return this._provideWhenSyntax.whenNoAncestorIs(n)},Un.prototype.whenAnyAncestorNamed=function(n){return this._provideWhenSyntax.whenAnyAncestorNamed(n)},Un.prototype.whenAnyAncestorTagged=function(n,t){return this._provideWhenSyntax.whenAnyAncestorTagged(n,t)},Un.prototype.whenNoAncestorNamed=function(n){return this._provideWhenSyntax.whenNoAncestorNamed(n)},Un.prototype.whenNoAncestorTagged=function(n,t){return this._provideWhenSyntax.whenNoAncestorTagged(n,t)},Un.prototype.whenAnyAncestorMatches=function(n){return this._provideWhenSyntax.whenAnyAncestorMatches(n)},Un.prototype.whenNoAncestorMatches=function(n){return this._provideWhenSyntax.whenNoAncestorMatches(n)},Un.prototype.onActivation=function(n){return this._provideOnSyntax.onActivation(n)},Un.prototype.inSingletonScope=function(){return this._provideInSyntax.inSingletonScope()},Un.prototype.inTransientScope=function(){return this._provideInSyntax.inTransientScope()},Un.prototype.done=function(n){return this._provideInSyntax.done(n)},Un);function Un(n,t,e){this._provideInSyntax=n,this._provideWhenSyntax=t,this._provideOnSyntax=e}var Hn=(Jn.prototype.done=function(a){var u=this;return function(t){var n=Reflect.hasOwnMetadata(Kn.PARAM_TYPES,t),e=!0===a;if(!0==e&&!1===n)X(Gn(),t);else if(!0!=e||!0!==n)try{X(Gn(),t)}catch(n){throw new Error("Cannot apply @provideFluent decorator multiple times but is has been used multiple times in "+t.name+" Please use done(true) if you are trying to declare multiple bindings!")}var i={constraint:u._binding,implementationType:t},r=Reflect.getMetadata(Ln.provide,Reflect)||[],o=[i].concat(r);return Reflect.defineMetadata(Ln.provide,o,Reflect),t}},Jn);function Jn(n){this._binding=n}var Qn=(Xn.prototype.onActivation=function(e){function n(n,t){return i._bindingOnSyntax(n,t).onActivation(e)}var i=this,t=new Hn(n);return new Zn(n,t)},Xn.prototype.done=function(n){return this._provideDoneSyntax.done(n)},Xn);function Xn(n,t){this._bindingOnSyntax=n,this._provideDoneSyntax=t}var Zn=($n.prototype.when=function(e){function n(n,t){return i._bindingWhenSyntax(n,t).when(e)}var i=this,t=new Hn(n);return new Qn(n,t)},$n.prototype.whenTargetNamed=function(e){function n(n,t){return i._bindingWhenSyntax(n,t).whenTargetNamed(e)}var i=this,t=new Hn(n);return new Qn(n,t)},$n.prototype.whenTargetTagged=function(e,i){function n(n,t){return r._bindingWhenSyntax(n,t).whenTargetTagged(e,i)}var r=this,t=new Hn(n);return new Qn(n,t)},$n.prototype.whenInjectedInto=function(e){function n(n,t){return i._bindingWhenSyntax(n,t).whenInjectedInto(e)}var i=this,t=new Hn(n);return new Qn(n,t)},$n.prototype.whenParentNamed=function(e){function n(n,t){return i._bindingWhenSyntax(n,t).whenParentNamed(e)}var i=this,t=new Hn(n);return new Qn(n,t)},$n.prototype.whenParentTagged=function(e,i){function n(n,t){return r._bindingWhenSyntax(n,t).whenParentTagged(e,i)}var r=this,t=new Hn(n);return new Qn(n,t)},$n.prototype.whenAnyAncestorIs=function(e){function n(n,t){return i._bindingWhenSyntax(n,t).whenAnyAncestorIs(e)}var i=this,t=new Hn(n);return new Qn(n,t)},$n.prototype.whenNoAncestorIs=function(e){function n(n,t){return i._bindingWhenSyntax(n,t).whenNoAncestorIs(e)}var i=this,t=new Hn(n);return new Qn(n,t)},$n.prototype.whenAnyAncestorNamed=function(e){function n(n,t){return i._bindingWhenSyntax(n,t).whenAnyAncestorNamed(e)}var i=this,t=new Hn(n);return new Qn(n,t)},$n.prototype.whenAnyAncestorTagged=function(e,i){function n(n,t){return r._bindingWhenSyntax(n,t).whenAnyAncestorTagged(e,i)}var r=this,t=new Hn(n);return new Qn(n,t)},$n.prototype.whenNoAncestorNamed=function(e){function n(n,t){return i._bindingWhenSyntax(n,t).whenNoAncestorNamed(e)}var i=this,t=new Hn(n);return new Qn(n,t)},$n.prototype.whenNoAncestorTagged=function(e,i){function n(n,t){return r._bindingWhenSyntax(n,t).whenNoAncestorTagged(e,i)}var r=this,t=new Hn(n);return new Qn(n,t)},$n.prototype.whenAnyAncestorMatches=function(e){function n(n,t){return i._bindingWhenSyntax(n,t).whenAnyAncestorMatches(e)}var i=this,t=new Hn(n);return new Qn(n,t)},$n.prototype.whenNoAncestorMatches=function(e){function n(n,t){return i._bindingWhenSyntax(n,t).whenNoAncestorMatches(e)}var i=this,t=new Hn(n);return new Qn(n,t)},$n.prototype.done=function(n){return this._provideDoneSyntax.done(n)},$n);function $n(n,t){this._bindingWhenSyntax=n,this._provideDoneSyntax=t}var nt=(tt.prototype.when=function(n){return this._provideWhenSyntax.when(n)},tt.prototype.whenTargetNamed=function(n){return this._provideWhenSyntax.whenTargetNamed(n)},tt.prototype.whenTargetTagged=function(n,t){return this._provideWhenSyntax.whenTargetTagged(n,t)},tt.prototype.whenInjectedInto=function(n){return this._provideWhenSyntax.whenInjectedInto(n)},tt.prototype.whenParentNamed=function(n){return this._provideWhenSyntax.whenParentNamed(n)},tt.prototype.whenParentTagged=function(n,t){return this._provideWhenSyntax.whenParentTagged(n,t)},tt.prototype.whenAnyAncestorIs=function(n){return this._provideWhenSyntax.whenAnyAncestorIs(n)},tt.prototype.whenNoAncestorIs=function(n){return this._provideWhenSyntax.whenNoAncestorIs(n)},tt.prototype.whenAnyAncestorNamed=function(n){return this._provideWhenSyntax.whenAnyAncestorNamed(n)},tt.prototype.whenAnyAncestorTagged=function(n,t){return this._provideWhenSyntax.whenAnyAncestorTagged(n,t)},tt.prototype.whenNoAncestorNamed=function(n){return this._provideWhenSyntax.whenNoAncestorNamed(n)},tt.prototype.whenNoAncestorTagged=function(n,t){return this._provideWhenSyntax.whenNoAncestorTagged(n,t)},tt.prototype.whenAnyAncestorMatches=function(n){return this._provideWhenSyntax.whenAnyAncestorMatches(n)},tt.prototype.whenNoAncestorMatches=function(n){return this._provideWhenSyntax.whenNoAncestorMatches(n)},tt.prototype.onActivation=function(n){return this._provideOnSyntax.onActivation(n)},tt.prototype.done=function(n){return this._provideWhenSyntax.done(n)},tt);function tt(n,t){this._provideWhenSyntax=n,this._provideOnSyntax=t}var et=(it.prototype.inSingletonScope=function(){function n(n,t){return e._bindingInSyntax(n,t).inSingletonScope()}var e=this,t=new Hn(n),i=new Zn(n,t),r=new Qn(n,t);return new nt(i,r)},it.prototype.inTransientScope=function(){function n(n,t){return e._bindingInSyntax(n,t).inTransientScope()}var e=this,t=new Hn(n),i=new Zn(n,t),r=new Qn(n,t);return new nt(i,r)},it.prototype.done=function(n){return this._provideDoneSyntax.done(n)},it);function it(n,t){this._bindingInSyntax=n,this._provideDoneSyntax=t}function rt(){return new Vn(function(i,n){(Reflect.getMetadata(Ln.provide,Reflect)||[]).map(function(n){return e=i,(t=n).constraint(e,t.implementationType);var t,e})})}var ot=Symbol.for("INJECTION");function at(n,t,e,i){Object.defineProperty(n,t,{configurable:!0,enumerable:!0,get:function(){return i&&!Reflect.hasMetadata(ot,this,t)&&Reflect.defineMetadata(ot,e(),this,t),Reflect.hasMetadata(ot,this,t)?Reflect.getMetadata(ot,this,t):e()},set:function(n){Reflect.defineMetadata(ot,n,this,t)}})}var ut,st,ct,ht=new Fn({skipBaseClassChecks:!0}),dt=(void 0===ut&&(ut=!0),[function(e){return function(n,t){at(n,t,function(){return st.get(e)},ct)}},(st=ht,ct=ut)][0]),pt="inversify-binding-decorators:provide";n.buildProviderModule=rt,n.decorate=X,n.fluentProvide=function(e){function i(n,t){return n(e).to(t)}var n=new Hn(function(n,t){return i(n,t)._binding});return new zn(new et(i,n),new Zn(i,n),new Qn(i,n))},n.fullProvider=function(i,r){return function(t){X(Yn(i,r),t);var n,e=(Reflect.getMetadata(pt,Reflect)||[]).find(function(n){return n.implementationType===t});return e&&!ht.isBound(i)&&(n=new Vn(function(n){e.constraint(n,e.implementationType)}),ht.load(n)),t}},n.inject=function(a){return function(n,t,e){if(void 0===a)throw new Error("@inject called with undefined this could mean that the class "+n.name+" has a circular dependency problem. You can use a LazyServiceIdentifer to  overcome this limitation.");var i,r,o=new z(v,a);"number"==typeof e?J(u,n,t,o,e):(i=t,r=o,J(s,n.constructor,i,r))}},n.injectable=Gn,n.lazyInject=dt,n.legionsContainer=ht,n.loadProviderModule=function(){ht.load(rt())},n.provide=Yn,Object.defineProperty(n,"__esModule",{value:!0})});
