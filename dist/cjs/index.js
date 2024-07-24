'use strict';

var React = require('react');

/******************************************************************************
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
/* global Reflect, Promise, SuppressedError, Symbol */


function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

// AnchorLink 子组件
var AnchorLink = function (_a) {
    var item = _a.item, level = _a.level, hierarchy = _a.hierarchy, handleClick = _a.handleClick, activeHref = _a.activeHref, itemClassName = _a.itemClassName, itemStyle = _a.itemStyle;
    var targetHref = item.href;
    var currentHierarchy = __spreadArray(__spreadArray([], hierarchy, true), [targetHref], false);
    return (React.createElement("div", { key: targetHref, className: "ease-anchor-item ".concat(itemClassName), style: itemStyle },
        React.createElement("div", { onClick: function (e) { return handleClick(e, targetHref, currentHierarchy); } }, typeof item.content === 'function'
            ? item.content(activeHref === targetHref, level)
            : item.content),
        item.children &&
            item.children.map(function (child) { return (React.createElement(AnchorLink, { key: child.href, item: child, level: level + 1, hierarchy: currentHierarchy, handleClick: handleClick, activeHref: activeHref, itemClassName: itemClassName, itemStyle: itemStyle })); })));
};
// EaseAnchor 组件
var EaseAnchor = function (_a) {
    var items = _a.items, scrollContainer = _a.scrollContainer, _b = _a.offset, offset = _b === void 0 ? 0 : _b, _c = _a.animation, animation = _c === void 0 ? true : _c, onClick = _a.onClick, _d = _a.className, className = _d === void 0 ? '' : _d, _e = _a.style, style = _e === void 0 ? {} : _e, _f = _a.itemClassName, itemClassName = _f === void 0 ? '' : _f, _g = _a.itemStyle, itemStyle = _g === void 0 ? {} : _g, defaultValue = _a.defaultValue;
    var _h = React.useState(''), activeHref = _h[0], setActiveHref = _h[1];
    var containerRef = React.useRef(null);
    var initialScrollDone = React.useRef(false);
    var getInitialActiveHref = React.useCallback(function () {
        if (defaultValue)
            return defaultValue;
        var hash = window.location.hash.slice(1);
        return hash ? hash : '';
    }, [defaultValue]);
    React.useEffect(function () {
        setActiveHref(getInitialActiveHref());
    }, [getInitialActiveHref]);
    var findTopVisibleHrefInItems = function (items) {
        var topVisibleItem = null;
        var findTopVisibleItem = function (items, hierarchy) {
            items.forEach(function (item) {
                var targetHref = item.href;
                var targetElement = document.getElementById(targetHref);
                if (targetElement && containerRef.current) {
                    var containerTop = containerRef.current instanceof Window
                        ? 0
                        : containerRef.current.getBoundingClientRect().top;
                    var targetTop = targetElement.getBoundingClientRect().top;
                    var top_1 = targetTop - containerTop;
                    if (top_1 >= 0 && (!topVisibleItem || top_1 < (topVisibleItem === null || topVisibleItem === void 0 ? void 0 : topVisibleItem.top))) {
                        topVisibleItem = { href: targetHref, hierarchy: __spreadArray(__spreadArray([], hierarchy, true), [targetHref], false), top: top_1 };
                    }
                    if (item.children) {
                        findTopVisibleItem(item.children, __spreadArray(__spreadArray([], hierarchy, true), [targetHref], false));
                    }
                }
            });
        };
        findTopVisibleItem(items, []);
        return topVisibleItem;
    };
    var handleScroll = React.useCallback(function () {
        if (!containerRef.current)
            return;
        var result = findTopVisibleHrefInItems(items);
        if (result && result.href !== activeHref) {
            setActiveHref(result.href);
        }
    }, [items, activeHref]);
    var setupScrollListener = function () {
        try {
            var container = typeof scrollContainer === 'string'
                ? document.getElementById(scrollContainer)
                : scrollContainer || window;
            containerRef.current = container;
            if (!containerRef.current) {
                throw new Error('Invalid scroll container');
            }
            containerRef.current.addEventListener('scroll', handleScroll);
            handleScroll();
            return function () {
                var _a;
                (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.removeEventListener('scroll', handleScroll);
            };
        }
        catch (error) {
            console.error('Error setting up scroll listener:', error);
        }
    };
    var initialScrollToTarget = function () {
        if (!initialScrollDone.current && containerRef.current) {
            var targetHref = getInitialActiveHref();
            if (targetHref) {
                var targetElement = document.getElementById(targetHref);
                if (targetElement && containerRef.current) {
                    var containerTop = containerRef.current instanceof Window
                        ? 0
                        : containerRef.current.getBoundingClientRect().top;
                    var targetTop = targetElement.getBoundingClientRect().top;
                    var targetScrollTop = containerRef.current instanceof Window
                        ? window.scrollY
                        : containerRef.current.scrollTop;
                    var targetPosition = targetTop - containerTop + targetScrollTop - offset;
                    if (animation) {
                        containerRef.current.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth',
                        });
                    }
                    else {
                        containerRef.current.scrollTo(0, targetPosition);
                    }
                    setActiveHref(targetHref);
                }
            }
            initialScrollDone.current = true;
        }
    };
    React.useEffect(function () {
        setupScrollListener();
        initialScrollToTarget();
    }, [scrollContainer, handleScroll, getInitialActiveHref, offset, animation]);
    var handleClick = React.useCallback(function (e, href, hierarchy) {
        e.preventDefault();
        var targetHref = href;
        var targetElement = document.getElementById(targetHref);
        if (targetElement && containerRef.current) {
            var containerTop = containerRef.current instanceof Window
                ? 0
                : containerRef.current.getBoundingClientRect().top;
            var targetTop = targetElement.getBoundingClientRect().top;
            var targetScrollTop = containerRef.current instanceof Window ? window.scrollY : containerRef.current.scrollTop;
            var targetPosition = targetTop - containerTop + targetScrollTop - offset;
            if (animation) {
                containerRef.current.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth',
                });
            }
            else {
                containerRef.current.scrollTo(0, targetPosition);
            }
            if (onClick) {
                onClick(href, hierarchy);
            }
        }
    }, [offset, animation, onClick]);
    return (React.createElement("nav", { className: "ease-anchor ".concat(className), style: style }, items.map(function (item) { return (React.createElement(AnchorLink, { key: item.href, item: item, level: 0, hierarchy: [], handleClick: handleClick, activeHref: activeHref, itemClassName: itemClassName, itemStyle: itemStyle })); })));
};

exports.Anchor = EaseAnchor;
//# sourceMappingURL=index.js.map
