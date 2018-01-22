import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface ConversationsState {
  isLoading: boolean;
  //startDateIndex?: number;
  conversations: Conversation[];
}

export interface Conversation {
  id: number;
  startTime: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestConversationsAction {
  type: 'REQUEST_CONVERSATIONS';
  //user: number;
}

interface ReceiveConversationsAction {
  type: 'RECEIVE_CONVERSATIONS';
  //user: number;
  conversations: Conversation[];
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestConversationsAction | ReceiveConversationsAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
  requestConversations: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
      // Only load data if it's something we don't already have (and are not already loading)
      if (!getState().conversations.isLoading) {
          let fetchTask = fetch(`api/Conversations`, {
              headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token')
              },
          })
            .then(response => response.json() as Promise<Conversation[]>)
            .then(data => {
              dispatch({ type: 'RECEIVE_CONVERSATIONS', conversations: data });
            });

          addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
          dispatch({ type: 'REQUEST_CONVERSATIONS' });
      }
  }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: ConversationsState = { conversations: [], isLoading: false };

export const reducer: Reducer<ConversationsState> = (state: ConversationsState, incomingAction: Action) => {
  const action = incomingAction as KnownAction;
  switch (action.type) {
    case 'REQUEST_CONVERSATIONS':
      return {
        conversations: state.conversations,
        isLoading: true
      };
    case 'RECEIVE_CONVERSATIONS':
      // Only accept the incoming data if it matches the most recent request. This ensures we correctly
      // handle out-of-order responses.
      //if (action.startDateIndex === state.startDateIndex) {
        return {
          conversations: action.conversations,
          isLoading: false
        };
      //}
      //break;
    default:
      // The following line guarantees that every action in the KnownAction union has been covered by a case above
      const exhaustiveCheck: never = action;
  }

  return state || unloadedState;
};
