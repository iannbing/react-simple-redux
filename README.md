# React Simple Redux

A minimal implementation of `react-redux` using React Context API. The API completely follows how `react-redux` works.

To migrate your project from `react-redux` to `react-simple-redux` or the other way around, You only need to change the configuration of `Provider`. Rest of your code will still work.

## Why

- You are building a component in a big project that uses `react-redux` and you don't want to pollute the global store before your component is really ready.
- Your project is too small to use full-blown redux, but it's complex enough to have state management in it.
- You need to publish a React component, but you cannot avoid props-drilling in your component.
- You don't want to put the `Provider` at the top level for some reason.

## Usage

```bash
npm i react-simple-redux
// or
yarn add react-simple-redux
```

First, create a separate file `store.js` to instantiate the components. And then plug these components into your app.

```js
import createStore from "react-simple-redux";
import reducer from "./path/to/reducer";

const { Provider, Consumer, connect } = createStore(reducer);

export { Provider, Consumer, connect };
```

Wrap your component with `Provider`. It doesn't have to be the direct parent, nor at the top level of your app.

Let's say you want to connect `UserProfile` to `store`, insert `Provider` like this.

```jsx
import { Provider } from './store';

const initialState = { firstName: 'Jon', lastName: 'Snow', email: 'jon.snow@email.com' }

<Dashboard>
    <Provider initialState={initialState} >
        <Header>
            <UserProfile />
        </Header>
    </Provider>
</Dashboard>

```

```jsx
// reducer.js

const SET_USERNAME = 'action/set_username';

export default function reducer(state, action){
    const { type, payload } = action;

    // To log all the actions
    // console.log(type, payload);

    switch(type){
        case SET_USERNAME: {
            const { firstName, lastName } = payload;
            return {...state, firstName, lastName};
        }
        default: {
            return state;
        }
    }
}

// Action creator
export const setUsernameAction = ({ firstName, lastName }) => ({
    type: SET_USERNAME,
    payload: { firstName, lastName }
});

```

Finally, define how data and dispatchers should work in your child component.
**Note: you need to wrap your component with `React.memo`**.
It is necessary to prevent unnecessary re-render caused by state updates.

```jsx
// UserProfile.jsx

import { connect } from './path/to/store';
import { setUsernameAction } from './path/to/your/reducer';

const UserProfile = ({ username, email, setUsername }) => {
    return (
        <div>
            <div>
                <div>User Name: {username}</div>
                <div>Email: {email}</div>
            </div>
            <button onClick={() => setUsername({firstName: 'Kit', lastName: 'Harington'})}>
                Rename to Kit Harington
            </button>
        </div>
    )
}

const mapStateToProps = state => {
    const { firstName, lastName } = state;
    return { username: firstName + ' ' + lastName }
}

const mapDispatchToProps = dispatch => ({
    setUsername: newName => dispatch(setUsernameAction(newName)),
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(React.memo(UserProfile)); // use React.memo here

```

For more extensive documentation, plase check [react-redux](https://react-redux.js.org/).

If there is any inconsistent usage with `react-redux`, please [file an issue](https://github.com/iannbing/react-simple-redux/issues/new).
