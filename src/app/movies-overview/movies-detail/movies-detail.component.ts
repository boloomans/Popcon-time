import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { MovieApiService} from '../../movieApi/movie-api.service';
import { Movie } from '../../movieClass/movie';

@Component({
  selector: 'app-movies-detail',
  templateUrl: './movies-detail.component.html',
  styleUrls: ['./movies-detail.component.scss']
})
export class MoviesDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieApiService,
    private location: Location,
    private movie: Movie
  ) { }

  ngOnInit() {
    this.getMovie();
  }

  getMovie(): void {
    const imdbID = this.route.snapshot.paramMap.get('imdbID');
    if (imdbID) {
      this.movieService.getMovieByName(imdbID)
        .subscribe(movie => this.movie = movie);
    }
    console.log(this.movie);
  }

}
// https://angular.io/tutorial/toh-pt5
