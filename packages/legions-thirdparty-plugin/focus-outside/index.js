/**
 * legions-thirdparty-plugin v0.0.9
 * (c) 2021 duanguang
 * @license MIT
 */
/* 此库引自社区开源
 * @Author: txs1992
 * @url: https://github.com/txs1992/focus-outside
 * @Date: 2019-07-25 19:32:40
 * @Last Modified by: duanguang
 * @Last Modified time: 2020-09-10 14:30:51
 */
/* import Map from './map-shim'; */
var els = [];
var elMap = new Map();
var defaultClass = 'focus-outside';
function isNotFocusable(el) {
    return isNaN(parseInt(el.getAttribute('tabindex')));
}
function setFocusable(el) {
    el.setAttribute('tabindex', '-1');
}
function getNode(target) {
    return els.find(function (el) { return el.contains(target) || el === target; });
}
function addClass(el, name) {
    var classList = el.className.split(' ');
    if (classList.indexOf(name) > -1)
        return;
    classList.push(name);
    el.className = classList.join(' ');
}
function removeClass(el, name) {
    var classList = el.className.split(' ');
    var index = classList.indexOf(name);
    if (index < 0)
        return;
    classList.splice(index, 1);
    el.className = classList.join(' ');
}
function focusinHandler(_a) {
    var target = _a.target;
    var node = getNode(target);
    if (!node)
        return;
    //@ts-ignore
    var _b = findNodeMap(elMap.entries(), node) || {}, el = _b.el, nodeList = _b.nodeList;
    if (!el)
        return;
    clearTimeout(nodeList.timerId);
}
function focusoutHandler(_a) {
    var target = _a.target;
    var node = getNode(target);
    if (!node)
        return;
    //@ts-ignore
    var _b = findNodeMap(elMap.entries(), node) || {}, el = _b.el, key = _b.key, nodeList = _b.nodeList;
    if (!el)
        return;
    nodeList.timerId = setTimeout(key, 10);
}
function findNodeMap(entries, node) {
    var result = {};
    elMap.forEach(function (value, keys) {
        //console.log(keys,value)
        var key = keys;
        var nodeList = value;
        var el = nodeList.find(function (item) { return item.node === node; });
        if (el) {
            result = {
                key: key,
                nodeList: nodeList,
                el: el,
            };
        }
    });
    return result;
    /*   for (let i = 0; i < entries.length; i++) {
      
      const [key, nodeList] = entries[i]
      const el = nodeList.find(item => item.node === node)
      if (el) return { key, nodeList, el }
    } */
}
function focusBind(el, callback, className) {
    if (className === void 0) { className = 'focus-outside'; }
    if (className)
        defaultClass = className;
    if (els.indexOf(el) < 0)
        els.push(el);
    if (elMap.has(callback)) {
        var nodeList = elMap.get(callback);
        nodeList.push({
            node: el,
            oldTabIndex: el.getAttribute('tabindex'),
        });
    }
    else {
        elMap.set(callback, [
            {
                node: el,
                oldTabIndex: el.getAttribute('tabindex'),
            },
        ]);
    }
    if (isNotFocusable(el))
        setFocusable(el);
    addClass(el, defaultClass);
    el.addEventListener('focusin', focusinHandler);
    el.addEventListener('focusout', focusoutHandler);
}
function focusUnbind(target) {
    //@ts-ignore
    var _a = findNodeMap(elMap.entries(), target) || {}, el = _a.el, key = _a.key, nodeList = _a.nodeList;
    if (!el)
        return;
    var node = el.node, oldTabIndex = el.oldTabIndex;
    var index = els.indexOf(node);
    if (index > -1)
        els.splice(index);
    removeClass(node, defaultClass);
    if (oldTabIndex) {
        node.setAttribute('tabindex', oldTabIndex);
    }
    else {
        node.removeAttribute('tabindex');
    }
    node.removeEventListener('focusin', focusinHandler);
    node.removeEventListener('focusout', focusoutHandler);
    var nodeIndex = nodeList.indexOf(el);
    if (index > -1)
        nodeList.splice(nodeIndex, 1);
    if (!nodeList.length)
        elMap.delete(key);
}

export { focusBind, focusUnbind };
