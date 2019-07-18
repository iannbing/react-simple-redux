import React, { ComponentType } from 'react';

/*---------------------------------- Types start ----------------------------------*/

type State = { [key: string]: any };

type Payload = any;
type Action = {
  type: string;
  payload?: Payload;
};

type Reducer = (state: State, action: Action) => State;

interface OwnProps {
  [key: string]: any;
}

interface ProviderProps extends OwnProps {
  reducer: Reducer;
  initialState: State;
}

type Dispatch = (action: Action) => Payload;
type StateWithDispatch = {
  [key: string]: any;
  dispatch: Dispatch;
};

type Dispatcher = (props: State) => any | void;
type DispatchProps = {
  [dispatchName: string]: Dispatcher;
};

type MapStateToProps = (state: State) => State;
type MapDispatchToProps = (
  dispatch: Dispatch,
  ownProps?: OwnProps
) => DispatchProps | null;
type MergeProps = (
  stateProps: State,
  dispatchProps: DispatchProps | null,
  ownProps: OwnProps
) => Object;

const Context = React.createContext({});
const { Provider: InitialProvider, Consumer } = Context;

/*---------------------------------- Types end ----------------------------------*/

class Provider extends React.Component<ProviderProps, State> {
  constructor(props: ProviderProps) {
    super(props);

    const { initialState } = props;
    this.state = initialState;
  }

  dispatch: Dispatch = async action => {
    const { reducer } = this.props;
    const { type, payload } = await action;
    this.setState(state => reducer(state, { type, payload }));
    return payload;
  };

  render() {
    const { children } = this.props;
    const context: StateWithDispatch = { ...this.state, dispatch: this.dispatch };
    return <InitialProvider value={context}>{children}</InitialProvider>;
  }
}

const defaultmapStateToProps: MapStateToProps = state => state;
const defaultMergeProps: MergeProps = (
  stateProps: State,
  dispatchProps: DispatchProps,
  ownProps: OwnProps
) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
});
const defaultMapDispatchToProps: MapDispatchToProps = () => null;

const connect = (
  mapStateToProps: MapStateToProps,
  mapDispatchToProps: MapDispatchToProps,
  mergeProps: MergeProps
) => (Wrapped: ComponentType<any>) => (ownProps: OwnProps) => {
  const mapStateToPropsFun = mapStateToProps || defaultmapStateToProps;
  const mapDispatchToPropsFun = mapDispatchToProps || defaultMapDispatchToProps;
  const mergePropsFun = mergeProps || defaultMergeProps;
  const MemoWrapped = React.memo(Wrapped);

  return (
    <Consumer>
      {({ dispatch, ...state }: StateWithDispatch) => {
        const stateProps = mapStateToPropsFun(state);
        const dispatchProps = mapDispatchToPropsFun(dispatch, ownProps);
        const merged = mergePropsFun(stateProps, dispatchProps, ownProps);

        return (
          <MemoWrapped
            {...ownProps}
            {...stateProps}
            {...dispatchProps}
            {...merged}
            dispatch={dispatch}
          />
        );
      }}
    </Consumer>
  );
};

export { Provider, Consumer, connect };
