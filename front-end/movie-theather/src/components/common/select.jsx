import React from "react";

const Select = ({ name, label, options, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select name={name} id={name} {...rest} className="form-control">
        <option value="" />
        {options.map(option => (
          <option key={option.id} value={option.id}>
            {option[name]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
