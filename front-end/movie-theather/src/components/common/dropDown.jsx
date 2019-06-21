import React, { Component } from "react";
import _ from "lodash";

class Dropdown extends Component {
  state = {
    isOpen: false,
    dis: "Genres"
  };

  toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });

  saveState = item => {
    console.log("The item");
    console.log(item.genre);
    this.props.onItemSelect(item)
    this.setState({ dis: item.genre });
  };

  render() {
    const {
      items: unSortedItems,
      textProperty,
      
    } = this.props;
    const items = _.sortBy(unSortedItems, ["genre"], ["asc"]);
    const menuClass = `dropdown-menu${this.state.isOpen ? "show" : ""}`;
    return (
      <div className="dropdown " onClick={this.toggleOpen} >
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          id="dropdownMenu2"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="true"
          
        >
          {this.state.dis}
        </button>
        <div className={menuClass} aria-labelledby="dropdownMenu2" id="drpdwn">
          {items.map(item => (
            <button
              key={item.id}
              className={"dropdown-item text-white "}
              type="button"
              // onClick={() => onItemSelect(item)}
              onClick={() => this.saveState(item)}
            >
              {item[textProperty]}
            </button>
          ))}
        </div>
      </div>
    );
  }
}

Dropdown.defaultProps = {
  textProperty: "genre",
  valueProperty: "id"
};
export default Dropdown;
