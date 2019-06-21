import React from "react";
import Form from "./common/form";
import { addMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";
import { getActors } from "../services/actorService";
import Joi from "@hapi/joi";
import { Helmet } from "react-helmet";
import AbsoluteWrapper from "./common/AbsoluteWrapper";

class MovieForm extends Form {
  state = {
    data: {
      title: "",
      year: "",
      description: "",
      photo: "",
      genres: []
    },
    actors: [],
    allGenres: [],
    errors: {}
  };

  schema = {
    title: Joi.string()
      .required()
      .label("Title"),
    year: Joi.number()
      .integer()
      .min(1900)
      .max(2050)
      .required()
      .label("Year"),
    description: Joi.string()
      .min(10)
      .max(255)
      .required()
      .label("Description")
  };

  async populateGenres() {
    const { data: allGenres } = await getGenres();
    this.setState({ allGenres });
  }

  async populateActors() {
    const { data: actors } = await getActors();
    this.setState({ actors });
  }

  async componentDidMount() {
    await this.populateGenres();
    await this.populateActors();
  }

  doSubmit = async () => {
    const data = { ...this.state.data };
    const { genres } = this.state.data;
    const final = genres.map(t => t.value);
    data["genres"] = final;
    this.setState({ data });
    console.log("The do submit");
    console.log(final);
    console.log(data);
    window.location = "/movies";
    try {
      await addMovie(data);
    } catch (ex) {}
  };

  imageUpload = e => {
    const file = e.target.files[0];
    const data = { ...this.state.data };
    getBase64(file).then(base64 => {
      data["photo"] = base64.split(",")[1];
      this.setState({ data });
    });
  };

  render() {
    // const actorOptions = this.state.actors.map(a => ({
    //   label: a.name,
    //   value: a
    // }));

    const genreOptions = this.state.allGenres.map(g => ({
      label: g.genre,
      value: g
    }));

    return (
      <AbsoluteWrapper>
        <Helmet>
          <title>Add a new movie</title>
        </Helmet>
        <div className="d-flex flex-column" style={{ margin: 20, padding: 50 }}>
          <h2
            className="text-white"
            style={{ textAlign: "center", marginBottom: 50 }}
          >
            Add movie
          </h2>
          <div className="d-flex flex-row">
            <form className="form-horizontal" onSubmit={this.handleSubmit}>
              {this.renderInput("title", "Title")}
              {this.renderInput("year", "Year")}
              {this.renderInput("description", "Description")}
              <label className="text-white p-2">Genres</label>
              {this.renderSelect("genre", "Genres", genreOptions)}
              {/* {this.renderSelect("name","Actors",actorOptions)} */}
              {/* {this.renderPhoto("photo","Photo")} */}
              <label className="text-white p-2">Poster</label> <br/>
              <input
                className="poza"
                type="file"
                name="photo"
                onChange={this.imageUpload}
                style={{ color: "black" }}
                
              />
              {this.renderButton("Add movie")}
            </form>
          </div>
        </div>
      </AbsoluteWrapper>
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

export default MovieForm;
