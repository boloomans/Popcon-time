import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { MovieApiService} from '../../movieApi/movie-api.service';

@Component({
  selector: 'app-movies-detail',
  templateUrl: './movies-detail.component.html',
  styleUrls: ['./movies-detail.component.scss']
})
export class MoviesDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieApiService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getMovie();
  }

  getMovie(): void {
    const name = +this.route.snapshot.paramMap.get('name');
    // this.movieService.getMovie(name)
    //   .subscribe(hero => this.hero = hero);
  }

}
// https://angular.io/tutorial/toh-pt5
