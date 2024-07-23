import React, { useState, useEffect, useRef } from 'react';
import EaseAnchor from './components/Anchor.tsx';

// 定义锚点项
const items = [
  {
    href: 'section1',
    content: (isActive) => <span style={{ color: isActive ? '#94D2EF' : '#355386', fontWeight: isActive ? 'bold' : 'normal' }}>Section 1</span>
  },
  {
    href: 'section2',
    content: (isActive) => <span style={{ color: isActive ? '#94D2EF' : '#355386', fontWeight: isActive ? 'bold' : 'normal' }}>Section 2</span>,
    children: [
      {
        href: 'section2-1',
        content: (isActive) => <span style={{ color: isActive ? '#94D2EF' : '#355386', fontWeight: isActive ? 'bold' : 'normal' }}>Section 2-1</span>
      },
      {
        href: 'section2-2',
        content: (isActive) => <span style={{ color: isActive ? '#94D2EF' : '#355386', fontWeight: isActive ? 'bold' : 'normal' }}>Section 2-2</span>
      }
    ]
  },
  {
    href: 'section3',
    content: (isActive) => <span style={{ color: isActive ? '#94D2EF' : '#355386', fontWeight: isActive ? 'bold' : 'normal' }}>Section 3</span>
  }
];

const items2 = [
  {
    id: 'section1', label: 'Section 1', children: [
      { id: 'subsection1', label: 'Subsection 1' },
      { id: 'subsection2', label: 'Subsection 2' },
    ]
  },
  { id: 'section2', label: 'Section 2' },
  {
    id: 'section3', label: 'Section 3', children: [
      { id: 'subsection3', label: 'Subsection 3' },
      { id: 'subsection4', label: 'Subsection 4' },
    ]
  },
];

const Demo1 = () => {
  const handleClick = (activeItem, hierarchy) => {
    console.log('Active Item:', activeItem);
    console.log('Hierarchy:', hierarchy);
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', height: '100vh' }}>
      <EaseAnchor
        items={items}
        scrollContainer="scroll-container"
        offset={50}
        animation={true}
        onClick={handleClick}
        className="ease-anchor"
        style={{ padding: '20px', borderRadius: '8px', boxShadow: '4px 8px 16px rgba(0, 0, 0, 0.2)', marginRight: '20px', width: '200px' }}
        itemClassName="ease-anchor-item"
        itemStyle={{ padding: '10px', cursor: 'pointer', borderRadius: '4px', fontSize: 20 }}
        defaultValue="section2"
      />
      <div id="scroll-container" style={{ height: '300px', width: '800px', overflowY: 'scroll', borderRadius: '8px', padding: '20px', backgroundColor: '#ffffff', boxShadow: '4px 8px 16px rgba(0, 0, 0, 0.2)' }}>
        <div style={{ height: '500px', background: '#355386', padding: '20px', borderRadius: '8px', color: '#fff' }}>
          <div id="section1">Section 1 Content</div>
        </div>
        <div style={{ height: '550px', background: '#3E68A0', padding: '20px', borderRadius: '8px', color: '#fff' }}>
          <div id="section2" >Section 2 Content</div>
          <div style={{ height: '200px', background: '#5091C0', margin: '20px', padding: '20px', borderRadius: '8px', color: '#fff' }}>
            <div id="section2-1">Section 2-1 Content</div>
          </div>
          <div style={{ height: '200px', background: '#94D2EF', margin: '20px', padding: '20px', borderRadius: '8px', color: '#355386' }}>
            <div id="section2-2">Section 2-2 Content</div>
          </div>
        </div>
        <div id="section3" style={{ height: '500px', background: '#BCDDEA', padding: '20px', borderRadius: '8px', color: '#355386' }}>
          <div id="section3">Section 3 Content</div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return <Demo1></Demo1>
}

export default App;