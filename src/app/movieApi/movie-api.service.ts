// @ts-ignore
import { Injectable } from '@angular/core';
// @ts-ignore
import { HttpClient } from '@angular/common/http';

import { Movie } from '../movieClass/movie';
import {Observable, of} from 'rxjs';
import {MoviesOverviewComponent} from '../movies-overview/movies-overview.component';

// @ts-ignore
@Injectable({
  providedIn: 'root'
})

export class MovieApiService {
  private apiURL = 'http://www.omdbapi.com/';
  private apiKEY = '&apikey=e7ca963c';

  private apiMovieURL = 'https://api.themoviedb.org/3';
  private apiMovieKEY = 'api_key=99c0f41f4789bb8379060b627460bb70';
  private defaultPoster = '../assets/img/fallback.png';
  private RequestCount = 0;
  public MovieList: Movie[] = [];
  constructor(private httpClient: HttpClient) {
    this.getMovieIdsNew(1);
  }

  public getMovie(MovieData) {
    const  locMovie = JSON.parse(localStorage.getItem(MovieData.title.toLowerCase()));
    if (localStorage.getItem(MovieData.title.toLowerCase()) !== null) {
      if (locMovie.Response === 'True') {
        console.log('pushed');
        this.MovieList.push(JSON.parse(localStorage.getItem(MovieData.title.toLowerCase())));
      }
    } else {
      console.log('getting ' + MovieData.title + ' with ID: ' + MovieData.id + ' From API');
      this.httpClient.get<Movie>(`${this.apiURL}?i=${MovieData.id}${this.apiKEY}`).subscribe(res => {
        if (res.Poster === 'N/A' ) {
          res.Poster = this.defaultPoster;
        }
        res.shortTitle = MovieData.title;
        this.MovieList.push(res);
        localStorage.setItem(MovieData.title.toLowerCase(), JSON.stringify(res));
        console.log('got ' + MovieData.title + ' from API');
      });
    }
  }

  getMovieByName(imdbID: string): Observable<Movie> {
    // TODO: send the message _after_ fetching the hero
    // this.messageService.add(`HeroService: fetched hero id=${id}`);
    console.log(this.MovieList);
    console.log(this.MovieList[2].imdbID);
    return of(this.MovieList.find(movie => movie.imdbID === imdbID));
  }

  public async getMovieIdsNew(Pages?: number) {
    if (Pages !== null) {
      for (let x = 1; x <= Pages; x++) {
        // tslint:disable-next-line:max-line-length
        const data = await this.httpClient.get<any>(`${this.apiMovieURL}/discover/movie?sort_by=popularity.desc&${this.apiMovieKEY}&page=${x}`).toPromise();
        this.RequestCount++;
        for (const movie of data.results) {
          if (movie !== null && localStorage.getItem(movie.title.toLowerCase()) === null) {
            if (this.RequestCount < 40) {
              // tslint:disable-next-line:max-line-length
              const ids = await this.httpClient.get<any>(`${this.apiMovieURL}/movie/${movie.id}/external_ids?${this.apiMovieKEY}&page=${x}`).toPromise();
              this.RequestCount++;
              if (ids !== null) {
                this.getMovie({id: ids.imdb_id, title: movie.title});
              }
            } else {
              console.log('Max request stating timeout');
              this.RequestCount = 0;
              setTimeout(z => {
                console.log('unpaused');
              }, 10000);
            }
          } else {
            this.getMovie({title: movie.title});
          }
        }
      }
    }
  }

  public getMovies(MovieTitlesArray: string[], IdsArray?) {
    const Movies = [];
    let locMovie;
    // if (IdsArray) {
    for (const MovieData of IdsArray) {
      locMovie = JSON.parse(localStorage.getItem(MovieData.title.toLowerCase()));
      if (localStorage.getItem(MovieData.title.toLowerCase()) !== null) {
        if (locMovie.Response === 'True') {
          Movies.push(JSON.parse(localStorage.getItem(MovieData.title.toLowerCase())));
        }
      } else {
        console.log('getting ' + MovieData.title + ' with ID: ' + MovieData.id + ' From API');
        this.httpClient.get<Movie>(`${this.apiURL}?i=${MovieData.id}${this.apiKEY}`).subscribe(res => {
          if (res.Poster === 'N/A' ) {
            res.Poster = this.defaultPoster;
          }
          res.shortTitle = MovieData.title;
          Movies.push(res);
          localStorage.setItem(MovieData.title.toLowerCase(), JSON.stringify(res));
          console.log('got ' + MovieData.title + ' from API');
        });
      }
    }
    return Movies;
  }

  public async getMovieIds(Pages?: number) {
    const MovieIds = [];
    // tslint:disable-next-line:max-line-length
    if (Pages !== null) {
      for (let x = 1; x <= Pages; x++) {
        // tslint:disable-next-line:max-line-length
        const data = await this.httpClient.get<any>(`${this.apiMovieURL}/discover/movie?sort_by=popularity.desc&${this.apiMovieKEY}&page=${x}`).toPromise();
        for (const movie of data.results) {
          if (movie !== null && localStorage.getItem(movie.title.toLowerCase()) === null) {
            // tslint:disable-next-line:max-line-length
            const ids = await this.httpClient.get<any>(`${this.apiMovieURL}/movie/${movie.id}/external_ids?${this.apiMovieKEY}&page=${x}`).toPromise();
            if (ids !== null) {
              MovieIds.push({id: ids.imdb_id, title: movie.title});
            }
          } else {
            MovieIds.push({title: movie.title});
          }
        }
      }
    }
    return await MovieIds;
  }

  public getHeaders() {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.head(`${this.apiMovieURL}/?${this.apiMovieKEY}`, {observe: 'response'}); // is observe property necessary to make this http call? If not you can remove it.
  }
}
// tslint:disable-next-line:max-line-length
// Populaire lijst ids er overheen beginnen te loopen met rekening houden aan de timeout op de calls dan imdb id eruit halen met deze movieApi callen en in een json duwen
