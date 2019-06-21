import React from "react";
import Form from "./common/form";
import { addMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";
import { getActors } from "../services/actorService";
import Joi from "@hapi/joi";
import { Helmet } from "react-helmet";
import AbsoluteWrapper from "./common/AbsoluteWrapper";
import "../loginForm.css";
import { toast } from "react-toastify";

class NewMovieForm extends Form {
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
    errors: {},
    name: ""
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
      .label("Description"),
    photo: Joi.string().label("Photo"),
    genres: Joi.label("Genres")
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
    try {
      const movieAdded = await addMovie(data);
      window.location = "movie/" + movieAdded.data.id;
    } catch (ex) {
      console.log("error while adding");
    }
  };

  imageUpload = e => {
    const file = e.target.files[0];
    this.setState({ name: file.name });
    const data = { ...this.state.data };
    getBase64(file).then(base64 => {
      data["photo"] = base64.split(",")[1];
      this.setState({ data });
    });
  };

  render() {
    const genreOptions = this.state.allGenres.map(g => ({
      label: g.genre,
      value: g
    }));

    return (
      <AbsoluteWrapper>
        <Helmet>
          <title>Add a new movie</title>
        </Helmet>

        <div id="modal">
          <div id="modal-content">
            <div id="modal-title">
              <h2>ADD</h2>
              <div className="underline-title" />
            </div>
            <form className="form" onSubmit={this.handleSubmit}>
              {this.renderInput("title", "Title", "fa fa-ticket")}
              <div className="form-border" />
              {this.renderInput("year", "Year", "fa fa-calendar")}
              <div className="form-border" />
              {this.renderInput("description", "Description", "fa fa-pencil")}
              <div className="form-border" />
              <label style={{ marginTop: 15 }}>
                <i class="fa fa-list-ul" />
                Genres
              </label>
              {this.renderSelect("genre", "Genres", genreOptions)}
              <div className="form-border" />
              {/* {this.renderSelect("name","Actors",actorOptions)} */}
              {/* {this.renderPhoto("photo","Photo")} */}
              <label style={{ marginTop: 15 }}>
                <i class="fa fa-camera" />
                Poster
              </label>{" "}
              <br />
              <div className="poza">
                <input type="file" name="photo" onChange={this.imageUpload} />
              </div>
              {this.renderButton("ADD")}
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

export default NewMovieForm;
