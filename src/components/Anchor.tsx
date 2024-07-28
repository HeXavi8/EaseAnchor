import React, { useState, useEffect, useRef, ReactNode, useCallback, CSSProperties } from 'react';

// 定义 AnchorItem 接口
// Define AnchorItem interface
interface AnchorItem {
  href: string;
  // 锚点的目标 ID / Target ID for the anchor
  content: ReactNode | ((isActive: boolean, level: number) => ReactNode);
  // 锚点的显示内容 / Content to display for the anchor
  children?: AnchorItem[];
  // 可选的子锚点项 / Optional child anchor items
}

// 定义 EaseAnchorProps 接口
// Define EaseAnchorProps interface
interface EaseAnchorProps {
  items: AnchorItem[];
  // 锚点项数组 / Array of anchor items
  scrollContainer?: string | HTMLElement;
  // 滚动容器 / Scroll container
  offset?: number;
  // 滚动偏移量 / Scroll offset
  animation?: boolean;
  // 是否使用平滑滚动 / Whether to use smooth scrolling
  onClick?: (href: string, hierarchy: string[]) => void;
  // 点击回调 / Click callback
  className?: string;
  // 自定义类名 / Custom class name
  style?: CSSProperties;
  // 自定义样式 / Custom style
  itemClassName?: string;
  // 锚点项自定义类名 / Custom class name for anchor items
  itemStyle?: CSSProperties;
  // 锚点项自定义样式 / Custom style for anchor items
  defaultValue?: string;
  // 默认激活的锚点 / Default active anchor
}

// 定义 AnchorLink 组件的 props 接口
// Define props interface for AnchorLink component
interface AnchorLinkProps {
  item: AnchorItem;
  level: number;
  hierarchy: string[];
  handleClick: (
    e: React.MouseEvent<HTMLElement>,
    href: string,
    hierarchy: string[],
  ) => void;
  activeHref: string;
  itemClassName?: string;
  itemStyle?: React.CSSProperties;
}

interface TopVisibleItem {
  href: string;
  hierarchy: string[];
  top: number;
}

// AnchorLink 子组件
// AnchorLink subcomponent
export const AnchorLink: React.FC<AnchorLinkProps> = ({
  item,
  level,
  hierarchy,
  handleClick,
  activeHref,
  itemClassName,
  itemStyle,
}) => {
  const targetHref = item.href;
  const currentHierarchy = [...hierarchy, targetHref];
  return (
    <div key={targetHref} className={`ease-anchor-item ${itemClassName}`} style={itemStyle}>
      <div onClick={(e) => handleClick(e, targetHref, currentHierarchy)}>
        {typeof item.content === 'function'
          ? item.content(activeHref === targetHref, level)
          : item.content}
      </div>
      {item.children &&
        item.children.map((child) => (
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

// EaseAnchor 主组件
// EaseAnchor main component
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

  // 获取初始活动锚点
  // Get initial active anchor
  const getInitialActiveHref = useCallback(() => {
    if (defaultValue) return defaultValue;
    const hash = window.location.hash.slice(1);
    return hash ? hash : '';
  }, [defaultValue]);

  useEffect(() => {
    setActiveHref(getInitialActiveHref());
  }, [getInitialActiveHref]);

  // 查找当前可见的顶部锚点
  // Find the top visible anchor
  const findTopVisibleHrefInItems = (
    items: AnchorItem[],
  ): { href: string; hierarchy: string[] } | null => {
    let topVisibleItem: TopVisibleItem | null = null;

    const findTopVisibleItem = (items: AnchorItem[], hierarchy: string[]): void => {
      items.forEach((item) => {
        const targetHref = item.href;
        const targetElement = document.getElementById(targetHref);
        if (targetElement && containerRef.current) {
          const containerTop =
            containerRef.current instanceof Window
              ? 0
              : containerRef.current.getBoundingClientRect().top;
          const targetTop = targetElement.getBoundingClientRect().top;
          const top = targetTop - containerTop;
          if (top >= 0 && (!topVisibleItem || top < topVisibleItem?.top)) {
            topVisibleItem = { href: targetHref, hierarchy: [...hierarchy, targetHref], top };
          }
          if (item.children) {
            findTopVisibleItem(item.children, [...hierarchy, targetHref]);
          }
        }
      });
    };

    findTopVisibleItem(items, []);
    return topVisibleItem
  };

  // 处理滚动事件
  // Handle scroll event
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const result = findTopVisibleHrefInItems(items);
    if (result && result.href !== activeHref) {
      setActiveHref(result.href);
    }
  }, [items, activeHref]);

  // 设置滚动监听器
  // Set up scroll listener
  const setupScrollListener = () => {
    try {
      const container =
        typeof scrollContainer === 'string'
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

  // 初始滚动到目标位置
  // Initial scroll to target position
  const initialScrollToTarget = () => {
    if (!initialScrollDone.current && containerRef.current) {
      const targetHref = getInitialActiveHref();
      if (targetHref) {
        const targetElement = document.getElementById(targetHref);
        if (targetElement && containerRef.current) {
          const containerTop =
            containerRef.current instanceof Window
              ? 0
              : containerRef.current.getBoundingClientRect().top;
          const targetTop = targetElement.getBoundingClientRect().top;
          const targetScrollTop =
            containerRef.current instanceof Window
              ? window.scrollY
              : containerRef.current.scrollTop;
          const targetPosition = targetTop - containerTop + targetScrollTop - offset;
          if (animation) {
            containerRef.current.scrollTo({
              top: targetPosition,
              behavior: 'smooth',
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

  // 处理锚点点击事件
  // Handle anchor click event
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>, href: string, hierarchy: string[]) => {
      e.preventDefault();
      const targetHref = href;
      const targetElement = document.getElementById(targetHref);
      if (targetElement && containerRef.current) {
        const containerTop =
          containerRef.current instanceof Window
            ? 0
            : containerRef.current.getBoundingClientRect().top;
        const targetTop = targetElement.getBoundingClientRect().top;
        const targetScrollTop =
          containerRef.current instanceof Window ? window.scrollY : containerRef.current.scrollTop;
        const targetPosition = targetTop - containerTop + targetScrollTop - offset;
        if (animation) {
          containerRef.current.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          });
        } else {
          containerRef.current.scrollTo(0, targetPosition);
        }

        if (onClick) {
          onClick(href, hierarchy);
        }
      }
    },
    [offset, animation, onClick],
  );

  return (
    <nav className={`ease-anchor ${className}`} style={style}>
      {items.map((item) => (
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