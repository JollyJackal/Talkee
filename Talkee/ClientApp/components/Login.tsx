import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
//import { Field, reduxForm } from 'redux-form';
import * as Form from 'redux-form';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as UserStore from '../store/User';

// At runtime, Redux will merge together...
type LoginProps =
    UserStore.UserState        // ... state we've requested from the Redux store
    & typeof UserStore.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>
    & Form.InjectedFormProps<formValues>; // ... plus incoming routing parameters

interface formValues {
    email: string;
    password: string;
}

class Login extends React.Component<LoginProps, {}> {
    submit = (values: formValues) => {
        //this.props.loginRequest(values, this.props.history);
        this.props.loginRequest(values, this.props.history);
    }

    errorMessage() {
        //console.log('There was an error in Login'); //TODO improve this
        /*
        if (this.props.errorMessage) {
            return (
                <div className="info-red">
                    {this.props.errorMessage}
                </div>
            );
        }
        */
    }

    render() {
        const { handleSubmit } = this.props;
        return (
            <div className="form">
                <div className="container">
                    <h2>Sign In</h2>
                    <form onSubmit={handleSubmit(this.submit)}>
                        <Form.Field name="email"
                            component="input"
                            type="text"
                            placeholder="Email"
                        />
                        <Form.Field name="password"
                            component="input"
                            type="password"
                            placeholder="Password"
                        />
                        <button type="submit" className="blue">Sign In</button>
                    </form>
                    {this.errorMessage()}
                </div>
            </div>
        );
    }
}

/*
function mapStateToProps(state) {
    return { errorMessage: state.auth.error };
}
*/


const reduxFormSignin = Form.reduxForm<formValues>({
    form: 'signin'
})(Login);

//export default connect(mapStateToProps, { signInAction })(reduxFormSignin);

//TODO Apparently there is a conflict between the typings for react-redux and redux-form, so the
//type associated with connect is a workaround
// See: https://stackoverflow.com/questions/46477939/typescript-errors-when-using-redux-form-with-react-redux-connect
export default connect<{}, {}, {}>(
    (state: ApplicationState) => state.user, // Selects which state properties are merged into the component's props
    UserStore.actionCreators                 // Selects which action creators are merged into the component's props
)(reduxFormSignin) as typeof Login;
