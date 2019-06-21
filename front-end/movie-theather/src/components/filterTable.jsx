import React, { Component } from "react";
import Dropdown from "./common/dropDown";

const FILTERING_OPTIONS = "title, year, rating";
class FilterTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteringBy: new Map(),
      results: 10,
      genre: ""
    };
    this.numberOfResults = this.numberOfResults.bind(this);
    this.sort = this.sort.bind(this);
    this.reset = this.reset.bind(this);
    this.submitFilter = this.submitFilter.bind(this);
  }

  reset() {
    this.setState({ filteringBy: new Map(), results: 10 });
    const iHtmlItems = document.querySelectorAll("i");
    const buttonHtmlItems = document.querySelectorAll("button.btn.btn-secondary.active");
    console.log("reset function was called");
    console.log(document.querySelectorAll("button.btn.btn-secondary.active"));

    iHtmlItems.forEach(e => {
      if (e.id.substr(FILTERING_OPTIONS)) e.className = "fa fa-sort";
    });

    buttonHtmlItems.forEach(e => {
      e.className = "btn btn-secondary";
    })
    
    this.props.toSort(new Map(), 10, "");
    console.log("Starea ");
    console.log(this.state.genre);
    this.setState({genre:""});
    
  }

  // componentDidUpdate() {
  //   //console.log("this are props", this.props);
  //   //console.log(this.state.filteringBy, this.state.results);
  // }

  numberOfResults(event) {
    const results = parseInt(event.target.value);
    //console.log(typeof results);
    this.setState({ results });
    //console.log(this.state.results);
  }

  submitFilter() {
    console.log("submitFilter props", this.props);
    this.props.toSort(
      this.state.filteringBy,
      this.state.results,
      this.state.genre
    );
  }

  handleGenreSelect = genre => {
    console.log("genul", genre);
    this.setState({ genre: genre.genre });
  };

  sort(event) {
    event.preventDefault();
    let el = event.target.querySelector("i");
    let cl = event.target;

    const sortingBy = {
      value: "",
      order: ""
    };
    if (el === null) {
      el = event.target;
    }
    if(cl===null) {
      cl = event.target;
    } else {
      cl.className = "btn btn-secondary active";
    }
    sortingBy.value = el.id;
    if (el.className === "fa fa-sort") {
      el.className = "fa fa-sort-asc";
      cl.className = "btn btn-secondary active up";
     
      sortingBy.order = "asc";
    } else if (el.className === "fa fa-sort-asc") {
      el.className = "fa fa-sort-desc";
      cl.className = "btn btn-secondary active down";
      sortingBy.order = "desc";
    } else {
      sortingBy.order = "asc";
      el.className = "fa fa-sort-asc";
      cl.className = "btn btn-secondary active up";
    }
    //console.log(sortingBy);
    const newState = new Map([...this.state.filteringBy]);
    newState.set(sortingBy.value, sortingBy.order);
    this.setState({ filteringBy: newState });
    //console.log(this.state.sortingBy);

    console.log("the props", this.props);
  }

  render() {
    return (
      <>
      
        <div className="container-fluid sidebar-filter">
          <div className="row justify-content-center text-align-center my-row1">
            {/* <div className="filter--table d-flex flex-wrap align-items-center justify-content-center mt-4 small"> */}
            {/* <div className="col-md-8 col-xs-12  my-col21"> */}
            <div className="col col-sm col-md text-center my-col21" >

           


              <button
                type="button"
                className="btn btn-secondary"
                onClick={this.sort}
                data-container="body"
                data-toggle="popover"
                data-placement="top"
                data-content="Sorted"
              >

               <strong>Title</strong>  <i id="title" className="fa fa-sort" />
              </button>
              
            </div>
            <div className="col col-sm col-md col-lg-12 my-col22 text-center">
              <button
                onClick={this.sort}
                type="button"
                className="btn btn-secondary"
              >
                <strong>Year</strong>  <i id="year" className="fa fa-sort" />
              </button>
            </div>
            {/* </div> */}
            {/* <div className="col-6 my-col22"> */}
            <div className="col col-sm col-md col-lg-12 my-col23 text-center">
              <button
                onClick={this.sort}
                type="button"
                className="btn btn-secondary"
              >
                <strong>Rating</strong>   <i id="rating" className="fa fa-sort" />
              </button>
            </div>
            <div className="col col-sm col-md col-lg-12 my-col24 text-center">
              <Dropdown
                items={this.props.genres}
                onItemSelect={this.handleGenreSelect}
                selectedItem={this.state.genre.genre}
              />
            </div>
          </div>
          <div className="row justify-content-center my-row2">
            <div className="col-md-6 my-col3">
              <button
                onClick={this.submitFilter}
                type="button"
                className="btn btn-success btn-block"
              >
                Filter
              </button>
              <button
                onClick={this.reset}
                type="button"
                className="btn btn-danger btn-block"
              >
                Reset
              </button>
            </div>
          </div>
       
        </div>
      </>
    );
  }
}

export default FilterTable;
