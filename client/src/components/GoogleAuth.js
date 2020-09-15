import React from 'react';
import { connect } from 'react-redux';
import { signIn, signOut } from '../actions';

class GoogleAuth extends React.Component {

	// every time the component is first rendered to the screen...
	componentDidMount() {
		// ...we try to load a portion of the Google library: when the load is
		// complete we call the arrow function we pass to load as second parameter
		window.gapi.load('client:auth2', () => {
			window.gapi.client.init({
				clientId: '497791044790-3oqctgpfli9i1vht92s0bg4a1bbcokn1.apps.googleusercontent.com',
				scope: 'email'
			}).then(() => {
				// this code will be called only AFTER the library successfully in itialized itself

				// save the auth object with all the methods we need as a property in our class
				this.auth = window.gapi.auth2.getAuthInstance();
				this.onAuthChange(this.auth.isSignedIn.get());

				// create a listener to update the state every time the auth status changes
				this.auth.isSignedIn.listen(this.onAuthChange);
			});
		});
	}


	onAuthChange = (isSignedIn) => {
		if (isSignedIn === true) {
			this.props.signIn(this.auth.currentUser.get().getId());
		} else {
			this.props.signOut();
		}
	};


	onSignInClick = () => {
		this.auth.signIn();
	};


	onSignOutClick = () => {
		this.auth.signOut();
	};


	renderAuthButton() {
		if (this.props.isSignedIn === null) {
			return <div className="ui active inline medium loader" style={{ paddingTop:10 }}></div>
		}
		else if (this.props.isSignedIn) {
			return(
				<button onClick={this.onSignOutClick} className="ui red google button">
					<i className="google icon" />
					Sign out
				</button>
			);
		}
		else {
			return(
				<button onClick={this.onSignInClick} className="ui blue google button">
					<i className="google icon" />
					Sign in with Google
				</button>
			);
		}
	}

	render() {
		return(
			<div>{this.renderAuthButton()}</div>
		);
	}
}


const mapStateToProps = (state) => {
	return {
		isSignedIn: state.auth.isSignedIn
	};
};


export default connect(mapStateToProps, { signIn, signOut })(GoogleAuth);