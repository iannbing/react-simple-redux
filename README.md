# React Simple Tree Menu

[![npm version](https://badge.fury.io/js/react-simple-tree-menu.svg)](https://badge.fury.io/js/react-simple-tree-menu)
[![CircleCI](https://circleci.com/gh/iannbing/react-simple-tree-menu/tree/master.svg?style=shield)](https://circleci.com/gh/iannbing/react-simple-tree-menu/tree/master)
[![Storybook](https://cdn.jsdelivr.net/gh/storybooks/brand@master/badge/badge-storybook.svg)](https://iannbing.github.io/react-simple-tree-menu/)

Inspired by [Downshift](https://github.com/downshift-js/downshift), a simple, data-driven, light-weight React Tree Menu component that:

- does not depend on any UI framework
- fully customizable with `render props` and `control props`
- allows search
- support keyboard browsing

Check [Storybook Demo](https://iannbing.github.io/react-simple-tree-menu/).

## Usage

Install with the following command in your React app:

```bash
npm i react-simple-tree-menu
// or
yarn add react-simple-tree-menu
```

To generate a `TreeMenu`, you need to provide data in the following structure.

```js
// as an array
const treeData = [
  {
    key: 'first-level-node-1',
    label: 'Node 1 at the first level',
    ..., // any other props you need, e.g. url
    nodes: [
      {
        key: 'second-level-node-1',
        label: 'Node 1 at the second level',
        nodes: [
          {
            key: 'third-level-node-1',
            label: 'Last node of the branch',
            nodes: [] // you can remove the nodes property or leave it as an empty array
          },
        ],
      },
    ],
  },
  {
    key: 'first-level-node-2',
    label: 'Node 2 at the first level',
  },
];
// or as an object
const treeData = {
  'first-level-node-1': {               // key
    label: 'Node 1 at the first level',
    index: 0, // decide the rendering order on the same level
    ...,      // any other props you need, e.g. url
    nodes: {
      'second-level-node-1': {
        label: 'Node 1 at the second level',
        index: 0,
        nodes: {
          'third-level-node-1': {
            label: 'Node 1 at the third level',
            index: 0,
            nodes: {} // you can remove the nodes property or leave it as an empty array
          },
        },
      },
    },
  },
  'first-level-node-2': {
    label: 'Node 2 at the first level',
    index: 1,
  },
};

```

And then import `TreeMenu` and use it. By default you only need to provide `data`. You can have more control over the behaviors of the components using the provided API.

```jsx
import TreeMenu from 'react-simple-tree-menu';
...
// import default minimal styling or your own styling
import '../node_modules/react-simple-tree-menu/dist/main.css';
// Use the default minimal UI
<TreeMenu data={treeData} />

// Use any third-party UI framework
<TreeViewMenu
  data={treeData}
  onClickItem={({ key, label, ...props }) => {
    this.navigate(props.url); // user defined prop
  }}
  debounceTime={125}>
    {({ search, items }) => (
        <>
          <Input onChange={e => search(e.target.value)} placeholder="Type and search" />
          <ListGroup>
            {items.map(props => (
              // You might need to wrap the third-party component to consume the props
              // check the story as an example
              // https://github.com/iannbing/react-simple-tree-menu/blob/master/stories/index.stories.js
              <ListItem {...props} />
            ))}
          </ListGroup>
        </>
    )}
</TreeViewMenu>

```

If you want to extend the minial UI components, they are exported at your disposal.

``` jsx
// you can import and extend the default minial UI
import TreeMenu, { defaultChildren, ItemComponent } from 'react-simple-tree-menu';

// add custom styling to the list item
<TreeViewMenu data={treeData}>
    {({ search, items }) => (
        <ul>
            {items.map(props => (
              <ItemComponent {...props, style: { background: 'pink' }} />
            ))}
        </ul>
    )}
</TreeViewMenu>

// add a button to do reset
<TreeViewMenu data={treeData}>
    {({ search, items, reset }) => (
      <div>
        <button onClick={reset} />
        {defaultChildren({search, items})}
      </div>
    )}
</TreeViewMenu>

```
## API
