import React, { Component } from "react";
import "../App.css";
import { getGenres } from "../services/genreService";
import { getMovies, deleteMovie } from "../services/movieService";
import { toast } from "react-toastify";
import _ from "lodash";
import { paginate } from "../utils/paginate";
import MoviesTable from "./moviesTable";
import Pagination from "./common/pagination";
import SearchBox from "./searchBox";
import Dropdown from "./common/dropDown";
import { getAllMovies, addMovieToWatchlist } from "../services/userService";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1,
    sortColumn: { path: "title", order: "asc" },
    searchQuery: "",
    selectedGenre: null,
    user: ""
  };

  async componentDidMount() {
    const { user } = this.props;
    const movieData = await getMovies();
    const movies = movieData.data.content;
    console.log("movies", movies);
    const genreData = await getGenres();
    const genres = genreData.data;
    console.log(this.props);
    this.setState({ movies, genres, user });
  }

  handleDelete = async movie => {
    const originalMovies = this.state.movies;
    const movies = originalMovies.filter(m => m.id !== movie.id);
    this.setState({ movies });

    try {
      await deleteMovie(movie.id);
    } catch (error) {
      toast.error("This movie has already been deleted");
      this.setState({ movies: originalMovies });
    }
  };

  handleAdd = async movie => {
    const { data } = await getAllMovies(this.state.user.id);

    if (data.filter(e => e.id === movie.id).length === 0) {
      try {
        await addMovieToWatchlist(this.state.user.id, movie.id);
      } catch (error) {}
    }
  };

  handleRating = movie => {};

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, searchQuery: "", currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handleSearch = query => {
    this.setState({ searchQuery: query, selectedGenre: null, currentPage: 1 });
  };

  /*   getPagedData = () => {
    const {
      pageSize,
      currentPage,
      movies: allMovies,
      selectedGenre,
      sortColumn,
      searchQuery
    } = this.state;

    let filtered = allMovies;

    if (searchQuery) {
      filtered = allMovies.filter(m =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    } else if (selectedGenre && selectedGenre.id) {
      filtered = allMovies.filter(
        m => m.genres.filter(g => g.id === selectedGenre.id).length > 0
      );
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const movies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: movies };
  }; */

  render() {
    const { pageSize, currentPage, searchQuery } = this.state;
    const { user } = this.props;

    const { movies, genres } = this.state;
    console.log("movies before data", this.state.movies);
    let imageSrc = "data:image/png;base64,";

    return (
      <div>
        <div className="d-flex flex-column">
          <div className="d-flex flex-row">
            <div className="p-2">
              <SearchBox value={searchQuery} onChange={this.handleSearch} />
            </div>
            <div className="p-2 ">
              <Dropdown
                items={this.state.genres}
                onItemSelect={this.handleGenreSelect}
                selectedItem={this.state.selectedGenre}
              />
            </div>
          </div>

          {/* user &&
            user.role.filter(r => r.authority === "ROLE_ADMIN").length > 0 && (
              <div className="d-flex flex-row align-items-stretch ">
                <MoviesTable
                  movies={data}
                  onAction={this.handleDelete}
                  label="Remove"
                />
              </div>
            )}

          {user &&
            user.role.filter(r => r.authority === "ROLE_ADMIN").length ===
              0 && (
              <div className="d-flex flex-row align-items-stretch ">
                <MoviesTable
                  movies={data}
                  onAction={this.handleAdd}
                  label="Add"
                />
              </div>
            ) */}

          {!user && (
            <div className="d-flex flex-row align-items-stretch ">
              <MoviesTable movies={[...this.state.movies]} label="Details" />
            </div>
          )}

          <div className="d-flex flex-row justify-content-center">
            <Pagination
              //itemsCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Movies;
