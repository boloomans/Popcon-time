// @ts-ignore
import { Component, OnInit } from '@angular/core';
import { Movie } from '../movieClass/movie';
import { MovieApiService } from '../movieApi/movie-api.service';

// @ts-ignore
@Component({
  selector: 'app-movies-overview',
  templateUrl: './movies-overview.component.html',
  styleUrls: ['./movies-overview.component.scss']
})
export class MoviesOverviewComponent implements OnInit {
  Movie: Movie;
  Movies: Movie[];

  constructor(private MovieService: MovieApiService) { }

  ngOnInit() {
    // this.getData();
    // this.MovieTitles = this.MovieService.getMovieList();
  }

  public addToFavorites(SelectedMovie: Movie) {
    SelectedMovie.isFavorite = !SelectedMovie.isFavorite;
    let StrMovie = localStorage.getItem(SelectedMovie.shortTitle.toLowerCase());
    if (StrMovie.search(/isFavorite/) !== -1) {
      const m = JSON.parse(localStorage.getItem(SelectedMovie.shortTitle.toLowerCase()));
      m.isFavorite = !m.isFavorite;
      localStorage.setItem(SelectedMovie.shortTitle.toLowerCase(), JSON.stringify(m));
    } else {
      if (SelectedMovie.isFavorite) {
        StrMovie = StrMovie.substring(0, StrMovie.length - 1) + ',"isFavorite":true}';
      } else {
        StrMovie = StrMovie.substring(0, StrMovie.length - 1) + ',"isFavorite":false}';
      }
      localStorage.setItem(SelectedMovie.shortTitle.toLowerCase(), StrMovie);
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

  getMovies(): void {
    this.MovieService.getMoviesNew()
      .subscribe(Movies => this.Movies = Movies);
  }

  // public async getData() {
  //   // this.Movies = this.MovieService.getMovies(await this.MovieService.getMovieList(6) as string[]);
  //   const movieIds = await this.MovieService.getMovieIds(7) as string[];
  //   this.Movies = this.MovieService.getMovies(null, movieIds );
  //   // this.MovieService.getHeaders().subscribe( (data: HttpResponse<any>) => {
  //   //   console.log(data);
  //   //   console.log(data.headers.get('ETag'));
  //   //   console.log(data.headers.get('x-ratelimit-remaining'));
  //   // });
  // }
}

// TODO create a routing to specific movies
