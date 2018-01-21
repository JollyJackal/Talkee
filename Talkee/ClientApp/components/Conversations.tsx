import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as ConversationsState from '../store/Conversations';

// At runtime, Redux will merge together...
type ConversationsProps =
  ConversationsState.ConversationsState        // ... state we've requested from the Redux store
  & typeof ConversationsState.actionCreators      // ... plus action creators we've requested
  & RouteComponentProps<{ }>; // ... plus incoming routing parameters

class Conversations extends React.Component<ConversationsProps, {}> {
  componentWillMount() {
    // This method runs when the component is first added to the page
    //let startDateIndex = parseInt(this.props.match.params.startDateIndex) || 0;
      this.props.requestConversations();
      console.log('componentWillMount');
  }

  componentWillReceiveProps(nextProps: ConversationsProps) {
    // This method runs when incoming props (e.g., route params) change
    //let startDateIndex = parseInt(nextProps.match.params.startDateIndex) || 0;
      this.props.requestConversations();
      console.log('componentWillReceiveProps');
  }

  public render() {
    return <div>
      <h1>Conversation</h1>
      <p>This should eventually be a smaller component on the side, with the messages for the selected conversation loaded.</p>
      {this.renderConversationsTable()}
    </div>;
  }

  private renderConversationsTable() {
    return <table className='table'>
      <thead>
        <tr>
          <th>Id</th>
          <th>Start Time</th>
        </tr>
      </thead>
      <tbody>
        {this.props.conversations.map(conversation =>
          <tr key={conversation.id}>
            <td>{conversation.id}</td>
            <td>{conversation.startTime}</td>
          </tr>
        )}
      </tbody>
    </table>;
  }
}

export default connect(
  (state: ApplicationState) => state.conversations, // Selects which state properties are merged into the component's props
  ConversationsState.actionCreators                 // Selects which action creators are merged into the component's props
)(Conversations) as typeof Conversations;
