import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as UserStore from '../store/User';

type LogoutProps =
    UserStore.UserState        // ... state we've requested from the Redux store
    & typeof UserStore.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>; // ... plus incoming routing parameters

class Logout extends React.Component<LogoutProps, {}> {
    public render() {
        return <div>
            <button onClick={() => { this.props.logout(this.props.history) }}>Logout</button>
        </div>;
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.user, // Selects which state properties are merged into the component's props
    UserStore.actionCreators                 // Selects which action creators are merged into the component's props
)(Logout) as typeof Logout;