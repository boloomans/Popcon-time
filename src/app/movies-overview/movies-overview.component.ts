import { Component, OnInit } from '@angular/core';
import { Movie } from '../movieClass/movie';
import { MovieApiService } from '../movieApi/movie-api.service';

@Component({
  selector: 'app-movies-overview',
  templateUrl: './movies-overview.component.html',
  styleUrls: ['./movies-overview.component.scss']
})
export class MoviesOverviewComponent implements OnInit {
  Movie: Movie;
  Movies: Movie[];
  MovieTitles = [
    'The Avengers',
    'Avengers: endgame',
    'Deadpool',
    'X-men',
    'John wick',
    'John wick: chapter 2',
    'John wick: chapter 3',
    'Toy Story',
    'Toy Story 2',
    'Toy Story 3',
    'Toy Story 4'
  ];

  constructor(private MovieService: MovieApiService) { }

  ngOnInit() {
    this.Movies = this.MovieService.getMovies(this.MovieTitles);
  }

  public addToFavorites(SelectedMovie: Movie) {
    SelectedMovie.isFavorite = !SelectedMovie.isFavorite;
    let StrMovie = localStorage.getItem(SelectedMovie.Title.toLowerCase());
    if (StrMovie.search(/isFavorite/) !== -1) {
      const m = JSON.parse(localStorage.getItem(SelectedMovie.Title.toLowerCase()));
      m.isFavorite = !m.isFavorite;
      localStorage.setItem(SelectedMovie.Title.toLowerCase(), JSON.stringify(m));
    } else {
      if (SelectedMovie.isFavorite) {
        StrMovie = StrMovie.substring(0, StrMovie.length - 1) + ',"isFavorite":true}';
      } else {
        StrMovie = StrMovie.substring(0, StrMovie.length - 1) + ',"isFavorite":false}';
      }
      localStorage.setItem(SelectedMovie.Title.toLowerCase(), StrMovie);
    }
    this.isFavorited(SelectedMovie);
  }

  public isFavorited(SelectedMovie: Movie) {
    if (SelectedMovie.isFavorite) {
      return 'heart favorited';
    } else {
      return 'heart';
    }
  }
}

// TODO create a routing to specific movies
