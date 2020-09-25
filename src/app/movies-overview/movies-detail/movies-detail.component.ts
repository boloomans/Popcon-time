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
  movie: Movie;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieApiService,
    private location: Location,
  ) { }

  ngOnInit() {
    this.getMovie();
    this.addEvent();
  }

  getMovie(): void {
    const imdbID = this.route.snapshot.paramMap.get('imdbID');
    if (imdbID) {
      this.movieService.getMovieNew(imdbID)
        .subscribe(movie => this.movie = movie);
    }
  }

  addEvent(): void {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      // Fall back to event.which if event.keyCode is null
      const keycode = event.keyCode || event.which;
      if (keycode === 27) {
        this.location.back();
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}
