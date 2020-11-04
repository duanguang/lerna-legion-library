export function assignObject(obj1, obj2) {
  for (let name in obj2) {
    if (obj2.hasOwnProperty(name)) {
      obj1[name] = obj2[name];
    }
  }
  return obj1;
  for (let name in obj2) {
    if (obj2.hasOwnProperty(name)) {
      obj1[name] = obj2[name];
    }
  }
  return obj1;
}
function typeDecide(o, type) {
  return Object.prototype.toString.call(o) === '[object ' + type + ']';
}
function stringify(obj) {
  if (window.JSON && window.JSON.stringify) {
    return JSON.stringify(obj);
  }
  var t = typeof obj;
  if (t != 'object' || obj === null) {
    // simple data type
    if (t == 'string') obj = '"' + obj + '"';
    return String(obj);
  } else {
    // recurse array or object
    var n,
      v,
      json = [],
      arr = obj && obj.constructor == Array;

    // fix.
    var self = arguments.callee;

    for (n in obj) {
      if (obj.hasOwnProperty(n)) {
        v = obj[n];
        t = typeof v;
        if (obj.hasOwnProperty(n)) {
          if (t == 'string') v = '"' + v + '"';
          else if (t == 'object' && v !== null)
            // v = jQuery.stringify(v);
            v = self(v);
          json.push((arr ? '' : '"' + n + '":') + String(v));
        }
      }
    }
    return (arr ? '[' : '{') + String(json) + (arr ? ']' : '}');
  }
}
export function serializeObj(obj) {
  let parames = '';
  Object.keys(obj).forEach(name => {
    if (typeDecide(obj[name], 'Object')) {
      parames += name + '=' + stringify(obj[name]);
    } else {
      parames += name + '=' + obj[name] + '^';
    }
  });
  return encodeURIComponent(parames.substr(0, parames.length - 1));
}
