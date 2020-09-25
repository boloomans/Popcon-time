// @ts-ignore
import { Injectable } from '@angular/core';
// @ts-ignore
import { HttpClient } from '@angular/common/http';

import { Movie } from '../movieClass/movie';
import {Observable, of} from 'rxjs';
import { MessageService } from '../message.service';
import {MoviesOverviewComponent} from '../movies-overview/movies-overview.component';
import {catchError, tap} from 'rxjs/operators';

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
  constructor(private httpClient: HttpClient, private messageService: MessageService) {
    this.getMovieIdsNew(10);
  }

  // public getMovieDetails(MovieData) {
  //   const  locMovie = JSON.parse(localStorage.getItem(MovieData.title.toLowerCase()));
  //   if (localStorage.getItem(MovieData.title.toLowerCase()) !== null) {
  //     if (locMovie.Response === 'True') {
  //       this.MovieList.push(JSON.parse(localStorage.getItem(MovieData.title.toLowerCase())));
  //     }
  //   } else {
  //     console.log('getting ' + MovieData.title + ' with ID: ' + MovieData.id + ' From API');
  //     this.httpClient.get<Movie>(`${this.apiURL}?i=${MovieData.id}${this.apiKEY}`).subscribe(res => {
  //       if (res.Poster === 'N/A' ) {
  //         res.Poster = this.defaultPoster;
  //       }
  //       res.shortTitle = MovieData.title;
  //       localStorage.setItem(MovieData.title.toLowerCase(), JSON.stringify(res));
  //       console.log('got ' + MovieData.title + ' from API');
  //       return res;
  //     });
  //   }
  // }

  public getMovie(MovieData) {
    const  locMovie = JSON.parse(localStorage.getItem(MovieData.title.toLowerCase()));
    if (localStorage.getItem(MovieData.title.toLowerCase()) !== null) {
      if (locMovie.Response === 'True') {
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

  getMovieNew(imdbID: string): Observable<Movie> {
    const url = `${this.apiURL}?i=${imdbID}${this.apiKEY}`;
    return this.httpClient.get<Movie>(url).pipe(
      tap(_ => this.log(`MovieService: fetched Movie imdbID=${imdbID}`)),
      catchError(this.handleError<Movie>(`getMovie imdbID=${imdbID}`))
    );
  }

  public getMovieByName(imdbID: string): Observable<Movie> {
    // TODO: send the message _after_ fetching the hero
    this.log(`MovieService: fetched Movie imdbID=${imdbID}`);
    return of(this.MovieList.find(movie => movie.imdbID === imdbID));
  }

  public async getMovieIdsNew(Pages?: number) {
    if (Pages !== null) {
      for (let x = 1; x <= Pages; x++) {
        this.log('Movie API Service: fetching Movies');
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
              console.log('Max requests, starting timeout');
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

  getMovies(MovieTitlesArray: string[], IdsArray?) {
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

  getMoviesNew(): Observable<Movie[]> {
    return this.httpClient.get<Movie[]>(`${this.apiMovieURL}/discover/movie?sort_by=popularity.desc&${this.apiMovieKEY}&page=0`)
      .pipe(
        tap(_ => this.log('Fetched Movies')),
        catchError(this.handleError<Movie[]>('getMovies', []))
      );
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

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  public getHeaders() {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.head(`${this.apiMovieURL}/?${this.apiMovieKEY}`, {observe: 'response'}); // is observe property necessary to make this http call? If not you can remove it.
  }
}
// tslint:disable-next-line:max-line-length
// Populaire lijst ids er overheen beginnen te loopen met rekening houden aan de timeout op de calls dan imdb id eruit halen met deze movieApi callen en in een json duwen
