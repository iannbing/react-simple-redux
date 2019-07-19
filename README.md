# [NOTE]: This is a personal experimental project, which is under heavy development. DO NOT use this in your production code.

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

Wrap your component with `Provider`. It doesn't have to be the direct parent, nor at the top level of your app.

Let's say you want to connect `UserProfile` to `store`, insert `Provider` like this.

```jsx
import { Provider } from 'react-simple-redux';
import reducer from './path/to/your/reducer';

const initialState = { firstName: 'Jon', lastName: 'Snow', email: 'jon.snow@email.com' }

<Dashboard>
    <Provider reducer={reducer} initialState={initialState} >   // feeding data
        <Header>
            <UserProfile />  // consuming data
        </Header>
    </Provider>
</Dashboard>

```

reducer.js

```jsx

export default function reducer(state, action){
    const { type, payload } = action;

    switch(type){
        case: SET_USERNAME: {
            const { firstName, lastName } = payload;
            return {...state, firstName, lastName};
        }
        default: {
            return state;
        }
    }
}

// Action creator
export const setUsernameAction = ({ firstName, lastName }) => ({ type: SET_USERNAME, payload: { firstName, lastName } });

```

UserProfile.jsx

```jsx

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

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);

```

For more extensive documentation, plase check [react-redux](https://react-redux.js.org/).

If there is any inconsistent usage with `react-redux`, please [file an issue](https://github.com/iannbing/react-simple-redux/issues/new).
