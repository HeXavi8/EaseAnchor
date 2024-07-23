import React, { useState, useEffect, useRef, ReactNode, useCallback, CSSProperties } from 'react';

// 定义 AnchorItem 接口
interface AnchorItem {
  href: string;
  content: ReactNode | ((isActive: boolean, level: number) => ReactNode);
  children?: AnchorItem[];
}

// 定义 EaseAnchorProps 接口
interface EaseAnchorProps {
  items: AnchorItem[];
  scrollContainer?: string | HTMLElement;
  offset?: number;
  animation?: boolean;
  onClick?: (href: string, hierarchy: string[]) => void;
  className?: string;
  style?: CSSProperties;
  itemClassName?: string;
  itemStyle?: CSSProperties;
  defaultValue?: string;
}

// AnchorLink 子组件
export const AnchorLink = ({ item, level, hierarchy, handleClick, activeHref, itemClassName, itemStyle }) => {
  const targetHref = item.href;
  const currentHierarchy = [...hierarchy, targetHref];
  return (
    <div key={targetHref} className={`ease-anchor-item ${itemClassName}`} style={itemStyle}>
      <div onClick={(e) => handleClick(e, targetHref, currentHierarchy)}>
        {typeof item.content === 'function'
          ? item.content(activeHref === targetHref, level)
          : item.content}
      </div>
      {item.children && item.children.map(child => (
        <AnchorLink
          key={child.href}
          item={child}
          level={level + 1}
          hierarchy={currentHierarchy}
          handleClick={handleClick}
          activeHref={activeHref}
          itemClassName={itemClassName}
          itemStyle={itemStyle}
        />
      ))}
    </div>
  );
};

// EaseAnchor 组件
const EaseAnchor: React.FC<EaseAnchorProps> = ({
  items,
  scrollContainer,
  offset = 0,
  animation = true,
  onClick,
  className = '',
  style = {},
  itemClassName = '',
  itemStyle = {},
  defaultValue,
}) => {
  const [activeHref, setActiveHref] = useState<string>('');
  const containerRef = useRef<HTMLElement | null>(null);
  const initialScrollDone = useRef<boolean>(false);

  const getInitialActiveHref = useCallback(() => {
    if (defaultValue) return defaultValue;
    const hash = window.location.hash.slice(1);
    return hash ? hash : '';
  }, [defaultValue]);

  useEffect(() => {
    setActiveHref(getInitialActiveHref());
  }, [getInitialActiveHref]);

  const findTopVisibleHrefInItems = (items: AnchorItem[], offset: number): { href: string, hierarchy: string[] } | null => {
    let topVisibleItem: { href: string, hierarchy: string[], top: number } | null = null;

    const findTopVisibleItem = (items: AnchorItem[], hierarchy: string[]): void => {
      items.forEach(item => {
        const targetHref = item.href;
        const targetElement = document.getElementById(targetHref);
        if (targetElement && containerRef.current) {
          const containerTop = containerRef.current instanceof Window ? 0 : containerRef.current.getBoundingClientRect().top;
          const targetTop = targetElement.getBoundingClientRect().top;
          const top = targetTop - containerTop;
          if (top >= 0 && (!topVisibleItem || top < topVisibleItem.top)) {
            topVisibleItem = { href: targetHref, hierarchy: [...hierarchy, targetHref], top };
          }
          if (item.children) {
            findTopVisibleItem(item.children, [...hierarchy, targetHref]);
          }
        }
      });
    };

    findTopVisibleItem(items, []);
    return topVisibleItem ? { href: topVisibleItem.href, hierarchy: topVisibleItem.hierarchy } : null;
  };

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const result = findTopVisibleHrefInItems(items, offset);
    if (result && result.href !== activeHref) {
      setActiveHref(result.href);
    }
  }, [items, offset, activeHref]);

  const setupScrollListener = () => {
    try {
      const container = typeof scrollContainer === 'string'
        ? document.getElementById(scrollContainer)
        : scrollContainer || window;

      containerRef.current = container as HTMLElement;

      if (!containerRef.current) {
        throw new Error('Invalid scroll container');
      }

      containerRef.current.addEventListener('scroll', handleScroll);
      handleScroll();

      return () => {
        containerRef.current?.removeEventListener('scroll', handleScroll);
      };
    } catch (error) {
      console.error('Error setting up scroll listener:', error);
    }
  };

  const initialScrollToTarget = () => {
    if (!initialScrollDone.current && containerRef.current) {
      const targetHref = getInitialActiveHref();
      if (targetHref) {
        const targetElement = document.getElementById(targetHref);
        if (targetElement && containerRef.current) {
          const containerTop = containerRef.current instanceof Window ? window.scrollY : containerRef.current.getBoundingClientRect().top;
          const targetTop = targetElement.getBoundingClientRect().top;
          const targetScrollTop = containerRef.current instanceof Window ? window.scrollY : containerRef.current.scrollTop
          const targetPosition = targetTop - containerTop + targetScrollTop - offset;
          if (animation) {
            containerRef.current.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          } else {
            containerRef.current.scrollTo(0, targetPosition);
          }
          setActiveHref(targetHref);
        }
      }
      initialScrollDone.current = true;
    }
  };

  useEffect(() => {
    setupScrollListener();
    initialScrollToTarget();
  }, [scrollContainer, handleScroll, getInitialActiveHref, offset, animation]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLElement>, href: string, hierarchy: string[]) => {
    e.preventDefault();
    const targetHref = href;
    const targetElement = document.getElementById(targetHref);
    if (targetElement && containerRef.current) {
      const containerTop = containerRef.current instanceof Window ? 0 : containerRef.current.getBoundingClientRect().top;
      const targetTop = targetElement.getBoundingClientRect().top;
      const targetScrollTop = containerRef.current instanceof Window ? window.scrollY : containerRef.current.scrollTop
      const targetPosition = targetTop - containerTop + targetScrollTop - offset;
      if (animation) {
        containerRef.current.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      } else {
        containerRef.current.scrollTo(0, targetPosition);
      }

      if (onClick) {
        onClick(href, hierarchy);
      }
    }
  }, [offset, animation, onClick, items]);

  return (
    <nav className={`ease-anchor ${className}`} style={style}>
      {items.map(item => (
        <AnchorLink
          key={item.href}
          item={item}
          level={0}
          hierarchy={[]}
          handleClick={handleClick}
          activeHref={activeHref}
          itemClassName={itemClassName}
          itemStyle={itemStyle}
        />
      ))}
    </nav>
  );
};

export default EaseAnchor;
