import React, { Component, Fragment } from "react";
import "./../form.scss";
import axios from 'axios';

class Form extends Component {
    state = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        emailError: false,
        divMessage: { error: { show: false }, success: { show: false } }
    }

    successBack = () => {
        this.setState({ firstName: "", lastName: "", email: "", password: "", divMessage: { error: { show: false }, success: { show: false } } });
    }

    errorBack = () => {
        this.setState({ firstName: "", lastName: "", email: "", password: "", divMessage: { error: { show: false }, success: { show: false } } });
    }

    changeFirstName = element => {
        if ( element.target.value === "" ) {
            this.setState({ firstName: element.target.value, error: true });
        } else {
            this.setState({ firstName: element.target.value, error: false });
        }
    }

    changeLastName = element => {
        if ( element.target.value === "" ) {
            this.setState({ lastName: element.target.value, error: true });
        } else {
            this.setState({ lastName: element.target.value, error: false });
        }
    }

    changeEmailAddress = element => {
        if ( element.target.value === "" ) {
            this.setState({ email: element.target.value, error: true });
        } else {
            this.setState({ email: element.target.value, error: false });
        }
    }

    changePassword = element => {
        if ( element.target.value === "" ) {
            this.setState({ password: element.target.value, error: true });
        } else {
            this.setState({ password: element.target.value, error: false });
        }
    }

    validateSubmit = () => {
        const { firstName, lastName, email, password } = this.state;
        if ( !(firstName === "") && !(lastName === "") && !(email === "") && !(password === "") ) {
            return true;
        } else {
            return false;
        }
    }

    focusOut = () => {
        if ( this.state.email.trim() === "" ) {

        } else {
            axios.post('https://api.raisely.com/v3/check-user', {
                "campaignUuid": "46aa3270-d2ee-11ea-a9f0-e9a68ccff42a",
                "data": {
                    "email": this.state.email
                }
            }).then(result => {
                if ( result.data.data.status === "OK" ) {
                    this.setState({ emailError: true });
                } else if ( result.data.data.status === "EXISTS" ) {
                    window.alert("choose a new email address");
                    this.setState({ emailError: false });
                }
            }).catch(err => console.log(err));
        }
    }

    formSubmit = e => {
        e.preventDefault();
        
        axios.post("https://api.raisely.com/v3/signup", {
            "campaignUuid": "46aa3270-d2ee-11ea-a9f0-e9a68ccff42a",
            "data": {
                "email": this.state.email,
                "firstName": this.state.firstName,
                "lastName": this.state.lastName,
                "password": this.state.password
            }
        }).then(result => {
            const { data } = result;
            if (data.data.status === "ACTIVE") {
                this.setState({ divMessage: { error: { show: false }, success: { show: true } } });
            }
        }).catch(err => {
            this.setState({ divMessage: { error: { show: true }, success: { show: false } } });
        });
    }

    render() {
        return (
            <Fragment>
                <div className="container">
                    <h2 className="headding-text">Signup:</h2>
                    { (this.state.divMessage.error.show) ? <Error errorBack={this.errorBack} /> : null }
                    { (this.state.divMessage.success.show) ? <Success successBack={this.successBack} /> : null }
                    <form>
                        <div className="form-group">
                            <label htmlFor="#firstName">First Name:</label>
                            <input type="text" className="form-control" onChange={this.changeFirstName} value={this.state.firstName} id="firstName" placeholder="Enter your first name" />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="#lastName">Last Name:</label>
                            <input type="text" className="form-control" id="lastName" onChange={this.changeLastName} value={this.state.lastName} placeholder="Enter your last name"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="#emails">Email Address:</label>
                            <input type="email" onBlur={this.focusOut} id="emails" className="form-control" onChange={this.changeEmailAddress} value={this.state.email} placeholder="Enter Your Email Address"/>
                        </div>

                        <div className="form-group">
                            <label htmlFor="#passwords">Password:</label>
                            <input type="password" id="passwords" className="form-control" onChange={this.changePassword} value={this.state.password} placeholder="Enter your password"/>
                        </div>

                        { (this.validateSubmit() && this.state.emailError ) ? <input type="submit" className="form-submit" onClick={this.formSubmit} value="SUBMIT" /> : <input type="submit" className="form-submit" disabled style={{ backgroundColor: "#08aadaa1" }} value="SUBMIT" /> }
                    </form>
                </div>
            </Fragment>
        );
    }
}

export default Form;

class Error extends Component {

    render() {
        return (
            <Fragment>
                <div className="error-message">
                    <h2 className="message">This email address has already been registered</h2>
                    <button onClick={this.props.errorBack}>BACK</button>
                </div>
            </Fragment>
        );
    }
}

class Success extends Component {

    render() {
        return (
            <Fragment>
                <div className="success-message">
                    <h2 className="message">Data is Successfully Added</h2>
                    <button onClick={this.props.successBack}>BACK</button>
                </div>
            </Fragment>
        );
    }
}