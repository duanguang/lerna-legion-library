!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).legionsThirdpartyPlugin={})}(this,function(t){"use strict";var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function n(t,e){return t(e={exports:{}},e.exports),e.exports}function r(t){return t&&t.Math==Math&&t}function u(t){try{return!!t()}catch(t){return!0}}function o(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}function i(t){return b.call(t).slice(8,-1)}function c(t){if(null==t)throw TypeError("Can't call method on "+t);return t}function l(t){return w(c(t))}function a(t){return"object"==typeof t?null!==t:"function"==typeof t}function f(t,e){if(!a(t))return t;var n,r;if(e&&"function"==typeof(n=t.toString)&&!a(r=n.call(t)))return r;if("function"==typeof(n=t.valueOf)&&!a(r=n.call(t)))return r;if(!e&&"function"==typeof(n=t.toString)&&!a(r=n.call(t)))return r;throw TypeError("Can't convert object to primitive value")}function s(t,e){return O.call(t,e)}function p(t){if(!a(t))throw TypeError(String(t)+" is not an object");return t}function y(e,n){try{M(g,e,n)}catch(t){g[e]=n}return n}var g=r("object"==typeof globalThis&&globalThis)||r("object"==typeof window&&window)||r("object"==typeof self&&self)||r("object"==typeof e&&e)||Function("return this")(),d=!u(function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]}),h={}.propertyIsEnumerable,m=Object.getOwnPropertyDescriptor,v={f:m&&!h.call({1:2},1)?function(t){var e=m(this,t);return!!e&&e.enumerable}:h},b={}.toString,S="".split,w=u(function(){return!Object("z").propertyIsEnumerable(0)})?function(t){return"String"==i(t)?S.call(t,""):Object(t)}:Object,O={}.hasOwnProperty,j=g.document,T=a(j)&&a(j.createElement),P=!d&&!u(function(){return 7!=Object.defineProperty(T?j.createElement("div"):{},"a",{get:function(){return 7}}).a}),E=Object.getOwnPropertyDescriptor,L={f:d?E:function(t,e){if(t=l(t),e=f(e,!0),P)try{return E(t,e)}catch(t){}if(s(t,e))return o(!v.f.call(t,e),t[e])}},x=Object.defineProperty,A={f:d?x:function(t,e,n){if(p(t),e=f(e,!0),p(n),P)try{return x(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported");return"value"in n&&(t[e]=n.value),t}},M=d?function(t,e,n){return A.f(t,e,o(1,n))}:function(t,e,n){return t[e]=n,t},C="__core-js_shared__",k=g[C]||y(C,{}),D=Function.toString;"function"!=typeof k.inspectSource&&(k.inspectSource=function(t){return D.call(t)});function I(t){return"Symbol("+String(void 0===t?"":t)+")_"+(++K+Y).toString(36)}var N,R,B,F,G,V,_,z,H,J=k.inspectSource,U=g.WeakMap,q="function"==typeof U&&/native code/.test(J(U)),W=n(function(t){(t.exports=function(t,e){return k[t]||(k[t]=void 0!==e?e:{})})("versions",[]).push({version:"3.6.5",mode:"global",copyright:"© 2020 Denis Pushkarev (zloirock.ru)"})}),K=0,Y=Math.random(),$=W("keys"),Q={},X=g.WeakMap;_=q?(N=new X,R=N.get,B=N.has,F=N.set,G=function(t,e){return F.call(N,t,e),e},V=function(t){return R.call(N,t)||{}},function(t){return B.call(N,t)}):(z=$[H="state"]||($[H]=I(H)),Q[z]=!0,G=function(t,e){return M(t,z,e),e},V=function(t){return s(t,z)?t[z]:{}},function(t){return s(t,z)});function Z(t){return"function"==typeof t?t:void 0}function tt(t,e){return arguments.length<2?Z(mt[t])||Z(g[t]):mt[t]&&mt[t][e]||g[t]&&g[t][e]}function et(t){return isNaN(t=+t)?0:(0<t?bt:vt)(t)}function nt(t){return 0<t?St(et(t),9007199254740991):0}function rt(f){return function(t,e,n){var r,o,i,u=l(t),c=nt(u.length),a=(r=c,(o=et(n))<0?wt(o+r,0):Ot(o,r));if(f&&e!=e){for(;a<c;)if((i=u[a++])!=i)return!0}else for(;a<c;a++)if((f||a in u)&&u[a]===e)return f||a||0;return!f&&-1}}function ot(t,e){var n,r=l(t),o=0,i=[];for(n in r)!s(Q,n)&&s(r,n)&&i.push(n);for(;e.length>o;)s(r,n=e[o++])&&(~jt(i,n)||i.push(n));return i}function it(t,e){var n=Ct[Mt(t)];return n==Dt||n!=kt&&("function"==typeof e?u(e):!!e)}function ut(t,e){var n,r,o,i,u=t.target,c=t.global,a=t.stat,f=c?g:a?g[u]||y(u,{}):(g[u]||{}).prototype;if(f)for(n in e){if(o=e[n],r=t.noTargetGet?(i=Nt(f,n))&&i.value:f[n],!It(c?n:u+(a?".":"#")+n,t.forced)&&void 0!==r){if(typeof o==typeof r)continue;!function(t,e){for(var n=xt(e),r=A.f,o=L.f,i=0;i<n.length;i++){var u=n[i];s(t,u)||r(t,u,o(e,u))}}(o,r)}(t.sham||r&&r.sham)&&M(o,"sham",!0),ht(f,n,o,t)}}function ct(r,o,t){if(!function(t){if("function"!=typeof t)throw TypeError(String(t)+" is not a function")}(r),void 0===o)return r;switch(t){case 0:return function(){return r.call(o)};case 1:return function(t){return r.call(o,t)};case 2:return function(t,e){return r.call(o,t,e)};case 3:return function(t,e,n){return r.call(o,t,e,n)}}return function(){return r.apply(o,arguments)}}function at(t){return Object(c(t))}function ft(t){return s(Gt,t)||(Bt&&s(Vt,t)?Gt[t]=Vt[t]:Gt[t]=_t("Symbol."+t)),Gt[t]}function lt(t,e){var n;return Rt(t)&&("function"==typeof(n=t.constructor)&&(n===Array||Rt(n.prototype))||a(n)&&null===(n=n[zt]))&&(n=void 0),new(void 0===n?Array:n)(0===e?0:e)}function st(y){var g=1==y,d=2==y,h=3==y,m=4==y,v=6==y,b=5==y||v;return function(t,e,n,r){for(var o,i,u=at(t),c=w(u),a=ct(e,n,3),f=nt(c.length),l=0,s=r||lt,p=g?s(t,f):d?s(t,0):void 0;l<f;l++)if((b||l in c)&&(i=a(o=c[l],l,u),y))if(g)p[l]=i;else if(i)switch(y){case 3:return!0;case 5:return o;case 6:return l;case 2:Ht.call(p,o)}else if(m)return!1;return v?-1:h||m?m:p}}function pt(t,e){var n=[][t];return!!n&&u(function(){n.call(null,e||function(){throw 1},1)})}function yt(t){throw t}function gt(t,e){if(s(qt,t))return qt[t];var n=[][t],r=!!s(e=e||{},"ACCESSORS")&&e.ACCESSORS,o=s(e,0)?e[0]:yt,i=s(e,1)?e[1]:void 0;return qt[t]=!!n&&!u(function(){if(r&&!d)return 1;var t={length:-1};r?Ut(t,1,{enumerable:!0,get:yt}):t[1]=1,n.call(t,o,i)})}var dt={set:G,get:V,has:_,enforce:function(t){return _(t)?V(t):G(t,{})},getterFor:function(n){return function(t){var e;if(!a(t)||(e=V(t)).type!==n)throw TypeError("Incompatible receiver, "+n+" required");return e}}},ht=n(function(t){var e=dt.get,c=dt.enforce,a=String(String).split("String");(t.exports=function(t,e,n,r){var o=!!r&&!!r.unsafe,i=!!r&&!!r.enumerable,u=!!r&&!!r.noTargetGet;"function"==typeof n&&("string"!=typeof e||s(n,"name")||M(n,"name",e),c(n).source=a.join("string"==typeof e?e:"")),t!==g?(o?!u&&t[e]&&(i=!0):delete t[e],i?t[e]=n:M(t,e,n)):i?t[e]=n:y(e,n)})(Function.prototype,"toString",function(){return"function"==typeof this&&e(this).source||J(this)})}),mt=g,vt=Math.ceil,bt=Math.floor,St=Math.min,wt=Math.max,Ot=Math.min,jt={includes:rt(!0),indexOf:rt(!1)}.indexOf,Tt=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"],Pt=Tt.concat("length","prototype"),Et={f:Object.getOwnPropertyNames||function(t){return ot(t,Pt)}},Lt={f:Object.getOwnPropertySymbols},xt=tt("Reflect","ownKeys")||function(t){var e=Et.f(p(t)),n=Lt.f;return n?e.concat(n(t)):e},At=/#|\.prototype\./,Mt=it.normalize=function(t){return String(t).replace(At,".").toLowerCase()},Ct=it.data={},kt=it.NATIVE="N",Dt=it.POLYFILL="P",It=it,Nt=L.f,Rt=Array.isArray||function(t){return"Array"==i(t)},Bt=!!Object.getOwnPropertySymbols&&!u(function(){return!String(Symbol())}),Ft=Bt&&!Symbol.sham&&"symbol"==typeof Symbol.iterator,Gt=W("wks"),Vt=g.Symbol,_t=Ft?Vt:Vt&&Vt.withoutSetter||I,zt=ft("species"),Ht=[].push,Jt={forEach:st(0),map:st(1),filter:st(2),some:st(3),every:st(4),find:st(5),findIndex:st(6)},Ut=Object.defineProperty,qt={},Wt=Jt.every,Kt=pt("every"),Yt=gt("every");ut({target:"Array",proto:!0,forced:!Kt||!Yt},{every:function(t,e){return Wt(this,t,1<arguments.length?e:void 0)}});var $t=Jt.forEach,Qt=pt("forEach"),Xt=gt("forEach"),Zt=Qt&&Xt?[].forEach:function(t,e){return $t(this,t,1<arguments.length?e:void 0)};ut({target:"Array",proto:!0,forced:[].forEach!=Zt},{forEach:Zt});var te,ee,ne=tt("navigator","userAgent")||"",re=g.process,oe=re&&re.versions,ie=oe&&oe.v8;ie?ee=(te=ie.split("."))[0]+te[1]:ne&&(!(te=ne.match(/Edge\/(\d+)/))||74<=te[1])&&(te=ne.match(/Chrome\/(\d+)/))&&(ee=te[1]);var ue,ce=ee&&+ee,ae=ft("species"),fe=Jt.map,le=(ue="map",51<=ce||!u(function(){var t=[];return(t.constructor={})[ae]=function(){return{foo:1}},1!==t[ue](Boolean).foo})),se=gt("map");ut({target:"Array",proto:!0,forced:!le||!se},{map:function(t,e){return fe(this,t,1<arguments.length?e:void 0)}});var pe=A.f,ye=Function.prototype,ge=ye.toString,de=/^\s*function ([^ (]*)/;!d||"name"in ye||pe(ye,"name",{configurable:!0,get:function(){try{return ge.call(this).match(de)[1]}catch(t){return""}}});var he=Object.keys||function(t){return ot(t,Tt)};ut({target:"Object",stat:!0,forced:u(function(){he(1)})},{keys:function(t){return he(at(t))}});var me={};me[ft("toStringTag")]="z";var ve="[object z]"===String(me),be=ft("toStringTag"),Se="Arguments"==i(function(){return arguments}()),we=ve?i:function(t){var e,n,r;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(n=function(t,e){try{return t[e]}catch(t){}}(e=Object(t),be))?n:Se?i(e):"Object"==(r=i(e))&&"function"==typeof e.callee?"Arguments":r},Oe=ve?{}.toString:function(){return"[object "+we(this)+"]"};ve||ht(Object.prototype,"toString",Oe,{unsafe:!0});var je="toString",Te=RegExp.prototype,Pe=Te[je],Ee=u(function(){return"/a/b"!=Pe.call({source:"a",flags:"b"})}),Le=Pe.name!=je;(Ee||Le)&&ht(RegExp.prototype,je,function(){var t=p(this),e=String(t.source),n=t.flags;return"/"+e+"/"+String(void 0===n&&t instanceof RegExp&&!("flags"in Te)?function(){var t=p(this),e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.dotAll&&(e+="s"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e}.call(t):n)},{unsafe:!0});for(var xe in{CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}){var Ae=g[xe],Me=Ae&&Ae.prototype;if(Me&&Me.forEach!==Zt)try{M(Me,"forEach",Zt)}catch(t){Me.forEach=Zt}}var Ce=n(function(e){function n(t){return"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?e.exports=n=function(t){return typeof t}:e.exports=n=function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},n(t)}e.exports=n}),ke={excel:"legionsThirdpartyExcelPlugin",html2canvas:"legionsThirdpartyHtml2canvasPlugin",jsBarcode:"legionsThirdpartyJsbarcodePlugin",clipboard:"legionsThirdpartyClipboardPlugin",dexie:"legionsThirdpartyDexiePlugin",focusOutside:"legionsThirdpartyFocusOutsidePlugin"};function De(){return{excel:null,html2canvas:null,jsBarcode:null,clipboard:null,dexie:null,focusOutside:null}}var Ie,Ne,Re=De(),Be=De();function Fe(t){var e,n,r,o="legions-"+t.name;window[ke[t.name]]||window.parent[ke[t.name]]||document.getElementById(o)?(e=window[ke[t.name]]||window.parent[ke[t.name]],"jsBarcode"===t.name?Re[t.name]=e.JsBarcode:"dexie"===t.name?Re[t.name]=e.DexieUtils:Re[t.name]=e):((n=document.createElement("script")).id=o,r=Date.parse((new Date).toString()),n.src=t.url+"?v="+r,document.body.appendChild(n),n.onload=n.onreadystatechange=function(){this.readyState&&!/^(loaded|complete)$/.test(this.readyState)||("jsBarcode"===t.name?Re[t.name]=window[ke[t.name]].JsBarcode:"dexie"===t.name?Re[t.name]=window[ke[t.name]].DexieUtils:Re[t.name]=window[ke[t.name]])})}Ie=Be,Ne=Re,Object.keys(Ne).forEach(function(t){Object.defineProperty(Ie,t,{configurable:!1,get:function(){return Ne[t]||console.error(t+":Property has no value yet,it is possible that the Plugin is not ready, Please install at the entrance(legionsThirdpartyPlugin.use({name:'"+t+"',url:''}))"),Ne[t]}})});var Ge=(Ve.prototype.use=function(t){"object"===Ce(t)&&(Array.isArray(t)?t.map(function(t){Fe(t)}):Fe(t))},Ve.prototype.subscribe=function(t,e){var n,r,o;"string"==typeof t?Re[t]?e():n=setInterval(function(){Re[t]&&(e(),clearInterval(n))},150):"[object Array]"===Object.prototype.toString.call(t)&&(r=[],t.map(function(t){r.push({name:t,value:Re[t]})}),r.every(function(t){return t.value})?e():(r=[],o=setInterval(function(){t.map(function(t){r.push({name:t,value:Re[t]})}),r.every(function(t){return t.value})?(e(),clearInterval(o)):r=[]},150)))},Object.defineProperty(Ve.prototype,"plugins",{get:function(){return Be},enumerable:!1,configurable:!0}),Ve);function Ve(){}var _e=new Ge;t.LegionsThirdpartyPlugin=Ge,t.legionsThirdpartyPlugin=_e,Object.defineProperty(t,"__esModule",{value:!0})});
