import React, { CSSProperties, ReactNode } from 'react';

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
declare const EaseAnchor: React.FC<EaseAnchorProps>;

export { EaseAnchor as Anchor };
