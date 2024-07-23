import React, { CSSProperties, ReactNode } from 'react';

/**
 * Interface for a single anchor item
 * @interface AnchorItem
 * @property {string} href - The target href for the anchor item
 * @property {ReactNode | ((isActive: boolean, level: number) => ReactNode)} content - The content to be rendered for this item. Can be a ReactNode or a function that returns a ReactNode
 * @property {AnchorItem[]} [children] - Optional array of child anchor items
 */
interface AnchorItem {
    href: string;
    content: ReactNode | ((isActive: boolean, level: number) => ReactNode);
    children?: AnchorItem[];
}
/**
 * Props for the EaseAnchor component
 * @interface EaseAnchorProps
 * @property {AnchorItem[]} items - Array of anchor items to be rendered
 * @property {string | HTMLElement} [scrollContainer] - The container to which the scroll event listener is attached. Can be a CSS selector string or an HTMLElement
 * @property {number} [offset=8] - The offset distance to the top of the container
 * @property {number} [targetOffset=0] - The offset distance to the target element
 * @property {boolean} [animation=true] - Whether to use smooth scrolling animation
 * @property {(currentActiveHref: string) => void} [onChange] - Callback function that is called when the active anchor changes
 * @property {string} [className] - Additional CSS class name for the component
 * @property {React.CSSProperties} [style] - Additional inline styles for the component
 * @property {boolean} [hashMode=false] - Whether to use hash mode for URLs
 * @property {string} [defaultValue] - The default active href (for uncontrolled component)
 * @property {string} [value] - The controlled active href (for controlled component)
 */
interface EaseAnchorProps {
    items: AnchorItem[];
    scrollContainer?: string | HTMLElement;
    offset?: number;
    targetOffset?: number;
    animation?: boolean;
    onChange?: (currentActiveHref: string) => void;
    className?: string;
    style?: CSSProperties;
    hashMode?: boolean;
    defaultValue?: string;
    value?: string;
}
declare const EaseAnchor: React.FC<EaseAnchorProps>;

export { EaseAnchor as Anchor };
