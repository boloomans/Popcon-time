import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Movie } from '../movieClass/movie';
import {Observable} from 'rxjs';
import {stringify} from 'querystring';
import {isString} from 'util';

@Injectable({
  providedIn: 'root'
})
export class MovieApiService {
  private apiURL = 'http://www.omdbapi.com/';
  private apiKEY = '&apikey=e7ca963c';
  constructor(private httpClient: HttpClient) {
  }

  public getMovie(MovieName?: string): Observable<Movie[]> {

    if (MovieName) {
      return this.httpClient.get<Movie[]>(`${this.apiURL}?t=${MovieName}${this.apiKEY}`);
    }

    return this.httpClient.get<Movie[]>(`${this.apiURL}?t=${MovieName}${this.apiKEY}`);
  }

  public getMovies(MovieArray: string[]) {
    const Movies = [];
    // const strMovies = [];
    for (const MovieTitle of MovieArray) {
      if (localStorage.getItem(MovieTitle.toLowerCase())) {
        Movies.push(JSON.parse(localStorage.getItem(MovieTitle.toLowerCase())));
        console.log('got ' + MovieTitle + ' from localStorage');
      } else {
        this.httpClient.get<Movie>(`${this.apiURL}?t=${MovieTitle}${this.apiKEY}`).subscribe(res => {
          Movies.push(res);
          localStorage.setItem(MovieTitle.toLowerCase(), JSON.stringify(res));
          console.log('got ' + MovieTitle + ' from API');
        });
      }
    }
    return Movies;
  }
}
