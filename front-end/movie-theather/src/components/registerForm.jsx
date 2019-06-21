import React from "react";
import Form from "./common/form";
import * as userService from "../services/userService";
import auth from "../services/authService";
import Joi from "@hapi/joi";
import { register } from "./../serviceWorker";
import { checkIfUsernameExists } from "../services/findUserByUsername";
import { checkUserByEmail } from "../services/findUserByEmail";
import { Helmet } from "react-helmet";
import AbsoluteWrapper from "./common/AbsoluteWrapper";

/*Joi.object().keys({
  username: Joi.string()
    .alphanum()
    .min(5)
    .max(30)
    .required()
    .label("Username"),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{7,30}$/, { name: "password" })
    .required()
    .label("Password"),
  name: Joi.string()
    .regex(/^[A-Z][a-z]{1,15}/, { name: "name" })
    .required()
    .label("Name"),
  email: Joi.string()
    .email({ minDomainSegments: 3 })
    .required()
    .label("Email"),
  age: Joi.number()
    .integer()
    .min(14)
    .max(110)
    .required()
    .label("Age")
}); */

class RegisterForm extends Form {
  state = {
    data: {
      username: "",
      password: "",
      name: "",
      email: "",
      age: ""
    },
    errors: {},
    registered: false
  };

  schema = {
    username: Joi.string()
      .alphanum()
      .min(5)
      .max(30)
      .required()
      .label("Username"),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{7,30}$/, { name: "password" })
      .required()
      .label("Password"),
    name: Joi.string()
      .regex(/^[A-Z][a-z]{1,15}/, { name: "name" })
      .required()
      .label("Name"),
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .required()
      .label("Email"),
    age: Joi.number()
      .integer()
      .min(14)
      .max(110)
      .required()
      .label("Age")
  };

  doSubmit = async () => {
    const errors = { ...this.state.errors };

    try {
      const { data } = await userService.addUser(this.state.data);
      this.setState({ registered: true });
      /* await auth.login(data.username, this.state.data.password);
      window.location = "/"; */
    } catch (ex) {
      const errors = { ...this.state.errors };
      checkUserByEmail(this.state.data.email).then(response => {
        if (response.data) {
          const errors = { ...this.state.errors };
          errors["email"] = "The email already exists.";
          this.setState({ errors });
        }
      });

      checkIfUsernameExists(this.state.data.username).then(response => {
        if (response.data) {
          const errors = { ...this.state.errors };
          errors["username"] = "The username already exists.";
          this.setState({ errors });
        }
      });

      console.log("exception asd", ex);
      //errors.username = ex.response.data;
      //this.setState({ errors });
    }
  };

  render() {
    return this.state.registered === false ? (
      <AbsoluteWrapper>
        <Helmet>
          <title>Registration Form - Movie Theater App</title>
        </Helmet>
        <div className="d-flex flex-column align-items-center justify-content-center">
          <h2 className="text-white text-center m-3">Register</h2>
          <div className="d-flex flex-row align-items-center">
            <form className="form-horizontal" onSubmit={this.handleSubmit}>
              {this.renderInput("username", "Username")}
              {this.renderInput("password", "Password", "password")}
              {this.renderInput("name", "Name")}
              {this.renderInput("email", "Email")}
              {this.renderInput("age", "Age")}
              <div className="text-center">{this.renderButton("Register")}</div>
            </form>
          </div>
        </div>
      </AbsoluteWrapper>
    ) : (
      <div className="text-center">
        <h1 className="text-light">
          Thank you for your registration. Please check your email to confirm
          your account.
        </h1>
      </div>
    );
  }
}

export default RegisterForm;
