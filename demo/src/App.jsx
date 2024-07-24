import React from 'react';
import EaseAnchor from './components/Anchor.tsx';

// 定义锚点项
const items1 = [
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

const Demo1 = () => {
  const handleClick = (activeItem, hierarchy) => {
    console.log('Active Item:', activeItem);
    console.log('Hierarchy:', hierarchy);
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', height: '100vh' }}>
      <EaseAnchor
        items={items1}
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

const Demo2 = () => {
  const items2 = [
    {
      href: 'section4',
      content: (isActive) => <span style={{ color: isActive ? '#94D2EF' : '#355386', fontWeight: isActive ? 'bold' : 'normal' }}>Section 4</span>
    },
    {
      href: 'section5',
      content: (isActive) => <span style={{ color: isActive ? '#94D2EF' : '#355386', fontWeight: isActive ? 'bold' : 'normal' }}>Section 5</span>,
      children: [
        {
          href: 'section5-1',
          content: (isActive) => <span style={{ color: isActive ? '#94D2EF' : '#355386', fontWeight: isActive ? 'bold' : 'normal' }}>Section 5-1</span>
        },
        {
          href: 'section5-2',
          content: (isActive) => <span style={{ color: isActive ? '#94D2EF' : '#355386', fontWeight: isActive ? 'bold' : 'normal' }}>Section 5-2</span>
        }
      ]
    },
    {
      href: 'section6',
      content: (isActive) => <span style={{ color: isActive ? '#94D2EF' : '#355386', fontWeight: isActive ? 'bold' : 'normal' }}>Section 6</span>
    }
  ];
  const handleAnchorClick = (href, hierarchy) => {
    console.log(`Clicked: ${href}, Hierarchy: ${hierarchy.join(' > ')}`);
  };
  return <div className="app">
    <div className="sidebar" style={{ position: 'fixed', left: 0, top: 600, width: '200px', height: '100vh', overflowY: 'auto' }}>
      <EaseAnchor
        items={items2}
        offset={60}
        onClick={handleAnchorClick}
        className="custom-anchor"
        itemClassName="custom-anchor-item"
        defaultValue='section5-2'
      />
    </div>
    <div className="content" style={{ marginLeft: '220px', padding: '20px' }}>
      <h1>EaseAnchor Demo</h1>
      <section style={{ height: '200px' }}>
        <h2 id="section4">Section 4</h2>
        <p>This is the content of section 4.</p>
      </section>
      <section style={{ height: '300px' }}>
        <h2 id="section5">Section 5</h2>
        <p>This is the content of section 5.</p>
        <section style={{ height: '100px' }}>
          <h3 id="section5-1">Section 5-1</h3>
          <p>This is the content of section 5-1.</p>
        </section>
        <section style={{ height: '100px' }}>
          <h3 id="section5-2">Section 5-2</h3>
          <p>This is the content of section 5-2.</p>
        </section>
      </section>
      <section style={{ height: '200px' }}>
        <h2 id="section6">Section 6</h2>
        <p>This is the content of section 6.</p>
      </section>
      <section style={{ height: '3000px' }}></section>
    </div>
  </div>
}

function App() {
  return <>
    <Demo1></Demo1>
    <Demo2></Demo2>
  </>
}

export default App;