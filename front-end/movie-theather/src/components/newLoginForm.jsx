import React from "react";
import Form from "./common/form";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";
import Joi from "@hapi/joi";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import AbsoluteWrapper from "./common/AbsoluteWrapper";
import "../loginForm.css";

class NewLoginForm extends Form {
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
    }
  };

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/" />;
    return (
      <AbsoluteWrapper>
        <Helmet>
          <title>Login to Movie Theater App</title>
        </Helmet>
        <div id="modal">
          <div id="modal-content">
            <div id="modal-title">
              <h2>LOGIN</h2>
              <div className="underline-title" />
            </div>
            {/* <div className="underline-title" /> */}
            <form className="form" onSubmit={this.handleSubmit}>
                {this.renderInput("username","Username","fa fa-user")}
              <div className="form-border" />
              {this.renderInput("password", "Password", "fa fa-unlock-alt","password")}
              <div className="form-border" />
              {this.renderButton("LOGIN")}
            </form>
          </div> 
        </div>
      </AbsoluteWrapper>
    );
  }
}

export default NewLoginForm;
