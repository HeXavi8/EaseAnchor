# EaseAnchor

EaseAnchor 是一个灵活的 React 锚点导航组件，提供了易用的页面内导航功能。它支持多级嵌套的锚点结构，可自定义滚动容器，以及样式，并提供平滑滚动和即时跳转两种模式。**（目前还处于beta版本）**

## 特性

- 支持多级嵌套的锚点结构
- 可自定义滚动容器
- 支持平滑滚动和即时跳转
- 自动检测并高亮当前可见的锚点
- 可自定义锚点项的样式和类名
- 支持通过 URL hash 或默认值设置初始活动锚点
- 提供全局点击回调函数

## 安装

```bash
npm install ease-anchor
```

## 用例

```jsx
import React from 'react';
import EaseAnchor from 'ease-anchor';

const App = () => {
  const items = [
    { href: 'section1', content: 'Section 1' },
    { href: 'section2', content: 'Section 2' },
    {
      href: 'section3',
      content: 'Section 3',
      children: [
        { href: 'section3-1', content: 'Section 3.1' },
        { href: 'section3-2', content: 'Section 3.2' },
      ],
    },
  ];

  return (
    <div>
      <EaseAnchor items={items} offset={60} />
      <div id="section1">Section 1 content</div>
      <div id="section2">Section 2 content</div>
      <div id="section3">
        Section 3 content
        <div id="section3-1">Section 3.1 content</div>
        <div id="section3-2">Section 3.2 content</div>
      </div>
    </div>
  );
};

export default App;
```

[更多用法](./demo/src/App.jsx)

## API

### EaseAnchor Props

| 属性            | 类型                                        | 默认值 | 描述                         |
| --------------- | ------------------------------------------- | ------ | ---------------------------- |
| items           | AnchorItem[]                                | -      | 锚点项数组，定义导航结构     |
| scrollContainer | string \| HTMLElement                       | window | 滚动容器的 ID 或 HTMLElement |
| offset          | number                                      | 0      | 滚动偏移量                   |
| animation       | boolean                                     | true   | 是否使用平滑滚动             |
| onClick         | (href: string, hierarchy: string[]) => void | -      | 点击锚点时的回调函数         |
| className       | string                                      | ''     | 导航容器的自定义类名         |
| style           | CSSProperties                               | {}     | 导航容器的自定义样式         |
| itemClassName   | string                                      | ''     | 锚点项的自定义类名           |
| itemStyle       | CSSProperties                               | {}     | 锚点项的自定义样式           |
| defaultValue    | string                                      | -      | 默认激活的锚点 href          |

### AnchorItem

AnchorItem 接口定义了每个锚点项的结构：

| 属性     | 类型                                                           | 描述           |
| -------- | -------------------------------------------------------------- | -------------- |
| href     | string                                                         | 锚点的目标 ID  |
| content  | ReactNode \| ((isActive: boolean, level: number) => ReactNode) | 锚点的显示内容 |
| children | AnchorItem[]                                                   | 可选，子锚点项 |

## 基础用法

### 自定义滚动容器

你可以通过 `scrollContainer` 属性指定自定义的滚动容器：

```jsx
<EaseAnchor items={items} scrollContainer="custom-container" />
```

### 动态内容

您可以使用函数来动态生成锚点内容：

```jsx
const items = [
  {
    href: 'dynamic',
    content: (isActive, level) => (
      <span style={{ color: isActive ? 'red' : 'black' }}>Dynamic Content (Level: {level})</span>
    ),
  },
];
```

### 使用回调函数

您可以使用 onClick 回调来执行自定义操作：

```jsx
const handleClick = (href, hierarchy) => {
  console.log(`Clicked: ${href}, Hierarchy: ${hierarchy.join(' > ')}`);
};

<EaseAnchor items={items} onClick={handleClick} />;
```

## 许可证

EaseAnchor 使用 MIT 许可证。查看 [LICENSE](./LICENSE) 文件了解更多信息。

### 联系我们

如果您有任何问题或建议，请通过以下方式联系我们：

- 提交 GitHub Issue
- 发送邮件到 xavihe.work@outlook.com

感谢您使用 EaseAnchor！
