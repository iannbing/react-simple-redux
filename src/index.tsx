import React from 'react';

const WidgetContext = React.createContext({});
const { Provider: InitialProvider, Consumer } = WidgetContext;

class Provider extends React.Component {
  constructor(props) {
    super(props);

    const { initialState } = props;
    this.state = initialState;
  }

  dispatch = async action => {
    const { reducer } = this.props;
    const { type, payload } = await action;
    this.setState(state => reducer(state, { type, payload }));
    return payload;
  };

  render() {
    const { children } = this.props;
    const context = { ...this.state, dispatch: this.dispatch };
    return <InitialProvider value={context}>{children}</InitialProvider>;
  }
}

const defaultmapStateToProps = state => state;
const defaultMergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
});
const defaultMapDispatchToProps = () => null;

const connect = (
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
) => Wrapped => ownProps => {
  const mapStateToPropsFun = mapStateToProps || defaultmapStateToProps;
  const mapDispatchToPropsFun = mapDispatchToProps || defaultMapDispatchToProps;
  const mergePropsFun = mergeProps || defaultMergeProps;
  const MemoWrapped = React.memo(Wrapped);

  return (
    <Consumer>
      {({ dispatch, ...state }) => {
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
