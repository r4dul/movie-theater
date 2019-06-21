import React from "react";
import Form from "./common/form";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";
import Joi from "@hapi/joi";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import AbsoluteWrapper from "./common/AbsoluteWrapper";

class LoginForm extends Form {
  state = {
    data: {
      username: "",
      password: ""
    },
    errors: {}
  };

  schema = {
    username: Joi.string()
      .required()
      .label("Username"),
    password: Joi.string()
      .required()
      .label("Password")
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      await auth.login(data.username, data.password);
      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/movies";
    } catch (ex) {
      console.log("response" + ex);
      if (ex.response.status === 404) {
        toast.error("Username not found.");
      }
      if (ex.response.status === 400) {
        toast.error("Your account is not confirmed. Please check your email.");
      }
      if (ex.response.status === 401) {
        toast.error("Invalid credentials!");
      }
      /*  if (ex.response && ex.response.status === 401) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      } */
    }
  };

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/" />;
    return (
      <AbsoluteWrapper>
        <Helmet>
          <title>Login to Movie Theater App</title>
        </Helmet>
        <div className="d-flex flex-column ">
          <div className="d-flex flex-row justify-content-center align-items-stretch">
            <h1 className="text-white text-center m-4">Login</h1>
          </div>
          <div className="d-flex flex-row justify-content-center align-items-stretch">
            <form onSubmit={this.handleSubmit}>
              {this.renderInput("username", "Username")}
              {this.renderInput("password", "Password", "password")}
              {this.renderButton("Login")}
            </form>
          </div>
        </div>
      </AbsoluteWrapper>
    );
  }
}

export default LoginForm;
