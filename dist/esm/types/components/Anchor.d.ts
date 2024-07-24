import React, { ReactNode, CSSProperties } from 'react';
interface AnchorItem {
    href: string;
    content: ReactNode | ((isActive: boolean, level: number) => ReactNode);
    children?: AnchorItem[];
}
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
interface AnchorLinkProps {
    item: AnchorItem;
    level: number;
    hierarchy: string[];
    handleClick: (e: React.MouseEvent<HTMLElement>, href: string, hierarchy: string[]) => void;
    activeHref: string;
    itemClassName?: string;
    itemStyle?: React.CSSProperties;
}
export declare const AnchorLink: React.FC<AnchorLinkProps>;
declare const EaseAnchor: React.FC<EaseAnchorProps>;
export default EaseAnchor;
