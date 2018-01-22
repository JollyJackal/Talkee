import * as React from 'react';
//import { NavLink, Link } from 'react-router-dom';
import { NavLink, Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as UserState from '../store/User';
import { withRouter } from 'react-router'


type UserProps =
    UserState.UserState        // ... state we've requested from the Redux store
    & typeof UserState.actionCreators;      // ... plus action creators we've requested

//NOTE: React.Component<any, {}> should be React.Component<UserProps, {}>,
//but because of an error in Typescript, it wasn't working. This is less than
//ideal, but works for now.
class NavMenu extends React.Component<any, {}> {
    navbarLinks() {
        /*
        if (this.props.user.id !== '') {
            return [
                <li key="secret"><Link to="/secret">Secret</Link></li>,
                <li key="signout"><Link to="/signout">Sign out</Link></li>
            ];
        }
        return [
            <li key="signin"><Link to="/signin">Sign in</Link></li>,
            <li key="signup"><Link to="/signup">Sign up</Link></li>
        ];
        */

        if (!this.props.authenticated) {
            return [
                <li>
                    <NavLink to={'/login'} activeClassName='active'>
                        <span className='glyphicon glyphicon-cog'></span> Login
                            </NavLink>
                </li>
            ];
        }
        else {
            return [
                <li>
                    <NavLink to={'/logout'} activeClassName='active'>
                        <span className='glyphicon glyphicon-cog'></span> Logout
                            </NavLink>
                </li>
            ];
        }
        
    }

    public render() {
        return <div className='main-nav'>
                <div className='navbar navbar-inverse'>
                <div className='navbar-header'>
                    <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>
                        <span className='sr-only'>Toggle navigation</span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                    </button>
                    <Link className='navbar-brand' to={ '/' }>Talkee</Link>
                </div>
                <div className='clearfix'></div>
                <div className='navbar-collapse collapse'>
                    <ul className='nav navbar-nav'>
                        <li>
                            <NavLink exact to={ '/' } activeClassName='active'>
                                <span className='glyphicon glyphicon-home'></span> Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={ '/counter' } activeClassName='active'>
                                <span className='glyphicon glyphicon-education'></span> Counter
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/fetchdata'} activeClassName='active'>
                              <span className='glyphicon glyphicon-th-list'></span> Fetch data
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/conversations'} activeClassName='active'>
                                <span className='glyphicon glyphicon-th-list'></span> Conversations
                            </NavLink>
                        </li>
                        {this.navbarLinks()}
                    </ul>
                </div>
            </div>
        </div>;
    }
}

// withRouter is to solve this problem: https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
// There is supposed to be a more efficient solution, so could be looked at in the future.
export default withRouter(connect(
    (state: ApplicationState) => state.user,
    UserState.actionCreators
)(NavMenu) as typeof NavMenu);


/*
export default connect(
    (state: ApplicationState) => state.counter, // Selects which state properties are merged into the component's props
    CounterStore.actionCreators                 // Selects which action creators are merged into the component's props
)(Counter) as typeof Counter;
*/
