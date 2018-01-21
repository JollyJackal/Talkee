import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface UserState {
    isLoading: boolean;
    user: User;
    //loginErrors: string[]; //TODO only if we want to return these from server
}

export interface User {
    id: string;
    name: string;
    //avatar: number; //No idea what type is. Look into it
}

const LOGIN_REQUEST = 'LOGIN_REQUEST';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
const LOGOUT        = 'LOGOUT';

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface LoginRequestAction {
    type: 'LOGIN_REQUEST';
}

interface LoginSuccessAction {
    type: 'LOGIN_SUCCESS';
    user: User;
}

interface LoginFailureAction {
    type: 'LOGIN_FAILURE';
}

interface LogoutAction {
    type: 'LOGOUT';
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = LoginRequestAction | LoginSuccessAction | LoginFailureAction | LogoutAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    loginRequest: (email: string, password: string): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        if ( !getState().user.isLoading ) {
            const payload = {
                Email: email,
                Password: password,
            }
            
            let fetchTask = fetch(`Account/Login`, {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
            })
            .then(response => {
                if (!response.ok)
                    Promise.reject('Login Failed'); //Since not supposed to catch here (See: https://github.com/facebook/react/issues/6895)
                
                return response.json();
            })
            .then(
                data => {
                    console.log(data);
                    localStorage.setItem('token', data.token);
                    dispatch({ type: LOGIN_SUCCESS, user: data.user });
                },
                error => {
                    console.log(error);
                    dispatch({ type: LOGIN_FAILURE });
                }
            );

            addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
            dispatch({ type: LOGIN_REQUEST });
        }
    },
    //logoutRequest: 
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: UserState = { user: {id: '', name: ''}, isLoading: false };

export const reducer: Reducer<UserState> = (state: UserState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case LOGIN_REQUEST:
            return Object.assign({}, state, { isLoading: true });
        case LOGIN_SUCCESS:
            return {
                user: action.user,
                isLoading: false
            };
        case LOGIN_FAILURE:
            return Object.assign({}, state, { isLoading: false });
        case LOGOUT:
            return unloadedState;
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
