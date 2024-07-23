import React, { useState, useRef, useCallback, useEffect } from 'react';

var EaseAnchor = function (_a) {
    var items = _a.items, scrollContainer = _a.scrollContainer, _b = _a.offset, offset = _b === void 0 ? 8 : _b, _c = _a.targetOffset, targetOffset = _c === void 0 ? 0 : _c, _d = _a.animation, animation = _d === void 0 ? true : _d, onChange = _a.onChange, _e = _a.className, className = _e === void 0 ? '' : _e, _f = _a.style, style = _f === void 0 ? {} : _f, _g = _a.hashMode, hashMode = _g === void 0 ? false : _g, defaultValue = _a.defaultValue, value = _a.value;
    var _h = useState(''), activeHref = _h[0], setActiveHref = _h[1];
    var containerRef = useRef(null);
    var initialScrollDone = useRef(false);
    var getInitialActiveHref = useCallback(function () {
        if (value !== undefined)
            return value;
        if (defaultValue)
            return defaultValue;
        if (hashMode) {
            var hash = window.location.hash;
            return hash ? hash : '';
        }
        return '';
    }, [value, defaultValue, hashMode]);
    useEffect(function () {
        setActiveHref(getInitialActiveHref());
    }, [getInitialActiveHref]);
    var handleScroll = useCallback(function () {
        if (!containerRef.current || value !== undefined)
            return;
        var currentActiveHref = '';
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            var targetHref = hashMode ? "#".concat(item.href.replace(/^#/, '')) : item.href;
            var element = document.querySelector(targetHref);
            if (element && element.getBoundingClientRect().top <= targetOffset + offset) {
                currentActiveHref = targetHref;
            }
            else {
                break;
            }
        }
        if (currentActiveHref !== activeHref) {
            setActiveHref(currentActiveHref);
            onChange && onChange(currentActiveHref);
            if (hashMode) {
                window.history.replaceState(null, '', currentActiveHref);
            }
        }
    }, [items, offset, targetOffset, activeHref, onChange, hashMode, value]);
    useEffect(function () {
        try {
            var container = typeof scrollContainer === 'string'
                ? document.querySelector(scrollContainer)
                : scrollContainer || window;
            containerRef.current = container;
            if (!containerRef.current) {
                throw new Error('Invalid scroll container');
            }
            containerRef.current.addEventListener('scroll', handleScroll);
            handleScroll(); // Initial check
            return function () {
                var _a;
                (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.removeEventListener('scroll', handleScroll);
            };
        }
        catch (error) {
            console.error('Error setting up scroll listener:', error);
        }
    }, [scrollContainer, handleScroll]);
    useEffect(function () {
        if (!initialScrollDone.current && containerRef.current) {
            var targetHref = getInitialActiveHref();
            if (targetHref) {
                var targetElement = document.querySelector(targetHref);
                if (targetElement) {
                    var containerScrollTop = containerRef.current === window
                        ? window.pageYOffset
                        : containerRef.current.scrollTop;
                    var targetPosition = targetElement.getBoundingClientRect().top + containerScrollTop - offset - targetOffset;
                    if (animation) {
                        containerRef.current.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                    else {
                        containerRef.current.scrollTo(0, targetPosition);
                    }
                    setActiveHref(targetHref);
                    onChange && onChange(targetHref);
                }
            }
            initialScrollDone.current = true;
        }
    }, [getInitialActiveHref, offset, targetOffset, animation, onChange]);
    var handleClick = useCallback(function (e, href) {
        e.preventDefault();
        var targetHref = hashMode ? "#".concat(href.replace(/^#/, '')) : href;
        var targetElement = document.querySelector(targetHref);
        if (targetElement && containerRef.current) {
            var containerScrollTop = containerRef.current === window
                ? window.pageYOffset
                : containerRef.current.scrollTop;
            var targetPosition = targetElement.getBoundingClientRect().top + containerScrollTop - offset - targetOffset;
            if (animation) {
                containerRef.current.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            else {
                containerRef.current.scrollTo(0, targetPosition);
            }
            if (hashMode) {
                window.history.pushState(null, '', targetHref);
            }
            if (value === undefined) {
                setActiveHref(targetHref);
            }
            onChange && onChange(targetHref);
        }
    }, [offset, targetOffset, animation, hashMode, onChange, value]);
    var renderAnchorItems = useCallback(function (anchorItems, level) {
        if (level === void 0) { level = 0; }
        return (React.createElement(React.Fragment, null, anchorItems.map(function (item) {
            var targetHref = hashMode ? "#".concat(item.href.replace(/^#/, '')) : item.href;
            return (React.createElement("div", { key: targetHref },
                React.createElement("div", { onClick: function (e) { return handleClick(e, targetHref); } }, typeof item.content === 'function'
                    ? item.content(value !== undefined ? value === targetHref : activeHref === targetHref, level)
                    : item.content),
                item.children && renderAnchorItems(item.children, level + 1)));
        })));
    }, [activeHref, handleClick, value, hashMode]);
    return (React.createElement("nav", { className: "ease-anchor ".concat(className), style: style }, renderAnchorItems(items)));
};

export { EaseAnchor as Anchor };
//# sourceMappingURL=index.js.map
