import React, { Component } from "react";
import _ from "lodash";

class SelectTest extends Component {
  constructor(props){
      super(props);
     
  }

  toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });

  itemSelect = e => {
      console.log("The event");
      console.log(e);

      const bala = e.target.value;
      console.log(bala);
      this.props.onItemSelect(bala);
      
  }

  render() {
    const {
      items: unSortedItems,
      textProperty,
      onItemSelect,
      selectedItem
    } = this.props;
    const items = _.sortBy(unSortedItems, ["genre"], ["asc"]);
    console.log("LEZ ITEMS");
    console.log(this.props);
   // const menuClass = `dropdown-menu${this.state.isOpen ? "show" : ""}`;
    return (
      <select className="custom-select custom-select-lg mb-3" onChange={this.itemSelect} onFocus={3} onBlur={1} >
        <option selected>Genres</option>
        {items.map(item => (
            <option key={item.id} value={item.genre}  >{item[textProperty]}</option> 
        ))}
        
        </select>
    );
  }
}

SelectTest.defaultProps = {
  textProperty: "genre",
  valueProperty: "id"
};
export default SelectTest;
