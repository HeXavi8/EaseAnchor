import React from 'react';
interface AnchorProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}
declare const Anchor: React.FC<AnchorProps>;
export default Anchor;
