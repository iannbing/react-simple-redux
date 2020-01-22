import React, { ComponentType } from 'react';

/*---------------------------------- Types start ----------------------------------*/

type Payload = unknown;
type Action = {
  type: string;
  payload?: Payload;
};

type Reducer<T> = (state: T, action: Action) => T;

interface ProviderProps<T> {
  reducer: Reducer<T>;
  initialState: T;
}

type Dispatch = (action: Action) => Payload;
type StateWithDispatch<T> = T & {
  dispatch: Dispatch;
};

type Dispatcher<T> = (props: T) => any | void;
type DispatchProps<T> = {
  [dispatchName: string]: Dispatcher<T>;
};

type MapStateToProps<StoreState, StateProps> = (state: StoreState) => StateProps;
type MapDispatchToProps<StoreState, OwnProps extends object> = (
  dispatch: Dispatch,
  ownProps?: OwnProps
) => DispatchProps<StoreState> | null;
type MergeProps<MappedStateProps, MappedDispatchProps, OwnProps> = (
  stateProps: MappedStateProps,
  dispatchProps: MappedDispatchProps,
  ownProps?: OwnProps
) => MappedStateProps & MappedDispatchProps & OwnProps;

/*---------------------------------- Types end ----------------------------------*/

export type Provider<T> = React.Component<ProviderProps<T>, T>;

interface Store<StoreState> {
  Provider: React.ComponentType<ProviderProps<StoreState>>;
  Consumer: React.Consumer<StateWithDispatch<StoreState>>;
  connect: Function;
  // connect: <
  //   StateProps,
  //   DispatchOwnProps extends object,
  //   MappedStateProps,
  //   MappedDispatchProps,
  //   OwnProps
  // >(
  //   mapStateToProps: MapStateToProps<StoreState, StateProps>,
  //   mapDispatchToProps: MapDispatchToProps<StoreState, DispatchOwnProps>,
  //   mergeProps: MergeProps<MappedStateProps, MappedDispatchProps, OwnProps>
  // ) => (
  //   Wrapped: React.ComponentType<React.Component<any, any>>
  // ) => (ownProps: object) => JSX.Element;
}

export default function createStore<StoreState extends object>(
  reducer: Reducer<StoreState>,
  initialContext?: StoreState
): Store<StoreState> {
  const Context = React.createContext<StoreState & { dispatch: Dispatch }>(
    (initialContext || {}) as StateWithDispatch<StoreState>
  );
  const { Consumer } = Context;

  class Provider extends React.Component<ProviderProps<StoreState>, StoreState> {
    constructor(props: ProviderProps<StoreState>) {
      super(props);

      const { initialState } = props;
      this.state = initialState;
    }

    dispatch: Dispatch = action => {
      const { type, payload } = action;
      this.setState((state: StoreState) => reducer(state, { type, payload }));
      return payload;
    };

    render() {
      const { children } = this.props;
      const context: StoreState & { dispatch: Dispatch } = {
        ...this.state,
        dispatch: this.dispatch,
      };
      return <Context.Provider value={context}>{children}</Context.Provider>;
    }
  }

  const defaultmapStateToProps: MapStateToProps<StoreState, StoreState> = state => state;
  const defaultMergeProps: MergeProps<StoreState, DispatchProps<StoreState>, object> = (
    stateProps,
    dispatchProps,
    ownProps
  ) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
  });
  const defaultMapDispatchToProps = () => null;

  const connect = (
    mapStateToProps: MapStateToProps<StoreState, any>,
    mapDispatchToProps: MapDispatchToProps<StoreState, any>,
    mergeProps: MergeProps<any, any, unknown>
  ) => (Wrapped: ComponentType<React.Component<any>>) => (ownProps: object) => {
    const mapStateToPropsFun = mapStateToProps || defaultmapStateToProps;
    const mapDispatchToPropsFun = mapDispatchToProps || defaultMapDispatchToProps;
    const mergePropsFun = mergeProps || defaultMergeProps;

    return (
      <Consumer>
        {({ dispatch, ...state }) => {
          const stateProps = mapStateToPropsFun(state as StoreState);
          const dispatchProps = mapDispatchToPropsFun(dispatch, ownProps);
          const merged = mergePropsFun(stateProps, dispatchProps, ownProps);

          return (
            <Wrapped
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

  return { Provider, Consumer, connect };
}
