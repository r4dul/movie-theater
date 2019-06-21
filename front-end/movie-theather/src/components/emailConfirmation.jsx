import React, { Component } from "react";
import { verifyEmail } from "../config.json";
import { verifyEmailService } from "../services/accountVerificationService";
import { toast } from "react-toastify";

class EmailConfirmation extends Component {
  state = {
    message: ""
  };

  verify = async endPoint => {
    const result = await verifyEmailService(endPoint);
    return result;
  };

  render() {
    const endPoint = verifyEmail + this.props.location.search;
    this.verify(endPoint)
      .then(response => {
        console.log(response);
        toast.success("Your account has been verified. You can now log in!");
        window.setTimeout(function() {
          window.location = "/login";
        }, 4000);
      })
      .catch(e => {
        toast.error(
          "Something went wrong. We could not verify your account. Please try again!"
        );
        console.log("errror", e);
      });

    //console.log("result", result.res);
    return <div />;
  }
}

export default EmailConfirmation;
