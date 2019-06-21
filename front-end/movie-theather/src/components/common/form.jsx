import React, { Component } from "react";
import Input from "./input";
import Select from "react-select";
import Joi from "@hapi/joi";

class Form extends Component {
  state = {
    data: {},
    errors: {},
    selectedOption: []
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);

    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  validateProperty = ({ name, value }) => {
    //console.log("validate: " + name + value + this.schema);
    const obj = { [name]: value };

    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = e => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) console.log("Errr");
    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  handleInsert = selectedOption => {
    const data = { ...this.state.data };
    data["genres"] = selectedOption;
    console.log("data ", data);
    this.setState({ data });
    this.setState({ selectedOption });

    console.log("Option selected: ", selectedOption);
  };

  renderButton(label) {
    return (
      <button id="submit-btn" disabled={this.validate()}>
        {label}
      </button>
    );
  }

  imageUpload = e => {
    const file = e.target.files[0];
    const data = { ...this.state.data };
    getBase64(file).then(base64 => {
      localStorage["fileBase64"] = base64;
      data["photo"] = base64.split(",")[1];
    });
  };

  renderInput(name, label, icon, type = "text") {
    const { data, errors } = this.state;
    return (
      <Input
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
        icon={icon}
      />
    );
  }

  renderSelect(name, label, options) {
    const { selectedOption } = this.state;
    return (
      <Select
        className="basic-multi-select"
        classNamePrefix="select"
        isMulti
        name={name}
        value={selectedOption}
        label={label}
        options={options}
        onChange={this.handleInsert}
        placeholder="Genres"
      />
    );
  }

  renderPhoto(name, label, type = "file") {
    const { data } = this.state;
    return (
      <Input
        type={type}
        name={name}
        value={data[name]}
        label={label}
        onChange={this.imageUpload}
      />
    );
  }
}
const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

export default Form;
