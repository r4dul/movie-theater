import React from "react";

const Input = ({ name, label, error, icon, ...rest }) => {
  return (
    <div className="field">

       <input
        {...rest}
        id={name}
        name={name}
        className= "form-content"
        placeholder={label}
      />
       {error && <div className="alert alert-danger">{error}</div>}
      <label className={error ? "lab": ""} htmlFor={name} color="red" style={{ paddingTop: 15}}>
        <i className={icon} /> {label}
      </label>
    </div>
  );
};

export default Input;
